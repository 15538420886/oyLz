'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input,Pagination} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var OverWorkApplyStore = require('./data/OverWorkApplyStore.js');
var OverWorkApplyActions = require('./action/OverWorkApplyActions');
import CreateOverWorkApplyPage from './Components/CreateOverWorkApplyPage';
import UpdateOverWorkApplyPage from './Components/UpdateOverWorkApplyPage';

var filterValue = '';
var pageRows = 10;
var OverWorkApplyPage = React.createClass({
    getInitialState : function() {
        return {
            overWorkApplySet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            filter:{},
        }
    },

    mixins: [Reflux.listenTo(OverWorkApplyStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            overWorkApplySet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
        this.setState({loading: true});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        OverWorkApplyActions.retrieveOverWorkApplyPage(filter,this.state.overWorkApplySet.startPage,pageRows);

    },

    onChangePage: function (pageNumber) {
        this.state.overWorkApplySet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function (current, pageSize) {

        pageRows = pageSize;
        this.handleQueryClick();
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        OverWorkApplyActions.initOverWorkApply(filter);
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(overWorkApply, event)
    {
        if(overWorkApply != null){
            this.refs.updateWindow.initPage(overWorkApply);
            this.refs.updateWindow.toggle();
        }

    },


    render : function() {
        var recordSet = Common.filter(this.state.overWorkApplySet.recordSet, filterValue);

        const columns = [
            {
                title: '日期类型',
                dataIndex: 'dateType',
                key: 'dateType',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '开始日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '项目名称',
                dataIndex: 'projName',
                key: 'projName',
                width: 140,
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '申请日期',
                dataIndex: 'applyDay',
                key: 'applyDay',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改员工加班申请'><Icon type={Common.iconUpdate}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var pag = {
            showQuickJumper: true, total:this.state.overWorkApplySet.totalRow, pageSize:this.state.overWorkApplySet.pageRow, current:this.state.overWorkApplySet.startPage,
            size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['overWorkApply/retrieve', 'overWorkApply/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加员工加班申请" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateOverWorkApplyPage ref="createWindow"/>
                <UpdateOverWorkApplyPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = OverWorkApplyPage;
