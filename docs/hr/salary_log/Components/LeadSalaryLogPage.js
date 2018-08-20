import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, DatePicker, Tabs, Col, Row } from 'antd';
const FormItem = Form.Item;
const { MonthPicker} = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import DictSelect from '../../../lib/Components/DictSelect';

var SalaryLogStore = require('../data/SalaryLogStore');
var SalaryLogAction = require('../action/SalaryLogAction');

var LeadSalaryLogPage = React.createClass({
	getInitialState : function() {
		return {
			salarySet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			salary:{},
			salaryList: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(SalaryLogStore, "onServiceComplete"), ModalForm('salary')],
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
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			
		];  
		this.initPage(this.props.leadList)
		
	},

	componentWillReceiveProps:function(newProps){
		// this.initPage( newProps.leadList );
	},
	
	initPage: function(leadList)
	{
		this.setState( { 
			salaryList: leadList,
		});
	},

	onClickSave : function(){
		var salary=this.state.salary;
		var salaryList = this.state.salaryList;
		var JsonStr = JSON.stringify(salaryList);
		console.log("工资单文件JsonStr",JsonStr);
		console.log("salary",salary);

		this.state.salarySet.operation = '';
		this.setState({loading: true});
		SalaryLogAction.batchSalaryLog(salary);
		
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
		// console.log(this.state.salary)
		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="导入工资单" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				        	<ServiceMsg ref='mxgBox' svcList={['hr-salary-log/batch-create']}/>
						   <Form layout={layout}>	
								<Row>	
								  <Col span="8">
									<FormItem {...formItemLayout2} label="工资单名称" required={false} colon={true} className={layoutItem} help={hints.salaryBodyHint} validateStatus={hints.salaryBodyStatus}>
										<Input type="text" name="salaryBody" id="salaryBody" value={this.state.salary.salaryBody } onChange={this.handleOnChange} />
									</FormItem>
								  </Col>
								</Row>
								<Row>	
								  <Col span="8">	
									<FormItem {...formItemLayout2} label="发放月份" required={false} colon={true} className={layoutItem} help={hints.salaryMonthHint} validateStatus={hints.salaryMonthStatus}>
										<MonthPicker name="salaryMonth" id="salaryMonth" value={this.formatMonth(this.state.salary.salaryMonth, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"salaryMonth", Common.monthFormat)}/>
									</FormItem>
								  </Col>
								  <Col span="8">
										<FormItem {...formItemLayout2} label="发薪日期" required={false} colon={true} className={layoutItem} help={hints.payDateHint} validateStatus={hints.payDateStatus}>
											<DatePicker name="payDate" id="payDate" value={this.formatDate(this.state.salary.payDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"payDate", Common.dateFormat)}/>
										</FormItem>
								  </Col>
								</Row>
								<Row>	
								  <Col span="8">
									<FormItem {...formItemLayout2} label="工资单文件" required={false} colon={true} className={layoutItem} help={hints.salaryBodyHint} validateStatus={hints.salaryBodyStatus}>
										<Input type="text" name="salaryBody" id="salaryBody" value={this.state.salaryList } onChange={this.handleOnChange} />
									</FormItem>
								  </Col>
								</Row>
								<Row>	
								  <Col span="8">
									<FormItem {...formItemLayout2} label="文件密码" required={false} colon={true} className={layoutItem} help={hints.salaryBodyHint} validateStatus={hints.salaryBodyStatus}>
										<Input type="text" name="salaryBody" id="salaryBody" value={this.state.salary.salaryBody } onChange={this.handleOnChange} />
									</FormItem>
								  </Col>
								</Row>
								<Row>	
								  <Col span="16">
									<FormItem style={{textAlign:'right'}} required={false} colon={true} className={layoutItem}>
				 			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
				 			   		<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
	                            	</FormItem>
                                  </Col>
								</Row>
							  </Form>
							  
		 				</div>
           			</TabPane>
	            </Tabs>
	        </div>
		);
	}
});

export default LeadSalaryLogPage;

