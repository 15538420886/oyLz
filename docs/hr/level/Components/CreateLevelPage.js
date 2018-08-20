﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var LevelStore = require('../data/LevelStore.js');
var LevelActions = require('../action/LevelActions');

var CreateLevelPage = React.createClass({
	getInitialState : function() {
		return {
			LevelSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			Level: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(LevelStore, "onServiceComplete"), ModalForm('Level')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	              loading: false,
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              LevelSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'lvlCode', desc:'级别编号', required: true, max: 64},
            { id: 'lvlName', desc: '级别名称', required: true, max: '64'},
			{id: 'lvlSalary', desc:'平均薪水', required: false, max: '1024'},
			{id: 'lvlRatio', desc:'员工比例', required: false, max: '64'},
			{id: 'unitTime', desc:'结算单位', required: false, max: '32'},
			{id: 'unitPrice', desc:'结算单价', required: false, max: '32'},
			{id: 'unitCost', desc:'平均成本', required: false, max: '32'},
			{id: 'lvlDesc', desc:'级别说明', required: false, max: '1024'},
		];
	},
	
	clear : function(corpUuid){
		this.state.hints = {};
		this.state.Level.uuid='';
		this.state.Level.corpUuid = corpUuid;
		this.state.Level.lvlCode='';
		this.state.Level.lvlName='';
		this.state.Level.lvlSalary='';
		this.state.Level.lvlRatio='';
		this.state.Level.unitTime='';
		this.state.Level.unitPrice='';
		this.state.Level.unitCost='';
		this.state.Level.lvlDesc='';
		
		this.state.loading = false;
	    this.state.LevelSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.Level)){
			this.state.LevelSet.operation = '';
			this.setState({loading: true});
			LevelActions.createHrLevel( this.state.Level );
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
			<Modal visible={this.state.modal} width='540px' title="增加管理" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-level/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <FormItem {...formItemLayout} label="级别编号" required={true} colon={true} className={layoutItem} help={hints.lvlCodeHint} validateStatus={hints.lvlCodeStatus}>
						<Input type="text" name="lvlCode" id="lvlCode" value={this.state.Level.lvlCode} onChange={this.handleOnChange}/>
					</FormItem>
                    <FormItem {...formItemLayout} label="级别名称" required={true} colon={true} className={layoutItem} help={hints.lvlNameHint} validateStatus={hints.lvlNameStatus}>
						<Input type="text" name="lvlName" id="lvlName" value={this.state.Level.lvlName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="平均薪水" colon={true} className={layoutItem} help={hints.lvlSalaryHint} validateStatus={hints.lvlSalaryStatus}>
						<Input type="text" name="lvlSalary" id="lvlSalary" value={this.state.Level.lvlSalary} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="员工比例" colon={true} className={layoutItem} help={hints.lvlRatioHint} validateStatus={hints.lvlRatioStatus}>
						<Input type="text" name="lvlRatio" id="lvlRatio" value={this.state.Level.lvlRatio} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="结算单位" colon={true} className={layoutItem} help={hints.unitTimeHint} validateStatus={hints.unitTimeStatus}>
						<Input type="text" name="unitTime" id="unitTime" value={this.state.Level.unitTime} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="结算单价" colon={true} className={layoutItem} help={hints.unitPriceHint} validateStatus={hints.unitPriceStatus}>
						<Input type="text" name="unitPrice" id="unitPrice" value={this.state.Level.unitPrice} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="平均成本" colon={true} className={layoutItem} help={hints.unitCostHint} validateStatus={hints.unitCostStatus}>
						<Input type="text" name="unitCost" id="unitCost" value={this.state.Level.unitCost} onChange={this.handleOnChange}/>
					</FormItem>
					 <FormItem {...formItemLayout} label="级别说明" colon={true} className={layoutItem} help={hints.lvlDescHint} validateStatus={hints.lvlDescStatus}>
						<Input type="textarea" name="lvlDesc" id="lvlDesc" value={this.state.Level.lvlDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateLevelPage;

