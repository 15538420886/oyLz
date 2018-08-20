"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router';
import {Button, Table, Icon, Modal} from 'antd';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var Context = require('../ParamContext');
import ServiceMsg from '../../lib/Components/ServiceMsg';
var ParamDefStore = require('./data/ParamDefStore');
var ParamDefActions = require('./action/ParamDefActions');
import CreateParamDefPage from './Components/CreateParamDefPage';
import UpdateParamDefPage from './Components/UpdateParamDefPage';
import ModListPage from '../mod/Components/ModListPage';

var ParamDefPage = React.createClass({
  getInitialState : function() {
      return {
          paramdefSet: {
            recordSet: [],
            operation : '',
            errMsg : ''
          },
          loading: false,
          selectedRowKeys: [],
          selectedMod : {},
      }
  },

  mixins: [Reflux.listenTo(ParamDefStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    this.setState({
        loading: false,
        paramdefSet: data,
    });
  },

  componentDidMount : function(){
      this.setState({loading: true});
      ParamDefActions.initParamDef();
  },
  
  handleQueryClick: function(){
      this.setState({loading: true});
      var mod = this.state.selectedMod;
      ParamDefActions.retrieveParamDef( mod.uuid );
  },

  handleOpenCreateWindow : function() {
    var mod = this.state.selectedMod;
    this.refs.createWindow.clear(mod.uuid, mod.appUuid);
    this.refs.createWindow.toggle();
  },

  onClickUpdate: function( paramdef, e ) {
    if(paramdef != null){
        this.refs.updateWindow.initPage( paramdef );
        this.refs.updateWindow.toggle();
    }
    e.stopPropagation();
  },

  onClickDelete : function( paramdef, event ) {
    Modal.confirm({
      title: Common.removeTitle,
      content: '是否删除选中的参数 【'+paramdef.paraName+'】',
      okText: Common.removeOkText,
      cancelText: Common.removeCancelText,
      onOk: this.handleRemoveClick2.bind(this, paramdef)
    });
    event.stopPropagation();
  },

  handleRemoveClick2: function( paramdef ) {
    this.setState({loading: true});
    ParamDefActions.deleteParamDef( paramdef.uuid );
  },

  onSelectMod: function( mod ) {
    this.setState({loading: true});
    this.state.selectedMod = mod;
    ParamDefActions.initParamDef( mod.uuid );
  },

  render: function () {
      var modUuid = this.state.selectedMod.uuid;
      var isSelected = (typeof modUuid !== 'undefined');

      var recordSet = this.state.paramdefSet.recordSet;
      const columns = [
          {
              title: '参数名称',
              dataIndex: 'paraName',
              key: 'paraName',
              width: 140,
          },
          {
              title: '参数说明',
              dataIndex: 'paraDesc',
              key: 'paraDesc',
              width: 140,
          },
          {
              title: '取值范围',
              dataIndex: 'valueSet',
              key: 'valueSet',
              width: 140,
          },
          {
              title: '状态',
              dataIndex: 'paraStatus',
              key: 'paraStatus',
              width: 140,
          },
          {
              title: '',
              key: 'action',
              width: 80,
              render: (paramdef, record) => (
                  <span>
                      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate} /></a>
                      <span className="ant-divider" />
                      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove} /></a>
                  </span>
              )
          }
      ];
      return (
          <div className='grid-page'>
              <ServiceMsg ref='mxgBox' svcList={['para_def/retrieve', 'para_def/remove']} />
              <ModListPage width='220px' caption='请选择模块' onSelectMod={this.onSelectMod} appUuid={Context.paramApp.uuid}>
                  <div className='toolbar-table'>
                      <Button icon={Common.iconAdd} disabled={!isSelected} type="primary" title="增加参数" onClick={this.handleOpenCreateWindow} />
                      <Button icon={Common.iconRefresh} disabled={!isSelected} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                  </div>
                  <div className='grid-body'>
                      <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                  </div>
              </ModListPage>

              <CreateParamDefPage ref="createWindow" />
              <UpdateParamDefPage ref="updateWindow" />
          </div>);
  }
});

module.exports = ParamDefPage;
