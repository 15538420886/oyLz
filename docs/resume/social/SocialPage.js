'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import Context from '../resumeContext';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal} from 'antd';
var Common = require('../../public/script/common');
import ServiceMsg from '../../lib/Components/ServiceMsg';
var ResumeStore = require('../resume/data/ResumeStore');
var ResumeActions = require('../resume/action/ResumeActions');
import CreateSocialPage from './Components/CreateSocialPage';

var SocialPage = React.createClass({
	getInitialState : function() {
		return {
			socialSet: {
				person: {},
				resumeID: '',
				operation:'',
				errMsg: ''
			},
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		this.setState({
			loading: false,
			socialSet: data
		});
	},
	componentDidMount : function(){
		var app=Context.resumeApp;
		this.setState({loading: true});
		if(app.id){
			ResumeActions.getResumeByID(app.id);
		}else{
			var id = window.loginData.authUser.userId;
			ResumeActions.getResumeByIdCode(id);
		}
	},
	onClickUpdate:function(social,event){
		if(social != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(social);
			}
		}
	},
	onClickDelete:function(social,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+social.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, social)
		});
	},
	onClickDelete2 : function(social){
		this.setState({loading: true});
		ResumeActions.delSocial(social.uuid);
	},
	render : function() {
		var recordSet=this.state.socialSet.person.socialList;
		const columns = [
		{
			title: '姓名',
			dataIndex: 'peName',
			key: 'peName',
			width: 140,
		},
		{
			title: '关系',
			dataIndex: 'relation',
			key: 'relation',
			width: 140,
		},
		{
			title: '职务',
			dataIndex: 'title',
			key: 'title',
			width: 140,
		},
		{
			title: '公司',
			dataIndex: 'compName',
			key: 'compName',
			width: 140,
		},
		{
			title: '',
			key: 'action',
			width: 80,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
				</span>
			),
		}
		];

		return (
			<div className='resume-page'>
				<ServiceMsg ref='mxgBox' svcList={['socialList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateSocialPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = SocialPage;
