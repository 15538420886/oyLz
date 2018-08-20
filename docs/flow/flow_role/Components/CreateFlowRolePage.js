import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';



var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FlowRoleStore = require('../data/FlowRoleStore.js');
var FlowRoleActions = require('../action/FlowRoleActions');

var CreateFlowRolePage = React.createClass({
    getInitialState : function() {
        return {
            flowRoleSet: {},
            loading: false,
            modal: false,
            flowRole: {},
            hints: {},
            validRules: [],
        }
    },

    mixins: [Reflux.listenTo(FlowRoleStore, "onServiceComplete"), ModalForm('flowRole')],
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
                    flowRoleSet: data
                });
            }
        }
    },

  	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'roleName', desc: '角色名称', required: true, max: 48,},
			{ id: 'roleCode', desc: '角色代码', max: 48,},
			{ id: 'roleLevel', desc: '组织级别',required: true, max: 24,},
		];
	},

    clear : function(corpUuid){
		this.state.hints = {};
		this.state.flowRole.uuid='';
		this.state.flowRole.roleName='';
		this.state.flowRole.roleCode='';
		this.state.flowRole.roleLevel='';
		this.state.flowRole.corpUuid = corpUuid;
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},
    onClickSave : function(){
		if(Common.formValidator(this, this.state.flowRole)){
			this.setState({loading: true});
            this.state.flowRole.corpUuid = window.loginData.compUser.corpUuid;    
			FlowRoleActions.createFlowRole( this.state.flowRole );
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
			<Modal visible={this.state.modal} width='540px' title="增加角色" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['flow_role/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} className={layoutItem} label='角色名称' required={true} colon={true} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
							<Input type='text' name='roleName' id='roleName' value={this.state.flowRole.roleName} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='角色代码' colon={true} help={hints.roleCodeHint} validateStatus={hints.roleCodeStatus}>
							<Input type='text' name='roleCode' id='roleCode' value={this.state.flowRole.roleCode} onChange={this.handleOnChange} />
					</FormItem>
                    <FormItem {...formItemLayout} className={layoutItem} label='组织级别' required={true} colon={true} help={hints.roleLevelHint} validateStatus={hints.roleLevelStatus}>
							<DictSelect style={{ width: '40%' }} name="coLevel" id="roleLevel" value={this.state.flowRole.roleLevel} appName='流程管理' optName='角色组织级别' onSelect={this.handleOnSelected.bind(this, "roleLevel")}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});
export default CreateFlowRolePage;