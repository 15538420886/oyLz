﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;

var EnvAppStore = require('../data/EnvAppStore.js');
var EnvAppActions = require('../action/EnvAppActions');

var UpdateEnvAppPage = React.createClass({
	getInitialState : function() {
		return {
			envAppSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			envApp: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(EnvAppStore, "onServiceComplete"), ModalForm('envApp')],
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
				  envAppSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'svcPort', desc:'端口号', required: true, max: '5'},
			{id: 'appVer', desc:'版本名称', required: false, max: '64'},
			{id: 'profileName', desc:'运行方式', required: false, max: '32'},
			{id: 'logPath', desc:'日志路径', required: false, max: '32'},
			{id: 'pidFile', desc:'PID文件', required: false, max: '128'},
			{id: 'installPath', desc:'安装路径', required: false, max: '128'},
			{id: 'runParams', desc:'启动参数', required: false, max: '128'},
			{id: 'confFile', desc:'配置文件', required: false, max: '128'},
			{id: 'memo2', desc:'备注', required: false, max: '512'},
		];
	},
	
	initPage: function(envApp)
	{
		this.state.hints = {};
		Utils.copyValue(envApp, this.state.envApp);
		
		this.state.loading = false;
		this.state.envAppSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.envApp)){
			this.state.envAppSet.operation = '';
			this.setState({loading: true});
			EnvAppActions.updateEnvAppInfo( this.state.envApp );
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
			<Modal visible={this.state.modal} width='540px' title="修改部署信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['env-app-deploy/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="端口号" required={true} colon={true} className={layoutItem} help={hints.svcPortHint} validateStatus={hints.svcPortStatus}>
						<Input type="number" name="svcPort" id="svcPort" value={this.state.envApp.svcPort } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="版本名称" required={false} colon={true} className={layoutItem} help={hints.appVerHint} validateStatus={hints.appVerStatus}>
						<Input type="text" name="appVer" id="appVer" value={this.state.envApp.appVer } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="运行方式" required={false} colon={true} className={layoutItem} help={hints.profileNameHint} validateStatus={hints.profileNameStatus}>
						<DictSelect name="profileName" id="profileName" value={this.state.envApp.profileName} appName='用户管理' optName='运行方式' onSelect={this.handleOnSelected.bind(this, "profileName")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="日志路径" required={false} colon={true} className={layoutItem} help={hints.logPathHint} validateStatus={hints.logPathStatus}>
						<Input type="text" name="logPath" id="logPath" value={this.state.envApp.logPath } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="PID文件" required={false} colon={true} className={layoutItem} help={hints.pidFileHint} validateStatus={hints.pidFileStatus}>
						<Input type="text" name="pidFile" id="pidFile" value={this.state.envApp.pidFile } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="安装路径" required={false} colon={true} className={layoutItem} help={hints.installPathHint} validateStatus={hints.pidFileStatus}>
						<Input type="text" name="installPath" id="installPath" value={this.state.envApp.installPath } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="启动参数" required={false} colon={true} className={layoutItem} help={hints.runParamsHint} validateStatus={hints.pidFileStatus}>
						<Input type="text" name="runParams" id="runParams" value={this.state.envApp.runParams } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="配置文件" required={false} colon={true} className={layoutItem} help={hints.confFileHint} validateStatus={hints.pidFileStatus}>
						<Input type="text" name="confFile" id="confFile" value={this.state.envApp.confFile } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
						<Input type="textarea" name="memo2" id="memo2" value={this.state.envApp.memo2 } onChange={this.handleOnChange} />
					</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default UpdateEnvAppPage;