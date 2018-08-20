import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import DictSelect from '../../../lib/Components/DictSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FlowRoleStore = require('../data/FlowRoleStore.js');
var FlowRoleActions = require('../action/FlowRoleActions');

var UpdateFlowRolePage = React.createClass({
	getInitialState : function() {
		return {
			flowRoleSet: {},
			loading: false,
			modal: false,
			flowRole: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(FlowRoleStore, "onServiceComplete"), ModalForm('flowRole')],
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
				  flowRoleSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
		
			
			{ id: 'roleName', desc: '角色名称', required: true, max: 24,},
            { id: 'roleCode', desc: '角色代码', max: 24,},
            { id: 'roleLevel', desc: '组织级别', required: true, max: 24,},
		];
	},
	
	initPage: function(flowRole)
	{
		this.state.hints = {};
		Utils.copyValue(flowRole, this.state.flowRole);
		
		this.state.loading = false;
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},
	onHandleOnSelected: function (id, value, option) {
			var flowRole = this.props.flowRole;
			flowRole[id] = value;
			this.setState({
					flowRole: this.state.flowRole
			});
	},
	onClickSave : function(){
		if(Common.formValidator(this, this.state.flowRole)){
			this.setState({loading: true});
			FlowRoleActions.updateFlowRole( this.state.flowRole );
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
			<Modal visible={this.state.modal} width='540px' title="修改流程角色信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['flow-role/update']}/>
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

export default UpdateFlowRolePage;