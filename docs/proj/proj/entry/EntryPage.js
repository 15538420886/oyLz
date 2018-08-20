'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import DispatTable from './Components/DispatTable';
import BackTable from './Components/BackTable';
import DispatSure from './Components/DispatSure';
import BackSure from './Components/BackSure';

var EntryPage = React.createClass({
	getInitialState : function() {
		return {
			action: 'query',
			dispat: {},
			back: {},
		}
	},

	onChangeAction: function(obj){
		if(obj.action === 'dispatSure'){
			this.setState({action: 'dispatSure', dispat: obj.dispat});
		}else{
			this.setState({action: 'backSure', back: obj.back});
		}
	},
	onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function() {
		var visible = (this.state.action === 'query') ? '' : 'none';
		var tabs = 
			<div style={{display:visible}}>
				<Tabs defaultActiveKey="1" tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="调度指令" key="1" style={{width: '100%', height: '100%'}}>
						<DispatTable onChangeAction={this.onChangeAction} />
					</TabPane>
					<TabPane tab="人员回组" key="2" style={{width: '100%', height: '100%'}}>
						<BackTable onChangeAction={this.onChangeAction} />
					</TabPane>
				</Tabs> 
			</div>;
		var page = null;
		if(this.state.action === 'dispatSure'){
			page = <DispatSure onBack={this.onGoBack} dispat={this.state.dispat} />;
		}
		else if(this.state.action === 'backSure'){
			page = <BackSure onBack={this.onGoBack} back={this.state.back}/>;
		}
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				{tabs}
				{page}
	        </div>

		);
	}
});

module.exports = EntryPage;

