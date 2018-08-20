﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;


import CreateProjCondPage2 from './Components/CreateProjCondPage2';
import UpdateProjCondPage2 from './Components/UpdateProjCondPage2';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjCondPageStore = require('./data/ProjCondPageStore');
var ProjCondPageActions = require('./action/ProjCondPageActions');
var ProjContext = require('../../ProjContext');

var pageRows = 10;
var filterValue = '';
var ProjCondPage2 = React.createClass({
    getInitialState : function() {
        return {
            condSet: {
                recordSet: [],
                startPage :1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
            },
            cond:{},
            action: 'query',
            loading: false,
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(ProjCondPageStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            condSet: data
        });
    },

    
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var filter=this.state.filter;
        
        filter.projUuid = this.props.projDisp.uuid;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        ProjCondPageActions.retrieveProjCondPage(filter,this.state.condSet.startPage, pageRows);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
       	this.handleQueryClick();
    }, 
   
    onClickUpdate : function(ProjCond, event){
       // this.setState({action: 'update2', cond: ProjCond});
        this.props.doAction('update-cond', ProjCond);
    },

    
    onClickDelete : function(ProjCond, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除 【'+ProjCond.perName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, ProjCond)
        });
    },

    onClickDelete2 : function(ProjCond)
    {
        this.setState({loading: true});
        this.state.condSet.operation = '';
        ProjCondPageActions.deleteProjCond( ProjCond.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    handleCreate: function (event) {
        var proj = this.props.projDisp;
        this.refs.createWindow.clear(proj.uuid, proj.projName);
		this.refs.createWindow.toggle();
	},

    onChangePage: function (pageNumber) {
        this.state.condSet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },

    onGoBack: function(){
        this.setState({action: 'query'});
    },

    render : function() {
        var recordSet = Common.filter(this.state.condSet.recordSet, filterValue);

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
    		    title: '推荐岗位',
    		    dataIndex: 'refJob',
    		    key: 'refJob',
    		    width: 140,
	        },
       		{
    		    title: '推荐人',
    		    dataIndex: 'refName',
    		    key: 'refName',
    		    width: 140,
	        },  
	        {
    		    title: '资源池',
                dataIndex: 'poolName',
                key: 'poolName',
                width: 140,
	        },
	        {
    		    title: '锁定期',
    		    dataIndex: 'lastDate',
    		    key: 'lastDate',
    		    width: 140,
    		    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
	        },
	        {
    		    title: '状态',
    		    dataIndex: 'provStatus',
    		    key: 'provStatus',
    		    width: 140,
		    },
            {
                title: '更多操作',
                key: 'action',
                width: 130,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员需求'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员需求'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];
        var pag = {
            showQuickJumper: true, total: this.state.condSet.totalRow, pageSize: this.state.condSet.pageRow, current: this.state.condSet.startPage,
            size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        var visible = (this.state.action === 'query') ? '' : 'none';

      var table =
        <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
            <ServiceMsg ref='mxgBox' svcList={['proj_cond/retrieve', 'proj_cond/remove']}/>

            <div className='toolbar-table'>
                <div style={{float:'left'}}>
                    <Button icon={Common.iconAdd} type="primary" title="推荐组员" onClick={this.handleCreate}/>
                    <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                </div>
                <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                    <Search placeholder="查询" style={{width: Common.searchWidth}} onChange={this.onFilterRecord}/>
                </div>
            </div>
            <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
            </div> 
            <CreateProjCondPage2 ref="createWindow"/>  
        </div>
      
	  	var page = null;
        if (this.state.action === 'update2') {
            page = <UpdateProjCondPage2 onBack={this.onGoBack} cond={this.state.cond} />
        } 
        return (
            <div style={{ width: '100%', height: '100%' }}>
                {table}
                {page}
            </div>
        );

    }
});

module.exports = ProjCondPage2;

