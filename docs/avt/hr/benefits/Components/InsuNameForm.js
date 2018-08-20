import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Validator = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var InsuranceStore = require('../../../../hr/insurance/data/InsuranceStore');
var InsuranceActions = require('../../../../hr/insurance/action/InsuranceActions');

var InsuNameForm = React.createClass({
	getInitialState : function() {
		return {
			insuranceSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
			insurance: {},
			insuName:'',
		}
	},

	mixins: [Reflux.listenTo(InsuranceStore, "onServiceComplete"), ModalForm('insurance')],
	onServiceComplete: function(data) {
	  if( data.operation === 'get-by-corp_uuid'){
		  this.setState({
			  loading: false,
			  insuranceSet: data
		  });
		  this.findList()
	  }
	},
	findList:function(){
		var recordSet = this.state.insuranceSet.recordSet;
		if(this.state.insuName!=""){
			recordSet.map((item,i)=>{
				if(this.state.insuName==item.insuName){
					this.setState({
					  loading: false,
					  insurance: item
				  	});
				}
				
			})
		}
	},
	// 第一次加载
	componentDidMount : function(){
		this.initPage(this.props.insuName)
	},
	componentWillReceiveProps:function(newProps){
         this.initPage( newProps.insuName );
    },
	
	initPage: function(insuName)
	{
		if(window.loginData.compUser){
			this.setState({loading: true,insuName: insuName});
			var corpUuid = window.loginData.compUser.corpUuid;
			InsuranceActions.initHrInsurance(corpUuid);
		}
		
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};
		
		return (
			<div style={{padding: '10px 24px 30px 24px',width:"100%", maxWidth:"600px"}}>
	   		<Form layout={layout}>
				<FormItem {...formItemLayout} label="社保名称" colon={true} className={layoutItem} >
					<Input type="text" name="insuName" id="insuName" value={this.state.insurance.insuName} readOnly={true} />
				</FormItem>
				<FormItem {...formItemLayout} label="医疗保险" colon={true} className={layoutItem} >
					<Input type="text" name="health" id="health" value={this.state.insurance.health} readOnly={true} />
				</FormItem>
				<FormItem {...formItemLayout} label="养老保险" colon={true} className={layoutItem} >
					<Input type="text" name="pension" id="pension" value={this.state.insurance.pension} readOnly={true} />
				</FormItem>
				<FormItem {...formItemLayout} label="生育保险" colon={true} className={layoutItem} >
					<Input type="text" name="maternity" id="maternity" value={this.state.insurance.maternity} readOnly={true}/>
				</FormItem>
				<FormItem {...formItemLayout} label="工伤保险" colon={true} className={layoutItem} >
					<Input type="text" name="injury" id="injury" value={this.state.insurance.injury} readOnly={true} />
				</FormItem>
				<FormItem {...formItemLayout} label="失业保险" colon={true} className={layoutItem} >
					<Input type="text" name="jobless" id="jobless" value={this.state.insurance.jobless} readOnly={true} />
				</FormItem>
				<FormItem {...formItemLayout} label="公积金" colon={true} className={layoutItem} >
					<Input type="text" name="accumulation" id="accumulation" value={this.state.insurance.accumulation} readOnly={true} />
				</FormItem>
				<FormItem {...formItemLayout} label="生效日期" colon={true} className={layoutItem} >
					<Input type="text" name="effectDate" id="effectDate" value={this.state.insurance.effectDate} readOnly={true} />
				</FormItem>
			</Form>
		</div>
		);
	}
});

module.exports =  InsuNameForm;