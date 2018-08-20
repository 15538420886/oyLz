import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select ,Row ,Col,DatePicker } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateBenefitPage = React.createClass({
	getInitialState : function() {
		return {
			benefitSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			benefit: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('benefit')],
	onServiceComplete: function(data) {
		if(data.resource==='benefitList' && (data.operation === 'create' || data.operation === 'update')){
			if( data.errMsg === ''){
				this.state.btnOpen=false;
				this.clear();
			}

			this.setState({loading: false});
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.clear();
		this.state.validRules = [
			{id: 'orgName', desc:'组织名称', required: true},
			{id: 'orgRole', desc:'承担角色', required: true},
			{id: 'beginDate', desc:'开始日期', required: true},
			{id: 'endDate', desc:'结束日期', required: false},
			{id: 'activeLoc', desc:'活动地点', required: false},
			{id: 'activeCont', desc:'活动内容', required: true},
			{id: 'witness', desc:'见证人', required: false},
			{id: 'wPhone', desc:'电话', dataType:'mobile' ,required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.benefit.orgName='';
		this.state.benefit.orgRole='';
		this.state.benefit.beginDate='';
		this.state.benefit.endDate='';
		this.state.benefit.activeLoc='';
		this.state.benefit.activeCont='';
		this.state.benefit.witness='';
	},

	initPage: function(benefit)
	{
		this.state.hints = {};
		Utils.copyValue(benefit, this.state.benefit);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.benefit)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateBenefit( this.state.benefit );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.benefit)){
			this.setState({loading: true});
			ResumeActions.addBenefit( this.state.benefit );
		}
	},
	onClickBack:function(){
		browserHistory.push({
          	pathname: '/resume2/PreviewPage/',
        });
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};

		var hints=this.state.hints;
		return (
            <div className='resume-form'>
				<Form layout={layout}>
					<FormItem {...formItemLayout} label="组织名称" required={true} colon={true} className={layoutItem} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}>
						<Input type="text" name="orgName" id="orgName" value={this.state.benefit.orgName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="承担角色" required={true} colon={true} className={layoutItem} help={hints.orgRoleHint} validateStatus={hints.orgRoleStatus}>
						<Input type="text" name="orgRole" id="orgRole" value={this.state.benefit.orgRole } onChange={this.handleOnChange} />
					</FormItem>

					<FormItem {...formItemLayout} label="开始日期" required={true} colon={true} className={layoutItem}>
						<Col span="6">
							<FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  value={this.formatMonth(this.state.benefit.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
							</FormItem>
						</Col>
						<Col span="2" style={{textAlign: 'center'}}>
							到
						</Col>
						<Col span="6">
							<FormItem help={hints.endDateHint} validateStatus={hints.endDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="endDate" id="endDate"  value={this.formatMonth(this.state.benefit.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
							</FormItem>
						</Col>
					</FormItem>

					<FormItem {...formItemLayout} label="活动地点" required={false} colon={false} className={layoutItem} help={hints.activeLocHint} validateStatus={hints.activeLocStatus}>
						<Input type="textarea" name="activeLoc" id="activeLoc" value={this.state.benefit.activeLoc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="活动内容" required={true} colon={true} className={layoutItem} help={hints.activeContHint} validateStatus={hints.activeContStatus}>
						<Input type="textarea" name="activeCont" id="activeCont" value={this.state.benefit.activeCont } onChange={this.handleOnChange} />
					</FormItem>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="见证人" required={false} colon={false} className={layoutItem} help={hints.witnessHint} validateStatus={hints.witnessStatus}>
								<Input type="text" name="witness" id="witness" value={this.state.benefit.witness } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="电话" required={false} colon={false} className={layoutItem} help={hints.wPhoneHint} validateStatus={hints.wPhoneStatus}>
								<Input type="text" name="wPhone" id="wPhone" value={this.state.benefit.wPhone } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>

				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['benefitList/create', 'benefitList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateBenefitPage;
