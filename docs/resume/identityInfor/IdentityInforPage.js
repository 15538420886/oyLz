'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import Context from '../resumeContext';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal} from 'antd';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
import ServiceMsg from '../../lib/Components/ServiceMsg';
var ResumeStore = require('../resume/data/ResumeStore');
var ResumeActions = require('../resume/action/ResumeActions');
import CreateIdentityPage from './Components/CreateIdentityPage';

var IdentityInforPage = React.createClass({
	getInitialState : function() {
		return {
			identitySet: {
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
			identitySet: data
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
	onClickUpdate:function(identity,event){
		if(identity != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(identity);
			}
		}
	},
	onClickDelete:function(identity,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+identity.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, identity)
		});
	},
	onClickDelete2 : function(identity){
		this.setState({loading: true});
		ResumeActions.delIdentity(identity.uuid);
	},
	render : function() {
		var recordSet=this.state.identitySet.person.identityList;
		const columns = [
      {
        title: '类型',
        dataIndex: 'idType',
        key: 'idType',
        width: 160,
		render: (text, record) => (Utils.getOptionName('简历系统', '身份信息', record.idType, false, this)),
      },
      {
        title: '内容1',
        dataIndex: 'idData1',
        key: 'idData1',
        width: 300,
      },
      {
        title: '内容2',
        dataIndex: 'idData2',
        key: 'idData2',
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
				<ServiceMsg ref='mxgBox' svcList={['identityList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateIdentityPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = IdentityInforPage;
