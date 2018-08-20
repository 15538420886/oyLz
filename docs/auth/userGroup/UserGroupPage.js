﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Spin,Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var UserGroupStore = require('./data/UserGroupStore.js');
var UserGroupActions = require('./action/UserGroupActions');
import CreateUserGroupPage from './Components/CreateUserGroupPage';
import UpdateUserGroupPage from './Components/UpdateUserGroupPage';

import AppAuthPage from './Components/AppAuthPage.js';
var LeftList = require('../../lib/Components/LeftList');

var filterValue = '';
var UserGroupPage = React.createClass({
	getInitialState : function() {
		return {
			userGroupSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
			userGroup:null,
			selectedRowUuid:'',
		}
	},

    mixins: [Reflux.listenTo(UserGroupStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            userGroupSet: data
        });
    },

	loadData: function(corpUuid){
        UserGroupActions.initUserGroup(corpUuid);
    },

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		var corpUuid = window.loginData.compUser.corpUuid;
		UserGroupActions.initUserGroup(corpUuid);
	},

	//点击行发生的事件
    onRowClick: function(record, index){
		var corpUuid = window.loginData.compUser.corpUuid;
        this.state.groupName= record.groupName;
        this.setState({
			userGroup:record,
            userGroupSet: this.state.userGroupSet,
			selectedRowUuid:record.uuid,
        });

        UserGroupActions.initUserGroup(corpUuid);
		this.refs.AppAuthPage.loadData(record);
    },

	handleOpenCreateWindow : function(event) {
		var corpUuid = window.loginData.compUser.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(event)
	{
		if(this.state.userGroup != null){
			this.refs.updateWindow.initPage(this.state.userGroup);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的用户组【'+this.state.userGroup.groupName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, this.state.userGroup)
		});
	},

	onClickDelete2 : function()
	{
		this.setState({loading: true});
		this.state.userGroupSet.operation = '';
		UserGroupActions.deleteUserGroup( this.state.userGroup.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		var corpUuid = window.loginData.compUser.corpUuid;
		var recordSet = Common.filter(this.state.userGroupSet.recordSet, filterValue);

		const {
            ...attributes,
        } = this.props;

		var isSelected = (this.state.userGroup !== null);
		recordSet.map((user, i) => {
            user.listText = user.groupName; 
           
        });

		var cs = Common.getGridMargin(this);
		var tool =
            <div style={{ padding: '8px 0 8px 8px' }}>
                <Button icon={Common.iconAdd} type="primary" title="增加用户组" onClick={this.handleOpenCreateWindow}/>
				<Button icon={Common.iconUpdate} title="修改用户组" disabled={!isSelected} onClick={this.onClickUpdate} style={{marginLeft: '4px'}}/>
				<Button icon={Common.iconRemove} title="删除用户组" disabled={!isSelected} onClick={this.onClickDelete} style={{marginLeft: '4px'}}/>
            </div>

		return (
			<div className='grid-page' style={{padding: '10px'}}>
				<div style={{margin: cs.margin,float:'left'}}>
					<ServiceMsg ref='mxgBox' svcList={['user-group/retrieve', 'user-group/remove']}/>	
				</div>
                <div style={{ height: '100%',float:'left',width: '200px'}}>
                    {
                        this.state.loading
                            ? <Spin tip="正在努力加载数据...">
								<LeftList dataSource={recordSet} style={{width: '200px',height: '100%'}} rowText='listText' activeNode ={this.state.selectedRowUuid} onClick={this.onRowClick} toolbar={tool} {...attributes} />
                            </Spin>
                            : <LeftList dataSource={recordSet} style={{width: '200px',height: '100%'}} rowText='listText' activeNode ={this.state.selectedRowUuid} onClick={this.onRowClick} toolbar={tool} {...attributes} />
                    }
				</div>

				<div style={{height:'100%',overflow:'hidden'}}>
					<AppAuthPage ref="AppAuthPage" userGroup={this.state.userGroup}/> 
                </div>
				
				<CreateUserGroupPage ref="createWindow"/>
				<UpdateUserGroupPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = UserGroupPage;


