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
import CreateContactPage from './Components/CreateContactPage';

var ResumePage = React.createClass({
	getInitialState : function() {
		return {
			contactSet: {
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
			contactSet: data
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
	onClickUpdate:function(contact,event){
		if(contact != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(contact);
			}
		}
	},
	onClickDelete:function(contact,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+contact.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, contact)
		});
	},
	onClickDelete2 : function(contact){
		this.setState({loading: true});
		ResumeActions.delContact(contact.uuid);
	},
	render : function() {
		var recordSet=this.state.contactSet.person.contactList;
		const columns = [
		{
			title: '类型',
			dataIndex: 'contType',
			key: 'contType',
			width: 160,
		},
		{
			title: '内容1',
			dataIndex: 'contData1',
			key: 'contData1',
			width: 300,
		},
		{
			title: '内容2',
			dataIndex: 'contData2',
			key: 'contData2',
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

		return (
			<div  className='resume-page'>
				<ServiceMsg ref='mxgBox' svcList={['contactList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateContactPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = ResumePage;
