'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';

import {Button, Table, Icon,Modal} from 'antd';

var Context = require('../ParamContext');
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var ModStore = require('./data/ModStore');
var ModActions = require('./action/ModActions');
import CreateModPage from './Components/CreateModPage';
import UpdateModPage from './Components/UpdateModPage';

var ModPage = React.createClass({
  getInitialState : function() {
    return {
      modSet: {
        recordSet: [],
        operation : '',
        errMsg : ''
      },
      loading: false,
    }
  },

  mixins: [Reflux.listenTo(ModStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  this.setState({
	      loading: false,
	      modSet: data
	  });
	},

  // 刷新
  handleQueryClick : function(event){
      this.setState({loading: true});
      var app=Context.paramApp;
      ModActions.retrieveAppGroup(app.uuid);
  },

  // 页面跳转
  componentWillReceiveProps: function(nextProps){
    var q = nextProps.location.query;
    if(q != null && typeof(q) != 'undefined'){
        if(q.app != null && typeof(q.app) != 'undefined'){
            if(Context.paramApp.uuid != q.app){
                Context.createContext( q.app );
                ModActions.initAppGroup( q.app );
            }
        }
    }
  },
  componentWillMount : function(){
    var q = this.props.location.query;
    if(q != null && typeof(q) != 'undefined'){
        if(q.app != null && typeof(q.app) != 'undefined'){
            Context.createContext( q.app );
        }
    }
},

  // 第一次加载
  componentDidMount : function(){
    this.setState({loading: true});
    var app=Context.paramApp;
    ModActions.initAppGroup(app.uuid);
  },

  handleOpenCreateWindow : function(event){
    var app=Context.paramApp;
    this.refs.createWindow.clear(app.uuid);
    this.refs.createWindow.toggle();
  },

  onClickUpdate : function(mod, event){
    if(mod != null){
      this.refs.updateWindow.initPage(mod);
      this.refs.updateWindow.toggle();
    }
  },

  onClickDelete : function(mod, event){
    Modal.confirm({
      title: '删除确认',
      content: '是否删除选中的模块 【'+mod.groupName+'】',
      okText: '确定',
      cancelText: '取消',
      onOk: this.onClickDelete2.bind(this, mod)
    });
  },

  onClickDelete2 : function(mod){
    this.setState({loading: true});
    ModActions.deleteAppGroup( mod.uuid );
  },

  render : function() {
    var recordSet = this.state.modSet.recordSet;
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'groupName',
        key: 'groupName',
        width: 160,
      },
      {
        title: '模块说明',
        dataIndex: 'groupDesc',
        key: 'groupDesc',
        width: 300,
      },
      {
        title: '',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <span>
          <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
          <span className="ant-divider" />
          <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
          </span>
        ),
      }
    ];

    var cs = Common.getGridMargin(this);
    return (
    <div className='grid-page' style={{padding: cs.padding}}>
      <div style={{margin: cs.margin}}>
        <ServiceMsg ref='mxgBox' svcList={['app-group/retrieve','app-group/remove']} />
        <div className='toolbar-table'>
          <Button icon={Common.iconAdd} type="primary" title="增加模块" onClick={this.handleOpenCreateWindow} />
          <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
        </div>
      </div>
      <div className='grid-body'>
          <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
      </div>

      <CreateModPage ref="createWindow"/>
      <UpdateModPage ref="updateWindow"/>
    </div>
    );
  }
});

module.exports = ModPage;
