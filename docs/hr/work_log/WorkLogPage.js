'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
import DimissTodoPage from './Components/DimissTodoPage';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var WorkLogStore = require('./data/WorkLogStore.js');
var WorkLogActions = require('./action/WorkLogActions');
import WorkLogFilter from './Components/WorkLogFilter';
import CreateWorkLogPage from './Components/CreateWorkLogPage';
import UpdateWorkLogPage from './Components/UpdateWorkLogPage';
import DetailsWorkLogPage from './Components/DetailsWorkLogPage';


var pageRows = 10;
var WorkLogPage = React.createClass({
    getInitialState: function () {
        return {
            workLogSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            action: 'query',
            workLog: null,

            loading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(WorkLogStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            var ff = data.filter.staffCode;
            if (ff === null || typeof (ff) === 'undefined' || ff === '') {
                ff = data.filter.perName;
                if (ff === null || typeof (ff) === 'undefined') {
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if (this.state.moreFilter) {
                var mp = this.refs.WorkLogFilter;
                if (mp !== null && typeof (mp) !== 'undefined') {
                    mp.state.workLog = this.state.filter;
                }
            }
        }

        this.setState({
            loading: false,
            workLogSet: data
        });
    },
    // 第一次加载
    componentDidMount: function () {
        WorkLogActions.getCacheData();
    },
    handleQueryClick: function () {
        this.setState({ loading: true });
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        WorkLogActions.retrieveHrWorkLogPage(this.state.filter, this.state.workLogSet.startPage, pageRows);
    },
    showMoreFilter: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    onChangePage: function (pageNumber) {
        this.state.workLogSet.startPage = pageNumber;
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
        this.state.filter = this.refs.WorkLogFilter.state.workLog;
        this.handleQueryClick();
    },
    onClickDelete: function (workLog, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的工作日志',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, workLog)
        });
    },
    onClickDelete2: function (workLog) {
        this.setState({ loading: true });
        this.state.workLogSet.operation = '';
        WorkLogActions.deleteHrWorkLog(workLog.uuid);
    },
    handleCreate: function (e) {
        this.setState({ action: 'create' });
    },
    onClickDetails: function (workLog, event) {
        this.setState({ workLog: workLog, action: 'detail' });
    },
    onClickUpdate: function (workLog, event) {
        this.setState({ workLog: workLog, action: 'update' });
    },
    onGoBack: function (workLog) {
        this.setState({ action: 'query' });
        // 离职后处理
        if (workLog) {
            var chgType = workLog.chgType;
            if (chgType === '离职' || chgType === '辞退' || chgType === '开除') {
                this.refs.nextWindow.toggle();
                this.refs.nextWindow.initStaff(workLog);
            }
        }
    },

    render: function () {
        const columns = [
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
                width: 140,
            },
            {
                title: '变更类型',
                dataIndex: 'chgType',
                key: 'chgType',
                width: 140,
                render: (text, record) => (Utils.getOptionName('HR系统', '工作变更类型', record.chgType, false, this)),
            },
            {
                title: '部门名称',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 140,
            },
            {
                title: '调前说明',
                dataIndex: 'befMemo',
                key: 'befMemo',
                width: 140,
            },
            {
                title: '调后说明',
                dataIndex: 'aftMemo',
                key: 'aftMemo',
                width: 140,
            },
            {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },

            {
                title: '更多操作',
                key: 'action',
                width: 70,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='详情'><Icon type='bars' /></a>
                    </span>
                ),
            }
        ];
        /*
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工作'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工作'><Icon type={Common.iconRemove}/></a>
                    <span className="ant-divider" />
        */

        var recordSet = this.state.workLogSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.workLogSet.totalRow, pageSize: this.state.workLogSet.pageRow,
            current: this.state.workLogSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };

        var contactTable =
            <div className='grid-page' style={{ overflow: 'hidden', display: visible }}>
                <div style={{ padding: '8px 0 0 0', height: '100%', width: '100%', overflowY: 'auto' }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_work_log/retrieve', 'hr_work_log/remove']} />
                    <WorkLogFilter ref="WorkLogFilter" moreFilter={moreFilter} />

                    <div style={{ margin: '8px 0 0 0' }}>
                        <div className='toolbar-table'>
                            <div style={{ float: 'left' }}>
                                <Button icon={Common.iconAdd} type="primary" title="增加工作变更信息" onClick={this.handleCreate} />
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            </div>
                            {
                                moreFilter ?
                                    <div style={{ textAlign: 'right', width: '100%' }}>
                                        <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                        <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                    </div> :
                                    <div style={{ textAlign: 'right', width: '100%' }}>
                                        <Search placeholder="查询(员工编号/员工姓名)" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />
                                        <Button title="更多条件" onClick={this.showMoreFilter} style={{ marginLeft: '8px' }}>更多条件</Button>
                                    </div>
                            }
                        </div>
                    </div>
                    <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                    </div>
                </div>
            </div>;

        var page = null;
        if (this.state.action === 'create') {
            page = <CreateWorkLogPage ref='createPage' onBack={this.onGoBack} />;
        }
        else if (this.state.action === 'detail') {
            page = <DetailsWorkLogPage onBack={this.onGoBack} userUuid={this.state.workLog.userUuid} />
        }
        else if (this.state.action === 'update') {
            page = <UpdateWorkLogPage onBack={this.onGoBack} workLog={this.state.workLog} />
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {contactTable}
                {page}
                <DimissTodoPage ref="nextWindow" />
            </div>
        );
    }
});

module.exports = WorkLogPage;
