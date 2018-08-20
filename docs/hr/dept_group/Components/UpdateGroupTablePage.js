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

var GroupTableStore = require('../data/GroupTableStore.js');
var GroupTableActions = require('../action/GroupTableActions');

var UpdateGroupTablePage = React.createClass({
	getInitialState : function() {
		return {
			groupSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			group: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(GroupTableStore, "onServiceComplete"), ModalForm('group')],
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
				  groupSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'groupName', desc:'机构名称', required: true, max: '128'},
			{id: 'groupCode', desc:'机构代码', required: false, max: '64'},
			{id: 'groupDesc', desc:'机构描述', required: false, max: '512'},
			{id: 'groupLoc', desc:'办公地址', required: false, max: '256'},
		];
	},
	
	initPage: function(group)
	{
		this.state.hints = {};
		Utils.copyValue(group, this.state.group);
		
		this.state.loading = false;
		this.state.groupSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.group)){
			this.state.groupSet.operation = '';
			this.setState({loading: true});
			GroupTableActions.updateHrDeptGroup( this.state.group );
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
			<Modal visible={this.state.modal} width='540px' title="修改事业群信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_dept_group/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="机构名称" required={true} colon={true} className={layoutItem} help={hints.groupNameHint} validateStatus={hints.groupNameStatus}>
						<Input type="text" name="groupName" id="groupName" value={this.state.group.groupName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="机构代码" required={false} colon={true} className={layoutItem} help={hints.groupCodeHint} validateStatus={hints.groupCodeStatus}>
						<Input type="text" name="groupCode" id="groupCode" value={this.state.group.groupCode } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="机构描述" required={false} colon={true} className={layoutItem} help={hints.groupDescHint} validateStatus={hints.groupDescStatus}>
						<Input type="text" name="groupDesc" id="groupDesc" value={this.state.group.groupDesc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="办公地址" required={false} colon={true} className={layoutItem} help={hints.groupLocHint} validateStatus={hints.groupLocStatus}>
						<Input type="text" name="groupLoc" id="groupLoc" value={this.state.group.groupLoc } onChange={this.handleOnChange} />
					</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default UpdateGroupTablePage;