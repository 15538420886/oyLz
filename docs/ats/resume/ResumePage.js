'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Radio } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var RecruitStore = require('../recruit/data/RecruitStore');
var RecruitActions = require('../recruit/action/RecruitActions');
var PendingTable = require('./Components/PendingTable');

var ResumePage = React.createClass({
    getInitialState: function () {
        return {
            recruitSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            action: 'query',
            resume:null,
            recruit: null,
            filterValue: '',
        }
    },

    mixins: [Reflux.listenTo(RecruitStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            recruitSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });

        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.status = '招聘中';
        RecruitActions.retrieveRecruit(filter);
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });

        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.status = '招聘中';
        RecruitActions.retrieveRecruit(filter);
    },

    onClickOpen: function ( resume, event) {
         if(resume != null){
            this.setState({resume: resume, action: 'detail'});
        }
    },

    onGoBack: function () {
        this.setState({ action: 'query' });
    },

    onChangeFilter: function (e) {
        this.setState({ filterValue: e.target.value });
    },

    render: function () {
        var recordSet = Common.filter(this.state.recruitSet.recordSet, this.state.filterValue);

        var columns = [
            {
                title: '岗位名称',
                dataIndex: 'jobName',
                key: 'jobName',
                width: 140,
            },
            {
                title: '城市',
                dataIndex: 'jobCity',
                key: 'jobCity',
                width: 100,
            },
            {
                title: '部门',
                dataIndex: 'applyDept',
                key: 'applyDept',
                width: 140,
            },
            {
                title: '申请日期',
                dataIndex: 'applyDate',
                key: 'applyDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '人员类型',
                dataIndex: 'personType',
                key: 'personType',
                width: 140,
            },
            {
                title: '标准岗位',
                dataIndex: 'jobCode',
                key: 'jobCode',
                width: 220,
                render: (text, record) => (record.category + '>' + record.jobLevel),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
            },
            {
                title: '操作',
                key: 'action',
                width: 70,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickOpen.bind(this, record)} title='简历管理'><Icon type={Common.iconDetail} /></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{ padding: cs.padding, display: visible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['recruit/retrieve']} />
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                    <div className='grid-body'>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} expandedRowRender={this.expandedRowRender} />
                    </div>
                </div>
            </div>
        );
        var detailResumePage = null;
        if(this.state.action === 'detail'){
                    // FIXME 输入参数
            detailResumePage = <PendingTable onBack={this.onGoBack} resume={this.state.resume}/>;
        }
       

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {tablePage}
                {detailResumePage}
            </div>
        );
    }
});

module.exports = ResumePage;
