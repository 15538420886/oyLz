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

var CreatePeCompPage = React.createClass({
	getInitialState : function() {
		return {
			peCompSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			peComp: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('peComp')],
	onServiceComplete: function(data) {
		if(data.resource==='peCompList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'compName', desc:'公司名称', required: true, max: 256},
			{id: 'industry', desc:'所处行业',required: false, max: 128},
			{id: 'compLoc', desc:'公司地址',required: false, max: 256},
			{id: 'deptName', desc:'部门名称',required: false, max: 64},
			{id: 'workRole', desc:'岗位',required: true, max: 64},
			{id: 'beginDate', desc:'工作时间',required: true, max: 24},
			{id: 'endDate', desc:'结束时间',required: true, max: 24},

			{id: 'witness', desc:'见证人',required: false, max: 64},
			{id: 'wPhone', desc:'电话',required: false, max: 32 ,dataType:'mobile'},
			{id: 'workCont', desc:'工作内容',required: true, max: 4000},
			{id: 'director', desc:'汇报对象',required: false, max: 16},
			{id: 'subCount', desc:'下属人数',required: false, max: 16},
			{id: 'achieve', desc:'业绩说明',required: false, max: 4000},
			{id: 'leavReason', desc:'离职原因',required: true, max: 4000}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.peCompSet.operation='';
		this.state.peComp.compName='';
		this.state.peComp.industry='互联网';
		this.state.peComp.compLoc='';
		this.state.peComp.deptName='';
		this.state.peComp.workRole='';
		this.state.peComp.beginDate=null;
		this.state.peComp.witness='';
		this.state.peComp.wPhone='';
		this.state.peComp.workCont='';
		this.state.peComp.director='汇报对象';
		this.state.peComp.subCount='';
		this.state.peComp.achieve='';
		this.state.peComp.leavReason='';
	},
	initPage: function(peComp)
	{
		this.state.hints = {};
		Utils.copyValue(peComp, this.state.peComp);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.peComp)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updatePeComp( this.state.peComp );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.peComp)){
			this.setState({loading: true});
			ResumeActions.addPeComp( this.state.peComp );
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
		   			<FormItem {...formItemLayout} label="公司名称" required={true} colon={true} className={layoutItem} help={hints.compNameHint} validateStatus={hints.compNameStatus}>
						<Input type="text" name="compName" id="compName" value={this.state.peComp.compName} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="公司地址" colon={true} className={layoutItem} help={hints.compLocHint} validateStatus={hints.compLocStatus}>
						<Input type="text" name="compLoc" id="compLoc" value={this.state.peComp.compLoc} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="所处行业" colon={true} className={layoutItem} help={hints.industryHint} validateStatus={hints.industryStatus} >
						<DictSelect style={{widht:'100%'}} name="industry" id="industry" value={this.state.peComp.industry}  appName='简历系统' optName='所处行业' onSelect={this.handleOnSelected.bind(this, "industry")} />
					</FormItem >

					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="部门名称" colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
								<Input type="text" name="deptName" id="deptName" value={this.state.peComp.deptName} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="岗位" required={true} colon={true} className={layoutItem} help={hints.workRoleHint} validateStatus={hints.workRoleStatus}>
								<Input type="text" name="workRole" id="workRole" value={this.state.peComp.workRole} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>

					<FormItem {...formItemLayout} label="工作时间" required={true} colon={true} className={layoutItem}>
						<Col span="6">
				   			<FormItem  help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  value={this.formatMonth(this.state.peComp.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
							</FormItem>
						</Col>
						<Col span="2" style={{textAlign: 'center'}}>
							到
						</Col>
						<Col span="6">
				   			<FormItem  help={hints.endDateHint} validateStatus={hints.endDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="endDate" id="endDate"  value={this.formatMonth(this.state.peComp.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
							</FormItem>
						</Col>
					</FormItem>

					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="见证人" colon={true} className={layoutItem} help={hints.witnessHint} validateStatus={hints.witnessStatus}>
								<Input type="text" name="witness" id="witness" value={this.state.peComp.witness} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="电话" colon={true} className={layoutItem} help={hints.wPhoneHint} validateStatus={hints.wPhoneStatus}>
								<Input type="text" name="wPhone" id="wPhone" value={this.state.peComp.wPhone} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>

					<FormItem {...formItemLayout} label="工作内容" required={true} colon={true} className={layoutItem} help={hints.workContHint} validateStatus={hints.workContStatus}>
						<Input type="textarea" name="workCont" id="workCont" value={this.state.peComp.workCont} onChange={this.handleOnChange} style={{height:'150px'}}/>
					</FormItem>

					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="汇报对象" colon={true} className={layoutItem} help={hints.directorHint} validateStatus={hints.directorStatus} >
								<DictSelect name="director" id="director" value={this.state.peComp.director}  appName='简历系统' optName='汇报对象' onSelect={this.handleOnSelected.bind(this, "director")} />
							</FormItem >
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="下属人数" colon={true} className={layoutItem} help={hints.subCountHint} validateStatus={hints.subCountStatus}>
								<Input type="text" name="subCount" id="subCount" value={this.state.peComp.subCount} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>

					<FormItem {...formItemLayout} label="业绩说明" colon={true} className={layoutItem} help={hints.achieveHint}   validateStatus={hints.achieveStatus}>
						<Input type="textarea" name="achieve" id="achieve" value={this.state.peComp.achieve} onChange={this.handleOnChange} style={{height:'70px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="离职原因" required={true} colon={true} className={layoutItem} help={hints.leavReasonHint} validateStatus={hints.leavReasonStatus}>
						<Input type="textarea" name="leavReason" id="leavReason" value={this.state.peComp.leavReason} onChange={this.handleOnChange} style={{height:'70px'}}/>
					</FormItem>

				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['peCompList/create', 'peCompList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreatePeCompPage;
