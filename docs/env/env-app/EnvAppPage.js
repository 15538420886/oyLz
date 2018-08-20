'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Modal} from 'antd';
var Utils = require('../../public/script/utils');
var EnvAppActions = require('./action/EnvAppActions');
var EnvAppStore = require('./data/EnvAppStore');
import CreateEnvAppPage from './Components/CreateEnvAppPage';
import UpdateEnvAppPage from './Components/UpdateEnvAppPage';

var EnvAppPage = React.createClass({
    getInitialState : function() {
        return {
            envAppSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading: false,
            envHost: this.props.envHost,
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.envAppSet.operation = '';
        this.setState({loading: true});
        EnvAppActions.initEnvAppInfo(this.state.envHost.uuid);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear(this.state.envHost.uuid);
        this.refs.createWindow.toggle();
    },

    // 移除App
    onClickRemove:function(envApp)
    {
        Modal.confirm({
            title: '移除确认',
            content: '是否移除选中的应用 【'+envApp.appName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickRemove2.bind(this, envApp)
        });
    },

    onClickUpdate : function(envApp)
    {
      if(envApp != null){
        envApp.hostUuid = this.state.envHost.uuid;
        this.refs.updateWindow.initPage(envApp);
        this.refs.updateWindow.toggle();
      }
    },

    onClickRemove2 : function(envApp)
    {
        this.state.envAppSet.operation = '';
        this.setState({loading: true});
        EnvAppActions.deleteEnvAppInfo( envApp.uuid );
    },

    handleGoBack : function(){

      browserHistory.push({
          pathname: '/env/EnvHostPage/',
      });

    },

    render : function() {
        var recordSet = this.state.envAppSet.recordSet;
        if( this.state.loading ){
            if(this.state.envAppSet.operation === 'retrieve' || this.state.envAppSet.operation === 'remove'){
                this.state.loading = false;
            }
        }

        const columns = [
            {
                title: '应用名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 100,
            },
            {
                title: '端口号',
                dataIndex: 'svcPort',
                key: 'svcPort',
                width: 140,
            },
            {
                title: '运行方式',
                dataIndex: 'profileName',
                key: 'profileName',
                width: 140,
                render: (text, record) => (Utils.getOptionName('用户管理', '运行方式', record.profileName, true, this)),
            },
            {
                title: '版本名称',
                dataIndex: 'appVer',
                key: 'appVer',
                width: 180,
            },
            {
              title: '',
              key: 'action',
              width: 100,
              render: (text, record) => (
                <span>
                  <a href="#" onClick={this.onClickUpdate.bind(this, record)}>修改</a>
                  <span className="ant-divider" />
                  <a href="#" onClick={this.onClickRemove.bind(this, record)}>移除</a>
                </span>
              ),
            }
        ];

        return (
      <div className='grid-page'>
        <ServiceMsg ref='mxgBox' svcList={['auth-app-info/retrieve', 'auth-app-info/remove']}/>

        <div className='toolbar-table' style={{overflow:'hidden'}}>
          <div style={{float:'left'}}>
            <Button onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}>增加</Button>
            <Button onClick={this.handleGoBack} style={{marginLeft: '4px'}}>返回</Button>
          </div>
        </div>

        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" scroll={{y:600}} bordered />
        <CreateEnvAppPage ref="createWindow" envHost={this.state.envHost} />
        <UpdateEnvAppPage ref="updateWindow" />
      </div>
        );
    }
});

ReactMixin.onClass(EnvAppPage, Reflux.connect(EnvAppStore, 'envAppSet'));
module.exports = EnvAppPage;
