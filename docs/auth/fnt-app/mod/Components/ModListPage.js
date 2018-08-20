"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Spin } from 'antd';
var Context = require('../../../AuthContext');
var Utils = require('../../../../public/script/utils');
var LeftList = require('../../../../lib/Components/LeftList');
var FntModStore = require('../data/FntModStore');
var FntModActions = require('../action/FntModActions');

var ModListPage = React.createClass({
	getInitialState : function() {
		return {
			modSet: {
				recordSet: [],
				errMsg : ''
			},
			loading:false,
		}
	},
    mixins: [Reflux.listenTo(FntModStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            modSet: data
        });
    },

	componentDidMount : function(){
		this.setState({loading: true});
		var appUuid = Context.fntApp.uuid;
		FntModActions.initFntAppMod(appUuid);
	},
	handleModuleClick:function(fntMod){
		if( fntMod != null ){
			this.props.onSelectFntMod( fntMod );
		}
	},
	
	render:function(){
        const {
        	onSelectFntMod,
            ...attributes,
        } = this.props;

		var recordSet = this.state.modSet.recordSet;
		return (	
			(this.state.loading) ? <Spin tip="正在努力加载数据..."></Spin>: <LeftList dataSource={recordSet} rowText='modName' onClick={this.handleModuleClick} {...attributes}/>	
		);
	}
});

module.exports = ModListPage;
