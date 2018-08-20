import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input, Select, Radio, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var AuthAppStore = require('../data/AppStore.js');
var AuthAppActions = require('../action/AppActions');

var CreateAuthAppPage = React.createClass({
	getInitialState : function() {
		return {
			authAppSet: {},
            loading: false,
			modal: false,
			authApp: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(AuthAppStore, "onServiceComplete"), ModalForm('authApp')],
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
                    authAppSet: data
                });
            }
        }
    },

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'appCode', desc:'服务编号', required: true, max: 64},
            {id: 'appName', desc:'服务名称', max: 64},
            { id: 'iconFile', desc: '权限扫描地址', max: 64 },
            { id: 'appDesc', desc: '服务说明', max: 1024 },
            { id: 'privRoles', desc: '缩写', required: true, max: 10 },
		];
	},

	clear : function(groupUuid){
		this.state.hints = {};
        this.state.authApp.appCode='';
        this.state.authApp.appName='';
        this.state.authApp.appDesc = '';
        this.state.authApp.iconFile = '';
        this.state.authApp.appCharge='0';
        this.state.authApp.personSub='0';
        this.state.authApp.authDept='0';
        this.state.authApp.privRoles='';
		this.state.authApp.groupUuid = groupUuid;
        this.state.authApp.corpUuid = window.loginData.compUser.corpUuid;

        this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
        if (Validator.formValidator(this, this.state.authApp)) {
            this.setState({ loading: true });
			AuthAppActions.createAuthAppInfo( this.state.authApp );
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
			<Modal visible={this.state.modal} width='540px' title="增加服务" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['auth-app-info/create']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
                <Form layout={layout}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="服务编号" required={true} colon={true} className={layoutItem} help={hints.appCodeHint} validateStatus={hints.appCodeStatus}>
                                <Input type="text" name="appCode" id="appCode" value={this.state.authApp.appCode} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="缩写" required={true} colon={true} className={layoutItem} help={hints.privRolesHint} validateStatus={hints.privRolesStatus}>
                                <Input type="text" name="privRoles" id="privRoles" value={this.state.authApp.privRoles} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem {...formItemLayout} label="服务名称" colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                    	<Input type="text" name="appName" id="appName" value={this.state.authApp.appName} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="收费类型" colon={true} className={layoutItem} help={hints.appChargeHint} validateStatus={hints.appChargeStatus}>
						<RadioGroup name="appCharge" id="appCharge" onChange={this.onRadioChange} value={this.state.authApp.appCharge}>
			              <Radio id="appCharge" value='0'>免费</Radio>
			              <Radio id="appCharge" value='1'>收费</Radio>
			            </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="权限扫描" colon={true} className={layoutItem} help={hints.iconFileHint} validateStatus={hints.iconFileStatus}>
                        <Input type="text" name="iconFile" id="iconFile" value={this.state.authApp.iconFile} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="服务说明" colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                        <Input type="textarea" name="appDesc" id="appDesc" value={this.state.authApp.appDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateAuthAppPage;
