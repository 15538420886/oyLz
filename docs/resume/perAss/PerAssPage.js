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
import CreateReviewPage from './Components/CreateReviewPage';

var PerAssPage = React.createClass({
	getInitialState : function() {
		return {
			reviewSet: {
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
			reviewSet: data
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
	onClickUpdate:function(review,event){
		if(review != null){
			if(typeof(this.refs.createWindow) != 'undefined'){
				this.refs.createWindow.initPage(review);
			}
		}
	},
	onClickDelete:function(review,event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的记录 【'+review.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, review)
		});
	},
	onClickDelete2 : function(review){
		this.setState({loading: true});
		ResumeActions.delReview(review.uuid);
	},
	render : function() {
		var recordSet=this.state.reviewSet.person.reviewList;
    const columns = [
      {
        title: '标题',
        dataIndex: 'reName',
        key: 'reName',
        width: 100,
        render: (text, record) => (Utils.getOptionName('简历系统', '个人评价', record.reName, false, this)),
      },
      {
        title: '描述',
        dataIndex: 'review',
        key: 'review',
        width: 600,
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
				<ServiceMsg ref='mxgBox' svcList={['reviewList/remove']}/>
				<div className='resume-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
				</div>
                <CreateReviewPage ref="createWindow" />
			</div>
		);
	}
});

module.exports = PerAssPage;
