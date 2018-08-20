import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Checkbox, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var ParamsStore = require('../data/ParamsStore.js');
var ParamsActions = require('../action/ParamsActions');

var CreateParamsPage = React.createClass({
	getInitialState : function() {
		return {
			paramsSet: {},
			loading: false,
			modal: false,
			params: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ParamsStore, "onServiceComplete"), ModalForm('params')],
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
					paramsSet: data
				});
			}
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'paramName', desc:'名称', required: true, max: '24'},
			{id: 'paramDesc', desc:'描述', required: true, max: '24'},
			{id: 'paramOpts', desc:'可选择内容', required: false, max: '24'},

		];
	},
	
	clear : function(filter){
		this.state.hints = {};
		this.state.params.paramName='';
		this.state.params.paramDesc='';
		this.state.params.paramOpts='';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.params)){
			this.setState({loading: true});
			var obj = {
				filter: this.props.assetType.uuid,
				object: this.state.params
        	}
			ParamsActions.createParams( obj );
		}
	},

	render : function(){
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
			<Modal visible={this.state.modal} width='540px' title="增加规格参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['params/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <Row>
                        <Col span={12}>
							<FormItem {...formItemLayout2} label="名称" required={true} colon={true} className={layoutItem} help={hints.paramNameHint} validateStatus={hints.paramNameStatus}>
								<Input type="text" name="paramName" id="paramName" value={this.state.params.paramName } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
					<FormItem {...formItemLayout} label="描述" required={true} colon={true} className={layoutItem} help={hints.paramDescHint} validateStatus={hints.paramDescStatus}>
						<Input type="text" name="paramDesc" id="paramDesc" value={this.state.params.paramDesc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="可选择内容" required={false} colon={true} className={layoutItem} help={hints.paramOptsHint} validateStatus={hints.paramOptsStatus}>
						<Input type="textarea" name="paramOpts" id="paramOpts" value={this.state.params.paramOpts } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateParamsPage;