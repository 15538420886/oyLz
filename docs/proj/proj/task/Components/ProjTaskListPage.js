"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Spin } from 'antd';
var Context = require('../../../ProjContext');
var Utils = require('../../../../public/script/utils');
var LeftList = require('../../../../lib/Components/LeftList');
var ProjTaskStore = require('../data/ProjTaskStore');
var ProjTaskActions = require('../action/ProjTaskActions');
var ProjContext = require('../../../ProjContext');

var ProjTaskListPage = React.createClass({
	getInitialState : function() {
		return {
			projSet: {
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
        this.state.projSet.operation = '';
        this.setState({loading: true});
    },
	componentDidMount : function(filter){
		this.setLoading();
		var filter = {};
		filter.projUuid = ProjContext.selectedProj.uuid;
		ProjTaskActions.initProjTask(filter);
	},
	handleProjTaskClick:function(proj){
		if( proj != null ){
			this.props.onSelectProjTask( proj );
		}
	},
	render:function(){
		if( this.state.loading ){
            if(this.state.projSet.operation === 'retrieve'){
                this.state.loading = false;
            }
        }
        const {
        	filter,
        	onSelectProjTask,
            ...attributes,
        } = this.props;
		var recordSet = this.state.projSet.recordSet;
		return (	
			(this.state.loading) ? <Spin tip="正在努力加载数据..."></Spin>: <LeftList dataSource={recordSet} rowText='ordName' onClick={this.handleProjTaskClick} {...attributes}/>	
		);
	}
});

ReactMixin.onClass(ProjTaskListPage, Reflux.connect(ProjTaskStore, 'projSet'));
module.exports = ProjTaskListPage;
