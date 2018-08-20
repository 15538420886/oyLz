'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'
import { withRouter } from 'react-router'

import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var AppActions = require('./action/AppActions');
var AppStore = require('./data/AppStore');
import CreateAppPage from './components/CreateAppPage';
import UpdateAppPage from './components/UpdateAppPage';

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

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        this.state.appSet.operation = '';
        AppActions.retrieveAppInfo();
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.appSet.operation = '';
        this.setState({loading: true});
        AppActions.initAppInfo();
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    // 移除App
    onClickRemove:function(app)
    {
        Modal.confirm({
            title: '移除确认',
            content: '是否移除选中的软件 【'+app.softName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickRemove2.bind(this, app)
        });
    },

    onClickUpdate : function(app)
    {
      if(app != null){
        this.refs.updateWindow.initPage(app);
        this.refs.updateWindow.toggle();
      }
    },

    onClickRemove2 : function(app)
    {
        this.state.appSet.operation = '';
        this.setState({loading: true});
        AppActions.deleteAppInfo( app.uuid );
    },

    handleGoBack : function(){

      browserHistory.push({
          pathname: '/env/EnvHostPage/',
      });

    },
    /*点击操作，跳转到操作页面*/
    onClickOperat: function(app, e)
    {
      if(app != null){
          this.props.router.push({
            pathname: '/env/OperatPage/',
            query: {
                        app: JSON.stringify(app),
                    },
            state: { fromDashboard: true }
          });
      }
      e.stopPropagation();
    },

    render : function() {
        var recordSet = this.state.appSet.recordSet;
        if( this.state.loading ){
            if(this.state.appSet.operation === 'retrieve' || this.state.appSet.operation === 'remove'){
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
                title: '应用代码',
                dataIndex: 'appCode',
                key: 'appCode',
                width: 140,
            },
            {
                title: '应用描述',
                dataIndex: 'appDesc',
                key: 'appDesc',
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
                  <span className="ant-divider" />
                  <a href="#" onClick={this.onClickOperat.bind(this, record)}>操作</a>
                </span>
              ),
            }
        ];

        return (
      <div className='grid-page'>
        <ServiceMsg ref='mxgBox' svcList={['auth-app-info/retrieve', 'auth-app-info/remove']}/>

        <div className='toolbar-table'>
          <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick}/>
          <Button icon={Common.iconAdd} title="增加操作" onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}/>
        </div>

        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" scroll={{y:600}} bordered />
        <CreateAppPage ref="createWindow" />
        <UpdateAppPage ref="updateWindow" />
      </div>
        );
    }
});
var AppPage = withRouter(AppPage2);
ReactMixin.onClass(AppPage2, Reflux.connect(AppStore, 'appSet'));
module.exports = AppPage;
