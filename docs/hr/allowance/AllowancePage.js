﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var AllowanceStore = require('./data/AllowanceStore.js');
var AllowanceActions = require('./action/AllowanceActions');
import CreateAllowancePage from './Components/CreateAllowancePage';
import UpdateAllowancePage from './Components/UpdateAllowancePage';

var AllowancePage = React.createClass({
	getInitialState : function() {
		return {
			allowanceSet: {
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

    mixins: [Reflux.listenTo(AllowanceStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            allowanceSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.allowanceSet.operation = '';
		AllowanceActions.retrieveHrAllowance(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		AllowanceActions.initHrAllowance(corpUuid);
	},

	handleOpenCreateWindow : function(event) {
        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(allowance, event)
	{
		if(allowance != null){
			this.refs.updateWindow.initPage(allowance);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(allowance, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的补贴级别 【'+allowance.allowName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, allowance)
		});
	},

	onClickDelete2 : function(allowance)
	{
		this.setState({loading: true});
		this.state.allowanceSet.operation = '';
		AllowanceActions.deleteHrAllowance( allowance.uuid );
	},

	render : function() {
		var recordSet = this.state.allowanceSet.recordSet;

		const columns = [
			{
                title: '补贴名称',
                dataIndex: 'allowName',
                key: 'allowName',
                width: 140,
            },
            {
                title: '补贴说明',
                dataIndex: 'allowDesc',
                key: 'allowDesc',
                width: 140,
            },
            {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
            },
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
			    	      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改补贴参数'><Icon type={Common.iconUpdate}/></a>
			    	      <span className="ant-divider" />
			    	      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除补贴参数'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

        var cs = Common.getGridMargin(this);
		return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_allowance/retrieve', 'hr_allowance/remove']}/>
                    <div className='toolbar-table'>
                        <Button icon={Common.iconAdd} title="增加补贴级别" type="primary" onClick={this.handleOpenCreateWindow}/>
                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick}  style={{marginLeft: '4px'}}/>
                    </div>
                </div>
                <div className='grid-body'>
				    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

				<CreateAllowancePage ref="createWindow"/>
				<UpdateAllowancePage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = AllowancePage;

