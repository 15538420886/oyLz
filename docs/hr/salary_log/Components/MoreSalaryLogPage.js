import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../lib/Components/DeptTreeSelect';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const FormItem = Form.Item;

var MoreSalaryLogPage = React.createClass({
	getInitialState : function() {
		return {
			modal: this.props.moreFilter,
			hints: {},
			validRules: [],

			salary: {
				salaryMonth:'',
				date1:'',
				date2:'',
				staffCode:'',
				salaryName:'',
				perName:'',
				baseCity:'',
				deptUuid:'',
			},
		}
	},

	mixins: [ModalForm('salary')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'salaryMonth', desc:'发放月份', required: false, max: '24'},
			{id: 'date1', desc:'发薪起始日期', required: false, max: '24'},
			{id: 'date2', desc:'发薪结束日期', required: false, max: '24'},
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'salaryName', desc:'名称', required: false, max: '32'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'baseCity', desc:'归属地', required: false, max: '128'},
			{id: 'deptName', desc:'部门', required: false, max: '24'},
		];
	},


	render : function(){
		if( !this.state.modal ){
			return null;
		};
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 24}),
		};

		var hints=this.state.hints;
		return (
			<div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
						<Row>
						<Col span="6">
							<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
								<Input type="text" name="perName" id="perName" value={this.state.salary.perName } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
				   		<Col span="6">
					  	 	<FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
								<Input type="text" name="staffCode" id="staffCode" value={this.state.salary.staffCode } onChange={this.handleOnChange} />
							</FormItem>
						</Col>

						<Col span="6">
							<FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
					            <Input type="text" name="baseCity" id="baseCity" value={this.state.salary.baseCity } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="6">
							<FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptUuidHint} validateStatus={hints.deptUuidStatus}>
								<DeptTreeSelect name="deptUuid" id="deptUuid" value={this.state.salary.deptUuid } onSelect={this.handleOnSelected.bind(this, "deptUuid")}  />
							</FormItem>
						</Col>
						</Row>
						<Row>
						<Col span="6">
							<FormItem {...formItemLayout} label="发放月份" required={false} colon={true} className={layoutItem} help={hints.salaryMonthHint} validateStatus={hints.salaryMonthStatus}>
								<DatePicker name="salaryMonth" id="salaryMonth" value={this.formatDate(this.state.salary.salaryMonth, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"salaryMonth", Common.dateFormat)}/>
							</FormItem>
						</Col>
						<Col span="6">
							<FormItem {...formItemLayout} label="名称" required={false} colon={true} className={layoutItem} help={hints.salaryNameHint} validateStatus={hints.salaryNameStatus}>
								<Input type="text" name="salaryName" id="salaryName" value={this.state.salary.salaryName } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="6">
						<FormItem {...formItemLayout} label="发薪日期" required={false} colon={true} className={layoutItem} help={hints.date1Hint} validateStatus={hints.date1Status}>
							<DatePicker name="date1" id="date1" value={this.formatDate(this.state.salary.date1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date1", Common.dateFormat)}/>
						</FormItem>
						</Col>
						<Col span="6">
							<FormItem {...formItemLayout} label="到" required={false} colon={true} className={layoutItem} help={hints.date2Hint} validateStatus={hints.date2Status}>
								<DatePicker name="date2" id="date2" value={this.formatDate(this.state.salary.date2, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date2", Common.dateFormat)}/>
							</FormItem>

						</Col>
						</Row>
					</Form>
				</div>
			</div>

		);
	}
});

export default MoreSalaryLogPage;
