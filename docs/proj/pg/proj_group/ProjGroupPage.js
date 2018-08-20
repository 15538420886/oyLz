﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ProjContext = require('../../ProjContext');
var ProjGroupStore = require('./data/ProjGroupStore');
var ProjGroupActions = require('./action/ProjGroupActions'); 
import CreateProjGroupPage from './Components/CreateProjGroupPage';
import UpdateProjGroupPage from './Components/UpdateProjGroupPage';

var filterValue = '';
var ProjGroupPage = React.createClass({
	getInitialState : function() {
		return {
			projGroupSet: {
				recordSet: [],
			},
            loading: false,
            sortedInfo: null,
		}
	},

    mixins: [Reflux.listenTo(ProjGroupStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projGroupSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var corpUuid = window.loginData.compUser.corpUuid;
		ProjGroupActions.retrieveProjGroup(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		var corpUuid = window.loginData.compUser.corpUuid;
		ProjGroupActions.initProjGroup(corpUuid);
	},
	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},
	onClickUpdate : function(projGroup, event)
	{
		if(projGroup != null){
			this.refs.updateWindow.initPage(projGroup);
			this.refs.updateWindow.toggle();
		}
	},
	onClickDelete : function(projGroup, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的项目 【'+projGroup.grpCode+'】', 
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, projGroup)
		});
	},
	onClickDelete2 : function(projGroup)
	{
		this.setState({loading: true});
		ProjGroupActions.deleteProjGroup( projGroup.uuid );
	},
    onClickManage: function (projGroup, event){
        ProjContext.openProjGroupPage(projGroup, event);
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
    },
    handleSortChange: function (pagination, filters, sorter) {
        console.log('sorter', sorter)
        this.setState({
            sortedInfo: sorter,
        });
    },

	render : function() {
        var recordSet = Common.filter(this.state.projGroupSet.recordSet, filterValue);
        var sortedInfo = this.state.sortedInfo;
        sortedInfo = sortedInfo || {};

		const columns = [
			{
				title: '编号',
				dataIndex: 'grpCode',
				key: 'grpCode',
                width: 140,
                sorter: (a, b) => a.grpCode.localeCompare(b.grpCode),
                sortOrder: sortedInfo.columnKey === 'grpCode' && sortedInfo.order,
			},
			{
				title: '业务集群',
				dataIndex: 'deptCode',
				key: 'deptCode',
                width: 140,
                sorter: (a, b) => a.deptCode.localeCompare(b.deptCode),
                sortOrder: sortedInfo.columnKey === 'deptCode' && sortedInfo.order,
			},
			{
				title: '项目群',
				dataIndex: 'grpName',
				key: 'grpName',
                width: 140,
                sorter: (a, b) => a.grpName.localeCompare(b.grpName),
                sortOrder: sortedInfo.columnKey === 'grpName' && sortedInfo.order,
			},
			{
				title: '创建日',
				dataIndex: 'beginDate',
				key: 'beginDate',
				width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                sorter: (a, b) => a.beginDate.localeCompare(b.beginDate),
                sortOrder: sortedInfo.columnKey === 'beginDate' && sortedInfo.order,
			},
			{
				title: '客户',
				dataIndex: 'custName',
				key: 'custName',
                width: 140,
                sorter: (a, b) => a.custName.localeCompare(b.custName),
                sortOrder: sortedInfo.columnKey === 'custName' && sortedInfo.order,
			},
			/*{
				title: '类型',
				dataIndex: 'grpType',
				key: 'grpType',
				width: 140,
				render: (text, record) => (Utils.getOptionName('项目管理', '项目群类型', record.grpType, false, this)),
            },*/
            {
                title: '成员',
                dataIndex: 'memberCount',
                key: 'memberCount',
                width: 90,
            },
			{
				title: '状态',
				dataIndex: 'grpStatus',
				key: 'grpStatus',
				width: 140,
                render: (text, record) => (Utils.getOptionName('项目管理', '项目群状态', record.grpStatus, false, this)),
			},
			{ 
				title: '形式',
				dataIndex: 'orgType',
				key: 'orgType',
				width: 140,
                render: (text, record) => (Utils.getOptionName('项目管理', '项目群组织方式', record.orgType, false, this)),
			},
			{
				title: '操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目群'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目群'><Icon type={Common.iconRemove}/></a>
					<span className="ant-divider" />
                    <a href="#" onClick={this.onClickManage.bind(this, record)} title='管理项目群'><Icon type={Common.iconDetail} /></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['proj_group/retrieve', 'proj_group/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加项目群" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} onChange={this.handleSortChange} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateProjGroupPage ref="createWindow"/>
				<UpdateProjGroupPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = ProjGroupPage;

