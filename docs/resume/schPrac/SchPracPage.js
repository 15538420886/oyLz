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
import CreateSchPracPage from './Components/CreateSchPracPage';

var SchPracPage = React.createClass({
	getInitialState : function() {
		return {
			schPracSet: {
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
			schPracSet: data
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
	onClickUpdate:function(schPrac,event){
		if(schPrac != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(schPrac);
			}
		}
	},
	onClickDelete:function(schPrac,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+schPrac.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, schPrac)
		});
	},
	onClickDelete2 : function(schPrac){
		this.setState({loading: true});
		ResumeActions.delPrac(schPrac.uuid);
	},
	render : function() {
		var recordSet=this.state.schPracSet.person.pracList;
		const columns = [
      {
        title: '时间',
        dataIndex: 'endDate',
        key: 'endDate',
        width: 90,
      },
      {
        title: '实践名称',
        dataIndex: 'pracName',
        key: 'pracName',
        width: 450,
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
				<ServiceMsg ref='mxgBox' svcList={['pracList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateSchPracPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = SchPracPage;
