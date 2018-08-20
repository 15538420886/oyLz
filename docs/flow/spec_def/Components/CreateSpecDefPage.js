import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col,Checkbox} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import DictSelect from '../../../lib/Components/DictSelect';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var SpecDefStore = require('../data/SpecDefStore.js');
var SpecDefActions = require('../action/SpecDefActions');

var CreateSpecDefPage = React.createClass({
	getInitialState : function() {
		return {
			specDefSet: {},
			loading: false,
			modal: false,
			specDef: {},
			hints: {},
			validRules: [],
		}
	},

	mixins: [Reflux.listenTo(SpecDefStore, "onServiceComplete"), ModalForm('specDef')],
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
					specDefSet: data
				});
			}
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'flowCode', desc: '流程编号', required: true, max: 64,},
			{ id: 'flowName', desc: '流程名称', required: true, max: 64,},
			{ id: 'flowLevel', desc: '组织级别', required: true, max: 24,},
			{ id: 'flowBook', desc: '规章制度', max: 512,},
			{ id: 'flowLoc', desc: '属地相关', max: 24,},
		];
	},
	
	clear : function(filter){
		// FIXME 输入参数，对象初始化
		this.state.hints = {};
		this.state.specDef.uuid='';
		this.state.specDef.filter = filter;
		this.state.specDef.flowCode='';
		this.state.specDef.flowName='';
		this.state.specDef.flowLevel='';
		this.state.specDef.flowBook='';
		this.state.specDef.flowLoc='0';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.specDef)){
			this.setState({loading: true});
            this.state.specDef.corpUuid = window.loginData.compUser.corpUuid; 
			SpecDefActions.createSpecFlowDef( this.state.specDef );
		}
	},
	

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加流程" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['spec_flow_def/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <Row> 
                        <Col span="12">
                            <FormItem {...formItemLayout} className={layoutItem} label='流程编号' required={true} colon={true} help={hints.flowCodeHint} validateStatus={hints.flowCodeStatus}>
                                    <Input type='text' name='flowCode' id='flowCode' value={this.state.specDef.flowCode} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">        
                            <FormItem {...formItemLayout} className={layoutItem} label='流程名称' required={true} colon={true} help={hints.flowNameHint} validateStatus={hints.flowNameStatus}>
                                    <Input type='text' name='flowName' id='flowName' value={this.state.specDef.flowName} onChange={this.handleOnChange} />
                            </FormItem>
                         </Col>
                    </Row> 
                    <Row>                         
						<Col span="12"> 
							<FormItem {...formItemLayout} className={layoutItem} label='组织级别' required={true} colon={true} help={hints.flowLevelHint} validateStatus={hints.flowLevelStatus}>
									<DictSelect name='flowLevel' id='flowLevel' appName='流程管理' optName='特批组织级别' value={this.state.specDef.flowLevel} onSelect={this.handleOnSelected.bind(this, 'flowLevel')} />
							</FormItem>
							</Col>
							<Col span="12">
							<FormItem {...formItemLayout2} className={layoutItem} style={{marginLeft:'24px'}} label='' colon={true} help={hints.flowLoccHint} validateStatus={hints.flowLocStatus}>
								<Checkbox  name='flowLoc'  id='flowLoc' checked={(this.state.specDef.flowLoc !== '0') ? true : false} onChange={this.handleCheckBox}>地区相关</Checkbox>
							</FormItem>
						</Col>
						</Row> 
					<FormItem {...formItemLayout2} className={layoutItem} label='规章制度' colon={true} help={hints.flowBookHint} validateStatus={hints.flowBookStatus}>
							<Input type='textarea' name='flowBook' id='flowBook' style={{height: '100px'}} value={this.state.specDef.flowBook} onChange={this.handleOnChange} />
					</FormItem>       
				</Form>
			</Modal>
		);
	}
});

export default CreateSpecDefPage;