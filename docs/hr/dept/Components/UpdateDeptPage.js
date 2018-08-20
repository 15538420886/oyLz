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

var DeptStore = require('../data/DeptStore.js');
var DeptActions = require('../action/DeptActions');

var UpdateDeptPage = React.createClass({
	getInitialState : function() {
		return {
			deptSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			dept: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(DeptStore, "onServiceComplete"), ModalForm('dept')],
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
				  deptSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'deptName', desc:'机构名称', required: true, max: '128'},
			{id: 'deptCode', desc:'机构代码', required: false, max: '64'},
			{id: 'deptDesc', desc:'机构描述', required: false, max: '512'},
			{id: 'deptLoc', desc:'办公地址', required: false, max: '256'},
		];
	},
	
	initPage: function(dept)
	{
		this.state.hints = {};
		Utils.copyValue(dept, this.state.dept);
		
		this.state.loading = false;
		this.state.deptSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.dept)){
			this.state.deptSet.operation = '';
			this.setState({loading: true});
			DeptActions.updateHrDept( this.state.dept );
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
			<Modal visible={this.state.modal} width='540px' title="修改部门信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_dept/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="机构名称" required={true} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
						<Input type="text" name="deptName" id="deptName" value={this.state.dept.deptName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="机构代码" required={false} colon={true} className={layoutItem} help={hints.deptCodeHint} validateStatus={hints.deptCodeStatus}>
						<Input type="text" name="deptCode" id="deptCode" value={this.state.dept.deptCode } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="机构描述" required={false} colon={true} className={layoutItem} help={hints.deptDescHint} validateStatus={hints.deptDescStatus}>
						<Input type="text" name="deptDesc" id="deptDesc" value={this.state.dept.deptDesc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="办公地址" required={false} colon={true} className={layoutItem} help={hints.deptLocHint} validateStatus={hints.deptLocStatus}>
						<Input type="text" name="deptLoc" id="deptLoc" value={this.state.dept.deptLoc } onChange={this.handleOnChange} />
					</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default UpdateDeptPage;

