'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var AppStore = require('./data/AppStore');
var AppActions = require('./action/AppActions');
var Context = require('../ParamContext');
import CreateAppPage from './Components/CreateAppPage';
import UpdateAppPage from './Components/UpdateAppPage';

var AppPage2 = React.createClass({
  getInitialState : function() {
      return {
        appSet: {
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

  mixins: [Reflux.listenTo(AppStore, "onServiceComplete")],
  onServiceComplete: function(data){
    this.setState({
        loading: false,
        appSet: data,
    });
  },

  handleQueryClick : function(event){
    this.state.appSet.operation = '';
    this.setState({loading: true});
  	AppActions.retrieveAppInfo();
  },

  componentDidMount : function(){
    this.state.appSet.operation = '';
    this.setState({loading: true});
  	AppActions.initAppInfo();
  },

  handleOpenCreateWindow : function(event){
  	this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },

  handleUpdateClick : function(app, event){
	if(app != null){
		this.refs.updateWindow.initPage(app);
		this.refs.updateWindow.toggle();
	}
  	event.stopPropagation();
  },

  handleRemoveClick : function(app, event){
  	Modal.confirm({
        title: Common.removeTitle,
  		  content: '是否删除选中的APP 【'+app.appName+'】',
        okText: Common.removeOkText,
        cancelText: Common.removeCancelText,
  		  onOk: this.handleRemoveClick2.bind(this, app)
  	});
  	event.stopPropagation();
  },

  handleRemoveClick2 : function(app){
    this.state.appSet.operation = '';
    this.setState({loading: true});
  	AppActions.deleteAppInfo( app.uuid );
  },

  handleAppClick: function(app, e){
    if(app != null){
      Context.paramApp = app;
        this.props.router.push({
          pathname: '/param2/ModPage/',
          state: { fromDashboard: true }
        });
    }
  },

  render : function() {
    var recordSet = this.state.appSet.recordSet;
    var cardList =
        recordSet.map((app, i) => {
          return <div key={app.uuid} className='card-div' style={{width: 300}}>
              <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleAppClick.bind(this, app)} title='点击进入参数管理页面'>
                  <div className="ant-card-head"><h3 className="ant-card-head-title">{app.appName}</h3></div>
                  <div className="ant-card-extra">
                      <a href="#" onClick={this.handleUpdateClick.bind(this, app)} title='修改'><Icon type={Common.iconUpdate}/></a>
                      <span className="ant-divider" />
                      <a href="#" onClick={this.handleRemoveClick.bind(this, app)} title='删除'><Icon type={Common.iconRemove}/></a>
                  </div>
                  <div className="ant-card-body" style={{cursor:'pointer'}}>{app.appDesc}</div>
              </div>
          </div>
        });

    return (
      <div className='card-page'>
          <ServiceMsg ref='mxgBox' svcList={['app-info/retrieve', 'app-info/remove']}/>
          <div style={{marginLeft:'16px', marginBottom:'12px', paddingTop:'14px', width: 200}}>应用参数和字典维护
            <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加应用' className='toolbar-icon' style={{color: '#108ee9'}}/>
          </div>
          {
            this.state.loading ?
                <Spin tip="正在努力加载数据...">{cardList}</Spin>
                :
                <div>{cardList}</div>
          }
        <CreateAppPage ref="createWindow"/>
        <UpdateAppPage ref="updateWindow"/>
        </div>);
    }
  });
var AppPage = withRouter(AppPage2);
module.exports = AppPage;
