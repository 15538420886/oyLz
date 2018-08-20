"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Spin } from 'antd';
var Utils = require('../../../public/script/utils');
var LeftList = require('../../../lib/Components/LeftList');
var ServiceStore = require('../../svc/data/ServiceStore');
var ServiceActions = require('../../svc/action/ServiceActions');
import PathContext from '../PathContext'
var InterfaceListPage = React.createClass({
	getInitialState : function() {
		return {
			interSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			selectedRowUuid: '',
			loading:false,
		}
	},
	mixins: [Reflux.listenTo(ServiceStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === "retrieve"){
			this.setState({
	            loading: false,
	            interSet: data
	        });
		}
	},
	setLoading: function(){
        this.state.interSet.operation = '';
        this.setState({loading: true});
    },
	
	componentDidMount : function(){
		this.setLoading();
        ServiceActions.retrieveAppTxn(PathContext.selectedRes.uuid);
	},
	handleinterClick:function(inter){
		if( inter != null ){
			this.props.onSelectModule( inter );
		}
	},
	
	render:function(){
		if( this.state.loading ){
            if(this.state.interSet.operation === 'retrieve'){
                this.state.loading = false;
            }
        }
        const {
        	appUuid,
        	onSelectModule,
            ...attributes,
        } = this.props;

		var recordSet = this.state.interSet.recordSet;
		return (	
			this.state.loading ? <Spin tip="正在努力加载数据..." ></Spin>: <LeftList dataSource={recordSet} rowText='txnName' onClick={this.handleinterClick} {...attributes}/>	
		);
	}
});

module.exports = InterfaceListPage;
