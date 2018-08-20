﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var InsuranceStore = require('./data/InsuranceStore.js');
var InsuranceActions = require('./action/InsuranceActions');
import CreateInsurancePage from './Components/CreateInsurancePage';
import UpdateInsurancePage from './Components/UpdateInsurancePage';

var InsurancePage = React.createClass({
	getInitialState : function() {
		return {
			insuranceSet: {
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

    mixins: [Reflux.listenTo(InsuranceStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            insuranceSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function() {
        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.insuranceSet.operation = '';
		InsuranceActions.retrieveHrInsurance(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		InsuranceActions.initHrInsurance(corpUuid);
	},

	handleOpenCreateWindow : function() {
        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(insurance, event)
	{
		if(insurance != null){
			this.refs.updateWindow.initPage(insurance);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(insurance, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的管理 【'+insurance.insuName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, insurance)
		});
	},

	onClickDelete2 : function(insurance)
	{
		this.setState({loading: true});
		this.state.insuranceSet.operation = '';
		InsuranceActions.deleteHrInsurance( insurance.uuid );
	},

	render : function() {
		var recordSet = this.state.insuranceSet.recordSet;

		const columns = [
			{
                title: '社保名称',
                dataIndex: 'insuName',
                key: 'insuName',
                width: 140,
            },
            {
                title: '公积金',
                dataIndex: 'accumulation',
                key: 'accumulation',
                width: 140,
            },
            {
                title: '医疗保险',
                dataIndex: 'health',
                key: 'health',
                width: 140,
            },
            {
                title: '养老保险',
                dataIndex: 'pension',
                key: 'pension',
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
			    	      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改社保参数'><Icon type={Common.iconUpdate}/></a>
			    	      <span className="ant-divider" />
			    	      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除社保参数'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_insurance/get-by-corp_uuid', 'hr_insurance/remove']}/>
					<div className='toolbar-table'>
						<Button icon={Common.iconAdd} type="primary" title="增加社保参数管理" onClick={this.handleOpenCreateWindow}/>
						<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateInsurancePage ref="createWindow"/>
				<UpdateInsurancePage ref="updateWindow"/>
			</div>
		);
	}
});


module.exports = InsurancePage;

