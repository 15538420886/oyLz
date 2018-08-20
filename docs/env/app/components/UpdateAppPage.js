import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input} from 'antd';
const FormItem = Form.Item;

var AppStore = require('../data/AppStore.js');
var AppActions = require('../action/AppActions');

var UpdateAppPage = React.createClass({
	getInitialState : function() {
		return {
			appSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			app: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(AppStore, "onServiceComplete"), ModalForm('app')],
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
				  appSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'appName', desc:'应用名称', required: true, max: '64'},
			{id: 'appCode', desc:'应用代码', required: true, max: '64'},
			{id: 'appDesc', desc:'应用描述', required: false, max: '1024'},
			{id: 'appType', desc:'类型', required: false, max: '12'},
			{id: 'appGroup', desc:'分组名称', required: false, max: '32'},
			{id: 'fileName', desc:'安装文件名', required: false, max: '256'},
			{id: 'springName', desc:'服务名称', required: false, max: '32'},
			{id: 'configName', desc:'配置名称', required: false, max: '64'},
			{id: 'memo2', desc:'备注', required: false, max: '512'},
		];
	},
	
	initPage: function(app)
	{
		this.state.hints = {};
		Utils.copyValue(app, this.state.app);
		
		this.state.loading = false;
		this.state.appSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.app)){
			this.state.appSet.operation = '';
			this.setState({loading: true});
			AppActions.updateAppInfo( this.state.app );
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
			<Modal visible={this.state.modal} width='540px' title="修改服务信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['env-app-info/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="应用名称" required={true} colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
						<Input type="text" name="appName" id="appName" value={this.state.app.appName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="应用代码" required={true} colon={true} className={layoutItem} help={hints.appCodeHint} validateStatus={hints.appCodeStatus}>
						<Input type="text" name="appCode" id="appCode" value={this.state.app.appCode } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="应用描述" required={false} colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
						<Input type="textarea" name="appDesc" id="appDesc" value={this.state.app.appDesc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="类型" required={false} colon={true} className={layoutItem} help={hints.appTypeHint} validateStatus={hints.appTypeStatus}>
						<DictSelect name="appType" id="appType" value={this.state.app.appType} appName='用户管理' optName='类型' onSelect={this.handleOnSelected.bind(this, "appType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="分组名称" required={false} colon={true} className={layoutItem} help={hints.appGroupHint} validateStatus={hints.appGroupStatus}>
						<Input type="text" name="appGroup" id="appGroup" value={this.state.app.appGroup } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="安装文件名" required={false} colon={true} className={layoutItem} help={hints.fileNameHint} validateStatus={hints.fileNameStatus}>
						<Input type="text" name="fileName" id="fileName" value={this.state.app.fileName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="服务名称" required={false} colon={true} className={layoutItem} help={hints.springNameHint} validateStatus={hints.springNameStatus}>
						<Input type="text" name="springName" id="springName" value={this.state.app.springName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="配置名称" required={false} colon={true} className={layoutItem} help={hints.configNameHint} validateStatus={hints.configNameStatus}>
						<Input type="text" name="configName" id="configName" value={this.state.app.configName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
						<Input type="textarea" name="memo2" id="memo2" value={this.state.app.memo2 } onChange={this.handleOnChange} />
					</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default UpdateAppPage;