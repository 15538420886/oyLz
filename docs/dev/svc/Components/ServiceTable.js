'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ErrorMsg from '../../../lib/Components/ErrorMsg';
import {Button, Table, Icon} from 'antd';

var Utils = require('../../../public/script/utils');
var ServiceStore = require('../data/ServiceStore.js');
var ServiceActions = require('../action/ServiceActions');

var selectedRowUuid = '';
var ServicePage = React.createClass({
	getInitialState : function() {
		return {
			serviceSet: {
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

	loadData : function(resUuid){
		  this.state.serviceSet.operation = '';
		  this.setState({loading: true});
		  ServiceActions.initAppTxn(resUuid);
	},

	onRowClick: function(record, index){
		selectedRowUuid = record.uuid;
		this.setState({
			serviceSet: this.state.serviceSet
		});

		this.props.onSelected(record);
	},

	getRowClassName: function(record, index){
		var uuid = record.uuid;
		if(selectedRowUuid == uuid){
			return 'selected';
		}
		else{
			return '';
		}
	},

	render : function() {
		if( this.state.loading ){
			if(this.state.serviceSet.operation === 'retrieve' || this.state.serviceSet.operation === 'remove'){
				this.state.loading = false;
			}
		}

		var recordSet = this.state.serviceSet.recordSet;

		const columns = [
			{
				title: '接口编号',
				dataIndex: 'txnName',
				key: 'txnName',
				width: 240,
			},
			{
				title: '接口说明',
				dataIndex: 'funcDesc',
				key: 'funcDesc',
				width: 240,
			},
			{
				title: '接口类型',
				dataIndex: 'methodType',
				key: 'methodType',
				width: 80,
			}
		];

		return (
			<div style={{padding:'24px 16px 0 0'}}>
				<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} onRowClick={this.onRowClick} rowClassName={this.getRowClassName} loading={this.state.loading} pagination={false} size='small' bordered />
			</div>
		);
	}
});

ReactMixin.onClass(ServicePage, Reflux.connect(ServiceStore, 'serviceSet'));
module.exports = ServicePage;
