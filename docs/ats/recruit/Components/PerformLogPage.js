'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var PerformLogStore = require('../data/PerformLogStore');
var PerformLogActions = require('../action/PerformLogActions');

import CreatePerformLogPage from './CreatePerformLogPage';
import UpdatePerformLogPage from './UpdatePerformLogPage';

var filterValue = '';
var PerformLogPage = React.createClass({
    getInitialState : function() {
        return {
            performLogSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(PerformLogStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            performLogSet: data
        });
    },

    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
        var filter = {};
        filter.uuid = this.props.uuid;
		filter.corpUuid = window.loginData.compUser.corpUuid;
        PerformLogActions.retrieveRecruit(filter);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var filter = {};
        filter.uuid = this.props.uuid;
		filter.corpUuid = window.loginData.compUser.corpUuid;
        PerformLogActions.retrieveRecruit(filter);
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(performLog, event)
    {
        if(performLog != null){
            this.refs.updateWindow.initPage(performLog);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(performLog, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的执行日志',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, performLog)
        });
    },

    onClickDelete2 : function(performLog)
    {
        this.setState({loading: true});
        var LogObj = {};
        LogObj.filter  = this.props.uuid;
        LogObj.object = performLog.uuid;
        PerformLogActions.deletePerformLog( LogObj );   
    },

    render : function() {
        var recordSet = Common.filter(this.state.performLogSet.recordSet, filterValue);
        const columns = [
                 {
					title: '日期',
					dataIndex: 'logDate',
					key: 'logDate',
					width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '渠道',
					dataIndex: 'channel',
					key: 'channel',
					width: 140,
				},
				{
					title: '简历数量',
					dataIndex: 'resumeCount',
					key: 'resumeCount',
					width: 140,
				},
				{
					title: '面试数量',
					dataIndex: 'interCount',
					key: 'interCount',
					width: 140,
				},
                {
					title: '录用人数',
					dataIndex: 'recruCount',
					key: 'recruCount',
					width: 140,
				},
                {
                
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改执行日志'><Icon type={Common.iconUpdate}/></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除执行日志'><Icon type={Common.iconRemove}/></a>
                        </span>
                    ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['perform-Log/retrieve', 'perform-Log/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加执行情况" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreatePerformLogPage ref="createWindow" uuid = {this.props.uuid}/>
                <UpdatePerformLogPage ref="updateWindow" uuid = {this.props.uuid}/>
            </div>
        );
    }
});

module.exports = PerformLogPage;