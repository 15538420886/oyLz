import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker} from 'antd';
const FormItem = Form.Item;
var ProjTaskMemberStore = require('../data/ProjTaskMemberStore');
var ProjTaskMemberActions = require('../action/ProjTaskMemberActions');

var UpdateProjTaskMemberPage = React.createClass({
	getInitialState : function() {
		return {
			projTaskMemberSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			projTaskMember: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ProjTaskMemberStore, "onServiceComplete"), ModalForm('projTaskMember')],
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
				  projTaskMemberSet: data
			  });
		  }
	  }
	},
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'staffCode', desc:'员工编号', required: true, max: '64'},
            {id: 'perName', desc:'姓名', required: true, max: '32'},
            {id: 'beginDate', desc:'入组日期', required: false, max: '24'},
            {id: 'beginTime', desc:'入组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
            {id: 'roleName', desc:'承担角色', required: false, max: '64'},
			{id: 'manStatus', desc:'状态：入组、离组', required: false, max: '16'},
			{id: 'endDate', desc:'离组日期', required: false, max: '24'},
			{id: 'endTime', desc:'离组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
		];
		this.initPage( this.props.projTaskMember );
	},
	initPage: function(projTaskMember){
		this.state.hints = {};
		Utils.copyValue(projTaskMember, this.state.projTaskMember);
		
		this.state.loading = false;
		this.state.projTaskMemberSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},
	onClickSave : function(){
		if(Common.formValidator(this, this.state.projTaskMember)){
			this.state.projTaskMemberSet.operation = '';
			this.setState({loading: true});
			ProjTaskMemberActions.updateProjTaskMember( this.state.projTaskMember );
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
			<Modal visible={this.state.modal} width='540px' title="修改人员" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
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
                            <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                <Input disabled={true} type="text" name="staffCode" id="staffCode" value={this.state.projTaskMember.staffCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                <Input disabled={true} type="text" name="perName" id="perName" value={this.state.projTaskMember.perName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.projTaskMember.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                                <Input type="text" name="beginTime" id="beginTime" value={this.state.projTaskMember.beginTime } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                        <Input type="textarea" name="roleName" id="roleName" value={this.state.projTaskMember.roleName } onChange={this.handleOnChange} />
                    </FormItem>
					<Row>
						<FormItem {...formItemLayout} label="人员状态" required={false} colon={true} className={layoutItem} help={hints.manStatusHint} validateStatus={hints.manStatusStatus}>		
							<DictRadio name="manStatus" id="manStatus" value={this.state.projTaskMember.manStatus} appName='项目管理' optName='订单人员状态' onChange={this.onRadioChange}/>
						</FormItem>
					</Row>
					<Row style={{display : (this.state.projTaskMember.manStatus==='入组') ? 'none' : 'block'}}>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="离组日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
								<DatePicker name='endDate' id='endDate' style={{width:'100%'}} value={this.formatDate(this.state.projTaskMember.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'endDate', Common.dateFormat)} />
							</FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="离组时间" required={false} colon={true} className={layoutItem} help={hints.endTimeHint} validateStatus={hints.endTimeStatus}>
								<Input type="text" name="endTime" id="endTime" value={this.state.projTaskMember.endTime } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
				</Form>
			</Modal>
		);
	}
});

export default UpdateProjTaskMemberPage;

