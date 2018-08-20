'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Tabs} from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ResGroupManStore = require('./data/ResGroupManStore');
var ResGroupManActions = require('./action/ResGroupManActions');
var ResBigGroupStore = require('./data/ResBigGroupStore');
var ResBigGroupActions = require('./action/ResBigGroupActions');
var ResSmallGroupStore = require('./data/ResSmallGroupStore');
var ResSmallGroupActions = require('./action/ResSmallGroupActions');
import ResBigGroupPage from './Components/ResBigGroupPage';
import ResSmallGroupPage from './Components/ResSmallGroupPage';

var ResGroupManPage = React.createClass({
	getInitialState : function() {
		return {
			teamGrpSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
			selectKey:'1'
		}
	},

	mixins: [Reflux.listenTo(ResGroupManStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            teamGrpSet: data
        });
    },

	componentDidMount : function(){
		this.setState({loading: true});
		var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
		ResGroupManActions.initResTeamGrp(filter);
	},

	onTabChange : function(activeKey){
		this.setState({ selectKey: activeKey });
	},

	render : function() {
		var recordSet = this.state.teamGrpSet.recordSet;
		var page=[];
		var smallTeam='';
		var bigTeam='';
		if(recordSet != null){
			for(var i = 0; i < recordSet.length; i++){
				var grpLevel = recordSet[i].grpLevel;
				var grpCode = recordSet[i].grpCode;
				var uuid = recordSet[i].uuid;
				var poolUuid = recordSet[i].poolUuid;
				var teamUuid = recordSet[i].teamUuid;
				if(this.state.selectKey===uuid){
					smallTeam=<ResSmallGroupPage uuid={uuid} poolUuid={poolUuid} />
				}else if(this.state.selectKey===grpCode){
					bigTeam=<ResBigGroupPage grpCode={grpCode} uuid={uuid} poolUuid={poolUuid} teamUuid={teamUuid} />
				}
				if(grpLevel === "大组"){
					var tap=<TabPane tab={recordSet[i].grpName + "(大组)"} key={grpCode} style={{width: '100%', height: '100%'}}>
	                    {bigTeam}
	                </TabPane>
					page.push(tap)
				}else if(grpLevel === "小组"){
					var tap=<TabPane tab={recordSet[i].grpName + "(小组)"} key={uuid} style={{width: '100%', height: '100%'}}>
	                   {smallTeam}
	                </TabPane>
					page.push(tap)
				}else{
					var tap=<TabPane tab={recordSet[i].grpName + "(中组)"} key={i+1} style={{width: '100%', height: '100%'}}>
						<ResBigGroupPage grpCode={grpCode} uuid={uuid} poolUuid={poolUuid} teamUuid={teamUuid} />
	                </TabPane>
					page.push(tap)
				}
			};
		}else{
			console.log("kong")
		};

			return (
				<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
					<Tabs activeKey={this.state.selectKey} onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>		
						{page}
					</Tabs>
				</div>

			);
		}
	});

module.exports = ResGroupManPage;

