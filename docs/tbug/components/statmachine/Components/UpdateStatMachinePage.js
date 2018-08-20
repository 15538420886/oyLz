﻿﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var StatMachineStore = require('../data/StatMachineStore.js');
var StatMachineActions = require('../action/StatMachineActions.js');

var UpdateStatMachinePage = React.createClass({
	getInitialState : function() {
		return {
			statMachineSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			statMachine: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(StatMachineStore, "onServiceComplete"), ModalForm('statMachine')],
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
				  statMachineSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'statmCode', desc:'状态机编码', required: false, max: '255'},
			{id: 'statmName', desc:'状态机名称', required: false, max: '255'},
			{id: 'statmDesp', desc:'状态机描述', required: false, max: '255'},
			{id: 'activeStat', desc:'状态', required: false, max: '255'},
			{id: 'showVer', desc:'版本号', required: false, max: '255'},
			{id: 'updateDate', desc:'更新时间', required: false, max: '24'},
			{id: 'updateUser', desc:'更新人', required: false, max: '255'},
			{id: 'objType', desc:'对象类型', required: false, max: '255'},
		];
	},
	
	initPage: function(statMachine)
	{
		this.state.hints = {};
		Utils.copyValue(statMachine, this.state.statMachine);
		
		this.state.loading = false;
		this.state.statMachineSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.statMachine)){
			this.state.statMachineSet.operation = '';
			this.setState({loading: true});
			StatMachineActions.updateStatMachine( this.state.statMachine );
		}
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改状态机管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['stat-machine/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
				   <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="状态机编码" required={true} colon={true} className={layoutItem} help={hints.statmCodeHint} validateStatus={hints.statmCodeStatus}>
								<Input type="text" name="statmCode" id="statmCode" value={this.state.statMachine.statmCode } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="状态机名称" required={true} colon={true} className={layoutItem} help={hints.statmNameHint} validateStatus={hints.statmNameStatus}>
								<Input type="text" name="statmName" id="statmName" value={this.state.statMachine.statmName } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="状态机描述" required={true} colon={true} className={layoutItem} help={hints.statmDespHint} validateStatus={hints.statmDespStatus}>
								<Input type="text" name="statmDesp" id="statmDesp" value={this.state.statMachine.statmDesp } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="状态" required={true} colon={true} className={layoutItem} help={hints.activeStatHint} validateStatus={hints.activeStatStatus}>
								<Input type="text" name="activeStat" id="activeStat" value={this.state.statMachine.activeStat } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="版本号" required={true} colon={true} className={layoutItem} help={hints.showVerHint} validateStatus={hints.showVerStatus}>
								<Input type="text" name="showVer" id="showVer" value={this.state.statMachine.showVer } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="是否禁用" required={true} colon={true} className={layoutItem} help={hints.disUseHint} validateStatus={hints.disUseStatus}>
								<DictSelect name="disUse" id="disUse" value={this.state.statMachine.disUse} appName='缺陷管理' optName='阿斯顿' onSelect={this.handleOnSelected.bind(this, "disUse")}/>
							</FormItem>
                        </Col>
                    </Row>	   
				</Form>
			</Modal>
		);
	}
});

export default UpdateStatMachinePage;

