﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjStore = require('./data/ProjStore.js');
var ProjActions = require('./action/ProjActions');
var ProjContext = require('../../ProjContext');

var pageRows = 10;
var ProjQueryPage = React.createClass({
    getInitialState: function () {
        return {
            projSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(ProjStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            var ff = data.filter.projCode;
            if (ff === null || typeof (ff) === 'undefined' || ff === '') {
                ff = data.filter.projName;
                if (ff === null || typeof (ff) === 'undefined') {
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
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
        this.state.filter.more = '0';
        ProjActions.retrieveProjInfoPage(this.state.filter, this.state.projSet.startPage, pageRows);
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
    handleAppClick: function (proj) {
        ProjContext.openInitProjPage(proj);
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
                        <a href="#" onClick={this.handleAppClick.bind(this, record)} title='项目详情'><Icon type="bars" /></a>
                    </span>
                ),
            }
        ];

        var recordSet = this.state.projSet.recordSet;
        var pag = {
            showQuickJumper: true, total: this.state.projSet.totalRow, pageSize: this.state.projSet.pageRow,
            current: this.state.projSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };

        return (
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['proj_info/retrieve', 'proj_info/remove']} />

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%' }}>
                            <Search placeholder="查询(项目组编号/项目组名称)" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>
        );
    }
});

module.exports = ProjQueryPage;

