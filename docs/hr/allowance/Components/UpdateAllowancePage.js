﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
import { Form, Modal, Button, Input, Select ,DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var AllowanceStore = require('../data/AllowanceStore.js');
var AllowanceActions = require('../action/AllowanceActions');

var UpdateAllowancePage = React.createClass({
	getInitialState : function() {
		return {
			allowanceSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			allowance: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(AllowanceStore, "onServiceComplete"), ModalForm('allowance')],
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
				  allowanceSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'allowName', desc:'补贴名称', required: true, max: '64'},
			{id: 'allowDesc', desc:'补贴说明', required: false, max: '1024'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'traffic', desc:'交通补贴', required: false, max: '16'},
			{id: 'phone', desc:'通讯补贴', required: false, max: '16'},
			{id: 'food', desc:'餐补', required: false, max: '16'},
			{id: 'clothing', desc:'服装补贴', required: false, max: '16'},
			{id: 'highTemp', desc:'高温补贴', required: false, max: '16'},
			{id: 'outDoor', desc:'户外补贴', required: false, max: '16'},
		];
	},
	
	initPage: function(allowance)
	{
		this.state.hints = {};
		Utils.copyValue(allowance, this.state.allowance);
		
		this.state.loading = false;
		this.state.allowanceSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.allowance)){
			this.state.allowanceSet.operation = '';
			this.setState({loading: true});
			AllowanceActions.updateHrAllowance( this.state.allowance );
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
			<Modal visible={this.state.modal} width='540px' title="修改补贴级别信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_allowance/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="补贴名称" required={true} colon={true} className={layoutItem} help={hints.allowNameHint} validateStatus={hints.allowNameStatus}>
						<Input type="text" name="allowName" id="allowName" value={this.state.allowance.allowName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="补贴说明" colon={true} className={layoutItem} help={hints.allowDescHint} validateStatus={hints.allowDescStatus}>
						<Input type="text" name="allowDesc" id="allowDesc" value={this.state.allowance.allowDesc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="生效日期" colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
						<DatePicker style={{ width: '100%' }} name="effectDate" id="effectDate" value={this.formatDate(this.state.allowance.effectDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "effectDate", Common.dateFormat)} />
					</FormItem>
					<FormItem {...formItemLayout} label="交通补贴" colon={true} className={layoutItem} help={hints.trafficHint} validateStatus={hints.trafficStatus}>
						<Input type="text" name="traffic" id="traffic" value={this.state.allowance.traffic } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="通讯补贴" colon={true} className={layoutItem} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
						<Input type="text" name="phone" id="phone" value={this.state.allowance.phone } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="餐补"  colon={true} className={layoutItem} help={hints.foodHint} validateStatus={hints.foodStatus}>
						<Input type="text" name="food" id="food" value={this.state.allowance.food } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="服装补贴" colon={true} className={layoutItem} help={hints.clothingHint} validateStatus={hints.clothingStatus}>
						<Input type="text" name="clothing" id="clothing" value={this.state.allowance.clothing } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="高温补贴" colon={true} className={layoutItem} help={hints.highTempHint} validateStatus={hints.highTempStatus}>
						<Input type="text" name="highTemp" id="highTemp" value={this.state.allowance.highTemp } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="户外补贴" colon={true} className={layoutItem} help={hints.outDoorHint} validateStatus={hints.outDoorStatus}>
						<Input type="text" name="outDoor" id="outDoor" value={this.state.allowance.outDoor } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateAllowancePage;

