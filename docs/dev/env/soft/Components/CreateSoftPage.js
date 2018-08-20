import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input} from 'antd';
const FormItem = Form.Item;

var SoftStore = require('../data/SoftStore.js');
var SoftActions = require('../action/SoftActions');

var CreateSoftPage = React.createClass({
	getInitialState : function() {
		return {
			softSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			soft: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(SoftStore, "onServiceComplete"), ModalForm('soft')],
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
	              softSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'softName', desc:'名称', required: true, max: '64'},
			{id: 'softType', desc:'类型', required: false, max: '32'},
			{id: 'softUrl', desc:'访问地址', required: false, max: '128'},
    		{id: 'softVer', desc:'版本名称', required: false, max: '64'},
    		{id: 'installPath', desc:'安装路径', required: false, max: '128'},
    		{id: 'runParams', desc:'启动参数', required: false, max: '128'},
    		{id: 'confFile', desc:'配置文件', required: false, max: '128'},
			{id: 'svcPort', desc:'监听端口', required: false, max: '5'},
			{id: 'logPath', desc:'日志路径', required: false, max: '32'},
			{id: 'softPurpose', desc:'用途', required: false, max: '1024'},
			{id: 'deployDesc', desc:'部署说明', required: false, max: '1024'},
			{id: 'memo2', desc:'备注', required: false, max: '512'},
				
		];
	},
	
	clear : function(){
		this.state.hints = {};
		this.state.soft.hostUuid=this.props.envHost.uuid;
		this.state.soft.softName='';
		this.state.soft.softType='';
		this.state.soft.softUrl='';
		this.state.soft.softVer='';
		this.state.soft.installPath='';
		this.state.soft.runParams='';
		this.state.soft.confFile='';
		this.state.soft.svcPort='';
		this.state.soft.logPath='';
		this.state.soft.softPurpose='';
		this.state.soft.deployDesc='';
		this.state.soft.memo2='';

		this.state.loading = false;
	    this.state.softSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.soft)){
			this.state.softSet.operation = '';
			this.setState({loading: true});
			SoftActions.createEnvSysSoft( this.state.soft );
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
			<Modal visible={this.state.modal} width='540px' title="增加软件" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['env-sys-soft/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="名称" required={true} colon={true} className={layoutItem} help={hints.softNameHint} validateStatus={hints.softNameStatus}>
						<Input type="text" name="softName" id="softName" value={this.state.soft.softName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="类型" required={false} colon={true} className={layoutItem} help={hints.softTypeHint} validateStatus={hints.softTypeStatus}>
						<Input type="text" name="softType" id="softType" value={this.state.soft.softType } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="访问地址" required={false} colon={true} className={layoutItem} help={hints.softUrlHint} validateStatus={hints.softUrlStatus}>
						<Input type="text" name="softUrl" id="softUrl" value={this.state.soft.softUrl } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="版本名称" required={false} colon={true} className={layoutItem} help={hints.softVerHint} validateStatus={hints.softUrlStatus}>
						<Input type="text" name="softVer" id="softVer" value={this.state.soft.softVer } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="安装路径" required={false} colon={true} className={layoutItem} help={hints.installPathHint} validateStatus={hints.softUrlStatus}>
						<Input type="text" name="installPath" id="installPath" value={this.state.soft.installPath } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="启动参数" required={false} colon={true} className={layoutItem} help={hints.runParamsHint} validateStatus={hints.softUrlStatus}>
						<Input type="text" name="runParams" id="runParams" value={this.state.soft.runParams } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="配置文件" required={false} colon={true} className={layoutItem} help={hints.confFileHint} validateStatus={hints.softUrlStatus}>
						<Input type="text" name="confFile" id="confFile" value={this.state.soft.confFile } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="监听端口" required={false} colon={true} className={layoutItem} help={hints.svcPortHint} validateStatus={hints.softUrlStatus}>
						<Input type="number" name="svcPort" id="svcPort" value={this.state.soft.svcPort } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="日志路径" required={false} colon={true} className={layoutItem} help={hints.logPathHint} validateStatus={hints.softUrlStatus}>
						<Input type="text" name="logPath" id="logPath" value={this.state.soft.logPath } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="用途" required={false} colon={true} className={layoutItem} help={hints.softPurposeHint} validateStatus={hints.softPurposeStatus}>
						<Input type="textarea" name="softPurpose" id="softPurpose" value={this.state.soft.softPurpose } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="部署说明" required={false} colon={true} className={layoutItem} help={hints.deployDescHint} validateStatus={hints.deployDescStatus}>
						<Input type="textarea" name="deployDesc" id="deployDesc" value={this.state.soft.deployDesc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
						<Input type="textarea" name="memo2" id="memo2" value={this.state.soft.memo2 } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateSoftPage;

