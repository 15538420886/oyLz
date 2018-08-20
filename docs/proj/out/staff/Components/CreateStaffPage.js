'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import ProjContext from '../../../ProjContext';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Validator = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select,Tabs,Col,Row, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = AutoComplete.Option;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;

import StaffJobPage from './StaffJob';
var StaffStore = require('../data/StaffStore');
var StaffActions = require('../action/StaffActions');

var CreateStaffPage = React.createClass({
	getInitialState : function() {
		return {
			staffSet: {
				errMsg : ''
			},
			loading: false,
			staff: {},
			hints: {},
			validRules: [],
			result:[]
		}
	},

	mixins: [Reflux.listenTo(StaffStore, "onServiceComplete"),ModalForm('staff')],
	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
          if (data.errMsg === '') {
              var job = this.refs.jobPage.state.job;

	          // 成功，关闭窗口
              this.goBack();

              // 下一步，创建用户
              var nextFunc = this.props.funcCreateUser;
              if (nextFunc !== null && nextFunc !== undefined) {
                  var user = null;
                  var staffCode = this.state.staff.staffCode;

                  var len = data.recordSet.length;
                  for (var i = 0; i < len; i++) {
                      var u = data.recordSet[i];
                      if (u.staffCode == staffCode) {
                          user = u;
                          break;
                      }
                  }

                  if (user !== null) {
                      // console.log('user', user)
                      nextFunc(user, job);
                  }
              }
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              staffSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            { id: 'idCode', desc: '证件编号', required: true, validator: this.checkIcCode, max: '64'},
			{id: 'idType', desc:'证件类型', required: true, max: '32'},
			{id: 'perName', desc:'姓名', required: true, max: '32'},
			{id: 'staffCode', desc:'员工编号', required: true, max: '64'},
			{id: 'jobTitle', desc:'职位', required: false, max: '64'},
            { id: 'baseCity', desc: '归属地', required: true, max: '32'},
            { id: 'phoneno', desc: '电话', required: true, dataType:'mobile', max: '32'},
			{id: 'email', desc:'电子邮箱', required: false, dataType:'email', max: '64'},
            { id: 'eduDegree', desc: '最高学历', required: true, max: '64'},
			{id: 'eduCollege', desc:'毕业院校', required: false, max: '128'},
            { id: 'induYears', desc: '行业经验', required: true, max: '32'},
			{id: 'workYears', desc:'工作年限', required: false, max: '32'},
        ];

        this.clear();
    },
    checkIcCode: function (value, rule, page) {
        var staff = this.state.staff;
        if (staff.idType === '身份证') {
            return Validator.checkDataType(value, 'idcard18');
        }
    },
	
	clear : function(){
		this.state.hints = {};
		this.state.staff.uuid='';
		
		this.state.staff.idCode='';
		this.state.staff.idType='';
		this.state.staff.perName='';
		this.state.staff.staffCode='';
		this.state.staff.jobTitle='';
		this.state.staff.baseCity='';
		this.state.staff.phoneno='';
		this.state.staff.email='';
		this.state.staff.eduDegree='';
		this.state.staff.eduCollege='';
		this.state.staff.induYears='';
        this.state.staff.workYears = '';
		
		if(this.refs.jobPage !== undefined){
			this.refs.jobPage.clear();
		}

		this.state.loading = false;
	    if( typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.staff) && this.refs.jobPage.checkValue()){
			this.setState({loading: true});
			var staff = this.state.staff;
			staff.status ='在岗';
			var job = this.refs.jobPage.state.job;
			staff.corpUuid =  window.loginData.compUser.corpUuid;
            staff.outUuid = ProjContext.selectedOutCorp.uuid;
            staff.corpName = ProjContext.selectedOutCorp.corpName;
            staff.entryDate = '' + Validator.getToday();

			this.refs.jobPage.fun();
			var obj = {os: staff, oj: job};

            // console.log('staff', staff)
			StaffActions.createOutStaff( obj );
		}
	},

	goBack:function(){
        this.props.onBack();
    },
	
	handleOnChange2: function(e) {
		var idx = 1;
		var name = e.target.id;
		var pos = name.indexOf('_');
		var t = name.substr(pos+1);
		if(t === '2'){
			idx = 2;
		}
		name = name.substr(0, pos);

		var obj = this.state.staff;
		var value1 = obj[name];
		var value2 = '0';
		if(value1 === undefined || value1 === null){
			value1 = '0';
		}
		else{
			pos = value1.indexOf('.');
			if(pos > 0){
				value2 = value1.substr(pos+1);
				value1 = value1.substr(0, pos);
			}
		}

		if(idx === 1){
			value1 = e.target.value;
			if(value1 === ''){
				value1 = '0';
			}
		}
		else{
			value2 = e.target.value;
			if(value2 === ''){
				value2 = '0';
			}
		}

		obj[name] = value1 + '.' + value2;
		Validator.validator(this, obj, name);
		this.setState({
            loading: this.state.loading
		});
	},

	getDisplayValue: function(value){
		var value1=value;
		var value2='';
		if(value1 !== undefined && value1 !== null){
			var pos = value1.indexOf('.');
			if(pos > 0){
				value2 = value1.substr(pos+1);
				value1 = value1.substr(0, pos);
				value2 = '' + parseInt(value2);
				value1 = '' + parseInt(value1);

				if(value2 === '0'){
					value2 = '';
				}

				if(value1 === '0'){
					value1 = '';
				}
			}
		}

		return {y: value1, m: value2};
	},

	 onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	handleSearch : function (value) {
		let result;
		if (!value || value.indexOf('@') >= 0) {
		result = [];
		} else {
		result = Validator.eMailList.map(domain => `${value}@${domain}`);
		}
		this.setState({ result });
	},
	
	emailOnChange: function(value){
		var obj = this.state.staff;
		obj.email = value;
		Validator.validator(this, obj, 'email');
		this.setState({
			loading: this.state.loading
		});
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		let result = this.state.result;
		const children = result.map((email) => {
			return <Option key={email}>{email}</Option>;
		});

		var hints=this.state.hints;
		var obj = this.state.staff;
		var corpUuid = window.loginData.compUser.corpUuid;
		var workYears = this.getDisplayValue(obj.workYears);
		var induYears = this.getDisplayValue(obj.induYears);

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}></TabPane>
					<TabPane tab="增加人员" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"16px 0 16px 8px", height: '100%',width:'100%',overflowY: 'auto'}}>
							<div style={{width:'100%', maxWidth:'700px'}}>
							<ServiceMsg ref='mxgBox' svcList={['out-staff/create','out-staff/createWithJob']}/>
								<Form layout={layout}>
									<Row>
										<Col span="12">
											<FormItem {...formItemLayout} label="证件类型" required={true} colon={true} className={layoutItem} help={hints.idTypeHint} validateStatus={hints.idTypeStatus}>
												<DictSelect name="idType" id="idType" value={this.state.staff.idType }  appName='简历系统' optName='证件类型' onSelect={this.handleOnSelected.bind(this, "idType")} />
											</FormItem>
										</Col>		
										<Col span="12">	
											<FormItem {...formItemLayout} label="证件编号" required={true} colon={true} className={layoutItem} help={hints.idCodeHint} validateStatus={hints.idCodeStatus}>
												<Input type="text" name="idCode" id="idCode" value={this.state.staff.idCode } onChange={this.handleOnChange} />
											</FormItem>
										</Col>		
									</Row>	
									<Row>
										<Col span="12">
											<FormItem {...formItemLayout} label="姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
												<Input type="text" name="perName" id="perName" value={this.state.staff.perName } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
										<Col span="12">	
											<FormItem {...formItemLayout} label="员工编号" required={true} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
												<Input type="text" name="staffCode" id="staffCode" value={this.state.staff.staffCode } onChange={this.handleOnChange} />
											</FormItem>
										</Col>	
									</Row>	
									<Row>
										<Col span="12">		
											<FormItem {...formItemLayout} label="职位" required={false} colon={true} className={layoutItem} help={hints.jobTitleHint} validateStatus={hints.jobTitleStatus}>
												<Input type="text" name="jobTitle" id="jobTitle" value={this.state.staff.jobTitle } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
										<Col span="12">		
                                            <FormItem {...formItemLayout} label="归属地" required={true} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
												<Input type="text" name="baseCity" id="baseCity" value={this.state.staff.baseCity } onChange={this.handleOnChange} />
											</FormItem>
										</Col>	
									</Row>	
									<Row>	
										<Col span="12">	
                                            <FormItem {...formItemLayout} label="电话" required={true} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
												<Input type="text" name="phoneno" id="phoneno" value={this.state.staff.phoneno } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="电子邮箱" required={false} colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
												<AutoComplete name="email" id="email" value={this.state.staff.email } onSearch={this.handleSearch} placeholder="请输入电子邮箱" onChange={this.emailOnChange} >
													{children}
												</AutoComplete>
											</FormItem>
										</Col>	
									</Row>
									<Row>	
										<Col span="12">			
                                            <FormItem {...formItemLayout} label="最高学历" required={true} colon={true} className={layoutItem} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
												<DictSelect  name="eduDegree" id="eduDegree" value={this.state.staff.eduDegree } appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")}/>
											</FormItem>
										</Col>
										<Col span="12">	
											<FormItem {...formItemLayout} label="毕业院校" required={false} colon={true} className={layoutItem} help={hints.eduCollegeHint} validateStatus={hints.eduCollegeStatus}>
												<Input type="text" name="eduCollege" id="eduCollege" value={this.state.staff.eduCollege } onChange={this.handleOnChange} />
											</FormItem>
										</Col>	
									</Row>
									<Row>	
										<Col span="12">	
                                            <FormItem {...formItemLayout} label="行业经验" required={true} colon={true} className={layoutItem} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
												<Col span='11'>
													<InputGroup compact>
														<Input style={{ width:'70%'}} type="text" name="induYears_1" id="induYears_1" value={induYears.y} onChange={this.handleOnChange2} />
														<Input style={{ width:'30%',textAlign:'center'}} defaultValue="年" readOnly={true}/>
													</InputGroup>
												</Col>
												<Col span='2'>
												</Col>
												<Col span='11'>
													<InputGroup compact>
														<Input style={{ width:'70%'}} type="text" name="induYears_2" id="induYears_2" value={induYears.m}  onChange={this.handleOnChange2} />
														<Input style={{ width:'30%',textAlign:'center'}} defaultValue="月" readOnly={true}/>
													</InputGroup>
												</Col>
											</FormItem>
										</Col>
										<Col span="12">		
                                            <FormItem {...formItemLayout} label="工作年限" required={false} colon={true} className={layoutItem} help={hints.workYearsHint} validateStatus={hints.workYearsStatus}>
												<Col span='11'>
												 	<InputGroup compact>
														<Input style={{ width:'70%'}} type="text" name="workYears_1" id="workYears_1" value={workYears.y} onChange={this.handleOnChange2} />
														<Input style={{ width:'30%',textAlign:'center'}} defaultValue="年" readOnly={true}/>
													</InputGroup>
												</Col>
												<Col span='2'>
												</Col>
												<Col span='11'>
													<InputGroup compact>
														<Input style={{ width:'70%'}} type="text" name="workYears_2" id="workYears_2" value={workYears.m} onChange={this.handleOnChange2} />
														<Input style={{ width:'30%',textAlign:'center'}} defaultValue="月" readOnly={true}/>
													</InputGroup>
												</Col>
											</FormItem>
										</Col>	
									</Row>
								</Form>
								<StaffJobPage ref='jobPage'/>
								<Form layout={layout}>
									<FormItem style={{textAlign:'right',padding:'4px 0'}} required={false} colon={true} className={layoutItem}>
										<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading} disabled={false}>保存</Button>{' '}
										<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
									</FormItem>
								</Form>	
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
});

export default CreateStaffPage;

