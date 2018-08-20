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
import CreateTechSkillPage from './Components/CreateTechSkillPage';

var TechSkillPage = React.createClass({
	getInitialState : function() {
		return {
			techSkillSet: {
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
			techSkillSet: data
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
	onClickUpdate:function(techSkill,event){
		if(techSkill != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(techSkill);
			}
		}
	},
	onClickDelete:function(techSkill,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+techSkill.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, techSkill)
		});
	},
	onClickDelete2 : function(techSkill){
		this.setState({loading: true});
		ResumeActions.delTechSkill(techSkill.uuid);
	},
	render : function() {
		var recordSet=this.state.techSkillSet.person.techSkillList;
		const columns = [
		{
		    title: '技能名称',
		    dataIndex: 'skName',
		    key: 'skName',
		    width: 140,
        },
       {
		    title: '熟练程度',
		    dataIndex: 'skLevel',
		    key: 'skLevel',
		    width: 140,
        },
       {
		    title: '使用时长',
		    dataIndex: 'skTime',
		    key: 'skTime',
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
				<ServiceMsg ref='mxgBox' svcList={['techSkillList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateTechSkillPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = TechSkillPage;
