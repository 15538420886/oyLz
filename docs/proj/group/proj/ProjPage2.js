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
import ProjFilter from './Components/ProjFilter';

var pageRows = 10;
var ProjPage2 = React.createClass({
    getInitialState: function () {
        return {
            projSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            action: 'query',
            proj: null,

            loading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(ProjStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            if (data.filter.parentUuid === ProjContext.selectedGroup.uuid) {
                var ff = data.filter.projCode;
                if (ff === null || typeof (ff) === 'undefined' || ff === '') {
                    ff = data.filter.projName;
                    if (ff === null || typeof (ff) === 'undefined') {
                        ff = '';
                    }
                }

                this.state.filterValue = ff;
                this.state.filter = data.filter;
                this.state.moreFilter = (data.filter.more === '1');

                if (this.state.moreFilter) {
                    var mp = this.refs.ProjFilter;
                    if (mp !== null && typeof (mp) !== 'undefined') {
                        mp.state.proj = this.state.filter;
                    }
                }
            }
            else {
                this.handleQueryClick();
            }
        }
        this.setState({
            loading: false,
            projSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        ProjActions.getCacheData();
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.parentUuid = ProjContext.selectedGroup.uuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        ProjActions.retrieveProjInfoPage(this.state.filter, this.state.projSet.startPage, pageRows);
    },

    showMoreFilter: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    onChangePage: function (pageNumber) {
        this.state.projSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onChangeFilter: function (e) {
        this.setState({ filterValue: e.target.value });
    },
    onSearch: function (e) {
        this.state.filter = {};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)) {
            this.state.filter.projCode = filterValue;
        }
        else {
            this.state.filter.projName = filterValue;
        }

        this.handleQueryClick();
    },
    onMoreSearch: function () {
        var filter = this.refs.ProjFilter.state.proj;
        if (filter.beginDate !== null && filter.beginDate !== '') {
            filter.beginDate1 = filter.beginDate + '01';
            filter.beginDate2 = filter.beginDate + '31';
        } else {
            filter.beginDate1 = '';
            filter.beginDate2 = '';
        }

        // console.log(filter.beginDate1)
        this.state.filter = filter;
        this.handleQueryClick();
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

    render: function () {

        const columns = [
            {
                title: '项目编号',
                dataIndex: 'projCode',
                key: 'projCode',
                width: 140,
            },
            {
                title: '项目名称',
                dataIndex: 'projName',
                key: 'projName',
                width: 140,
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
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
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

        var recordSet = this.state.projSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.projSet.totalRow, pageSize: this.state.projSet.pageRow,
            current: this.state.projSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        var contactTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['proj_info/retrieve', 'proj_info/remove']} />
                <ProjFilter ref="ProjFilter" moreFilter={moreFilter} />

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加项目组" onClick={this.handleCreate} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        {
                            moreFilter ?
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                    <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                </div> :
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Search placeholder="查询(项目组编号/项目组名称)" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />
                                    <Button title="更多条件" onClick={this.showMoreFilter} style={{ marginLeft: '8px' }}>更多条件</Button>
                                </div>
                        }
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
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

module.exports = ProjPage2;

