'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import SalaryListPage from './SalaryListPage';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Row, Col, Button, Input, Spin} from 'antd';
const FormItem = Form.Item;

var SalaryLogStore = require('../data/SalaryLogStore');
var SalaryLogActions = require('../action/SalaryLogActions');


var SalaryLogDetail = React.createClass({
	getInitialState : function() {
		return {
			salaryLogSet: {	
				operation : '',
				errMsg : ''
			},
			salaryLog: {},
			loading: false,
		}
	},
	mixins: [Reflux.listenTo(SalaryLogStore, "onServiceComplete"), ModalForm('salaryLog')],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
			this.setState({
				loading: false,
				salaryLogSet: data,
			});
		}
	},

		// 第一次加载
	componentDidMount : function(){
        this.initPage(this.props.salaryLog);
    },

    componentWillReceiveProps:function(newProps){
        this.initPage( newProps.salaryLog ); 
    },

    initPage: function(salaryLog)
    {
        Utils.copyValue(salaryLog, this.state.salaryLog);
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
						<Input type="text" name="staffCode" id="staffCode" value={this.state.salaryLog.staffCode } readOnly={true}/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem {...formItemLayout2} label="部门名称" className={layoutItem} >
						<Input type="text" name="deptName" id="deptName" value={this.state.salaryLog.deptName } readOnly={true}/>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem {...formItemLayout2} label="银行卡号" className={layoutItem} >
						<Input type="text" name="bankCard" id="bankCard" value={this.state.salaryLog.bankCard } readOnly={true}/>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem {...formItemLayout2} label="工资单名称" className={layoutItem} >
						<Input type="text" name="salaryName" id="salaryName" value={this.state.salaryLog.salaryName } readOnly={true}/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem {...formItemLayout2} label="绩效分数" className={layoutItem} >
						<Input type="text" name="performScore" id="performScore" value={this.state.salaryLog.performScore } readOnly={true}/>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem {...formItemLayout2} label="发放月份" className={layoutItem} >
						<Input type="text" name="salaryMonth" id="salaryMonth" value={Common.formatMonth(this.state.salaryLog.salaryMonth, Common.monthFormat)} readOnly={true}/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem {...formItemLayout2} label="发薪日期" className={layoutItem} >
						<Input type="text" name="payDate" id="payDate" value={Common.formatDate(this.state.salaryLog.payDate, Common.dateFormat)} readOnly={true}/>
					</FormItem>
				</Col>
			</Row>
		</Form>

		return (
			<div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				
				{
					this.state.loading? <Spin>{form}</Spin>:form
				}
				<div style={{width:'640px'}}>
					<SalaryListPage salary={this.state.salaryLog}/>
				</div>
			</div>
		);
	}
});

module.exports = SalaryLogDetail;