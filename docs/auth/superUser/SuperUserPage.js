'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var SuperUserStore = require('./data/SuperUserStore.js');
var SuperUserActions = require('./action/SuperUserActions');
import CreateSuperUserPage from './Components/CreateSuperUserPage';
import UpdateSuperUserPage from './Components/UpdateSuperUserPage';

var SuperUserPage = React.createClass({
  getInitialState : function() {
    return {
      superUserSet: {
        corpUuid: '',
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

  mixins: [Reflux.listenTo(SuperUserStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    this.setState({
      loading: false,
      superUserSet: data
    });
  },

  // 刷新
  handleQueryClick : function(event) {
    this.setState({loading: true});
    this.state.superUserSet.operation = '';
    SuperUserActions.retrieveSuperUser(this.state.superUserSet.corpUuid);
  },

  // 第一次加载
  componentDidMount : function(){
    this.setState({loading: true});
    var compUser = window.loginData.compUser;
    var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
    SuperUserActions.initSuperUser(corpUuid);
  },

  handleOpenCreateWindow : function(event) {
    this.refs.createWindow.clear(this.state.superUserSet.corpUuid);
    this.refs.createWindow.toggle();
  },

  onClickUpdate : function(superUser, event)
  {
    if(superUser != null){
      this.refs.updateWindow.initPage(superUser);
      this.refs.updateWindow.toggle();
    }
  },

  render : function() {
    var recordSet = this.state.superUserSet.recordSet;
    const columns = [
			{
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        width: 140,
      },
			{
        title: '访问类型',
        dataIndex: 'userType',
        key: 'userType',
        width: 140,
        render: (text, record) => (Utils.getOptionName('用户管理', '访问类型', record.userType, false, this)),
      },
			{
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        render: (text, record) => (Utils.getOptionName('common', '启用状态', record.status, false, this)),
      },
      {
        title: '更多操作',
        key: 'action',
        width: 100,
        render: (text, record) => (

          <span>
						<Button onClick={this.onClickUpdate.bind(this, record)}  style={{marginLeft: '4px', display:(record.status === "0") ? "block":"none" }}>启用</Button>
            <Button onClick={this.onClickUpdate.bind(this, record)}  style={{marginLeft: '4px', display:(record.status === "1") ? "block":"none" }}>禁用</Button>
					</span>
        ),
      }
    ];

    var cs = Common.getGridMargin(this);
    return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['super-user/retrieve', 'super-user/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加超级用户" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateSuperUserPage ref="createWindow"/>
				<UpdateSuperUserPage ref="updateWindow"/>
			</div>
    );
  }
});

module.exports = SuperUserPage;

