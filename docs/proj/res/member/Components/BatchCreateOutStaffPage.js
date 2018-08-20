'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input, Radio, Spin, Upload } from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var ProjContext = require('../../../ProjContext');
var ResMemberStore = require('../data/ResMemberStore');
var ResMemberActions = require('../action/ResMemberActions');

import CodeMap from '../../../../hr/lib/CodeMap';
import XlsTempFile from '../../../../lib/Components/XlsTempFile';
import XlsConfig from '../../../lib/XlsConfig';

var BatchCreateOutStaffPage = React.createClass({
    getInitialState: function () {
        return {
            recordSet: [],
            loading: false,
            viewType: '1',
            filter: {},
            resMember: {},
        }
    },

    mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), CodeMap(), XlsTempFile()],
    onServiceComplete: function (data) {    
        this.setState({
            loading: false,
            resMemberSet: data
        });   
    },

    // 第一次加载
    componentDidMount: function () {
    },

    onChangeView: function (e) {
        this.setState({ viewType: e.target.value });
    },

    handleBatchCreate: function (e) {
        // 批量增加数据
        this.setState({ loading: true });
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        for(var i = 0; i < this.state.recordSet.length; i++) { 
            var item = this.state.recordSet[i];
            item.userUuid = item.uuid;
            delete item.uuid; 
        }
        ResMemberActions.batchCreateResMember(this.state.recordSet); 
    },

    handleTempDown: function (e) {
        this.downXlsTempFile(XlsConfig.resMemberFields);
    },

    uploadComplete: function (errMsg, result) {
        this.setState({ loading: false }); 
        if (errMsg !== '') {
            Common.errMsg(errMsg);
        }
        else {
            // 计算开始日期 
            for (var i = 0; i < result.list.length; i++) {
                var item = result.list[i];
                item.workBegin = ProjContext.calcBeginMonth(item.beginDate, item.workYears);
                item.induBegin = ProjContext.calcBeginMonth(item.beginDate, item.induYears);

                item.corpUuid = window.loginData.compUser.corpUuid;
                item.poolUuid = ProjContext.selectedPool.uuid;
                item.teamUuid = this.props.team.uuid;
                item.userUuid = item.uuid;
                item.userId = item.userId;
                item.manType = '外协';
                item.status = '在岗';
                item.poolCode = ProjContext.selectedPool.poolCode;
                item.poolName = ProjContext.selectedPool.poolName;
                item.poolLoc = '';

                // 格式化入池时间
                var beginHour = item.beginHour;
                if (beginHour.length === 4) {
                    var pos = beginHour.indexOf(':');
                    if (pos < 0) {
                        item.beginHour = beginHour.substr(0, 2) + ':' + beginHour.substr(2);
                    }
                }

                item.resStatus = '资源池';
                item.resLoc = item.baseCity;
                item.resUuid = item.poolUuid;
                item.resName = item.poolName;
                item.resDate = item.beginDate;
                item.resHour = item.beginHour;
            }

            // 显示批量增加页面
            this.setState({ recordSet: result.list });
        }
    },

    beforeUpload: function (file) {
        this.setState({ loading: true });
        var url = Utils.projUrl + 'out-staff/retrieve-xls';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, XlsConfig.resMemberFields, file, this.uploadComplete);
        return false;
    },

    render: function () {
        var recordSet = this.state.recordSet;

        var corpUuid = window.loginData.compUser.corpUuid;
        var columns = [];
        if (this.state.viewType === '1') {
            columns = [
                {
                    title: '员工编号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 140,
                },
                {
                    title: '姓名',
                    dataIndex: 'perName',
                    key: 'perName',
                    width: 120,
                },
                {
                    title: '成本',
                    dataIndex: 'userCost',
                    key: 'userCost',
                    width: 100,
                },
                {
                    title: '入池日期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 100,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '入池时间',
                    dataIndex: 'beginHour',
                    key: 'beginHour',
                    width: 100,
                },
                {
                    title: '最高学历',
                    dataIndex: 'eduDegree',
                    key: 'eduDegree',
                    width: 120,
                },
                {
                    title: '毕业院校',
                    dataIndex: 'eduCollege',
                    key: 'eduCollege',
                    width: 140,
                },
                {
                    title: '工作年限',
                    dataIndex: 'workBegin',
                    key: 'workBegin',
                    width: 100,
                    render: (text, record) => (ProjContext.getColumnWorkYears(text)),
                },
                {
                    title: '行业经验',
                    dataIndex: 'induBegin',
                    key: 'induBegin',
                    width: 100,
                    render: (text, record) => (ProjContext.getColumnWorkYears(text)),
                },
            ];
        } else {
            columns = [
                {
                    title: '员工编号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 140,
                },
                {
                    title: '姓名',
                    dataIndex: 'perName',
                    key: 'perName',
                    width: 120,
                },
                {
                    title: '公司名称',
                    dataIndex: 'corpName',
                    key: 'corpName',
                    width: 140,
                    render: (text, record) => ((text === null || text === '' || text === undefined) ? record.deptName : text),
                },
                {
                    title: '员工级别',
                    dataIndex: 'empLevel',
                    key: 'empLevel',
                    width: 100,
                    render: (text, record) => (this.getLevelName(corpUuid, record.empLevel)),
                },
                {
                    title: '技术岗位',
                    dataIndex: 'techName',
                    key: 'techUuid',
                    width: 100,
                },
                {
                    title: '管理岗位',
                    dataIndex: 'manName',
                    key: 'manUuid',
                    width: 100,
                },
                {
                    title: '入池日期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 100,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '归属地',
                    dataIndex: 'baseCity',
                    key: 'baseCity',
                    width: 100,
                },
            ];
        };

        var disabled = (recordSet.length === 0);
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['res-member/create']} />
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon='save' type="primary" title="批量保存成员" onClick={this.handleBatchCreate} disabled={disabled}>批量保存成员</Button>
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='上传文件, 需要用户确认后才会保存到数据库'/>
                            </Upload>
                        </div>

                        <RadioGroup value={this.state.viewType} style={{ paddingLeft: '32px' }} onChange={this.onChangeView}>
                            <RadioButton value="1">工作经验</RadioButton>
                            <RadioButton value="2">岗位</RadioButton>
                        </RadioGroup>
                    </div>
                    <div className='grid-body'>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = BatchCreateOutStaffPage;

