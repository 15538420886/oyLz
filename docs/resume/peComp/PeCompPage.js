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
import CreatePeCompPage from './Components/CreatePeCompPage';

var PeCompPage = React.createClass({
	getInitialState : function() {
		return {
			peCompSet: {
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
			peCompSet: data
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
	onClickUpdate:function(peComp,event){
		if(peComp != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(peComp);
			}
		}
	},
	onClickDelete:function(peComp,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+peComp.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, peComp)
		});
	},
	onClickDelete2 : function(peComp){
		this.setState({loading: true});
		ResumeActions.delPeComp(peComp.uuid);
	},
	render : function() {
		var recordSet=this.state.peCompSet.person.peCompList;

		const columns = [
      {
        title: '公司名称',
        dataIndex: 'compName',
        key: 'compName',
        width: 320,
      },
      {
        title: '时间',
        dataIndex: 'beginDate',
        key: 'beginDate',
        width: 160,
		render: (text, record) => (record.beginDate+ ' ~ ' +record.endDate),
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
				<ServiceMsg ref='mxgBox' svcList={['peCompList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreatePeCompPage ref="createWindow" />
			</div>
		);
  }
});

module.exports = PeCompPage;
