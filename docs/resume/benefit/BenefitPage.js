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
import CreateBenefitPage from './Components/CreateBenefitPage';

var BenefitPage = React.createClass({
	getInitialState : function() {
		return {
			benefitSet: {
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
			benefitSet: data
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
	onClickUpdate:function(benefit,event){
		if(benefit != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(benefit);
			}
		}
	},
	onClickDelete:function(benefit,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+benefit.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, benefit)
		});
	},
	onClickDelete2 : function(benefit){
		this.setState({loading: true});
		ResumeActions.delBenefit(benefit.uuid);
	},
	render : function() {
		var recordSet=this.state.benefitSet.person.benefitList;
		const columns = [
		{
			title: '组织名称',
			dataIndex: 'orgName',
			key: 'orgName',
			width: 140,
		},
		{
			title: '承担角色',
			dataIndex: 'orgRole',
			key: 'orgRole',
			width: 140,
		},
		{
			title: '时间',
			dataIndex: 'beginDate',
			key: 'beginDate',
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
				<ServiceMsg ref='mxgBox' svcList={['benefitList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateBenefitPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = BenefitPage;
