'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var MsgActions = require('../../../lib/action/MsgActions');
import { Button, Table, Icon, Modal, Radio, Pagination, DatePicker, Spin, Input } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var UserCheckStore = require('../../proj/user_check/data/UserCheckStore');
var UserCheckActions = require('../../proj/user_check/action/UserCheckActions');
import CreateUserCheckPage from '../../proj/user_check/Components/CreateUserCheckPage';
import BatchCheckPage from '../../proj/user_check/Components/BatchCheckPage';

var ProjContext = require('../../ProjContext');
import ProjCodeMap from '../../lib/ProjCodeMap';
import SelectDate from '../../../lib/Components/SelectDate';

var today = '' + Common.getToday();
var filterValue = '';
var GroupCheckPage = React.createClass({
    getInitialState: function () {
        return {
            userCheckSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
            viewType: '1',
            workDate: today,
            filter: ''
        }
    },

    mixins: [Reflux.listenTo(UserCheckStore, "onServiceComplete"), ProjCodeMap()],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            userCheckSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        var date = new Date();

        this.setState({
            loading: true,
            viewType: '1',
        });

        this.queryUserChkBook(today);
    },

    // 选择日期
    onChangeDate: function (e) {
        var workDate = e.target.value;
        this.queryUserChkBook(workDate);

        this.setState({
            loading: true,
            workDate: workDate,
            selectedRowKeys: null,
        });
    },
    queryUserChkBook: function (chkDate) {
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.workDate = chkDate;
        filter.chkCode = window.loginData.compUser.userCode;
        filter.chkProj = ProjContext.selectedGroup.uuid;
        UserCheckActions.retrieveUserChkBook(filter);
    },
    onChangeViewType: function (e) {
        UserCheckActions.getCacheData()
        this.setState({
            loading: true,
            viewType: e.target.value
        });
    },

    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },
    getSelectedRows: function () {
        var selRows = [];
        var count = this.state.userCheckSet.recordSet.length;
        this.state.selectedRowKeys.map((data) => {
            selRows.push(this.state.userCheckSet.recordSet[data]);
        });
        return selRows;
    },

    onFilterRecord: function (e) {
        this.setState({ filterValue: e.target.value });
    },

    datePicker: function (date, dateString) {
        var chkDate = dateString.split('-').join('');
        this.setState({
            loading: true,
            workDate: chkDate,
        });

        this.queryUserChkBook(chkDate);
    },

    showError: function (msg) {
        MsgActions.showError('res-member-snap', 'create-group-chk', msg);
    },

    handleClickCheckBook: function (e) {
        var data = {
            corpUuid: window.loginData.compUser.corpUuid,
            grpUuid: ProjContext.selectedGroup.uuid,
            chkDate: this.state.workDate,
            grpName: ProjContext.selectedGroup.grpName
        }

        var obj = {
            startPage: 0,
            pageRow: 0,
            totalCount: 0,
            totalRow: 0,
            object: data,
        }

        this.setState({ loading: true });

        // 创建考勤表
        var self = this;
        var url = Utils.projUrl + '/res-member-snap/create-group-chk';
        Utils.doUpdateService(url, obj).then(function (result, status, xhr) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.showError('');

                // 刷新数据
                self.queryUserChkBook(data.chkDate);
            }
            else {
                self.showError("处理错误[" + result.errCode + "][" + result.errDesc + "]");
                self.setState({ loading: false });
            }
        }, function (xhr, errorText, errorType) {
            self.setState({ loading: false });
            self.showError('未知错误');
        });
    },

    //批量生成考勤表
    handleClickBatchCheck: function (e) {
        var chkDate = this.state.workDate;
        var checkList = this.getSelectedRows();
        console.log('checkList', checkList);
        this.refs.batchCheckWindow.clear(checkList, chkDate);
        this.refs.batchCheckWindow.toggle();
    },

    onClickCheck: function (userCheck) {
        var chkDate = this.state.workDate;
        this.refs.createWindow.clear(userCheck, chkDate);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (userCheck) {
        var chkDate = this.state.workDate;
        this.refs.createWindow.clear(userCheck, chkDate);
        this.refs.createWindow.toggle();
    },
    getTitleStyle: function (chkDate) {
        return (chkDate.checkUuid === null) ? { color: 'red' } : null;
    },
    getEditIcon: function (chkDate) {
        return (chkDate.checkUuid === null) ? 'schedule' : 'edit';
    },

    onClickDelete: function (userCheck, event) {
        var userChkObj = {};
        userChkObj.uuid = userCheck.uuid;
        userChkObj.checkUuid = userCheck.checkUuid;

        Modal.confirm({
            title: '删除确认',
            content: '是否删除【' + userCheck.perName + '】的考勤数据',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, userChkObj)
        });
    },
    onClickDelete2: function (userChkObj) {
        this.setState({ loading: true });
        UserCheckActions.deleteUserChkBook(userChkObj);
    },

    render: function () {
        var projUuid = ProjContext.selectedGroup.uuid;
        var recordSet = Common.filter(this.state.userCheckSet.recordSet, this.state.filterValue);
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        var columns = [];
        if (this.state.viewType === '1') {
            columns = [
                {
                    title: '员工号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 140,
                },
                {
                    title: '姓名',
                    dataIndex: 'perName',
                    key: 'perName',
                    width: 140,
                },
                {
                    title: '项目组',
                    dataIndex: 'resName',
                    key: 'resName',
                    width: 140,
                },
                {
                    title: '签到',
                    dataIndex: 'checkIn',
                    key: 'checkIn',
                    width: 140,
                },
                {
                    title: '签退',
                    dataIndex: 'checkOut',
                    key: 'checkOut',
                    width: 140,
                },
                {
                    title: '工时',
                    dataIndex: 'workHour',
                    key: 'workHour',
                    width: 140,
                },
                {
                    title: '加班',
                    dataIndex: 'overHour',
                    key: 'overHour',
                    width: 140,
                },
                {
                    title: '休假',
                    dataIndex: 'leaveHour',
                    key: 'leaveHour',
                    width: 140,
                },
                {
                    title: '经理',
                    dataIndex: 'pmName',
                    key: 'pmName',
                    width: 140,
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 60,
                    render: (text, record) => (
                        <span>
                            <a onClick={this.onClickCheck.bind(this, record)} title='考勤'><Icon type={this.getEditIcon(record)} /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除考勤数据'><Icon type={Common.iconRemove} /></a>
                        </span>
                    ),
                }
            ];
        } else if (this.state.viewType === '2') {
            var cardList =
                recordSet.map((chkDate, i) => {
                    return <div key={chkDate.uuid} className='card-div' style={{ width: 260 }}>
                        <div className="ant-card ant-card-bordered" style={{ width: '100%' }}>
                            <div className="ant-card-head"><h3 className="ant-card-head-title" style={this.getTitleStyle(chkDate)}>{chkDate.staffCode}（{chkDate.perName}）</h3></div>
                            <div className="ant-card-extra">
                                <a href="#" onClick={this.onClickUpdate.bind(this, chkDate)} title='修改'><Icon type={Common.iconUpdate} /></a>
                            </div>
                            <div className="ant-card-body" style={{ cursor: 'pointer', height: '80px', overflow: 'hidden' }}>
                                <p>签到：{chkDate.checkIn}， 签退：{chkDate.checkOut}</p>
                                <p>工时：{chkDate.workHour}， 加班：{chkDate.overHour}， 经理：{chkDate.pmName}</p>
                            </div>
                        </div>
                    </div>
                });
        } else if (this.state.viewType === '3') {
            columns = [
                {
                    title: '员工号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 140,
                },
                {
                    title: '姓名',
                    dataIndex: 'perName',
                    key: 'perName',
                    width: 140,
                },
                {
                    title: '项目组',
                    dataIndex: 'resName',
                    key: 'resName',
                    width: 140,
                },
                {
                    title: '签到',
                    dataIndex: 'checkIn',
                    key: 'checkIn',
                    width: 140,
                },
                {
                    title: '签退',
                    dataIndex: 'checkOut',
                    key: 'checkOut',
                    width: 140,
                },
                {
                    title: '工时',
                    dataIndex: 'workHour',
                    key: 'workHour',
                    width: 140,
                },
                {
                    title: '加班',
                    dataIndex: 'overHour',
                    key: 'overHour',
                    width: 140,
                },
                {
                    title: '休假',
                    dataIndex: 'leaveHour',
                    key: 'leaveHour',
                    width: 140,
                },
                {
                    title: '经理',
                    dataIndex: 'pmName',
                    key: 'pmName',
                    width: 140,
                },
            ]
        }

        // 表格
        var tableBox = null;
        if (this.state.viewType === '2') {
            tableBox = <div className='card-body' style={{ paddingTop: '6px' }}>{cardList}</div>
        }
        else if (this.state.viewType === '3') {
            tableBox =
                <div style={{ padding: '0 18px 18px 20px' }} className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowSelection={rowSelection} rowKey={record => record.id} loading={this.state.loading} pagination={false} size="small" bordered />
                </div>
        }
        else {
            tableBox =
                <div style={{ padding: '0 18px 18px 20px' }} className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="small" bordered={Common.tableBorder} />
                </div>
        }

        var cs = Common.getCardMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['user-chk-book/retrieve', 'user-chk-book/remove', 'res-member-snap/create-group-chk']} />

                    <div className='toolbar-table'>
                        {
                            this.state.viewType === '3' ?
                                <Button type="primary" style={{ marginRight: '12px' }} onClick={this.handleClickBatchCheck}>创建考勤</Button>
                                :
                                null
                        }

                        <SelectDate value={this.state.workDate} onChange={this.onChangeDate} />
                        <DatePicker style={{ width: '100px', marginLeft: '16px' }} format={dateFormat} onChange={this.datePicker} allowClear={false} />
                        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleClickCheckBook}>生成考勤表</Button>

                        <div style={{ float: 'right' }}>
                            <RadioGroup value={this.state.viewType} style={{ marginLeft: '16px' }} onChange={this.onChangeViewType}>
                                <RadioButton value="1"><Icon type='bars' /></RadioButton>
                                <RadioButton value="2"><Icon type='credit-card' /></RadioButton>
                                <RadioButton value="3"><Icon type='check-square-o' /></RadioButton>
                            </RadioGroup>
                        </div>
                        {
                            this.state.viewType === '3' ?
                                null
                                :
                                <Search placeholder="查询" style={{ width: '120px', marginLeft: '16px', float: 'right' }} value={this.state.filterValue} onChange={this.onFilterRecord} />
                        }
                    </div>
                </div>

                {tableBox}
                <CreateUserCheckPage ref="createWindow" />
                <BatchCheckPage ref="batchCheckWindow" />
            </div>

        );
    }
});

module.exports = GroupCheckPage;

