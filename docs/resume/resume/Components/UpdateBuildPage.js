import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var BuildStore = require('../data/ResumeStore');
var BuildActions = require('../action/ResumeActions');

var UpdateBuildPage = React.createClass({
	getInitialState : function() {
		return {
			buildSet: {
				operation : '',
				errMsg : ''
			},

			modal: false,
			build: {},
			hints: {},
			validRules: []
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
          {id: 'buildCode', desc:'建筑名称', required: true, max: 128},
          {id: 'address', desc:'地址', max: 256}
		];
	},

	initPage: function(build)
	{
		this.state.hints = {};
		Utils.copyValue(build, this.state.build);
	},

	handleOnChange : function(e) {
		var build = this.state.build;
		build[e.target.id] = e.target.value;
		Validator.validator(this, build, e.target.id);
		this.setState({
			build: build
		});
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.build)){
			BuildActions.updateHrBuild( this.state.build );
		}
	},

	toggle : function() {
		this.setState({
			modal: !this.state.modal
		});

		if( !this.state.modal ){
			this.state.buildSet.operation='';
		}
	},

	onDismiss : function(){
		var buildSet = this.state.buildSet;
		buildSet.errMsg = '';
		buildSet.operation = '';
		this.setState({
			buildSet: buildSet
		});
	},

	render : function() {
		var errMsg = '';
		if(this.state.modal && this.state.buildSet.operation === 'update'){
			if(this.state.buildSet.errMsg != ''){
				errMsg = this.state.buildSet.errMsg;
			}
			else{
				this.state.modal = false;
			}
		}

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

    	var hints=this.state.hints;
	    return (
	        <Modal visible={this.state.modal} width='540px' title="修改楼宇信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	          footer={[
	          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			        <ErrorMsg message={errMsg} toggle={this.onDismiss}/>
	           		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>保存</Button>{' '}
	           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	           </div>
	          ]}
	        >
	       		<Form layout={layout}>
					<FormItem {...formItemLayout} label="建筑名称" colon={true} className={layoutItem} help={hints.buildCodeHint} validateStatus={hints.buildCodeStatus}>
						<Input type="text" name="buildCode" id="buildCode" value={this.state.build.buildCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="地址" colon={true} className={layoutItem} help={hints.addressHint} validateStatus={hints.addressStatus}>
						<Input type="text" name="address" id="address" value={this.state.build.address} onChange={this.handleOnChange}/>
					</FormItem>
	        	</Form>
	        </Modal>
	    );
	}
});

ReactMixin.onClass(UpdateBuildPage, Reflux.connect(BuildStore, 'buildSet'));
export default UpdateBuildPage;
