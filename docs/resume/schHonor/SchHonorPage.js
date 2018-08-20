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
import CreateSchHonorPage from './Components/CreateSchHonorPage';

var SchHonorPage = React.createClass({
	getInitialState : function() {
		return {
			schHonorSet: {
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
			schHonorSet: data
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
	onClickUpdate:function(schHonor,event){
		if(schHonor != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(schHonor);
			}
		}
	},
	onClickDelete:function(schHonor,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+schHonor.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, schHonor)
		});
	},
	onClickDelete2 : function(schHonor){
		this.setState({loading: true});
		ResumeActions.delHonor2(schHonor.uuid);
	},
	render : function() {
		var recordSet=this.state.schHonorSet.person.honor2List;
		const columns = [
		{
			title: '学校',
			dataIndex: 'schName',
			key: 'schName',
			width: 160,
		},
		,
		{
			title: '获得奖项',
			dataIndex: 'hoName',
			key: 'hoName',
			width: 300,
		},
		{
			title: '奖项级别',
			dataIndex: 'hoLevel',
			key: 'hoLevel',
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
			<div className='resume-page'>
				<ServiceMsg ref='mxgBox' svcList={['honor2List/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateSchHonorPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = SchHonorPage;
