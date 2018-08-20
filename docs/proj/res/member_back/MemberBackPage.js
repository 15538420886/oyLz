﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input, Radio } from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ProjCodeMap from '../../lib/ProjCodeMap';
import ProjContext from '../../ProjContext';
import CodeMap from '../../../hr/lib/CodeMap';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var MemberBackStore = require('./data/MemberBackStore.js');
var MemberBackActions = require('./action/MemberBackActions');
import BackPage from './Components/BackPage';
import UpdateMemberBackPage from './Components/UpdateMemberBackPage';
import MemberBackFilter from './Components/MemberBackFilter';

var pageRows = 10;
var MemberBackPage = React.createClass({
    getInitialState: function () {
        return {
            memberBackSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
            viewType: '1',
            memberBack: null,
            action: 'query',
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(MemberBackStore, "onServiceComplete"), ProjCodeMap(), CodeMap()],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            this.state.memberBackSet = data;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            this.state.filterValue = (data.filter.staffCode) ? data.filter.staffCode : data.filter.perName;
            if (!this.state.filterValue) {
                this.state.filterValue = '';
            }

            // 缺省查询
            if (this.state.filter.poolUuid !== ProjContext.selectedPool.uuid) {
                this.handleQueryClick();
                return;
            }
        }
        else {
            this.state.memberBackSet = data;
        }

        this.setState({
            loading: false
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.poolUuid = ProjContext.selectedPool.uuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        MemberBackActions.retrieveResMemberPage(this.state.filter, this.state.memberBackSet.startPage, pageRows);
    },

    // 第一次加载
    componentDidMount: function () {
        MemberBackActions.getCacheData();
    },

    showMoreFilter: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    onChangePage: function (pageNumber) {
        this.state.memberBackSet.startPage = pageNumber;
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
            this.state.filter.staffCode = filterValue;
        }
        else {
            this.state.filter.perName = filterValue;
        }

        this.handleQueryClick();
    },
    onMoreSearch: function () {
        var filter = this.refs.MemberBackFilter.state.memberBack;
        if (filter.value) {
            if (Common.isIncNumber(filter.value)) {
                filter.staffCode = filter.value;
            }
            else {
                filter.perName = filter.value;
            }
        } else {
            filter.staffCode = '';
            filter.perName = '';
        }
        this.state.filter = filter;
        this.handleQueryClick();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    onClickUpdate: function (memberBack, event) {
        memberBack.beginHour =
            this.setState({ memberBack: memberBack, action: 'update' });
    },

    onClickBack: function (memberBack) {
        this.setState({ memberBack: memberBack, action: 'back' });
    },

    onGoBack: function () {

        this.setState({ action: 'query' });

    },
    onChangeView: function (e) {
        this.setState({ viewType: e.target.value });
    },

    render: function () {

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
                    title: '小组',
                    dataIndex: 'teamUuid',
                    key: 'teamUuid',
                    width: 140,
                    render: (text, record) => (this.getResTeamName(record.poolUuid, text))
                },
                {
                    title: '项目名称',
                    dataIndex: 'resName',
                    key: 'resName',
                    width: 140,
                },

                {
                    title: '状态',
                    dataIndex: 'resStatus',
                    key: 'resStatus',
                    width: 140,
                },
                {
                    title: '入组日期',
                    dataIndex: 'resDate',
                    key: 'resDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '时间',
                    dataIndex: 'resHour',
                    key: 'resHour',
                    width: 140,
                },
                {
                    title: '更多操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickBack.bind(this, record)} title='人员回组' style={{ display: (record.resStatus === "资源池") ? "none" : "block" }}><Icon type="team" /></a>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改回组时间' style={{ display: (record.resStatus === "资源池") ? "block" : "none" }}><Icon type={Common.iconUpdate} /></a>
                        </span>
                    ),
                }
            ];
        } else {
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
                    title: '归属地',
                    dataIndex: 'baseCity',
                    key: 'baseCity',
                    width: 140,
                },
                {
                    title: '最高学历',
                    dataIndex: 'eduDegree',
                    key: 'eduDegree',
                    width: 140,
                },
                {
                    title: '员工级别',
                    dataIndex: 'empLevel',
                    key: 'empLevel',
                    width: 140,
                    render: (text, record) => (this.getLevelName(record.corpUuid, record.empLevel)),
                },
                {
                    title: '技术岗',
                    dataIndex: 'techName',
                    key: 'techName',
                    width: 140,
                },
                {
                    title: '管理岗',
                    dataIndex: 'manName',
                    key: 'manName',
                    width: 140,
                },
                {
                    title: '行业经验',
                    dataIndex: 'induBegin',
                    key: 'induBegin',
                    width: 140,
                    render: (text, record) => (ProjContext.getColumnWorkYears(text)),
                },
                {
                    title: '更多操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickBack.bind(this, record)} title='人员回组' style={{ display: (record.resStatus === "资源池") ? "none" : "block" }}><Icon type="team" /></a>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改回组时间' style={{ display: (record.resStatus === "资源池") ? "block" : "none" }}><Icon type={Common.iconUpdate} /></a>
                        </span>
                    ),
                }

            ]
        }


        var recordSet = this.state.memberBackSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var filter = moreFilter ? this.state.filter : null;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.memberBackSet.totalRow, pageSize: this.state.memberBackSet.pageRow,
            current: this.state.memberBackSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };

        var contactTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['res-member/retrieve', 'res-member/remove']} />
                <MemberBackFilter ref="MemberBackFilter" moreFilter={moreFilter} filter={filter} filterValue={this.state.filterValue}/>

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            <RadioGroup value={this.state.viewType} style={{ marginLeft: '16px' }} onChange={this.onChangeView}>
                                <RadioButton value="1">人员信息</RadioButton>
                                <RadioButton value="2">工资经验</RadioButton>
                            </RadioGroup>
                        </div>
                        {
                            moreFilter ?
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                    <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                </div> :
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Search placeholder="查询(项目编号/项目名称)" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />
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
        if (this.state.action === 'update') {
            page = <UpdateMemberBackPage onBack={this.onGoBack} memberBack={this.state.memberBack} />
        } else if (this.state.action === 'back') {
            page = <BackPage onBack={this.onGoBack} memberBack={this.state.memberBack} />
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {contactTable}
                {page}
            </div>
        );
    }
});

module.exports = MemberBackPage;



