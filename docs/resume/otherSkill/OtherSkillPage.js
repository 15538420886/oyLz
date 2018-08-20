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
import CreateOtherSkillPage from './Components/CreateOtherSkillPage';

var OtherSkillPage = React.createClass({
	getInitialState : function() {
		return {
			otherSkillSet: {
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
			otherSkillSet: data
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
	onClickUpdate:function(otherSkill,event){
		if(otherSkill != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(otherSkill);
			}
		}
	},
	onClickDelete:function(otherSkill,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+otherSkill.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, otherSkill)
		});
	},
	onClickDelete2 : function(otherSkill){
		this.setState({loading: true});
		ResumeActions.delOtherSkill(otherSkill.uuid);
	},
	render : function() {
		var recordSet=this.state.otherSkillSet.person.otherSkillList;
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
				<ServiceMsg ref='mxgBox' svcList={['otherSkillList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateOtherSkillPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = OtherSkillPage;
