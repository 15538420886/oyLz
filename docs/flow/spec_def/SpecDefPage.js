'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Row, Col } from 'antd';

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var SpecDefStore = require('./data/SpecDefStore.js');
var SpecDefActions = require('./action/SpecDefActions');
import CreateSpecDefPage from './Components/CreateSpecDefPage';
import SpecDefStaffPage from './Components/SpecDefStaffPage';

var filterValue = '';
var SpecDefPage = React.createClass({
    getInitialState: function () {
        return {
            specDefSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(SpecDefStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            specDefSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        SpecDefActions.retrieveSpecFlowDef(filter);
        this.setState({ selectedRow: '' });
        this.refs.SpecDefStaff.clear();
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        SpecDefActions.initSpecFlowDef(filter);
    },

    handleOpenCreateWindow: function (event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (specDef, event) {
        if (specDef != null) {
            this.refs.updateWindow.initPage(specDef);
            this.refs.updateWindow.toggle();
        }
    },
    onQuery: function () {
        this.setState({ loading: true });
        SpecDefActions.updateSpecFlowDef2(this.state.specDefStaff);

    },
    onClickDelete: function (specDef, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的特批流程 【' + specDef.flowName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, specDef)
        });

    },

    onClickDelete2: function (specDef) {
        this.setState({ loading: true });
        SpecDefActions.deleteSpecFlowDef(specDef.uuid);
        this.refs.SpecDefStaff.clear();
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
        this.refs.SpecDefStaff.initPage(record);
        this.refs.SpecDefStaff.setState({ action: 'query' });
        this.setState({ selectedRow: index });
    },
    render: function () {
        var recordSet = Common.filter(this.state.specDefSet.recordSet, filterValue);
        const columns = [
            {
                title: '流程代码',
                dataIndex: 'flowCode',
                key: 'flowCode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'flowName',
                key: 'flowName',
                width: 180,
            },
            {
                title: '组织级别',
                dataIndex: 'flowLevel',
                key: 'flowLevel',
                width: 110,
                render: (text, record) => (Utils.getOptionName('流程管理', '特批组织级别', text, false, this)),
            },
            {
                title: '操作',
                key: 'action',
                width: 70,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除特批流程'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <div className='left-tree' style={{ flex: '0 0 440px', width: '440px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#fcfcfc' }}>
                    <div className='grid-body' style={{ padding: '0 16px 8px 12px' }}>
                        <ServiceMsg ref='mxgBox' svcList={['spec_flow_def/retrieve', 'spec_flow_def/remove']} />
                        <div className='toolbar-table' style={{ padding: '0 0 0 0' }}>
                            <div style={{ float: 'left' }}>
                                <Button icon={Common.iconAdd} type="primary" title="增加特批流程" onClick={this.handleOpenCreateWindow} />
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>

                        <Table onRowClick={(record, index) => { this.handleRelatedClick(record, index) }} rowClassName={this.getRowClassName} columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                        <CreateSpecDefPage ref="createWindow" />
                    </div>
                </div>

                <div className='left-tree' style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    <SpecDefStaffPage ref='SpecDefStaff' query={this.onQuery} />
                </div>
            </div>
        );
    }
});

module.exports = SpecDefPage;