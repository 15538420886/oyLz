import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, DatePicker, Tabs, Col, Row, Spin } from 'antd';
const FormItem = Form.Item;
const { MonthPicker} = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import DictSelect from '../../../lib/Components/DictSelect';
import SalaryListPage from './SalaryListPage';
var SalaryLogStore = require('../data/SalaryLogStore');
var SalaryLogAction = require('../action/SalaryLogAction');

var UpdateSalaryLogPage = React.createClass({
	getInitialState : function() {
		return {
			salarySet: {
				operation : '',
				errMsg : ''
			},
			salaryItemSet: {
				recordSet: [],
				errMsg : ''
			},
			loading: false,
			salary: {},
			factorList: [],
			hints: {},
			validRules: []
		}
	},

	mixins: [
			Reflux.listenTo(SalaryLogStore, "onServiceComplete"),
			ModalForm('salary')
	],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  salarySet: data
			  });
		  }
	  };
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
        	{id: 'salaryMonth', desc:'发放月份', required: true, max: '24'},
        	{id: 'staffCode', desc:'员工编号', required: true, max: '64'},
        	{id: 'salaryName', desc:'工资条名称', required: true, max: '64'},
			{id: 'salaryBody', desc:'工资条', required: true},
        ];

		this.initPage( this.props.salary );
	},

	componentWillReceiveProps:function(newProps){
		// this.initPage( newProps.salary );
	},

	initPage: function(salary)
	{
		Utils.copyValue(salary, this.state.salary);
		this.setState( {loading: false, hints: {}} );
		this.state.salarySet.operation='';
		if(  typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(salaryList){
		var JsonStr=JSON.stringify(salaryList);
		this.state.salary.salaryBody=JsonStr;
		if(!Common.formValidator(this, this.state.salary)){
			return;
		}

		this.setState({loading: true});
		SalaryLogAction.updateHrSalaryLog( this.state.salary );
	},

	goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		var hints=this.state.hints;
		var form=(
			 <Form layout={layout}>
				<Row>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="员工编号" required={true} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
						<Input type="text" name="staffCode" id="staffCode" value={this.state.salary.staffCode } onChange={this.handleOnChange} disabled={true} />
					</FormItem>
				  </Col>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus} >
						<Input type="text" name="perName" id="perName" value={this.state.salary.perName } onChange={this.handleOnChange} disabled={true} />
					</FormItem>
				  </Col>
				</Row>
				<Row>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="部门名称" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
						<Input type="text" name="deptName" id="deptName" value={this.state.salary.deptName } onChange={this.handleOnChange} disabled={true} />
					</FormItem>
				  </Col>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="银行卡号" required={false} colon={true} className={layoutItem} help={hints.bankCardHint} validateStatus={hints.bankCardStatus}>
						<Input type="text" name="bankCard" id="bankCard" value={this.state.salary.bankCard } onChange={this.handleOnChange} />
					</FormItem>
				  </Col>
				</Row>
				<Row>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="工资单名称" required={true} colon={true} className={layoutItem} help={hints.salaryNameHint} validateStatus={hints.salaryNameStatus}>
						<Input type="text" name="salaryName" id="salaryName" value={this.state.salary.salaryName } onChange={this.handleOnChange} />
					</FormItem>
				  </Col>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="绩效分数" required={false} colon={true} className={layoutItem} help={hints.performScoreHint} validateStatus={hints.performScoreStatus}>
						<Input type="text" name="performScore" id="performScore" value={this.state.salary.performScore } onChange={this.handleOnChange} />
					</FormItem>
				  </Col>
				</Row>
				<Row>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="发放月份" required={true} colon={true} className={layoutItem} help={hints.salaryMonthHint} validateStatus={hints.salaryMonthStatus}>
						<MonthPicker name="salaryMonth" id="salaryMonth" style={{width:'100%'}} value={this.formatDate(this.state.salary.salaryMonth, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"salaryMonth", Common.monthFormat)}/>
					</FormItem>
				  </Col>
				  <Col span="12">
						<FormItem {...formItemLayout2} label="发薪日期" required={false} colon={true} className={layoutItem} help={hints.payDateHint} validateStatus={hints.payDateStatus}>
							<DatePicker name="payDate" id="payDate" style={{width:'100%'}} value={this.formatDate(this.state.salary.payDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"payDate", Common.dateFormat)}/>
						</FormItem>
				  </Col>
				</Row>
			</Form>
			)

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onTabClick={this.goBack}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="修改工资单" key="2" style={{width: '100%', height: '100%'}}>
                      <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                          <div style={{ padding: "8px", height: '100%', overflowY: 'auto' }} >
                              <ServiceMsg ref='mxgBox' svcList={['hr-salary-log/update']} />
                              <div style={{ width: '100%', maxWidth: '700px' }}>
				        	    {this.state.loading ? <Spin>{form}</Spin> : form}
						   	    <SalaryListPage onSave={this.onClickSave} onBack={this.goBack} salary={this.state.salary}/>
						    </div>
						</div>
					  </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default UpdateSalaryLogPage;
