'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Row, Col } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var FlowRoleStore = require('./data/FlowRoleStore.js');
var FlowRoleActions = require('./action/FlowRoleActions');
var FlowRoleStaffStore = require('./data/FlowRoleStaffStore.js');
var FlowRoleStaffActions = require('./action/FlowRoleStaffActions');

import CreateFlowRolePage from './Components/CreateFlowRolePage';
import UpdateFlowRolePage from './Components/UpdateFlowRolePage';
import FlowRoleStaffPage from './FlowRoleStaffPage.js';

var filterValue = '';
var FlowRolePage = React.createClass({
    getInitialState: function () {
        return {
            FlowRoleSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            filter: {},
            selectedRow: -1,
        }
    },

    mixins: [Reflux.listenTo(FlowRoleStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            FlowRoleSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        FlowRoleActions.retrieveFlowRole(filter);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        FlowRoleActions.initFlowRole(filter);
    },

    handleOpenCreateWindow: function (event) {
        var corpUuid = window.loginData.compUser.corpUuid;
        this.refs.createWindow.clear(corpUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (FlowRole, event) {
        if (FlowRole != null) {
            this.refs.updateWindow.initPage(FlowRole);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (FlowRole, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的审批流程 【' + FlowRole.roleName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, FlowRole)
        });
    },

    onClickDelete2: function (FlowRole) {
        this.setState({ loading: true });

        FlowRoleActions.deleteFlowRole(FlowRole.uuid);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    getRowClassName: function (record, index) {

        if (this.state.selectedRow === index) {
            return 'selected';
        }
        else {
            return null;
        }
    },
    handleRelatedClick: function (record, index) {
        this.refs.flowRoleStaff.initPage(record);
        this.refs.flowRoleStaff.setState({ action: 'query' });
        this.setState({ selectedRow: index });
    },
    render: function () {
        var recordSet = Common.filter(this.state.FlowRoleSet.recordSet, filterValue);
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const columns = [

            {
                title: '角色代码',
                dataIndex: 'roleCode',
                key: 'roleCode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140,
            },
            {
                title: '组织级别',
                dataIndex: 'roleLevel',
                key: 'roleLevel',
                width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改流程角色'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除流程角色'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <div className='left-tree' style={{ flex: '0 0 440px', width: '440px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#fcfcfc' }}>
                    <div className='grid-body' style={{ padding: '0 16px 8px 12px' }}>
                        <ServiceMsg ref='mxgBox' svcList={['flow-role/retrieve', 'flow-role/remove']} />
                        <div className='toolbar-table' style={{ padding: '0 0 0 0' }}>
                            <div style={{ float: 'left' }}>
                                <Button icon={Common.iconAdd} type="primary" title="增加流程角色" onClick={this.handleOpenCreateWindow} />
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>

                        <Table onRowClick={(record, index) => { this.handleRelatedClick(record, index) }} rowClassName={this.getRowClassName} columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                        <CreateFlowRolePage ref="createWindow" />
                        <UpdateFlowRolePage ref="updateWindow" />
                    </div>
                </div>

                <div className='left-tree' style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    <FlowRoleStaffPage ref='flowRoleStaff' />
                </div>
            </div>
        );
    }
});

module.exports = FlowRolePage;
