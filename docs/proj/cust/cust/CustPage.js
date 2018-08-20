'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var CustStore = require('./data/CustStore');
var CustActions = require('./action/CustActions');
import CreateCustPage from './Components/CreateCustPage';
import UpdateCustPage from './Components/UpdateCustPage';

var pageRows = 10;
var CustPage = React.createClass({
	getInitialState : function() {
		return {
			custSet: {
				recordSet: [],
				startPage :1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			moreFilter: false,
            filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(CustStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            custSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		CustActions.retrieveProjCustPage(this.state.filter,this.state.custSet.startPage, pageRows);
	},

	// 第一次加载
	componentDidMount : function(){
		CustActions.getCacheData();
	},

	handleOpenCreateWindow : function(event) {
		var corpUuid = window.loginData.compUser.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(cust, event)
	{
		if(cust != null){
			this.refs.updateWindow.initPage(cust);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(cust, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的客户 【'+cust.custName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, cust)
		});
	},

	onClickDelete2 : function(cust)
	{
		this.setState({loading: true});
		CustActions.deleteProjCust( cust.uuid );
	},

	onChangePage: function(pageNumber){
        this.state.custSet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },

	onFilterRecord: function(e){
		this.setState({filterValue: e.target.value});
	},

	 onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.custCode = filterValue;
        }
        else{
            this.state.filter.custName = filterValue;
        }

        this.handleQueryClick();
    },

	render : function() {
		var recordSet = this.state.custSet.recordSet;
		const columns = [
            {
                title: '客户编号',
                dataIndex: 'custCode',
                key: 'custCode',
                width: 140,
            },
            {
                title: '客户简称',
                dataIndex: 'custName',
                key: 'custName',
                width: 200,
            },
            {
                title: '客户名称',
                dataIndex: 'custDesc',
                key: 'custDesc',
                width: 140,
            },
            {
                title: '销售区域',
                dataIndex: 'marketArea',
                key: 'marketArea',
                width: 140,
            },
            {
                title: '交付区域',
                dataIndex: 'delivArea',
                key: 'delivArea',
                width: 140,
            },
            {
                title: '客户经理',
                dataIndex: 'custManager',
                key: 'custManager',
                width: 140,
            },
            {
                title: '所属行业',
                dataIndex: 'custIndust',
                key: 'custIndust',
                width: 140,
            },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改客户'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除客户'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		var pag = {showQuickJumper: true, total:this.state.custSet.totalRow, pageSize:this.state.custSet.pageRow,
            current:this.state.custSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['proj_cust/retrieve', 'proj_cust/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加客户" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
							 <Search placeholder="查询(公司编号/公司名称)" style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} onSearch={this.onSearch}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateCustPage ref="createWindow"/>
				<UpdateCustPage ref="updateWindow"/>·
			</div>
		);
	}
}); 

module.exports = CustPage;

