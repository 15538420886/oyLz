'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var LevelStore = require('./data/LevelStore.js');
var LevelActions = require('./action/LevelActions');
import CreateLevelPage from './Components/CreateLevelPage';
import UpdateLevelPage from './Components/UpdateLevelPage';

var LevelPage = React.createClass({
	getInitialState : function() {
		return {
			LevelSet: {
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

    mixins: [Reflux.listenTo(LevelStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            LevelSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function() {
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.LevelSet.operation = '';
		LevelActions.retrieveHrLevel(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		LevelActions.initHrLevel(corpUuid);
	},

	handleOpenCreateWindow : function() {
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(Level, event)
	{
		if(Level != null){
			this.refs.updateWindow.initPage(Level);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(Level, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的管理 【'+Level.lvlCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, Level)
		});
	},

	onClickDelete2 : function(Level)
	{
		this.setState({loading: true});
		this.state.LevelSet.operation = '';
		LevelActions.deleteHrLevel( Level.uuid );
	},

	render : function(corpUuid) {
		var recordSet = this.state.LevelSet.recordSet;

		const columns = [
			{
				title: '级别编号',
				dataIndex: 'lvlCode',
				key: 'lvlCode',
				width: 140,
			},
			{
				title: '级别名称',
				dataIndex: 'lvlName',
				key: 'lvlName',
				width: 140,
			},
			{
				title: '平均薪水',
				dataIndex: 'lvlSalary',
				key: 'lvlSalary',
				width: 140,
			},
			{
				title: '员工比例',
				dataIndex: 'lvlRatio',
				key: 'lvlRatio',
				width: 120,
			},
			{
				title: '结算单价',
				dataIndex: 'unitPrice',
				key: 'unitPrice',
                width: 140,
                render: (text, record) => (
                    text + ' ' + record.unitTime
                ),
			},
			{
				title: '平均成本',
				dataIndex: 'unitCost',
				key: 'unitCost',
				width: 100,
			},
			{
				title: '级别说明',
				dataIndex: 'lvlDesc',
				key: 'lvlDesc',
				width: 360,
			},
			{
				title: ' ', 
				key: 'action',
				width: 120,
				render: (text, record) => (
					<span>
			    	      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改级别'><Icon type={Common.iconUpdate}/></a>
			    	      <span className="ant-divider" />
			    	      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除级别'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-level/retrieve', 'hr-level/remove']}/>

					<div className='toolbar-table'>
						<Button icon={Common.iconAdd} type="primary" title="增加级别" onClick={this.handleOpenCreateWindow}/>
						<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateLevelPage ref="createWindow"/>
				<UpdateLevelPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = LevelPage;

