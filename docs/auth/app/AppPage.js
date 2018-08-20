'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'
var Context = require('../AuthContext');

import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Table, Button, Icon, Input, Spin, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var AuthAppStore = require('./data/AppStore.js');
var AuthAppActions = require('./action/AppActions');
import CreateAuthAppPage from './Components/CreateAppPage';
import UpdateAuthAppPage from './Components/UpdateAppPage';

var filterValue = '';
var AuthAppPage = React.createClass({
	getInitialState : function() {
		return {
			authAppSet: {
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

    mixins: [Reflux.listenTo(AuthAppStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            authAppSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		this.state.authAppSet.operation = '';
		this.setState({loading: true});
		AuthAppActions.retrieveAuthAppInfo(null);
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.authAppSet.operation = '';
		this.setState({loading: true});
		AuthAppActions.initAuthAppInfo(null);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},

	handleAppClick:function(authApp)
	{
		if(authApp != null){
			Context.authApp = authApp;
			browserHistory.push({
                pathname: '/auth2/ModulePage/',
				state: { fromDashboard: true }
			});
		}
	},
	handleUpdateClick:function(authApp, event)
	{
		if(authApp != null){
			this.refs.updateWindow.initPage(authApp);
			this.refs.updateWindow.toggle();
		}

    	event.stopPropagation();
	},
	handleRemoveClick:function(authApp, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的服务 【'+authApp.appCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, authApp)
		});

    	event.stopPropagation();
	},
	onClickDelete2 : function(authApp)
	{
        this.state.authAppSet.operation = '';
        this.setState({loading: true});
		AuthAppActions.deleteAuthAppInfo( authApp.uuid );
	},
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	render : function() {
        var recordSet = [];
        if(filterValue === ''){
            recordSet = this.state.authAppSet.recordSet;
        }
        else{
            recordSet = Common.filter(this.state.authAppSet.recordSet, filterValue);
        }
		
		var cardList =
			recordSet.map((app, i) => {
				return <div key={app.uuid} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleAppClick.bind(this, app)} title='点击修改APP信息'>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{app.appCode}</h3></div>
						<div className="ant-card-extra">
							<a href="#" onClick={this.handleUpdateClick.bind(this, app)} title='修改'><Icon type={Common.iconUpdate}/></a>
							<span className="ant-divider" />
							<a href="#" onClick={this.handleRemoveClick.bind(this, app)} title='删除'><Icon type={Common.iconRemove}/></a>
						</div>
						<div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{app.appName}</div>
					</div>
				</div>
			});

		var cs = Common.getCardMargin(this);
		return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-campus/retrieve', 'auth-campus/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
	      				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个服务</div>
	                  		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加服务' className='toolbar-icon' style={{color: '#108ee9'}}/>
	                  		<Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
          				</div>
          				<div style={{textAlign:'right', width:'100%'}}>
                              <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                          </div>
          			</div>
                </div>

		      	{
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
			    }

				<CreateAuthAppPage ref="createWindow"/>
				<UpdateAuthAppPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = AuthAppPage;
