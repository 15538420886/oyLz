import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var UiParamStore = require('../data/UiParamStore.js');
var UiParamActions = require('../action/UiParamActions');

var UpdateUiParamPage = React.createClass({
	getInitialState : function() {
		return {
			uiParamSet: {},
			loading: false,
			modal: false,
			uiParam: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(UiParamStore, "onServiceComplete"), ModalForm('uiParam')],
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
				  uiParamSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'paramName', desc: '参数名称', required: true, max: 64,},
			{ id: 'paramValue', desc: '参数值', max: 2048,},
		];
	},
	
	initPage: function(uiParam)
	{
		this.state.hints = {};
		Utils.copyValue(uiParam, this.state.uiParam);
		
		this.state.loading = false;
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.uiParam)){
			this.setState({loading: true});
			UiParamActions.updateUiParam( this.state.uiParam );
		}
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改UI参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['ui-param/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} className={layoutItem} label='参数名称' required={true} colon={true} help={hints.paramNameHint} validateStatus={hints.paramNameStatus}>
							<Input type='text' name='paramName' id='paramName' value={this.state.uiParam.paramName} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='参数值' colon={true} help={hints.paramValueHint} validateStatus={hints.paramValueStatus}>
							<Input type='textarea' name='paramValue' id='paramValue' style={{ height: '200px' }} value={this.state.uiParam.paramValue} onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateUiParamPage;