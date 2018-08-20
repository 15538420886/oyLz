'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var StatFromToStore = require('./data/StatFromToStore.js');
var StatFromToActions = require('./action/StatFromToActions');
import CreateStatFromToPage from './Components/CreateStatFromToPage';
import UpdateStatFromToPage from './Components/UpdateStatFromToPage';

var filterValue = '';
var StatFromToPage = React.createClass({
	getInitialState : function() {
		return {
			statFromToSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(StatFromToStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            statFromToSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.statFromToSet.operation = '';
		StatFromToActions.retrieveStatFromTo(this.props);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		StatFromToActions.initStatFromTo(this.props);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(statFromTo, event)
	{
		if(statFromTo != null){
			this.refs.updateWindow.initPage(statFromTo);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(statFromTo, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的状态转换管理 【'+statFromTo.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, statFromTo)
		});
	},

	onClickDelete2 : function(statFromTo)
	{
		this.setState({loading: true});
		this.state.statFromToSet.operation = '';
		StatFromToActions.deleteStatFromTo( statFromTo.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},
	render : function() {
		var recordSet = Common.filter(this.state.statFromToSet.recordSet, filterValue);
		var corpUuid = window.loginData.compUser.corpUuid;
		var opCol = {
			title: '操作',
			key: 'action',
			width: 90,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改状态转换管理'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除状态转换管理'><Icon type={Common.iconRemove}/></a>
				</span>
			),
		}; 
		const columns = [
			{
				title: '现态',
				dataIndex: 'sttFrom',
				key: 'sttFrom',
				width: 140,
			},
			{
				title: '条件',
				dataIndex: 'sttCond',
				key: 'sttCond',
				width: 140,
			},
			{
				title: '动作',
				dataIndex: 'sttAction',
				key: 'sttAction',
				width: 140,
			},
			{
				title: '次态',
				dataIndex: 'sttTo',
				key: 'sttTo',
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
					<ServiceMsg ref='mxgBox' svcList={['stat-from-to/retrieve', 'stat-from-to/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加状态转换管理" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateStatFromToPage ref="createWindow"/>
				<UpdateStatFromToPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = StatFromToPage;


