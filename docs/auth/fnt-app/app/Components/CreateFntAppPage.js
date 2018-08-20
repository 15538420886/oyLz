import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Validator = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input, Select ,Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var FntAppStore = require('../data/FntAppStore');
var FntAppActions = require('../action/FntAppActions');

var CreateFntAppPage = React.createClass({
	getInitialState : function() {
		return {
			fntAppSet: {},
            loading: false,
			modal: false,
			fntApp: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(FntAppStore, "onServiceComplete"), ModalForm('fntApp')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    fntAppSet: data
                });
            }
        }
    },

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'appCode', desc:'应用代码', required: true, max: 64},
			{id: 'appName', desc:'应用名称', required: true, max: 64},
			{id: 'appDesc', desc:'应用描述', required: false, max: 1024},
			{id: 'appCharge', desc:'收费类型', required: false, max: 10},
			{id: 'authDept', desc:'分级授权', required: false, max: 10},
		];
	},

	clear : function(groupUuid){
		this.state.hints = {};
        this.state.fntApp.appCode='';
        this.state.fntApp.appName='';
        this.state.fntApp.appDesc = '';
        this.state.fntApp.appCharge='0';
        this.state.fntApp.authDept='0';
		this.state.fntApp.groupUuid='';
		this.state.fntApp.personSub='';
        this.state.fntApp.corpUuid = window.loginData.compUser.corpUuid;

        this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
        if (Validator.formValidator(this, this.state.fntApp)) {
            this.setState({ loading: true });
			FntAppActions.createFntApp( this.state.fntApp );
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
			<Modal visible={this.state.modal} width='540px' title="增加服务" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['fnt-app/create']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <FormItem {...formItemLayout} label="服务编号" colon={true} className={layoutItem} help={hints.appCodeHint} validateStatus={hints.appCodeStatus}>
                    	<Input type="text" name="appCode" id="appCode" value={this.state.fntApp.appCode} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="服务名称" colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                    	<Input type="text" name="appName" id="appName" value={this.state.fntApp.appName} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="收费类型" colon={true} className={layoutItem} help={hints.appChargeHint} validateStatus={hints.appChargeStatus}>
						<RadioGroup name="appCharge" id="appCharge" onChange={this.onRadioChange} value={this.state.fntApp.appCharge}>
			              <Radio id="appCharge" value='0'>免费</Radio>
			              <Radio id="appCharge" value='1'>收费</Radio>
			            </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="分级授权" colon={true} className={layoutItem} help={hints.authDeptHint} validateStatus={hints.authDeptStatus}>
						<RadioGroup name="authDept" id="authDept" onChange={this.onRadioChange} value={this.state.fntApp.authDept}>
			              <Radio id="authDept" value='1'>是</Radio>
			              <Radio id="authDept" value='0'>否</Radio>
			            </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="服务说明" colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                        <Input type="textarea" name="appDesc" id="appDesc" value={this.state.fntApp.appDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateFntAppPage;
