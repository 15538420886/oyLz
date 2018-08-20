﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var UserGroupStore = require('../data/UserGroupStore.js');
var UserGroupActions = require('../action/UserGroupActions');

var UpdateUserGroupPage = React.createClass({
	getInitialState : function() {
		return {
			userGroupSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			userGroup: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(UserGroupStore, "onServiceComplete"), ModalForm('userGroup')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.setState({
				  modal: false
			  });
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  userGroupSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'groupName', desc:'组名称', required: true, max: '24'},
	        {id: 'groupDesc', desc:'组描述', required: false, max: '512'},
		];
	},
	
	initPage: function(userGroup)
	{
		this.state.hints = {};
		Utils.copyValue(userGroup, this.state.userGroup);
		
		this.state.loading = false;
		this.state.userGroupSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.userGroup)){
			this.state.userGroupSet.operation = '';
			this.setState({loading: true});
			UserGroupActions.updateUserGroup( this.state.userGroup );
		}
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改用户组信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['user-group/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="组名称" colon={true} className={layoutItem} help={hints.groupNameHint} validateStatus={hints.groupNameStatus}>
						<Input type="text" name="groupName" id="groupName" value={this.state.userGroup.groupName} onChange={this.handleOnChange}/>
					</FormItem>
                    <FormItem {...formItemLayout} label="组说明" colon={true} className={layoutItem} help={hints.groupDescHint} validateStatus={hints.groupDescStatus}>
						<Input type="textarea" name="groupDesc" id="groupDesc" value={this.state.userGroup.groupDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateUserGroupPage;

