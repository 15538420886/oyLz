"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Spin } from 'antd';
var Context = require('../../AuthContext');
var Utils = require('../../../public/script/utils');
var LeftList = require('../../../lib/Components/LeftList');
var ModuleStore = require('../data/ModuleStore');
var ModuleActions = require('../action/ModuleActions');

var ModuleListPage = React.createClass({
	getInitialState : function() {
		return {
			moduleSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			selectedRowUuid: '',
			loading:false,
		}
	},

	setLoading: function(){
        this.state.moduleSet.operation = '';
        this.setState({loading: true});
    },
	
	componentDidMount : function(){
		this.setLoading();
		var appUuid = Context.authApp.uuid;
		ModuleActions.initModuleInfo(appUuid);
	},
	handleModuleClick:function(module){
		if( module != null ){
			this.props.onSelectModule( module );
		}
	},
	
	render:function(){
		if( this.state.loading ){
            if(this.state.moduleSet.operation === 'retrieve'){
                this.state.loading = false;
            }
        }

        const {
        	appUuid,
        	onSelectModule,
            ...attributes,
        } = this.props;

		var recordSet = this.state.moduleSet.recordSet;
		return (	
			(this.state.loading) ? <Spin tip="正在努力加载数据..."></Spin>: <LeftList dataSource={recordSet} rowText='modName' onClick={this.handleModuleClick} {...attributes}/>	
		);
	}
});

ReactMixin.onClass(ModuleListPage, Reflux.connect(ModuleStore, 'moduleSet'));
module.exports = ModuleListPage;
