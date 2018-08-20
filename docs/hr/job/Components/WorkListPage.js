"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var LeftList = require('../../../lib/Components/LeftList');
var WorkTypeStore = require('../../work_type/data/WorkTypeStore.js');
var WorkTypeActions = require('../../work_type/action/WorkTypeActions');

var WorkListPage = React.createClass({
	getInitialState : function() {
		return {
			workSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			selectedRowUuid: '',
		}
	},
	refresh: function(corpUuid){
		this.state.selectedRowUuid = '';
		WorkTypeActions.initHrWorkType(corpUuid);
	},
	componentDidMount : function(){
		var corpUuid = this.props.corpUuid;
		WorkTypeActions.initHrWorkType(corpUuid);
	},
	handleWorkClick:function(work){
		this.state.selectedRowUuid = work.uuid;
		if( work != null ){
			this.props.onSelectWork( work );
		}
	},
	getRowClassName: function(record, index){
		var uuid = record.uuid;
		if(this.state.selectedRowUuid == uuid){
			return 'selected';
		}
		else{
			return null;
		}
	},
	render:function(){
        const {
        	corpUuid,
        	onSelectwork,
            ...attributes,
        } = this.props;

		var recordSet = this.state.workSet.recordSet;
		return (
			<LeftList dataSource={recordSet} rowText='workName' onClick={this.handleWorkClick} {...attributes}/>
		);
	}
});

ReactMixin.onClass(WorkListPage, Reflux.connect(WorkTypeStore, 'workSet'));
module.exports = WorkListPage;
