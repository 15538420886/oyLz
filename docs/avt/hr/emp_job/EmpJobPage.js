'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import EmpJobTable from './Components/EmpJobTable';
import CodeMap from '../../../hr/lib/CodeMap';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Row, Col, Button, Input, Spin} from 'antd';
const FormItem = Form.Item;

var EmployeeJobStore = require('./data/EmpJobStore.js');
var EmpJobActions = require('./action/EmpJobActions');


var EmpJobPage = React.createClass({
	getInitialState : function() {
		return {
			empJobSet: {
				eju: {},
            	ejList: [],
				operation : '',
				errMsg : ''
			},

			loading: false,
		}
	},
	mixins: [Reflux.listenTo(EmployeeJobStore, "onServiceComplete"),CodeMap()],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve_p'){
			this.setState({
				loading: false,
				empJobSet: data,
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
			EmpJobActions.initHrEmpJob(filter);
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
		const form = <Form layout={layout} style={{width:'100%', maxWidth:'600px'}}>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工编号" className={layoutItem} >
							<Input type="text" name="staffCode" id="staffCode" value={this.state.empJobSet.eju.staffCode } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="任职部门" className={layoutItem} >
							<Input type="text" name="deptName" id="deptName" value={this.state.empJobSet.eju.deptName } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工类型" className={layoutItem} >
							<Input type="text" name="empType" id="empType" value={Utils.getOptionName('HR系统', '员工类型', this.state.empJobSet.eju.empType, false, this)} readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工级别" className={layoutItem} >
							<Input type="text" name="empLevel" id="empLevel" value={this.getLevelName(corpUuid, this.state.empJobSet.eju.empLevel)} readOnly={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="技术级别" className={layoutItem} >
							<Input type="text" name="techLevel" id="techLevel" value={this.state.empJobSet.eju.techLevel } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="管理级别" className={layoutItem} >
							<Input type="text" name="manLevel" id="manLevel" value={this.state.empJobSet.eju.manLevel } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="技术岗位" className={layoutItem} >
							<Input type="text" name="techUuid" id="techUuid" value={this.state.empJobSet.eju.techName} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="管理岗位" className={layoutItem} >
							<Input type="text" name="manUuid" id="manUuid" value={this.state.empJobSet.eju.manName} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<FormItem {...formItemLayout} label="调整原因" className={layoutItem} >
					<Input type="textarea" name="chgReason" id="chgReason" value={this.state.empJobSet.eju.chgReason } readOnly={true} />
				</FormItem>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="生效日期" className={layoutItem} >
							<Input type="text" name="effectDate" id="effectDate"  value={Common.formatDate(this.state.empJobSet.eju.effectDate, Common.dateFormat)} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
			</Form>

		return (
            <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr_emp_job/retrieve_p', 'hr_emp_job/retrieveDetail']}/>
				{
					this.state.loading? <Spin>{form}</Spin>:form
				}

				<EmpJobTable ejList={this.state.empJobSet.ejList} />
			</div>
		);
	}
});

module.exports = EmpJobPage;

/*
<Col span="12">
	<FormItem {...formItemLayout2} label="审批人" className={layoutItem} >
		<Input type="text" name="approver" id="approver" value={this.state.empJobSet.eju.approver } readOnly={true} />
	</FormItem>
</Col>
*/
