import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var OperatStore = require('../data/OperatStore.js');
var OperatActions = require('../action/OperatActions');

var CreateOperatPage = React.createClass({
	getInitialState : function() {
		return {
			operatSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			operat: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(OperatStore, "onServiceComplete"), ModalForm('operat')],
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
	              operatSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'opName', desc:'操作名称', required: true, max: '64'},
			{id: 'svcName', desc:'接口名称', required: true, max: '128'},
			{id: 'svcParam', desc:'请求参数', required: false, max: '1024'},
			{id: 'opDesc', desc:'用途', required: false, max: '256'},
		];
	},
	
	clear : function(appUuid){
		this.state.hints = {};
		this.state.operat.appUuid=appUuid;
		this.state.operat.opName='';
		this.state.operat.svcName='';
		this.state.operat.svcParam='';
		this.state.operat.opDesc='';
		
		this.state.loading = false;
	    this.state.operatSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.operat)){
			this.state.operatSet.operation = '';
			this.setState({loading: true});
			OperatActions.createEnvAppOp( this.state.operat );
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
			<Modal visible={this.state.modal} width='540px' title="增加操作" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['env-app-op/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="操作名称" required={true} colon={true} className={layoutItem} help={hints.opNameHint} validateStatus={hints.opNameStatus}>
						<Input type="text" name="opName" id="opName" value={this.state.operat.opName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="接口名称" required={true} colon={true} className={layoutItem} help={hints.svcNameHint} validateStatus={hints.svcNameStatus}>
						<Input type="text" name="svcName" id="svcName" value={this.state.operat.svcName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="请求参数" required={false} colon={true} className={layoutItem} help={hints.svcParamHint} validateStatus={hints.svcParamStatus}>
						<Input type="textarea" name="svcParam" id="svcParam" value={this.state.operat.svcParam } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="用途" required={false} colon={true} className={layoutItem} help={hints.opDescHint} validateStatus={hints.opDescStatus}>
						<Input type="textarea" name="opDesc" id="opDesc" value={this.state.operat.opDesc } onChange={this.handleOnChange} />
					</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default CreateOperatPage;