import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
var ProjTempTableStore = require('../data/ProjTempTableStore');
var ProjTempDetailActions = require('../action/ProjTempDetailActions');

var UpdateProjTempPage = React.createClass({
	getInitialState : function() {
		return {
			projTempSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			projTemp: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProjTempTableStore, "onServiceComplete"), ModalForm('projTemp')],
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
				  projTempSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'beginDate', desc:'入组日期', required: false, max: '24'},
            {id: 'beginTime', desc:'入组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
            {id: 'roleName', desc:'承担角色', required: false, max: '64'},
            {id: 'manStatus', desc:'状态：入组、离组', required: false, max: '16'},
			{id: 'endDate', desc:'离组日期', required: false, max: '24'},
			{id: 'endTime', desc:'离组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
		];
        this.initPage( this.props.projTemp );
	},
	
	initPage: function(projTemp){
		this.state.hints = {};
		Utils.copyValue(projTemp, this.state.projTemp);
		
		this.state.loading = false;
		this.state.projTempSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projTemp)){
			this.state.projTempSet.operation = '';
			this.setState({loading: true});
			ProjTempDetailActions.updateProjTemp( this.state.projTemp );
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改任务" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-task-member/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                   <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单编号" required={false} colon={true} className={layoutItem} help={hints.ordCodeHint} validateStatus={hints.ordCodeStatus}>
                                <Input type="text" name="ordCode" id="ordCode" disabled={true} value={this.state.projTemp.ordCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单名称" required={false} colon={true} className={layoutItem} help={hints.ordNameHint} validateStatus={hints.ordNameStatus}>
                                <Input type="text" name="ordName" id="ordName" disabled={true} value={this.state.projTemp.ordName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任务编号" required={false} colon={true} className={layoutItem} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
                                <Input type="text" name="itemCode" id="itemCode" disabled={true} value={this.state.projTemp.itemCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任务名称" required={false} colon={true} className={layoutItem} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                <Input type="text" name="itemName" id="itemName" disabled={true} value={this.state.projTemp.itemName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.projTemp.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                                <Input type="text" name="beginTime" id="beginTime" value={this.state.projTemp.beginTime } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                        <Input type="textarea" name="roleName" id="roleName" value={this.state.projTemp.roleName } onChange={this.handleOnChange} />
                    </FormItem>
                    <Row>
						<FormItem {...formItemLayout} label="人员状态" required={false} colon={true} className={layoutItem} help={hints.manStatusHint} validateStatus={hints.manStatusStatus}>		
							<DictRadio name="manStatus" id="manStatus" value={this.state.projTemp.manStatus} appName='项目管理' optName='订单人员状态' onChange={this.onRadioChange}/>
						</FormItem>
					</Row>
					<Row style={{display : (this.state.projTemp.manStatus==='入组') ? 'none' : 'block'}}>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="离组日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
								<DatePicker name='endDate' id='endDate' style={{width:'100%'}} value={this.formatDate(this.state.projTemp.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'endDate', Common.dateFormat)} />
							</FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="离组时间" required={false} colon={true} className={layoutItem} help={hints.endTimeHint} validateStatus={hints.endTimeStatus}>
								<Input type="text" name="endTime" id="endTime" value={this.state.projTemp.endTime } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>

                </Form>
			</Modal>
		);
	}
});

export default UpdateProjTempPage;

