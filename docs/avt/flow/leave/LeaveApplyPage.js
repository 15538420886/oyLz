'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var LeaveApplyStore = require('./data/LeaveApplyStore.js');
var LeaveApplyActions = require('./action/LeaveApplyActions');
var LeaveLogPerStore = require('../../check/leave_log/data/LeaveLogPerStore');
var LeaveLogPerActions = require('../../check/leave_log/action/LeaveLogPerActions');

import CreateUnpaidLeaveApplyPage from './Components/CreateUnpaidLeaveApplyPage';
import CreatePaidLeaveApplyPage from './Components/CreatePaidLeaveApplyPage';
import UpdateUnpaidLeaveApplyPage from './Components/UpdateUnpaidLeaveApplyPage';
import UpdatePaidLeaveApplyPage from './Components/UpdatePaidLeaveApplyPage';
import CancelUnpaidLeaveApplyPage from './Components/CancelUnpaidLeaveApplyPage';
import CancelPaidLeaveApplyPage from './Components/CancelPaidLeaveApplyPage';

var pageRows = 10;
var LeaveApplyPage = React.createClass({
    getInitialState: function () {
        return {
            leaveApplySet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
            leaveLoading: false,
            leave: {},
        }
    },

    mixins: [Reflux.listenTo(LeaveApplyStore, "onServiceComplete"),
        Reflux.listenTo(LeaveLogPerStore, "onServiceComplete2")],
    onServiceComplete: function (data) {
        // console.log('data:::', data)
        this.setState({
            loading: false,
            leaveApplySet: data
        });
    },

    onServiceComplete2: function (data) {
        if (data.operation === 'retrieve') {
            this.setState({
                leaveLoading: false,
                leave: data.leavelogper || {}
            });
        }
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        if (window.loginData.compUser) {
            this.setState({ loading: true });
            var filter = {
                corpUuid: window.loginData.compUser.corpUuid,
                staffCode: window.loginData.compUser.userCode
            }
            LeaveApplyActions.retrieveLeaveApplyPage(filter, this.state.leaveApplySet.startPage, pageRows);
        }
    },

    onChangePage: function (pageNumber) {
        this.state.leaveApplySet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function (current, pageSize) {
        // console.log('pageSize::', pageSize)
        pageRows = pageSize;
        this.handleQueryClick();
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        if (window.loginData.compUser) {
            this.setState({ loading: true, leaveLoading: true });
            var filter = {
                corpUuid: window.loginData.compUser.corpUuid,
                staffCode: window.loginData.compUser.userCode
            }
            LeaveApplyActions.initLeaveApply(filter);
            //查leave
            var corpUuid = window.loginData.compUser.corpUuid;
            var staffCode = window.loginData.compUser.userCode;
            LeaveLogPerActions.initLeaveLogPerInfo(corpUuid, staffCode);
        }
    },
    getSpendTime: function (text) {
        var pos = text.indexOf('.');
        if (pos < 0) {
            return text + '天';
        }

        var d = text.substr(0, pos);
        var h = text.substr(pos + 1);
        return d + '天 ' + h + '时';
    },

    handleOpenCreateUnpaidWindow: function (e) {
        this.refs.unpaidCreateWindow.clear();
        this.refs.unpaidCreateWindow.toggle();
    },
    handleOpenPaidCreateWindow: function (e) {
        this.refs.paidCreateWindow.clear(this.state.leave);
        this.refs.paidCreateWindow.toggle();
    },

    onClickUpdate: function (leaveApply, event) {
        if (leaveApply != null) {
            var leaveType = leaveApply.leaveType;
            if (leaveType === '病假' || leaveType === '事假' || leaveType === '其他无薪假期') {
                this.refs.unpaidUpdateWindow.initPage(leaveApply);
                this.refs.unpaidUpdateWindow.toggle();
            } else {
                this.refs.paidUpdateWindow.initPage(leaveApply, this.state.leave);
                this.refs.paidUpdateWindow.toggle();
            }

        }
    },

    onClickDelete: function (leaveApply, event) {
        if (leaveApply != null) {
            var leaveType = leaveApply.leaveType;
            if (leaveType === '病假' || leaveType === '事假' || leaveType === '其他无薪假期') {
                this.refs.unpaidCancelWindow.initPage(leaveApply);
                this.refs.unpaidCancelWindow.toggle();
            } else {
                this.refs.paidCancelWindow.initPage(leaveApply, this.state.leave);
                this.refs.paidCancelWindow.toggle();
            }

        }
    },

    onClickDelete2: function (leaveApply) {
        this.setState({ loading: true });
        LeaveApplyActions.deleteLeaveApply(leaveApply.uuid);
    },

    render: function () {
        var recordSet = this.state.leaveApplySet.recordSet;

        const columns = [
            {
                title: '休假类型',
                dataIndex: 'leaveType',
                key: 'leaveType',
                width: 140,
                render: (text, record) => (Utils.getOptionName('HR系统', '假期类型', record.leaveType, false, this)),
            },
            {
                title: '开始日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 120,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '时间',
                dataIndex: 'beginHour',
                key: 'beginHour',
                width: 70,
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 120,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '时间',
                dataIndex: 'endHour',
                key: 'endHour',
                width: 70,
            },
            {
                title: '天数',
                dataIndex: 'accrued',
                key: 'accrued',
                width: 140,
                render: (text, record) => (this.getSpendTime(text)),
            },
            {
                title: '申请日期',
                dataIndex: 'applyDay',
                key: 'applyDay',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 140,
            },

            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改休假申请'><Icon type={Common.iconUpdate} /></a>
                        {
                            record.status === '待休假' ?
                                <span>
                                    <span className="ant-divider" /><a href="#" onClick={this.onClickDelete.bind(this, record)} title='销假'><Icon type="clock-circle-o" /></a>
                                </span>
                                :
                                ''
                        }
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var pag = {
            showQuickJumper: true, total: this.state.leaveApplySet.totalRow, pageSize: this.state.leaveApplySet.pageRow, current: this.state.leaveApplySet.startPage,
            size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['leave_apply/retrieve', 'leave_apply/cancel']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>

                <CreateUnpaidLeaveApplyPage ref="unpaidCreateWindow" />
                <CreatePaidLeaveApplyPage ref="paidCreateWindow" />
                <UpdateUnpaidLeaveApplyPage ref="unpaidUpdateWindow" />
                <UpdatePaidLeaveApplyPage ref="paidUpdateWindow" />
                <CancelUnpaidLeaveApplyPage ref="unpaidCancelWindow" />
                <CancelPaidLeaveApplyPage ref="paidCancelWindow" />
            </div>
        );
    }
});

module.exports = LeaveApplyPage;

/*
<Button icon={Common.iconAdd} type="primary" title="增加无薪休假申请" onClick={this.handleOpenCreateUnpaidWindow}>申请无薪假</Button>
<Button icon={Common.iconAdd} title="增加有薪休假申请" loading={this.state.leaveLoading} onClick={this.handleOpenPaidCreateWindow} style={{ marginLeft: '4px' }}>申请带薪假</Button>
<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
*/