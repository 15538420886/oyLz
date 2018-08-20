'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router';
import {Button, Table, Icon,Modal,Form,Input,DatePicker,AutoComplete} from 'antd';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const Option = AutoComplete.Option;
import Context from '../resumeContext';
import ModalForm from '../../lib/Components/ModalForm';
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Validator = require('../../public/script/common');
var ResumeStore = require('./data/ResumeStore');
var ResumeActions = require('./action/ResumeActions');
import DictRadio from '../../lib/Components/DictRadio';
import CreateModPage from '../resume/Components/CreateBuildPage';
import UpdateModPage from '../resume/Components/UpdateBuildPage';
import CreateQueryPage from '../query/Components/CreateQueryPage';

var ResumePage = React.createClass({
	getInitialState : function() {
		var validRules = [
			{id: 'peName', desc:'姓名', required: true},
			{id: 'gender', desc:'性别', required: false},
			{id: 'bhDate', desc:'出生日期', required: false},
			{id: 'bhLoc', desc:'出生地', required: false},
			{id: 'hkLoc', desc:'户口所在地', required: false},
			{id: 'workDate', desc:'参加工作日期', required: true},
			{id: 'workYears', desc:'工作经验', required: true},
			{id: 'national', desc:'民族', required: false},
			{id: 'country', desc:'国籍', required: false},
			{id: 'healthy', desc:'健康状况', required: false},
			{id: 'marital', desc:'婚姻状况', required: false},
			{id: 'political', desc:'政治面貌', required: false},
			{id: 'phoneNo', desc:'手机号码', required: true ,dataType:'mobile'},
			{id: 'email', desc:'电子邮箱', required: true ,dataType:'email'},
		];

		return {
			personSet: {
				operation:'',
				errMsg: ''
			},
			person: {},
			hints: {},
			validRules: validRules,
			loading: false,
			result:[]
		}
	},

	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('person')],
	onServiceComplete: function(data) {
		if(data.resource !== 'person'){
			return;
		}

		if(data.operation === 'find'){
			var person={};
			if( data.errMsg === ''){
				// 复制数据
				for(var name in data.person){
					try{
						var value = data.person[name];
						if(value != null && !(typeof(value) === "object" && value.constructor === Array)){
							person[name] = value;
						}
					}catch(E){}
				}
			}

			this.setState({
				loading: false,
				person: person,
				personSet: data
			});
		}
		else if(data.operation === 'update'){
			if( data.errMsg === ''){
				// 修改列表
				var app=Context.resumeApp;
				app.gender = data.person.gender;
				app.email = data.person.email;
				app.phoneNo = data.person.phoneNo;
			}

			this.setState({
				loading: false,
			});
		}
		else if(data.operation === 'noResume'){
			// 如果用户没有简历的话，显示增加简历的页面
			this.handleOpenCreateWindow();
			this.setState({
				loading: false,
			});
		}
	},

	componentDidMount : function(){
		var app=Context.resumeApp;
		this.setState({loading: true});
		if(app.id){
			ResumeActions.getResumeByID(app.id);
		}else{
			var id = window.loginData.authUser.userId;
			ResumeActions.getResumeByIdCode(id);
		}
	},

	handleOpenCreateWindow : function(event) {
		var staffCode = window.loginData.compUser.userCode;
		this.refs.createWindow.clear(staffCode);
		this.refs.createWindow.toggle();
	},

	onClickSave:function(){
		this.setState({loading: true});
		ResumeActions.updateResume(this.state.person);
	},
	onClickBack:function(){
		browserHistory.push({
          	pathname: '/resume2/PreviewPage/',
        });
	},

	handleSearch : function (value) {
		console.log(value);
		let result;
		if (!value || value.indexOf('@') >= 0) {
		result = [];
		} else {
		result = Validator.eMailList.map(domain => `${value}@${domain}`);
		}
		console.log(result);
		this.setState({ result });
	},

	emailOnChange: function(value){
		var obj = this.state.person;
		obj.email = value;
		Validator.validator(this, obj, 'email');
		this.setState({
			loading: this.state.loading
		});
	},

	render : function() {
		var person = this.state.personSet.person;

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		let result = this.state.result;
		const children = result.map((email) => {
			return <Option key={email}>{email}</Option>;
		});
		var hints=this.state.hints;

	return (
     <div className='resume-page'>
     	<div style={{width:'100%', maxWidth:'700px', padding: '24px 24px 16px 24px'}}>
	        <Form layout={layout}>
				<FormItem {...formItemLayout} label="姓名" required={true} colon={true} className={layoutItem} help={hints.peNameHint} validateStatus={hints.peNameStatus}>
					<Input type="text" readOnly='true' name="peName" id="peName" value={this.state.person.peName } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="性别" required={false} colon={true} className={layoutItem} help={hints.genderHint} validateStatus={hints.genderStatus}>
					<DictRadio name="gender" id="gender" appName='简历系统' optName='性别' onChange={this.onRadioChange} value={this.state.person.gender }/>
				</FormItem>
				<FormItem {...formItemLayout} label="出生日期" required={false} colon={true} className={layoutItem} help={hints.bhDateHint} validateStatus={hints.bhDateStatus}>
					<DatePicker name="bhDate" id="bhDate"  value={this.formatDate(this.state.person.bhDate, Validator.dateFormat)}  format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this,"bhDate", Validator.dateFormat)} />
				</FormItem>
				<FormItem {...formItemLayout} label="出生地" required={false} colon={true} className={layoutItem} help={hints.bhLocHint} validateStatus={hints.bhLocStatus}>
					<Input type="text" name="bhLoc" id="bhLoc" value={this.state.person.bhLoc } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="户口所在地" required={false} colon={true} className={layoutItem} help={hints.hkLocHint} validateStatus={hints.hkLocStatus}>
					<Input type="text" name="hkLoc" id="hkLoc" value={this.state.person.hkLoc } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="参加工作日期" required={true} colon={true} className={layoutItem} help={hints.workDateHint} validateStatus={hints.workDateStatus}>
					<MonthPicker name="workDate" id="workDate" value={this.formatMonth(this.state.person.workDate, Validator.monthFormat)} format={Validator.monthFormat} onChange={this.handleOnSelMonth.bind(this,"workDate", Validator.monthFormat)}/>
				</FormItem>
				<FormItem {...formItemLayout} label="工作经验" required={true} colon={true} className={layoutItem} help={hints.workYearsHint} validateStatus={hints.workYearsStatus}>
					<Input type="text" name="workYears" id="workYears" value={this.state.person.workYears } onChange={this.handleOnChange} style={{width: '160px'}}/>
				</FormItem>
				<FormItem {...formItemLayout} label="民族" required={false} colon={true} className={layoutItem} help={hints.nationalHint} validateStatus={hints.nationalStatus}>
					<Input type="text" name="national" id="national" value={this.state.person.national } onChange={this.handleOnChange} style={{width: '160px'}}/>
				</FormItem>
				<FormItem {...formItemLayout} label="国籍" required={false} colon={true} className={layoutItem} help={hints.countryHint} validateStatus={hints.countryStatus}>
					<Input type="text" name="country" id="country" value={this.state.person.country } onChange={this.handleOnChange} style={{width: '160px'}}/>
				</FormItem>
				<FormItem {...formItemLayout} label="健康状况" required={false} colon={true} className={layoutItem} help={hints.healthyHint} validateStatus={hints.healthyStatus}>
					<Input type="text" name="healthy" id="healthy" value={this.state.person.healthy } onChange={this.handleOnChange} style={{width: '160px'}}/>
				</FormItem>
				<FormItem {...formItemLayout} label="婚姻状况" required={false} colon={true} className={layoutItem} help={hints.maritalHint} validateStatus={hints.maritalStatus}>
					<DictRadio name="marital" id="marital" value={this.state.person.marital } appName='简历系统' optName='婚姻状况' onChange={this.onRadioChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="政治面貌" required={false} colon={true} className={layoutItem} help={hints.politicalHint} validateStatus={hints.politicalStatus}>
					<DictRadio name="political" id="political" value={this.state.person.political } appName='简历系统' optName='政治面貌' onChange={this.onRadioChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="手机号码" required={true} colon={true} className={layoutItem} help={hints.phoneNoHint} validateStatus={hints.phoneNoStatus}>
					<Input type="text" name="phoneNo" id="phoneNo" value={this.state.person.phoneNo } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="电子邮箱" required={true} colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
					<AutoComplete name="email" id="email" value={this.state.person.email } onSearch={this.handleSearch} placeholder="请输入电子邮箱" onChange={this.emailOnChange} >
						{children}
					</AutoComplete>
				</FormItem>
	        </Form>
			<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
				<ServiceMsg ref='mxgBox' svcList={['socialList/create', 'socialList/update']}/>
		   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保 存</Button>{' '}
		   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
		   </div>
		</div>
		<CreateQueryPage ref="createWindow"/>
    </div>
    );
  }
});

module.exports = ResumePage;
