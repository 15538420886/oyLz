'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal } from 'antd';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var ProjInfoTableStore = require('../data/ProjInfoTableStore');
var ProjInfoTableActions = require('../action/ProjInfoTableActions');
import CreateProjInfoPage from '../Components/CreateProjInfoPage';
import UpdateProjInfoPage from '../Components/UpdateProjInfoPage';

var ProjInfoTablePage = React.createClass({
    getInitialState: function () {
        return {
            projInfoSet: {
                recordSet: [],
                errMsg: '',
            },
            loading: false,
            projUuid: this.props.projUuid,
        }
    },

    mixins: [Reflux.listenTo(ProjInfoTableStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projInfoSet: data
        });
    },

    handleQueryClick: function (filter) {
        this.setState({ loading: true });
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        filter.projUuid = this.props.projUuid;
        ProjInfoTableActions.retrieveProjMember(filter);
    },

    componentDidMount: function (filter) {
    },

    componentWillReceiveProps: function (newProps) {
        if (newProps.projUuid === this.props.projUuid) {
            return;
        }

        this.setState({ loading: true });
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        filter.projUuid = newProps.projUuid;
        ProjInfoTableActions.initProjMember(filter);
    },

    handleOpenCreateWindow: function (event) {
        var corpUuid = window.loginData.compUser.corpUuid;
        this.refs.createWindow.clear(corpUuid);
        this.refs.createWindow.toggle();
    },

    handleUpdateClick: function (projInfo, e) {
        if (projInfo != null) {
            this.refs.updateWindow.initPage(projInfo);
            this.refs.updateWindow.toggle();
        }
        e.stopPropagation();
    },

    handleRemoveClick: function (projInfo) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的任务 【' + projInfo.ordName + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.handleRemoveClick2.bind(this, projInfo)
        });
        event.stopPropagation();
    },

    handleRemoveClick2: function (projInfo) {
        this.setState({ loading: true });
        ProjInfoTableActions.deleteProjMember(projInfo.uuid);
    },

    render: function () {
        var recordSet = this.state.projInfoSet.recordSet;

        const columns = [
            {
                title: '编号',
                dataIndex: 'ordCode',
                key: 'ordCode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'ordName',
                key: 'ordName',
                width: 140,
            },
            {
                title: '客户',
                dataIndex: 'custName',
                key: 'custName',
                width: 140,
            },
            {
                title: '最终客户',
                dataIndex: 'realCust',
                key: 'realCust',
                width: 140,
            },
            {
                title: '入组日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '承担角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (projInfo, record) => (
                    <span>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, projInfo)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleRemoveClick.bind(this, projInfo)} title='删除任务'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div style={{ padding: '10px 0 0 0' }}>
                <ServiceMsg ref='mxgBox' svcList={['proj-task-member/user-task', 'proj-task-member/remove']} />
                <div className='toolbar-table'>
                    <div style={{ float: 'left' }}>
                        <span style={{ fontSize: '12pt' }}>我参与的订单和任务</span>
                        <Button icon={Common.iconAdd} type="primary" title="增加任务" onClick={this.handleOpenCreateWindow} style={{ marginLeft: '16px' }} />
                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ textAlign: 'right', width: '100%' }}>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
                <CreateProjInfoPage ref="createWindow" projUuid={this.props.projUuid} />
                <UpdateProjInfoPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = ProjInfoTablePage;

