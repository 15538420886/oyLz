﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select , DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var InsuranceStore = require('../data/InsuranceStore.js');
var InsuranceActions = require('../action/InsuranceActions');

var UpdateInsurancePage = React.createClass({
	getInitialState : function() {
		return {
			insuranceSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			insurance: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(InsuranceStore, "onServiceComplete"), ModalForm('insurance')],
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
				  insuranceSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
		];
	},
	
	initPage: function(insurance)
	{
		this.state.hints = {};
		Utils.copyValue(insurance, this.state.insurance);
		
		this.state.loading = false;
		this.state.insuranceSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.insurance)){
			this.state.insuranceSet.operation = '';
			this.setState({loading: true});
			InsuranceActions.updateHrInsurance( this.state.insurance );
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
			<Modal visible={this.state.modal} width='540px' title="修改社保管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_insurance/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="社保名称" required={true} colon={true} className={layoutItem} help={hints.insuNameHint} validateStatus={hints.insuNameStatus}>
						<Input type="text" name="insuName" id="insuName" value={this.state.insurance.insuName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="医疗保险" colon={true} className={layoutItem} help={hints.healthHint} validateStatus={hints.healthStatus}>
						<Input type="text" name="health" id="health" value={this.state.insurance.health} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="养老保险" colon={true} className={layoutItem} help={hints.pensionHint} validateStatus={hints.pensionStatus}>
						<Input type="text" name="pension" id="pension" value={this.state.insurance.pension} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="生育保险" colon={true} className={layoutItem} help={hints.maternityHint} validateStatus={hints.maternityStatus}>
						<Input type="text" name="maternity" id="maternity" value={this.state.insurance.maternity} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工伤保险" colon={true} className={layoutItem} help={hints.injuryHint} validateStatus={hints.injuryStatus}>
						<Input type="text" name="injury" id="injury" value={this.state.insurance.injury} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="失业保险" colon={true} className={layoutItem} help={hints.joblessHint} validateStatus={hints.joblessStatus}>
						<Input type="text" name="jobless" id="jobless" value={this.state.insurance.jobless} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="公积金" colon={true} className={layoutItem} help={hints.accumulationHint} validateStatus={hints.accumulationStatus}>
						<Input type="text" name="accumulation" id="accumulation" value={this.state.insurance.accumulation} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="生效日期" colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
						<DatePicker style={{ width: '100%' }} name="effectDate" id="effectDate" value={this.formatDate(this.state.insurance.effectDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "effectDate", Common.dateFormat)} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateInsurancePage;

