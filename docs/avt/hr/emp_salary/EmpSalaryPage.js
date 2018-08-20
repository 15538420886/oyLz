'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import EmpSalaryTable from './Components/EmpSalaryTable';
import CodeMap from '../../../hr/lib/CodeMap';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Row, Col, Button, Input, Spin} from 'antd';
const FormItem = Form.Item;

var EmployeeSalaryStore = require('./data/EmpSalaryStore.js');
var EmpSalaryActions = require('./action/EmpSalaryActions');


var EmpSalaryPage = React.createClass({
	getInitialState : function() {
		return {
			empSalarySet: {
				hesu: {},
            	hesList: [],
				operation : '',
				errMsg : ''
			},

			loading: false,
		}
	},
	mixins: [Reflux.listenTo(EmployeeSalaryStore, "onServiceComplete"),CodeMap()],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve_p'){
			this.setState({
				loading: false,
				empSalarySet: data,
			});
		}
	},

		// 第一次加载
	componentDidMount : function(){
		if(window.loginData.compUser){
			var filter = {};
			filter.staffCode=window.loginData.compUser.userCode;
			filter.corpUuid=window.loginData.compUser.corpUuid;
			this.setState({loading: true});
			EmpSalaryActions.initHrEmpSalary(filter);
		}

	},

	render : function() {
		var corpUuid= window.loginData.compUser.corpUuid;
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
		const form = <Form layout={layout} style={{width:'640px'}}>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工编号" className={layoutItem} >
							<Input type="text" name="staffCode" id="staffCode" value={this.state.empSalarySet.hesu.staffCode } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="任职部门" className={layoutItem} >
							<Input type="text" name="deptName" id="deptName" value={this.state.empSalarySet.hesu.deptName } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="申请人" className={layoutItem} >
							<Input type="text"  name="applyName" id="applyName"   value={this.state.empSalarySet.hesu.applyName} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="申请日期" className={layoutItem} >
							<Input type="text" name="applyDate" id="applyDate" value={Common.formatDate(this.state.empSalarySet.hesu.applyDate, Common.dateFormat)} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="调整类型" className={layoutItem} >
							<Input type="text" name="chgType" id="chgType" value={Utils.getOptionName('HR系统', '薪资调整类型', this.state.empSalarySet.hesu.chgType, false, this)} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工类型" className={layoutItem} >
							<Input type="text" name="empType" id="empType" value={Utils.getOptionName('HR系统', '员工类型', this.state.empSalarySet.hesu.empType, false, this)} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="调前薪水" className={layoutItem} >
							<Input type="text" name="befSalary" id="befSalary" value={this.state.empSalarySet.hesu.befSalary} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="调后薪水" className={layoutItem} >
							<Input type="text" name="aftSalary" id="aftSalary" value={this.state.empSalarySet.hesu.aftSalary} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<FormItem {...formItemLayout} label="调整原因" className={layoutItem} >
					<Input type="textarea" name="chgReason" id="chgReason" value={this.state.empSalarySet.hesu.chgReason} readOnly={true} />
				</FormItem>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="生效日期" className={layoutItem} >
							<Input type="text"  name="effectDate" id="effectDate" value={Common.formatDate(this.state.empSalarySet.hesu.effectDate, Common.dateFormat)} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="执行月份" className={layoutItem} >
							<Input type="text"  name="chgMonth" id="chgMonth"  value={Common.formatMonth(this.state.empSalarySet.hesu.chgMonth, Common.monthFormat)} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
			</Form>

		return (
            <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-emp-salary/retrieve_p', 'hr_emp_Salary/retrieveTable']}/>
				{
					this.state.loading? <Spin>{form}</Spin>:form
				}

				<EmpSalaryTable hesList={this.state.empSalarySet.hesList} />
			</div>
		);
	}
});

module.exports = EmpSalaryPage;

/*
	<Row>
		<Col span="12">
			<FormItem {...formItemLayout2} label="直接主管" className={layoutItem} >
				<Input type="text"  name="manager" id="manager"   value={this.state.empSalarySet.hesu.manager} readOnly={true} />
			</FormItem>
		</Col>
		<Col span="12">
			<FormItem {...formItemLayout2} label="审批人" className={layoutItem} >
				<Input type="text" name="approver" id="approver"  value={this.state.empSalarySet.hesu.approver} readOnly={true} />
			</FormItem>
		</Col>
	</Row>
*/
