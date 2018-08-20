"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var LeftList = require('../../../lib/Components/LeftList');
var ModStore = require('../data/ModStore');
var ModActions = require('../action/ModActions');

var ModListPage = React.createClass({
	getInitialState : function() {
		return {
			modSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
            loading: false,
            appUuid: '',
			selectedRowUuid: '',
		}
	},
    mixins: [Reflux.listenTo(ModStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            modSet: data
        });
    },
	refresh: function(appUuid){
		this.setState({loading: true, appUuid:appUuid});
		this.state.selectedRowUuid = '';
		ModActions.initAppGroup(appUuid);
	},
	componentDidMount : function(){
		var appUuid = this.props.appUuid;
		this.setState({loading: true, appUuid:appUuid});
		ModActions.initAppGroup(appUuid);
	},
	handleModClick:function(mod){
		if( mod != null ){
			this.state.selectedRowUuid = mod.uuid;
			this.props.onSelectMod( mod );
		}
		else{
			this.state.selectedRowUuid = '';
		}
	},
	render:function(){
        const {
        	appUuid,
        	onSelectMod,
            ...attributes,
        } = this.props;

		var recordSet = this.state.modSet.recordSet;
		return (
			<LeftList dataSource={recordSet} rowText='groupName' onClick={this.handleModClick} {...attributes}/>
		);
	}
});

module.exports = ModListPage;
