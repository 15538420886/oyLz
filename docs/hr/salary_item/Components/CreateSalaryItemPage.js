﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var SalaryItemStore = require('../data/SalaryItemStore.js');
var SalaryItemActions = require('../action/SalaryItemActions');

var CreateSalaryItemPage = React.createClass({
	getInitialState : function() {
		return {
			salaryItemSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			salaryItem: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(SalaryItemStore, "onServiceComplete"), ModalForm('salaryItem')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
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
	              salaryItemSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'groupName', desc:'分类名称', required: true, max: '64'},
			{id: 'itemIndex', desc:'序号', required: true, max: '4'},
			{id: 'itemCode', desc:'代码', required: true, max: '64'},
			{id: 'itemName', desc:'名称', required: true, max: '64'},
			{id: 'itemDesc', desc:'说明', required: false, max: '256'},
		];
	},
	
	clear : function(corpUuid){
		this.state.hints = {};
		this.state.salaryItem.uuid='';
		this.state.salaryItem.corpUuid = corpUuid;
		
		this.state.salaryItem.groupName='';
		this.state.salaryItem.itemIndex='';
		this.state.salaryItem.itemCode='';
		this.state.salaryItem.itemName='';
		this.state.salaryItem.itemDesc='';
		
		this.state.loading = false;
	    this.state.salaryItemSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.salaryItem)){
			this.state.salaryItemSet.operation = '';
			this.setState({loading: true});
			SalaryItemActions.createHrSalaryItem( this.state.salaryItem );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加工资单参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-salary-item/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
		   			<FormItem {...formItemLayout} label="分类名称" required={true} colon={true} className={layoutItem} help={hints.groupNameHint} validateStatus={hints.groupNameStatus}>
						<Input type="text" name="groupName" id="groupName" value={this.state.salaryItem.groupName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="序号" required={true} colon={true} className={layoutItem} help={hints.itemIndexHint} validateStatus={hints.itemIndexStatus}>
						<Input type="text" name="itemIndex" id="itemIndex" value={this.state.salaryItem.itemIndex} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="代码" required={true} colon={true} className={layoutItem} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
						<Input type="text" name="itemCode" id="itemCode" value={this.state.salaryItem.itemCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="名称" required={true} colon={true} className={layoutItem} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
						<Input type="text" name="itemName" id="itemName" value={this.state.salaryItem.itemName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="说明" colon={true} className={layoutItem} help={hints.itemDescHint} validateStatus={hints.itemDescStatus}>
						<Input type="textarea" name="itemDesc" id="itemDesc" value={this.state.salaryItem.itemDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateSalaryItemPage;

