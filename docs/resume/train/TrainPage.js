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
import CreateTrainPage from './Components/CreateTrainPage';

var TrainPage = React.createClass({
	getInitialState : function() {
		return {
			trainSet: {
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
			trainSet: data
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
	onClickUpdate:function(train,event){
		if(train != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(train);
			}
		}
	},
	onClickDelete:function(train,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+train.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, train)
		});
	},
	onClickDelete2 : function(train){
		this.setState({loading: true});
		ResumeActions.delTrain(train.uuid);
	},
	render : function() {
		var recordSet=this.state.trainSet.person.trainList;

		const columns = [
		{
			title: '培训结构',
			dataIndex: 'trainComp',
			key: 'trainComp',
			width: 120,
		},
		{
			title: '培训时间',
			dataIndex: 'beginDate',
			key: 'beginDate',
			width: 90,
		},
		{
			title: '培训课程',
			dataIndex: 'trainCourse',
			key: 'trainCourse',
			width: 300,
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
				<ServiceMsg ref='mxgBox' svcList={['trainList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateTrainPage ref="createWindow" />
			</div>
		);
  }
});

module.exports = TrainPage;
