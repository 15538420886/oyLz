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
import CreateIntroPage from './Components/CreateIntroPage';

var PerIntroPage = React.createClass({
	getInitialState : function() {
		return {
			introSet: {
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
			introSet: data
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
	onClickUpdate:function(intro,event){
		if(intro != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(intro);
			}
		}
	},
	onClickDelete:function(intro,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+intro.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, intro)
		});
	},
	onClickDelete2 : function(intro){
		this.setState({loading: true});
		ResumeActions.delIntro(intro.uuid);
	},
	render : function() {
		var recordSet=this.state.introSet.person.introList;

		const columns = [
		{
			title: '标题',
			dataIndex: 'introName',
			key: 'introName',
			width: 160,
		},
		{
			title: '描述',
			dataIndex: 'intro',
			key: 'intro',
			width: 300,
		},
		{
			title: '',
			key: 'action',
			width: 70,
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
				<ServiceMsg ref='mxgBox' svcList={['introList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateIntroPage ref="createWindow" />
			</div>
		);
  }
});

module.exports = PerIntroPage;
