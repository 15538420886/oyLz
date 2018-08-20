import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import DictRadio from '../../../lib/Components/DictRadio';

var RolesStore = require('../data/RolesStore.js');
var RolesActions = require('../action/RolesActions');

var UpdateRolesPage = React.createClass({
	getInitialState : function() {
		return {
			rolesSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			roles: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(RolesStore, "onServiceComplete"), ModalForm('roles')],
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
				  rolesSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
        	{id: 'roleName', desc:'业务角色', required: true, max: '32'},
        	{id: 'roleDesc', desc:'角色描述', required: true, max: '256'},
        	{id: 'roleStatus', desc:'有效标志', required: true, max: '1'},
		];
	},

	initPage: function(roles)
	{
		this.state.hints = {};
		Utils.copyValue(roles, this.state.roles);

		this.state.loading = false;
		this.state.rolesSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.roles)){
			this.state.rolesSet.operation = '';
			this.setState({loading: true});
			RolesActions.updateAuthAppRoleGroup( this.state.roles );
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
			<Modal visible={this.state.modal} width='540px' title="修改角数组信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['auth-app-role-group/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                	<FormItem {...formItemLayout} label="业务角色" required={true} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                		<Input type="text" name="roleName" id="roleName" value={this.state.roles.roleName } onChange={this.handleOnChange} />
                	</FormItem>
                	<FormItem {...formItemLayout} label="角色描述" required={false} colon={true} className={layoutItem} help={hints.roleDescHint} validateStatus={hints.roleDescStatus}>
                		<Input type="text" name="roleDesc" id="roleDesc" value={this.state.roles.roleDesc } onChange={this.handleOnChange} />
                	</FormItem>
                	<FormItem {...formItemLayout} label="有效标志" required={false} colon={true} className={layoutItem} help={hints.roleStatusHint} validateStatus={hints.roleStatusStatus}>
                		<DictRadio name="roleStatus" id="roleStatus" value={this.state.roles.roleStatus} appName='common' optName='启用状态' onChange={this.onRadioChange}/>
                	</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateRolesPage;
