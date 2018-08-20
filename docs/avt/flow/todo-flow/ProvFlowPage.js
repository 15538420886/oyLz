'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input } from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import CodeMap from '../../../hr/lib/CodeMap';
var ProvFlowStore = require('./data/ProvFlowStore');
var ProvFlowActions = require('./action/ProvFlowActions');
import SelectFlow from './Components/SelectFlow';
import ChkFlowViewPage from './Components/ChkFlowViewPage';


var pageRows = 10;
var ProvFlowPage = React.createClass({
    getInitialState: function () {
        return {
            flowSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
            obj: {},
            action: 'query',
            filterValue: ''
        }
    },

    mixins: [Reflux.listenTo(ProvFlowStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            flowSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var sixtyDay = this.getPastSixtyDay();
        var day = Common.getToday()
        var filter = {};
        filter.nextUserStaffCode = window.loginData.compUser.userCode;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.applyDate1 = sixtyDay;
        filter.applyDate2 = day;
        filter.flowUuid = this.state.filterValue;

        ProvFlowActions.retrieveChkFlowPage(filter, this.state.flowSet.startPage, pageRows);
    },

    // 第一次加载
    componentDidMount: function () {
        var sixtyDay = this.getPastSixtyDay();
        var day = Common.getToday()

        var filter = {};
        filter.nextUserStaffCode = window.loginData.compUser.userCode;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.applyDate1 = sixtyDay;
        filter.applyDate2 = day;

        this.setState({ loading: true });
        ProvFlowActions.initChkFlow(filter, this.state.flowSet.startPage, pageRows);
    },

    getPastSixtyDay: function () {
        var curDate = (new Date()).getTime();
        var sixtyDay = 60 * 24 * 3600 * 1000;
        var pastResult = curDate - sixtyDay;
        var pastDate = new Date(pastResult),
            pastYear = pastDate.getFullYear(),
            pastMonth = pastDate.getMonth() + 1,
            pastDay = pastDate.getDate();
        return pastYear * 10000 + pastMonth * 100 + pastDay;
    },

    onGoBack: function () {
        this.setState({ action: 'query' });
    },

    onClickFlow: function (data) {
        this.setState({ action: 'chk', obj: data });

    },

    handleOnSelectedFlow: function (value) {
        this.state.filterValue = value;
        this.handleQueryClick();
    },

    onChangePage: function (pageNumber) {
        this.state.flowSet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },

    onFilterRecord: function (e) {
        this.setState({ filterValue: e.target.value });
    },


    render: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
        var recordSet = this.state.flowSet.recordSet;
        const columns = [
            {
                title: '流程名称',
                dataIndex: 'flowName',
                key: 'flowName',
                width: 140,
            },
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
                title: '部门',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 140,
            },
            {
                title: '归属地',
                dataIndex: 'baseCity',
                key: 'baseCity',
                width: 140,
            },
            {
                title: '申请人',
                dataIndex: 'applyName',
                key: 'applyName',
                width: 140,
            },
            {
                title: '申请日期',
                dataIndex: 'applyDate',
                key: 'applyDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '状态',
                dataIndex: 'flowStatus',
                key: 'flowStatus',
                width: 100,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickFlow.bind(this, record)} ><Icon type="bars" /></a>
                    </span>
                ),
            }
        ];

        var page = null;
        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.flowSet.totalRow, pageSize: this.state.flowSet.pageRow,
            current: this.state.flowSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };

        var table =
            <div className='grid-page' style={{ padding: cs.padding, display: visible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['chk-flow/findFour']} />
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <SelectFlow placeholder="选择" style={{ textAlign: 'left', width: Common.searchWidth }} corpUuid={corpUuid} value={this.state.filterValue} onSelect={this.handleOnSelectedFlow} />
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} expandedRowRender={record => <div><p>{record.eventDesc}</p></div>} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>
        if (this.state.action === 'chk') {
            page = (<ChkFlowViewPage onBack={this.onGoBack} obj={this.state.obj} />)
        }
        return (
            <div >
                {table}
                {page}
            </div>
        );
    }
});

module.exports = ProvFlowPage;

