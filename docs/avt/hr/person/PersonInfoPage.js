import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, DatePicker, Row, Col, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio';

var EmployeeStore = require('./data/EmployeeStore');
var EmployeeActions = require('./action/EmployeeActions');

var PersonInfoPage = React.createClass({
	getInitialState : function() {
		return {
			employeeSet: {
				employee: {},
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(EmployeeStore, "onServiceComplete"), ModalForm('employee')],
	onServiceComplete: function(data) {
		if(data.operation === 'retrieve-p'){
			this.setState({
	            loading: false,
	            employeeSet: data
	        });
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.initPage()
	},

	initPage: function()
	{
		if(window.loginData.compUser){
			this.setState({loading: true});
			var filter = {};
			filter.corpUuid = window.loginData.compUser.corpUuid;
			filter.staffCode = window.loginData.compUser.userCode;
			EmployeeActions.initHrEmployee(filter);
		}
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


	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout_0 = {
			labelCol: ((layout=='vertical') ? null : {span: 5}),
			wrapperCol: ((layout=='vertical') ? null : {span: 19}),
		};
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 7}),
			wrapperCol: ((layout=='vertical') ? null : {span: 17}),
		};

		var employee = this.state.employeeSet.employee;
	    var obj = this.state.employeeSet.employee;
		var workYears = this.getDisplayValue(obj.workYears);
		var induYears = this.getDisplayValue(obj.induYears);

		var hints=this.state.hints;
		var form=(<Form  layout={layout} style={{width:'700px'}}>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="证件类型" >
						<Input type="text"  name="idType" id="idType" value={Utils.getOptionName('简历系统', '证件类型',this.state.employeeSet.employee.idType, true, this)} readOnly={true}/>

						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="证件编号" >
							<Input type="text" name="idCode" id="idCode" value={this.state.employeeSet.employee.idCode } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="姓名" >
							<Input type="text" name="perName" id="perName" value={this.state.employeeSet.employee.perName } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="员工编号">
							<Input type="text" name="staffCode" id="staffCode" value={this.state.employeeSet.employee.staffCode } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="职位" >
							<Input type="text" name="jobTitle" id="jobTitle" value={this.state.employeeSet.employee.jobTitle } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="入职时间" >
							<Input type="text" name="entryDate" id="entryDate"  value={Common.formatDate(this.state.employeeSet.employee.entryDate, Common.dateFormat) } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="电话">
							<Input type="text" name="phoneno" id="phoneno" value={this.state.employeeSet.employee.phoneno } readOnly={false}/>
						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="电子邮箱" >
							<Input type="text" name="email" id="email" value={this.state.employeeSet.employee.email } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="最高学历">
						<Input type="text"  name="idType" id="idType" value={Utils.getOptionName('简历系统', '教育背景',this.state.employeeSet.employee.eduDegree, true, this)} readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="毕业院校" >
							<Input type="text" name="eduCollege" id="eduCollege" value={this.state.employeeSet.employee.eduCollege } readOnly={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="工作年限" >
							<Col span='11'>
								<InputGroup compact>
									<Input style={{ width:'70%'}} type="text" name="workYears_1" id="workYears_1" value={workYears.y}  readOnly={true}/>
									<Input style={{ width:'30%',textAlign:'center'}} defaultValue="年" readOnly={true}/>
								</InputGroup>
							</Col>
							<Col span='2'>
							</Col>
							<Col span='11'>
								<InputGroup compact>
									<Input style={{ width:'70%'}} type="text" name="workYears_2" id="workYears_2" value={workYears.m} readOnly={true} />
									<Input style={{ width:'30%',textAlign:'center'}} defaultValue="月" readOnly={true}/>
								</InputGroup>
							</Col>
						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="行业经验">
							<Col span='11'>
								<InputGroup compact>
									<Input style={{ width:'70%'}} type="text" name="induYears_1" id="induYears_1" value={induYears.y} readOnly={true} />
									<Input style={{ width:'30%',textAlign:'center'}} defaultValue="年" readOnly={true}/>
								</InputGroup>
							</Col>
							<Col span='2'>
							</Col>
							<Col span='11'>
								<InputGroup compact>
									<Input style={{ width:'70%'}} type="text" name="induYears_2" id="induYears_2" value={induYears.m} readOnly={true} />
									<Input style={{ width:'30%',textAlign:'center'}} defaultValue="月" readOnly={true}/>
								</InputGroup>
							</Col>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="11">
						<FormItem {...formItemLayout_0} className={layoutItem} label="归属地">
							<Input type="text" name="baseCity" id="baseCity" value={this.state.employeeSet.employee.baseCity } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="13">
						<FormItem {...formItemLayout} className={layoutItem} label="状态" >
							<DictRadio name="status" id="status" value={this.state.employeeSet.employee.status} appName='HR系统' optName='员工状态' />
						</FormItem>
					</Col>
				</Row>
			</Form>
		);

		return (
			<div style={{padding:"24px 0 16px 20px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-employee/retrieve-p']}/>
				{this.state.loading ? <Spin>{form}</Spin> : form}
			</div>
		);
	}
});

module.exports=PersonInfoPage;
