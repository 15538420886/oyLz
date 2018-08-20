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
import CreateHonorPage from './Components/CreateHonorPage';

var EduHonorPage = React.createClass({
	getInitialState : function() {
		return {
			honorSet: {
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
			honorSet: data
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
	onClickUpdate:function(honor,event){
		if(honor != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(honor);
			}
		}
	},
	onClickDelete:function(honor,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+honor.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, honor)
		});
	},
	onClickDelete2 : function(honor){
		this.setState({loading: true});
		ResumeActions.delHonor(honor.uuid);
	},
	render : function() {
		var recordSet=this.state.honorSet.person.honorList;

		const columns = [
		{
			title: '学校',
			dataIndex: 'schName',
			key: 'schName',
			width: 160,
		},
		{
			title: '奖学金',
			dataIndex: 'hoLevel',
			key: 'hoLevel',
			width: 300,
		},
		{
			title: '等级',
			dataIndex: 'hoLevel2',
			key: 'hoLevel2',
			width: 300,
		},
		{
			title: '时间',
			dataIndex: 'endDate',
			key: 'endDate',
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
				<ServiceMsg ref='mxgBox' svcList={['honorList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateHonorPage ref="createWindow" />
			</div>
		);
  }
});

module.exports = EduHonorPage;
