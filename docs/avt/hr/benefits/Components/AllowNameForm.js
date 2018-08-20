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

var AllowanceStore = require('../../../../hr/allowance/data/AllowanceStore');
var AllowanceActions = require('../../../../hr/allowance/action/AllowanceActions');

var AllowNameForm = React.createClass({
	getInitialState : function() {
		return {
			allowanceSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
			allowance: {},
			allowName:'',
		}
	},

	mixins: [Reflux.listenTo(AllowanceStore, "onServiceComplete"), ModalForm('allowance')],
	onServiceComplete: function(data) {
	  if( data.operation === 'retrieve'){
		  this.setState({
			  loading: false,
			  allowanceSet: data
		  });
		  this.findList()
	  }
	},
	findList:function(){
		var recordSet = this.state.allowanceSet.recordSet;
		if(this.state.allowName!=""){
			recordSet.map((item,i)=>{
				if(this.state.allowName==item.allowName){
					this.setState({
					  loading: false,
					  allowance: item
				  	});
				}
				
			})
		}
	},
	// 第一次加载
	componentDidMount : function(){
		this.initPage(this.props.allowName)
	},
	componentWillReceiveProps:function(newProps){
         this.initPage( newProps.allowName );
    },
	
	initPage: function(allowName)
	{
		if(window.loginData.compUser){
			this.setState({loading: true,allowName: allowName});
			var corpUuid = window.loginData.compUser.corpUuid;
			AllowanceActions.initHrAllowance(corpUuid);
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
					<FormItem {...formItemLayout} label="补贴名称" colon={true} className={layoutItem} >
						<Input type="text" name="allowName" id="allowName" value={this.state.allowance.allowName } readOnly={true}  />
					</FormItem>
					<FormItem {...formItemLayout} label="补贴说明" colon={true} className={layoutItem} >
						<Input type="text" name="allowDesc" id="allowDesc" value={this.state.allowance.allowDesc } readOnly={true} />
					</FormItem>
					<FormItem {...formItemLayout} label="生效日期" colon={true} className={layoutItem} >
						<Input type="text" name="effectDate" id="effectDate" value={this.state.allowance.effectDate } readOnly={true} />
					</FormItem>
					<FormItem {...formItemLayout} label="交通补贴" colon={true} className={layoutItem} >
						<Input type="text" name="traffic" id="traffic" value={this.state.allowance.traffic } readOnly={true} />
					</FormItem>
					<FormItem {...formItemLayout} label="通讯补贴" colon={true} className={layoutItem}>
						<Input type="text" name="phone" id="phone" value={this.state.allowance.phone } readOnly={true}/>
					</FormItem>
					<FormItem {...formItemLayout} label="餐补"  colon={true} className={layoutItem} >
						<Input type="text" name="food" id="food" value={this.state.allowance.food } readOnly={true} />
					</FormItem>
					<FormItem {...formItemLayout} label="服装补贴" colon={true} className={layoutItem} >
						<Input type="text" name="clothing" id="clothing" value={this.state.allowance.clothing } readOnly={true} />
					</FormItem>
					<FormItem {...formItemLayout} label="高温补贴" colon={true} className={layoutItem} >
						<Input type="text" name="highTemp" id="highTemp" value={this.state.allowance.highTemp } readOnly={true} />
					</FormItem>
					<FormItem {...formItemLayout} label="户外补贴" colon={true} className={layoutItem} >
						<Input type="text" name="outDoor" id="outDoor" value={this.state.allowance.outDoor } readOnly={true}  />
					</FormItem>
				</Form>
		</div>
		);
	}
});

module.exports =  AllowNameForm;