'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var AppActions = require('../../app/action/AppActions');
var AppStore = require('../../app/data/AppStore');
import CreateAppInfoPage from './CreateAppInfoPage';

var filterValue = '';
var AppInfoPage = React.createClass({
    getInitialState : function() {
        return {
            authAppSet: {
                groupUuid: '',
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            loading: false,
            recordSet: [],
            appGroup: this.props.appGroup,
        }
    },

      mixins: [Reflux.listenTo(AppStore, "onServiceComplete")],
      onServiceComplete: function(data) {
          if(data.operation === 'update' || data.operation === 'batchUpdate' || data.operation === 'retrieve'){
              var groupUuid = this.state.appGroup.uuid;
              var recordSet = [];
              data.recordSet.map((node, i) => {
                  if(node.groupUuid === groupUuid){
                      recordSet.push(node);
                  }
              });

              if(data.errMsg === ''){
                  // 成功
                  this.setState({
                      loading: false,
                      recordSet: recordSet,
                      appGroupSet: data
                  });
              }
              else{
                  // 失败
                  this.setState({
                      loading: false,
                      appGroupSet: data
                  });
              }
          }
      },

    // 刷新
    handleQueryClick : function(event) {
        if(this.state.appGroup.uuid != ''){
            this.state.authAppSet.operation = '';
            this.setState({loading: true});
            AppActions.retrieveAuthAppInfo();
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.authAppSet.operation = '';
        this.setState({loading: true});
        AppActions.initAuthAppInfo();
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear(this.state.appGroup.uuid);
        this.refs.createWindow.toggle();
    },

    // 移除App
    onClickRemove:function(authApp)
    {
        Modal.confirm({
            title: '移除确认',
            content: '是否移除选中的应用 【'+authApp.appCode+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickRemove2.bind(this, authApp)
        });
    },
    onClickRemove2 : function(authApp)
    {
        this.state.authAppSet.operation = '';
        this.setState({loading: true});
        authApp.groupUuid = null;
        AppActions.updateAuthAppInfo(authApp);
    },

    handleGoBack : function()
    {
        browserHistory.push({
            pathname: '/auth/AppGroupPage/',
        });
    },
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    render : function() {
	  	var recordSet = [];
	    if(filterValue === ''){
	        recordSet = this.state.recordSet;
	    }
	    else{
	        recordSet = Common.filter(this.state.recordSet, filterValue);
	    }

        const columns = [
            {
                title: '应用名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 140,
            },
            {
                title: '应用编号',
                dataIndex: 'appCode',
                key: 'appCode',
                width: 140,
            },
            {
                title: '应用说明',
                dataIndex: 'appDesc',
                key: 'appDesc',
                width: 210,
            },
            {
                title: '',
                key: 'action',
                width: 60,
                render: (text, record) => (
            	    <span>
            		  <a href="#" onClick={this.onClickRemove.bind(this, record)}>移除</a>
            		</span>
                ),
            }
        ];

		var cs = Common.getGridMargin(this);
        return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
			    	<ServiceMsg ref='mxgBox' svcList={['auth-app-info/retrieve', 'auth-app-info/remove', 'auth-app-group/retrieve']}/>

				    <div className='toolbar-table' style={{overflow:'hidden'}}>
				    	<div style={{float:'left'}}>
						    <div style={{paddingTop:'8px', paddingRight:'8px', display: 'inline'}}>{this.props.appGroup.groupName} 包含{recordSet.length}个APP</div>
		        			<Button icon={Common.iconAdd} type="primary" title="绑定APP" onClick={this.handleOpenCreateWindow}/>
	        				<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
		        			<Button icon={Common.iconBack} title="返回" onClick={this.handleGoBack} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
					<CreateAppInfoPage ref="createWindow"/>
				</div>
			</div>
        );
    }
});

module.exports = AppInfoPage;
