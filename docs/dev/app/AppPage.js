'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Card, Modal, Spin} from 'antd';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var AppStore = require('./data/AppStore.js');
var AppActions = require('./action/AppActions');
import CreateAppPage from './Components/CreateAppPage';
import UpdateAppPage from './Components/UpdateAppPage';

var AppPage2 = React.createClass({
  getInitialState : function() {
      return {
          appSet: {
          	recordSet: [],
			startPage : 2,
			pageRow : 0,
			totalRow : 0,
			operation : '',
			errMsg : ''
          },
          loading: false,
          selectedRowKeys: []
      }
  },

  // 刷新
  handleQueryClick : function(event) {
        this.state.appSet.operation = '';
        this.setState({loading: true});
		AppActions.retrieveAppInfo();
  },

  // 第一次加载
  componentDidMount : function(){
        this.state.appSet.operation = '';
        this.setState({loading: true});
		AppActions.initAppInfo();
  },

  onSelectChange : function(selectedRowKeys){
	this.setState({ selectedRowKeys });
  },

  handleOpenCreateWindow : function(event) {
  	this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },

  handleDevClick: function(app, e)
  {
	if(app != null){
		window.devApp = app;
	    this.props.router.push({
	      pathname: '/dev2/SvcPage/',
	  	  state: { fromDashboard: true }
	    });
	}
  },

  handleUpdateClick: function(app, e)
  {
	if(app != null){
		this.refs.updateWindow.initPage(app);
    	this.refs.updateWindow.toggle();
	}

  	e.stopPropagation();
  },

  handleRemoveClick : function(app, event)
  {
  	Modal.confirm({
        title: Common.removeTitle,
  		content: '是否删除选中的APP 【'+app.appName+'】',
        okText: Common.removeOkText,
        cancelText: Common.removeCancelText,
  		onOk: this.handleRemoveClick2.bind(this, app)
  	});

  	event.stopPropagation();
  },

  handleRemoveClick2: function(app)
  {
    this.state.appSet.operation = '';
    this.setState({loading: true});
  	AppActions.deleteAppInfo( app.uuid );
  },

  render : function() {
    if( this.state.loading ){
      if(this.state.appSet.operation === 'retrieve' || this.state.appSet.operation === 'remove'){
          this.state.loading = false;
      }
    }

  	var recordSet = this.state.appSet.recordSet;
    var cardList =
        recordSet.map((app, i) => {
                return <div key={app.uuid} className='card-div' style={{width: 300}}>
                    <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleDevClick.bind(this, app)} title='点击进入开发页面'>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{app.appName}</h3></div>
                        <div className="ant-card-extra">
                            <a href="#" onClick={this.handleUpdateClick.bind(this, app)}>修改</a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.handleRemoveClick.bind(this, app)}>删除</a>
                        </div>
                        <div className="ant-card-body" style={{cursor:'pointer'}}>{app.appDesc}</div>
                    </div>
                </div>
        });

	return (
		<div className='card-page'>
           <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>  
                <ServiceMsg ref='mxgBox' svcList={['app-info/retrieve', 'app-info/remove']}/>
                <div style={{marginLeft:'16px', marginBottom:'14px'}}>服务清单
                    <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加应用' style={{paddingLeft:'8px', cursor:'pointer', fontSize:'18px' }}/>
                </div>

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据...">{cardList}</Spin>
                        :
                        <div>{cardList}</div>
                }
             </div>   
  			<CreateAppPage ref="createWindow"/>
  			<UpdateAppPage ref="updateWindow"/>
      </div>);
  }
});

var AppPage = withRouter(AppPage2);
ReactMixin.onClass(AppPage2, Reflux.connect(AppStore, 'appSet'));
module.exports = AppPage;
