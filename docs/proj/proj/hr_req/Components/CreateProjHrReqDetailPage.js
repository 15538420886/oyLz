import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import DictRadio from '../../../../lib/Components/DictRadio';
var Validator = require('../../../../public/script/common');
var ProjContext = require('../../../ProjContext');


import { Form, Modal, Button, Input, Select, Row, Col, Radio, InputNumber } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var HrReqDetailActions = require('../action/ProjHrReqDetailActions.js');
var HrReqDetailStore = require('../data/ProjHrReqDetailStore');

var CreateHrReqDetailPage = React.createClass({
	getInitialState : function() {
		return {
			HrReqDetailSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			HrReqDetail: {},
			hints: {},
			validRules: [],
			reqUuid:''
		}
	},

	mixins: [Reflux.listenTo(HrReqDetailStore, "onServiceComplete"), ModalForm('HrReqDetail')],
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
	              HrReqDetailSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            { id: 'reqCount', desc: '人员数量', required: true, dataType: 'number', max: '24'},
            { id: 'manType', desc: '人员类型', required: true, max: '32'},
			{id: 'induYears', desc:'从业经验', required: false, max: '32'},
            { id: 'manLevel', desc: '人员级别', required: true, max: '32'},
			{id: 'techCode', desc:'技术方向', required: false, max: '128'},
			{id: 'biziCode', desc:'业务方向', required: false, max: '128'},
			{id: 'techDesc', desc:'技术要求', required: false, max: '2048'},
			{id: 'biziDesc', desc:'业务要求', required: false, max: '2048'},
			{id: 'hrCode', desc:'标准分类', required: false, max: '64'},
		];
	},
	
	clear : function(reqUuid){
		
		this.state.hints = {};
		this.state.HrReqDetail.reqCount='';
		this.state.HrReqDetail.manType='';
		this.state.HrReqDetail.induYears='';
		this.state.HrReqDetail.manLevel='';
		this.state.HrReqDetail.techCode='';
		this.state.HrReqDetail.biziCode='';
		this.state.HrReqDetail.techDesc='';
		this.state.HrReqDetail.biziDesc='';
		this.state.HrReqDetail.hrCode='';
		this.state.reqUuid = reqUuid;
		this.state.loading = false;
	    this.state.HrReqDetailSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.HrReqDetail)){
			this.setState({loading: true});
			this.state.HrReqDetail.supCount = 0;
			this.state.HrReqDetail.reqUuid = this.state.reqUuid;
			this.state.HrReqDetail.status = "待处理";
			HrReqDetailActions.createProjHrReqDetail( this.state.HrReqDetail );
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='620px' title="增加人员明细" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-hr-req-detail/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<Row>
						<Col span="12">
                            <FormItem {...formItemLayout2} label="人员数量" required={true} colon={true} className={layoutItem} help={hints.reqCountHint} validateStatus={hints.reqCountStatus}>
								<Input type="text" name="reqCount" id="reqCount" value={this.state.HrReqDetail.reqCount} onChange={this.handleOnChange}/>
							</FormItem>
						</Col>
						<Col span="12">
                            <FormItem {...formItemLayout2} label="人员类型" required={true} colon={true} className={layoutItem} help={hints.manTypeHint} validateStatus={hints.manTypeStatus}>
								<DictSelect name="manType" id="manType" appName='项目管理' optName='人员需求类型' onSelect={this.handleOnSelected.bind(this, "manType")} value={this.state.HrReqDetail.manType}/>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
                            <FormItem {...formItemLayout2} label="人员级别" required={true} colon={true} className={layoutItem} help={hints.manLevelHint} validateStatus={hints.manLevelStatus}>
								<RadioGroup onChange={this.onChange1}>
								    <DictRadio name="manLevel" id="manLevel" appName='项目管理' optName='人员级别' onChange={this.onRadioChange} value={this.state.HrReqDetail.manLevel} />
								</RadioGroup>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="从业经验" required={false} colon={true} className={layoutItem} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                                <Input type="text" name="induYears" id="induYears" onChange={this.handleOnChange} value={this.state.HrReqDetail.induYears} addonAfter="年"/>
							</FormItem>
						</Col>
					</Row>
					<FormItem {...formItemLayout} label="技术方向" colon={true} className={layoutItem} help={hints.techCodeHint} validateStatus={hints.techCodeStatus}>
						<Input type="text" name="techCode" id="techCode" onChange={this.handleOnChange} value={this.state.HrReqDetail.techCode}/>
					</FormItem>
					<FormItem {...formItemLayout} label="业务方向" colon={true} className={layoutItem} help={hints.biziCodeHint} validateStatus={hints.biziCodeStatus}>
						<Input type="text" name="biziCode" id="biziCode" onChange={this.handleOnChange} value={this.state.HrReqDetail.biziCode}/>
					</FormItem>
					<FormItem {...formItemLayout} label="技术要求" colon={true} className={layoutItem} help={hints.techDescHint} validateStatus={hints.techDescStatus}>
						<Input type="textarea" name="techDesc" id="techDesc" onChange={this.handleOnChange} style={{height: '100px'}} value={this.state.HrReqDetail.techDesc}/>
					</FormItem>
					<FormItem {...formItemLayout} label="业务要求" colon={true} className={layoutItem} help={hints.biziDescHint} validateStatus={hints.biziDescStatus}>
						<Input type="textarea" name="biziDesc" id="biziDesc" onChange={this.handleOnChange} style={{height: '100px'}} value={this.state.HrReqDetail.biziDesc}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateHrReqDetailPage;

