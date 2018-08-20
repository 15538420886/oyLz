﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjStore = require('./data/ProjStore.js');
var ProjActions = require('./action/ProjActions');
var ProjContext = require('../../ProjContext');
import CreateProjPage from './Components/CreateProjPage';
import UpdateProjPage from './Components/UpdateProjPage';

var filterValue = '';
var ProjPage = React.createClass({
    getInitialState: function () {
        return {
            projSet: {
                recordSet: [],
                errMsg: ''
            },

            action: 'query',
            proj: null,
            loading: false,
            sortedInfo: null,
        }
    },

    mixins: [Reflux.listenTo(ProjStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });

        var filter = {};
        filter.status = '1';
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.parentUuid = ProjContext.selectedGroup.uuid;
        ProjActions.initProjInfo(filter, 0, 0);
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });

        var filter = {};
        filter.status = '1';
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.parentUuid = ProjContext.selectedGroup.uuid;
        ProjActions.retrieveProjInfoPage(filter, 0, 0);
    },

    onClickDelete: function (proj, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的项目组 【' + proj.projCode + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, proj)
        });
    },

    onClickDelete2: function (proj) {
        this.setState({ loading: true });
        this.state.projSet.operation = '';
        ProjActions.deleteProjInfo(proj.uuid);
    },

    handleAppClick: function (proj) {
        ProjContext.openGroupProjPage(proj);
    },

    handleCreate: function (e) {
        this.setState({ action: 'create' });
    },
    onClickUpdate: function (proj, event) {
        this.setState({ proj: proj, action: 'update' });
    },
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    handleSortChange: function (pagination, filters, sorter) {
        console.log('sorter', sorter)
        this.setState({
            sortedInfo: sorter,
        });
    },

    render: function () {
        var sortedInfo = this.state.sortedInfo;
        sortedInfo = sortedInfo || {};

        const columns = [
            {
                title: '项目编号',
                dataIndex: 'projCode',
                key: 'projCode',
                width: 140,
                sorter: (a, b) => a.projCode.localeCompare(b.projCode),
                sortOrder: sortedInfo.columnKey === 'projCode' && sortedInfo.order,
            },
            {
                title: '项目名称',
                dataIndex: 'projName',
                key: 'projName',
                width: 140,
                sorter: (a, b) => a.projName.localeCompare(b.projName),
                sortOrder: sortedInfo.columnKey === 'projName' && sortedInfo.order,
            },
            {
                title: '业务类型',
                dataIndex: 'biziType',
                key: 'biziType',
                width: 140,
            },
            {
                title: '项目类型',
                dataIndex: 'projType',
                key: 'projType',
                width: 140,
            },
            {
                title: '开始日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                sorter: (a, b) => a.beginDate.localeCompare(b.beginDate),
                sortOrder: sortedInfo.columnKey === 'beginDate' && sortedInfo.order,
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            /*{
                title: '项目状态',
                dataIndex: 'projStatus',
                key: 'projStatus',
                width: 140,
            },*/
            {
                title: '成员',
                dataIndex: 'memberCount',
                key: 'memberCount',
                width: 90,
            },
            {
                title: '项目经理',
                dataIndex: 'pmName',
                key: 'pmName',
                width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目组'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目组'><Icon type={Common.iconRemove} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleAppClick.bind(this, record)} title='项目详情'><Icon type="bars" /></a>
                    </span>
                ),
            }
        ];

        var recordSet = Common.filter(this.state.projSet.recordSet, filterValue);
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        
        var contactTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['proj_info/retrieve', 'proj_info/remove']} />

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加项目组" onClick={this.handleCreate} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} onChange={this.handleSortChange} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>;

        var page = null;
        if (this.state.action === 'create') {
            page = <CreateProjPage onBack={this.onGoBack} />;
        }
        else if (this.state.action === 'update') {
            var proj = {};
            Utils.copyValue(this.state.proj, proj);
            page = <UpdateProjPage onBack={this.onGoBack} proj={proj} />
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {contactTable}
                {page}
            </div>
        );
    }
});

module.exports = ProjPage;

