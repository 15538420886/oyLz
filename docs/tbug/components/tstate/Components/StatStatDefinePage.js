﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Utils = require('../../../../public/script/utils');
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var StatStatDefineStore = require('../data/StatStatDefineStore.js');
var StatStatDefineActions = require('../action/StatStatDefineActions');
import CreateStatStatDefinePage from '../Components/CreateStatStatDefinePage';
import UpdateStatStatDefinePage from '../Components/UpdateStatStatDefinePage';

var filterValue = '';
var StatStatDefinePage = React.createClass({
	getInitialState : function() {
		return {
			statStatDefineSet: {
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(StatStatDefineStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
			statStatDefineSet: data,
		});
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.statStatDefineSet.operation = '';
		StatStatDefineActions.retrieveStatStatDefine(this.props);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		StatStatDefineActions.initStatStatDefine(this.props);
	},
	// 	//接受新的props
	componentWillReceiveProps: function (nextProps) {
		// this.setState({ loading: true });
		// this.state.statStatDefineSet.operation = '';
		// StatStatDefineActions.retrieveStatStatDefine(nextProps);
	},
	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},
	
	onClickUpdate : function(statStatDefine, event)
	{
		if(statStatDefine != null){
			this.refs.updateWindow.initPage(statStatDefine);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(statStatDefine, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的状态机状态管理 【'+statStatDefine.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, statStatDefine)
		});
	},

	onClickDelete2 : function(statStatDefine)
	{
		this.setState({loading: true});
		this.state.statStatDefineSet.operation = '';
		StatStatDefineActions.deleteStatStatDefine( statStatDefine.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},
	handleSelectClick: function (Tstate) {
		this.props.selectsRoles(Tstate);	
		console.log(this.props)
	},
	render : function() {
		var recordSet = Common.filter(this.state.statStatDefineSet.recordSet, filterValue);
		var corpUuid = window.loginData.compUser.corpUuid;
		var opCol = {
			title: '操作',
			key: 'action',
			width: 90,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改状态机状态管理'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除状态机状态管理'><Icon type={Common.iconRemove}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.handleSelectClick.bind(this, record)} title='状态维护'><Icon type={Common.iconUser} /></a>
				</span>
			),
		}; 
		const columns = [
			{
				title: '状态编码',
				dataIndex: 'sttCode',
				key: 'sttCode',
				width: 140,
			},
			{
				title: '状态名称',
				dataIndex: 'sttName',
				key: 'sttName',
				width: 140,
			},
			{
				title: '初始',
				dataIndex: 'isBegin',
				key: 'isBegin',
				width: 140,
			},
			{
				title: '结束',
				dataIndex: 'isFinal',
				key: 'isFinal',
				width: 140,
			},
			{
				title: '是否禁用',
				dataIndex: 'disUse',
				key: 'disUse',
				width: 140,
			},
			opCol
		]
		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['stat-stat-define/retrieve', 'stat-stat-define/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加状态机状态管理" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateStatStatDefinePage InStatStatDefine={this.props} ref="createWindow"/>
				<UpdateStatStatDefinePage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = StatStatDefinePage;
