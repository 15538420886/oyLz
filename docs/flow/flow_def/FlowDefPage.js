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

var FlowDefStore = require('./data/FlowDefStore.js');
var FlowDefActions = require('./action/FlowDefActions');


import CreateFlowDefPage from './Components/CreateFlowDefPage';
import UpdateFlowDefPage from './Components/UpdateFlowDefPage';
import FlowDefNodePage from './FlowDefNodePage.js';

var filterValue = '';
var FlowDefPage = React.createClass({
    getInitialState: function () {
        return {
            flowDefSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            filter: {},
            rowUuid: {},
            selectedRowUuid: '',
        }
    },

    mixins: [Reflux.listenTo(FlowDefStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            flowDefSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        // FIXME 查询条件
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        FlowDefActions.retrieveFlowDef(filter);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        // FIXME 查询条件
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        FlowDefActions.initFlowDef(filter);
    },

    handleOpenCreateWindow: function (event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (flowDef, event) {
        if (flowDef != null) {
            this.refs.updateWindow.initPage(flowDef);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (flowDef, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的审批流程 【' + flowDef.flowCode + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, flowDef)
        });
    },

    onClickDelete2: function (flowDef) {
        this.setState({ loading: true });
        FlowDefActions.deleteFlowDef(flowDef.uuid);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    onRowClick: function (record, index, event) {
        this.setState({ selectedRowUuid: record.uuid })
        this.refs.localData.onInitFlowDef(record);
    },
    getRowClassName: function (record, index) {
        var uuid = record.uuid;
        if (this.state.selectedRowUuid == uuid) {
            return 'selected';
        }
        else {
            return '';
        }
    },
    render: function () {
        var recordSet = Common.filter(this.state.flowDefSet.recordSet, filterValue);
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        var addClass = { background: 'red' };
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
                title: '流程编号',
                dataIndex: 'flowCode',
                key: 'flowCode',
                width: 130,
            },
            {
                title: '流程名称',
                dataIndex: 'flowName',
                key: 'flowName',
                width: 180,
            },
            {
                title: '操作',
                key: 'action',
                width: 60,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改审批流程'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除审批流程'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <div className='left-tree' style={{ flex: '0 0 440px', width: '440px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#fcfcfc' }}>
                    <div className='grid-body' style={{padding: '0 16px 8px 12px'}}>
                        <ServiceMsg ref='mxgBox' svcList={['flow-def/retrieve', 'flow-def/remove']} />
                        <div className='toolbar-table' style={{ padding: '0 0 0 0' }}>
                            <div style={{ float: 'left' }}>
                                <Button icon={Common.iconAdd} type="primary" title="增加审批流程" onClick={this.handleOpenCreateWindow} />
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>

                        <Table onRowClick={this.onRowClick} rowClassName={this.getRowClassName} columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                    </div>
                    <CreateFlowDefPage ref="createWindow" />
                    <UpdateFlowDefPage ref="updateWindow" />
                </div>

                <div className='left-tree' style={{width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    <FlowDefNodePage ref="localData" />
                </div>
            </div>
        );
    }
});

module.exports = FlowDefPage;