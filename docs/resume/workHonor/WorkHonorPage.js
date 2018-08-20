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
import CreateWorkHonorPage from './Components/CreateWorkHonorPage';

var WorkHonorPage = React.createClass({
	getInitialState : function() {
		return {
			workHonorSet: {
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
			workHonorSet: data
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
	onClickUpdate:function(workHonor,event){
		if(workHonor != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(workHonor);
			}
		}
	},
	onClickDelete:function(workHonor,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+workHonor.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, workHonor)
		});
	},
	onClickDelete2 : function(workHonor){
		this.setState({loading: true});
		ResumeActions.delWorkHonor(workHonor.uuid);
	},
	render : function() {
		var recordSet=this.state.workHonorSet.person.workHonorList;

		const columns = [
      {
        title: '公司名称',
        dataIndex: 'memo2',
        key: 'memo2',
        width: 300,
      },
      {
        title: '荣誉名称',
        dataIndex: 'hoName',
        key: 'hoName',
        width: 160,
      },
      {
        title: '时间',
        dataIndex: 'beginDate',
        key: 'beginDate',
        width: 160,
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
				<ServiceMsg ref='mxgBox' svcList={['workHonorList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateWorkHonorPage ref="createWindow" />
			</div>
		);
  }
});

module.exports = WorkHonorPage;
