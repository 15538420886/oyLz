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

var WorkFactorStore = require('../data/WorkFactorStore.js');
var WorkFactorActions = require('../action/WorkFactorActions');

var UpdateWorkFactorPage = React.createClass({
	getInitialState : function() {
		return {
			workFactorSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			workFactor: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(WorkFactorStore, "onServiceComplete"), ModalForm('workFactor')],
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
				  workFactorSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'kpiName', desc:'指标名称', required: false, max: '64'},
			{id: 'kpiWeight', desc:'指标权重', required: false, max: '64'},
			{id: 'kpiValues', desc:'指标选值', required: false, max: '1024'},
			{id: 'kpiDesc', desc:'指标说明', required: false, max: '1024'},
		];
	},
	
	initPage: function(workFactor)
	{
		this.state.hints = {};
		Utils.copyValue(workFactor, this.state.workFactor);
		
		this.state.loading = false;
		this.state.workFactorSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.workFactor)){
			this.state.workFactorSet.operation = '';
			this.setState({loading: true});
			WorkFactorActions.updateHrWorkFactor( this.state.workFactor );
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
			<Modal visible={this.state.modal} width='540px' title="修改管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-work-factor/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="指标名称" colon={true} className={layoutItem} help={hints.kpiNameHint} validateStatus={hints.kpiNameStatus}>
						<Input type="text" name="kpiName" id="kpiName" value={this.state.workFactor.kpiName} onChange={this.handleOnChange}/>
					</FormItem>

					<FormItem {...formItemLayout} label="指标权重" colon={true} className={layoutItem} help={hints.kpiWeightHint} validateStatus={hints.kpiWeightStatus}>
						<Input type="text" name="kpiWeight" id="kpiWeight" value={this.state.workFactor.kpiWeight} onChange={this.handleOnChange}/>
					</FormItem>

					<FormItem {...formItemLayout} label="指标选值" colon={true} className={layoutItem} help={hints.kpiValuesHint} validateStatus={hints.kpiValuesStatus}>
						<Input type="text" name="kpiValues" id="kpiValues" value={this.state.workFactor.kpiValues} onChange={this.handleOnChange}/>
					</FormItem>

					<FormItem {...formItemLayout} label="指标说明" colon={true} className={layoutItem} help={hints.kpiDescHint} validateStatus={hints.kpiDescStatus}>
						<Input type="textarea" name="kpiDesc" id="kpiDesc" value={this.state.workFactor.kpiDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateWorkFactorPage;

