'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var CorpAppStore = require('./data/CorpAppStore.js');
var CorpAppActions = require('./action/CorpAppActions');

var FntAppStore = require('../fnt-app/app/data/FntAppStore.js');
var FntAppActions = require('../fnt-app/app/action/FntAppActions');
import SelectAppPage from './Components/SelectAppPage';
import CorpAppAuthPage from '../corp-app-auth/CorpAppAuthPage';

var CorpAppPage = React.createClass({
	getInitialState : function() {
		return {
			corpAppSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
			appLoading: false,
			appMap: {},
			appList: [],
			
			corpApp: null,	// 选中的APP
			action:'query'

		}
	},

    mixins: [Reflux.listenTo(CorpAppStore, "onServiceComplete"), Reflux.listenTo(FntAppStore, "onLoadAppComplete")],
    onServiceComplete: function(data) {
    	// console.log('data corpAppSet', data);
        this.setState({
            loading: false,
            corpAppSet: data
        });
    },
    onLoadAppComplete: function(data) {
    	// console.log('data appList', data);
    	var appMap={};
    	if(data.errMsg === ''){
    		data.recordSet.map((app, i) => {
    			appMap[app.uuid] = app;
    		});
    	}
    	
        this.setState({
            appLoading: false,
            appMap: appMap,
            appList: data.recordSet,
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.corpAppSet.operation = '';
		
        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
		CorpAppActions.retrieveAuthCorpApp( corpUuid );
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true, appLoading: true});
		
        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
		CorpAppActions.initAuthCorpApp(corpUuid);
		
		FntAppActions.initFntApp();
	},

	handleOpenCreateWindow : function(event) {
        var compUser = window.loginData.compUser;
        if(compUser === null){
        	return;
        }

		this.refs.selectAppPage.clear(compUser.corpUuid, this.state.corpAppSet.recordSet, this.state.appList);
		this.refs.selectAppPage.toggle();
	},

	handleRemoveClick : function(corpApp, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的APP 【'+corpApp.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, corpApp)
		});
		event.stopPropagation();
	},

	onClickDelete2 : function(corpApp)
	{
		this.setState({loading: true});
		this.state.corpAppSet.operation = '';
		CorpAppActions.deleteAuthCorpApp( corpApp.uuid );
	},

	handleAppClick : function(corpApp)
	{
		this.setState({action: 'appRole', corpApp: corpApp});
	},

	onBack : function(){
		this.setState({action: 'query'});
	},

	render : function() {
		var selectedApps = [];
		var recordSet = this.state.corpAppSet.recordSet;
		recordSet.map((corpApp, i) => {
			var app = this.state.appMap[corpApp.appUuid];
			if(app !== null && typeof(app) !== 'undefined'){
				corpApp['appCode'] = app.appCode;
				corpApp['appName'] = app.appName;
				selectedApps.push( corpApp );
			}
		});
		
		var cardList =
			selectedApps.map((app, i) => {
				return <div key={app.uuid} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleAppClick.bind(this, app)} title='点击修改权限信息'>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{app.appCode}</h3></div>
						<div className="ant-card-extra">
							<a href="#" onClick={this.handleRemoveClick.bind(this, app)} title='删除'><Icon type={Common.iconRemove}/></a>
						</div>
						<div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{app.appName}</div>
					</div>
				</div>
			});
		
		// console.log('cardList', cardList);
		var visible = (this.state.action === 'query') ? '' : 'none';
		var loading = this.state.loading || this.state.appLoading;
		var cs = Common.getCardMargin(this);
		var appCard = 
			<div className='card-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
				<ServiceMsg ref='mxgBox' svcList={['auth-corp-app/retrieve', 'auth-corp-app/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
	      				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>已订阅{selectedApps.length}个APP</div>
	                  		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='订阅APP' className='toolbar-icon' style={{color: '#108ee9'}}/>
	                  		<Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
          				</div>
          			</div>
                </div>

		      	{
                    loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
			    }
			    
				<SelectAppPage ref="selectAppPage"/>
			</div>;
		var page = null;
		if(this.state.action === 'appRole'){
			page = <CorpAppAuthPage corpApp={this.state.corpApp} onBack={this.onBack}/>
		}
		return (
    		<div style={{width: '100%',height:'100%'}}>
				{appCard}
				{page}
			</div>
		);
	}
});

module.exports = CorpAppPage;

