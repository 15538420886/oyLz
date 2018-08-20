﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';
var Context = require('../ParamContext');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var ParamEnvStore = require('./data/ParamEnvStore');
var ParamEnvActions = require('./action/ParamEnvActions');
import CreateParamEnvPage from './Components/CreateParamEnvPage';
import UpdateParamEnvPage from './Components/UpdateParamEnvPage';

var ParamEnvPage2 = React.createClass({
  getInitialState : function() {
      return {
          paramEnvSet: {
      			recordSet: [],
      			operation : '',
      			errMsg : ''
          },
          loading: false,
      }
  },

  mixins: [Reflux.listenTo(ParamEnvStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    this.setState({
        loading: false,
        paramEnvSet: data,
    });
  },

  handleQueryClick : function(event) {
    this.state.paramEnvSet.operation = '';
    this.setState({loading: true});
  	ParamEnvActions.retrieveParamEnv();
  },

  componentDidMount : function(){
    this.state.paramEnvSet.operation = '';
    this.setState({loading: true});
    ParamEnvActions.initParamEnv();
  },

  handleOpenCreateWindow : function(event) {
  	this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },

  handleUpdateClick : function(paramEnv, event) {
    if(paramEnv != null){
      this.refs.updateWindow.initPage(paramEnv);
      this.refs.updateWindow.toggle();
    }
  	event.stopPropagation();
  },

  handleRemoveClick : function(paramEnv, event){
  	Modal.confirm({
      title: Common.removeTitle,
  		content: '是否删除选中的环境参数 【'+paramEnv.envName+'】',
      okText: Common.removeOkText,
      cancelText: Common.removeCancelText,
  		onOk: this.handleRemoveClick2.bind(this, paramEnv)
  	});
  	event.stopPropagation();
  },

  handleRemoveClick2 : function(paramEnv){
    this.state.paramEnvSet.operation = '';
    this.setState({loading: true});
  	ParamEnvActions.deleteParamEnv( paramEnv.uuid );
  },

  handleparamEnvClick: function(paramEnv, e){
	if(paramEnv != null){
      Context.envApp = paramEnv;
	    this.props.router.push({
	      pathname: '/param3/paraValuePage/',
	  	  state: { fromDashboard: true }
	    });
	}
  },

  render : function() {
  	var recordSet = this.state.paramEnvSet.recordSet;
    var cardList =
        recordSet.map((paramEnv, i) => {
              return <div key={paramEnv.uuid} className='card-div' style={{width: 300}}>
                <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleparamEnvClick.bind(this, paramEnv)} title='点击进入参数管理页面'>
                  <div className="ant-card-head"><h3 className="ant-card-head-title">{paramEnv.envName}</h3></div>
                  <div className="ant-card-extra">
                    <a href="#" onClick={this.handleUpdateClick.bind(this, paramEnv)} title='修改'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleRemoveClick.bind(this, paramEnv)} title='删除'><Icon type={Common.iconRemove}/></a>
                  </div>
                  <div className="ant-card-body" style={{cursor:'pointer'}}>{paramEnv.envDesc}</div>
                </div>
              </div>
        });

	return (
		<div className='card-page'>
	      <ServiceMsg ref='mxgBox' svcList={['env_info/retrieve','env_info/remove']}/>

		    <div style={{marginLeft:'16px', marginBottom:'12px', paddingTop:'14px', width: 200}}>系统环境
		    	<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加环境' className='toolbar-icon' style={{color: '#108ee9'}}/>
		    </div>

	      	{
                this.state.loading ?
                    <Spin tip="正在努力加载数据...">{cardList}</Spin>
                    :
                    <div>{cardList}</div>
        }

			<CreateParamEnvPage ref="createWindow"/>
			<UpdateParamEnvPage ref="updateWindow"/>
      </div>);
  }
});
var ParamEnvPage = withRouter(ParamEnvPage2);
module.exports = ParamEnvPage;
