import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker, Col, Row } from 'antd';
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

var CreatePeProjPage = React.createClass({
	getInitialState : function() {
		return {
			peProjSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			peProj: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('peProj')],
	onServiceComplete: function(data) {
		if(data.resource==='peProjList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'memo2', desc:'公司名称', required: true, max: 24},
			{id: 'beginDate', desc:'开始时间',required: true, max: 64},
			{id: 'endDate', desc:'结束时间',required: true, max: 64},
			{id: 'projName', desc:'项目名称',required: true, max: 128},
			{id: 'projType', desc:'项目类型',required: true, max: 64},
			{id: 'custName', desc:'客户名称',required: false, max: 128},
			{id: 'custType', desc:'客户类型',required: false, max: 64},
			{id: 'framework', desc:'技术架构',required: false, max: 256},
			{id: 'skills', desc:'技能要求',required: true, max: 256},
			{id: 'projRole', desc:'岗位',required: false, max: 64},
			{id: 'language', desc:'工作语言',required: false, max: 32},
			{id: 'witness', desc:'见证人',required: false, max: 64},
			{id: 'wPhone', desc:'见证人电话',required: false, max: 32 ,dataType:'mobile'},
			{id: 'projDesc', desc:'项目简介',required: true, max: 4000},
			{id: 'workCont', desc:'工作内容',required: true, max: 4000},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.peProjSet.operation='';
		this.state.peProj.memo2='';
		this.state.peProj.beginDate='';
		this.state.peProj.endDate='';
		this.state.peProj.projName='';
		this.state.peProj.projType='开发';
		this.state.peProj.custName='';
		this.state.peProj.custType='银行';
		this.state.peProj.framework='';
		this.state.peProj.skills='';
		this.state.peProj.projRole='';
		this.state.peProj.language='普通话';
		this.state.peProj.witness='';
		this.state.peProj.wPhone='';
		this.state.peProj.projDesc='';
		this.state.peProj.workCont='';
	},
	initPage: function(peProj)
	{
		this.state.hints = {};
		Utils.copyValue(peProj, this.state.peProj);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.peProj)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updatePeProj( this.state.peProj );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.peProj)){
			this.setState({loading: true});
			ResumeActions.addPeProj( this.state.peProj );
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
					<FormItem {...formItemLayout} label="项目名称" required={true} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
						<Input type="text" name="projName" id="projName" value={this.state.peProj.projName} onChange={this.handleOnChange} />
					</FormItem>

					<FormItem {...formItemLayout} label="项目时间" required={true} colon={true} className={layoutItem}>
						<Col span="6">
							<FormItem  help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
							    <MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  value={this.formatMonth(this.state.peProj.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
							</FormItem>
						</Col>
						<Col span="2" style={{textAlign: 'center'}}>
							到
						</Col>
						<Col span="6">
							<FormItem  help={hints.endDateHint} validateStatus={hints.endDateStatus}>
							    <MonthPicker style={{width:'100%'}} name="endDate" id="endDate"  value={this.formatMonth(this.state.peProj.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
							</FormItem>
						</Col>
					</FormItem>

					<FormItem {...formItemLayout} label="客户名称" colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
						<Input type="text" name="custName" id="custName" value={this.state.peProj.custName} onChange={this.handleOnChange} />
					</FormItem>

					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} required={true} label="项目类型" colon={true} className={layoutItem} help={hints.projTypeHint} validateStatus={hints.projTypeStatus} >
								<DictSelect name="projType" id="projType" value={this.state.peProj.projType}  appName='简历系统' optName='项目类型' onSelect={this.handleOnSelected.bind(this, "projType")} />
							</FormItem >
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="客户类型" colon={true} className={layoutItem} help={hints.custTypeHint} validateStatus={hints.custTypeStatus} >
								<DictSelect name="custType" id="custType" value={this.state.peProj.custType}  appName='简历系统' optName='客户类型' onSelect={this.handleOnSelected.bind(this, "custType")} />
							</FormItem >
						</Col>
					</Row>

					<FormItem {...formItemLayout} label="技术架构" colon={true} className={layoutItem} help={hints.frameworkHint} validateStatus={hints.frameworkStatus}>
						<Input type="text" name="framework" id="framework" value={this.state.peProj.framework} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} required={true} label="技能要求" colon={true} className={layoutItem} help={hints.skillsHint} validateStatus={hints.skillsStatus}>
						<Input type="text" name="skills" id="skills" value={this.state.peProj.skills} onChange={this.handleOnChange} />
					</FormItem>

					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="岗位" colon={true} className={layoutItem} help={hints.projRoleHint} validateStatus={hints.projRoleStatus}>
								<Input type="text" name="projRole" id="projRole" value={this.state.peProj.projRole} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="工作语言" colon={true} className={layoutItem} help={hints.languageHint} validateStatus={hints.languageStatus} >
								<DictSelect name="language" id="language" value={this.state.peProj.language}  appName='简历系统' optName='工作语言' onSelect={this.handleOnSelected.bind(this, "language")} />
							</FormItem >
						</Col>
					</Row>

					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="见证人" colon={true} className={layoutItem} help={hints.witnessHint} validateStatus={hints.witnessStatus}>
								<Input type="text" name="witness" id="witness" value={this.state.peProj.witness} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="见证人电话" colon={true} className={layoutItem} help={hints.wPhoneHint} validateStatus={hints.wPhoneStatus}>
								<Input type="text" name="wPhone" id="wPhone" value={this.state.peProj.wPhone} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>

					<FormItem {...formItemLayout}  required={true}  label="项目简介" colon={true} className={layoutItem} help={hints.projDescHint}   validateStatus={hints.projDescStatus}>
						<Input type="textarea" name="projDesc" id="projDesc" value={this.state.peProj.projDesc} onChange={this.handleOnChange} style={{height:'150px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工作内容" required={true} colon={true} className={layoutItem} help={hints.workContHint} validateStatus={hints.workContStatus}>
						<Input type="textarea" name="workCont" id="workCont" value={this.state.peProj.workCont} onChange={this.handleOnChange} style={{height:'150px'}}/>
					</FormItem>

				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['peProjList/create', 'peProjList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreatePeProjPage;
