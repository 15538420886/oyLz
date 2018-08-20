'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var OperatStore = require('./data/OperatStore.js');
var OperatActions = require('./action/OperatActions');
import CreateOperatPage from './Components/CreateOperatPage';
import UpdateOperatPage from './Components/UpdateOperatPage';

var OperatPage = React.createClass({
  getInitialState : function() {
    var app = null;
    if(this.props.location.query != null){
        var str = this.props.location.query.app;
        app = JSON.parse(str);
    }
    return {
      operatSet: {
        recordSet: [],
        startPage : 0,
        pageRow : 0,
        totalRow : 0,
        operation : '',
        errMsg : ''
      },
      loading: false,
      appUuid: app.uuid,
    }
  },

    mixins: [Reflux.listenTo(OperatStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            operatSet: data
        });
    },
    
  // 刷新
  handleQueryClick : function(event) {
    this.setState({loading: true});
    this.state.operatSet.operation = '';
    OperatActions.retrieveEnvAppOp(this.state.appUuid);
  },

  // 第一次加载
  componentDidMount : function(){
    this.setState({loading: true});
    OperatActions.initEnvAppOp(this.state.appUuid);
  },

  handleOpenCreateWindow : function(event) {
    this.refs.createWindow.clear(this.state.appUuid);
    this.refs.createWindow.toggle();
  },

  onClickUpdate : function(operat, event)
  {
    if(operat != null){
      this.refs.updateWindow.initPage(operat);
      this.refs.updateWindow.toggle();
    }
  },

  onClickDelete : function(operat, event)
  {
    Modal.confirm({
      title: '删除确认',
      content: '是否删除选中的操作 【'+operat.opName+'】',
      okText: '确定',
      cancelText: '取消',
      onOk: this.onClickDelete2.bind(this, operat)
    });
  },

  onClickDelete2 : function(operat)
  {
    this.setState({loading: true});
    this.state.operatSet.operation = '';
    OperatActions.deleteEnvAppOp( operat.uuid );
  },

  render : function() {
    var recordSet = this.state.operatSet.recordSet;

    const columns = [
      {
        title: '操作名称',
        dataIndex: 'opName',
        key: 'opName',
        width: 140,
      },
     {
        title: '接口名称',
        dataIndex: 'svcName',
        key: 'svcName',
        width: 140,
      },
     {
        title: '请求参数',
        dataIndex: 'svcParam',
        key: 'svcParam',
        width: 140,
      },
     {
        title: '用途',
        dataIndex: 'opDesc',
        key: 'opDesc',
        width: 140,
      },
      {
        title: '',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <span>
          <a href="#" onClick={this.onClickUpdate.bind(this, record)}>更新</a>
          <span className="ant-divider" />
          <a href="#" onClick={this.onClickDelete.bind(this, record)}>删除</a>
          </span>
        ),
      }
    ];

    return (
      <div className='grid-page'>
        <ServiceMsg ref='mxgBox' svcList={['env-app-op/retrieve', 'env-app-op/remove']}/>

        <div className='toolbar-table'>
          <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick}/>
          <Button icon={Common.iconAdd} title="增加操作" onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}/>
        </div>
        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" scroll={{y:510}} bordered={Common.tableBorder}/>

        <CreateOperatPage ref="createWindow"/>
        <UpdateOperatPage ref="updateWindow"/>
      </div>
    );
  }
});

module.exports = OperatPage;
