﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var StatMachineStore = require('../data/StatMachineStore.js');
var StatMachineActions = require('../action/StatMachineActions');

var CreateStatMachinePage = React.createClass({
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
	              statMachineSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'statmCode', desc:'状态机编码', required: true, max: '255'},
			{id: 'statmName', desc:'状态机名称', required: true, max: '255'},
			{id: 'statmDesp', desc:'状态机描述', required: true, max: '255'},
			{id: 'activeStat', desc:'状态', required: true, max: '255'},
			{id: 'showVer', desc:'版本号', required: true, max: '255'},
			{id: 'disUse', desc:'是否禁用', required: true, max: '255'},
		];
	},
	
	clear : function(InStatMachine){
		this.state.hints = {};
		this.state.statMachine.statmCode='';
		this.state.statMachine.statmName='';
		this.state.statMachine.statmDesp='';
		this.state.statMachine.activeStat='';
		this.state.statMachine.showVer='';
		this.state.statMachine.disUse='';
		this.state.statMachine.InStatMachine = InStatMachine;
		
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
			StatMachineActions.createStatMachine( this.state.statMachine );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='640px' title="增加状态机管理" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['stat-machine/create']}/>
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

export default CreateStatMachinePage;
