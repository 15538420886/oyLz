'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';

var Utils = require('../../public/script/utils');
var EnvHostStore = require('./data/EnvHostStore.js');
var EnvHostActions = require('./action/EnvHostActions');
import CreateEnvHostPage from './Components/CreateEnvHostPage';

var EnvHostPage2 = React.createClass({
  getInitialState : function() {
      return {
          envHostSet: {
            recordSet: [],
            startPage : 0,
            pageRow : 0,
            totalRow : 0,
            operation : '',
            errMsg : ''
          },
          loading: true,
      }
  },

  // 刷新
  handleQueryClick : function(event) {
    this.state.envHostSet.operation = '';
    this.setState({loading: true});
    EnvHostActions.retrieveEnvHost();
  },

  // 第一次加载
  componentDidMount : function(){
    this.state.envHostSet.operation = '';
    this.setState({loading: true});
    EnvHostActions.initEnvHost();
  },

  handleOpenCreateWindow : function(event) {
    this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },

  handleUpdateClick : function(envHost, event)
  {
  if(envHost != null){
    this.refs.updateWindow.initPage(envHost);
    this.refs.updateWindow.toggle();
  }

    event.stopPropagation();
  },

  onSaveCallback : function(envHost)
  {
    EnvHostActions.updateEnvHost( envHost );
  },

  onCreateCallback : function(envHost)
  {
    EnvHostActions.createEnvHost( envHost );
  },

  handleRemoveClick : function(envHost, event)
  {
    Modal.confirm({
        title: Utils.removeTitle,
      content: '是否删除选中的主机信息 【'+envHost.hostName+'】',
        okText: Utils.removeOkText,
        cancelText: Utils.removeCancelText,
      onOk: this.handleRemoveClick2.bind(this, envHost)
    });

    event.stopPropagation();
  },

  handleRemoveClick2 : function(envHost)
  {
    this.state.envHostSet.operation = '';
    this.setState({loading: true});
    EnvHostActions.deleteEnvHost( envHost.uuid );
  },

  /*点击卡片页，跳转到修改页面*/
  handleEnvHostClick: function(envHost, e)
  {
    if(envHost != null){
        this.props.router.push({
          pathname: '/env/HostDetPage/',
          query: {
                      envHost: JSON.stringify(envHost),
                  },
          state: { fromDashboard: true }
        });
    }
    e.stopPropagation();
  },

  render : function() {

    if( this.state.loading ){
      if(this.state.envHostSet.operation === 'retrieve' || this.state.envHostSet.operation === 'remove'){
          this.state.loading = false;
      }
    }

    var recordSet = this.state.envHostSet.recordSet;
    var len = recordSet.length;
    var cardList =
        recordSet.map((envHost, i) => {
              return <div key={envHost.uuid} className='card-div' style={{width: 300}}>
                <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleEnvHostClick.bind(this, envHost)} title='点击查看软件和部署信息'>
                  <div className="ant-card-head"><h3 className="ant-card-head-title">{envHost.hostName}</h3></div>
                  <div className="ant-card-extra">
                    <a href="#" onClick={this.handleEnvHostClick.bind(this, envHost)}>修改</a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleRemoveClick.bind(this, envHost)}>删除</a>
                  </div>
                  <div className="ant-card-body" style={{cursor:'pointer'}}>
                    <p><span style={{display:'inline-block',width:'60px',lineHeight:'24px'}}>IP :</span>{envHost.ipAddr}</p>
                    <p><span style={{display:'inline-block',width:'60px',lineHeight:'24px'}}>用途 :</span>{envHost.memo2}</p>
                    <p><span style={{display:'inline-block',width:'60px',lineHeight:'24px'}}>地址 :</span>{envHost.deployLoc}</p>
                  </div>
                </div>
              </div>
        });

  return (
    <div className='card-page'>
        <ServiceMsg ref='mxgBox' svcList={['env-host/retrieve','env-host/remove']}/>

        <div style={{marginLeft:'16px', marginBottom:'12px'}}>共{len}个主机
          <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加主机' style={{paddingLeft:'8px', cursor:'pointer'}}/>
        </div>

          {
                this.state.loading ?
                    <Spin tip="正在努力加载数据...">{cardList}</Spin>
                    :
                    <div>{cardList}</div>
        }

        <CreateEnvHostPage ref="createWindow" onCreateCallback={this.onCreateCallback}/>
      </div>);
  }
});

var EnvHostPage = withRouter(EnvHostPage2);
ReactMixin.onClass(EnvHostPage2, Reflux.connect(EnvHostStore, 'envHostSet'));
module.exports = EnvHostPage;
