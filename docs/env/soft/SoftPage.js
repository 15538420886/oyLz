'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Modal} from 'antd';
var Utils = require('../../public/script/utils');
var SoftActions = require('./action/SoftActions');
var SoftStore = require('./data/SoftStore');
import CreateSoftPage from './Components/CreateSoftPage';
import UpdateSoftPage from './Components/UpdateSoftPage';

var SoftPage = React.createClass({
    getInitialState : function() {
        return {
            softSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                operation: "",
                errMsg: ""
            },
            loading: false,
            envHost: this.props.envHost,
        }
    },


    // 第一次加载
    componentDidMount : function(){
        this.state.softSet.operation = '';
        this.setState({loading: true});
        SoftActions.initEnvSysSoft(this.state.envHost.uuid);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    // 移除App
    onClickRemove:function(soft)
    {
        Modal.confirm({
            title: '移除确认',
            content: '是否移除选中的软件 【'+soft.softName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickRemove2.bind(this, soft)
        });
    },

    onClickUpdate : function(soft)
    {
      if(soft != null){
        soft.hostUuid = this.state.envHost.uuid;
        this.refs.updateWindow.initPage(soft);
        this.refs.updateWindow.toggle();
      }
    },

    onClickRemove2 : function(soft)
    {
        this.state.softSet.operation = '';
        this.setState({loading: true});
        // console.log(soft);
        SoftActions.deleteEnvSysSoft( soft.uuid );
    },

    handleGoBack : function(){

      browserHistory.push({
          pathname: '/env/EnvHostPage/',
      });

    },

    render : function() {
        var recordSet = this.state.softSet.recordSet;

        if( this.state.loading ){
            if(this.state.softSet.operation === 'retrieve' || this.state.softSet.operation === 'remove'){
                this.state.loading = false;
            }
        }

        const columns = [
            {
                title: '软件名称',
                dataIndex: 'softName',
                key: 'softName',
                width: 100,
            },
            {
                title: '地址',
                dataIndex: 'softUrl',
                key: 'softUrl',
                width: 140,
            },
            {
                title: '用途',
                dataIndex: 'softPurpose',
                key: 'softPurpose',
                width: 140,
            },
            {
                title: '部署说明',
                dataIndex: 'deployDesc',
                key: 'deployDesc',
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
        <ServiceMsg ref='mxgBox' svcList={['env-sys-soft/get-by-hostUuid', 'env-sys-soft/remove']}/>

        <div className='toolbar-table' style={{overflow:'hidden'}}>
          <div style={{float:'left'}}>
            <Button onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}>增加</Button>
            <Button onClick={this.handleGoBack} style={{marginLeft: '4px'}}>返回</Button>
          </div>
        </div>

        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" scroll={{y:600}} bordered />
        <CreateSoftPage ref="createWindow" envHost={this.state.envHost} />
        <UpdateSoftPage ref="updateWindow"/>
      </div>
        );
    }
});

ReactMixin.onClass(SoftPage, Reflux.connect(SoftStore, 'softSet'));
module.exports = SoftPage;
