import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select,DatePicker, Row, Col} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;

const FormItem = Form.Item;
const Option = Select.Option;

var DetailEmpSalary = React.createClass({
	getInitialState : function() {
		return {
			empSalary: {},
		}
	},

	mixins: [ModalForm('')],
	componentDidMount : function(){
	},

	initPage: function(empSalary)
	{
		this.setState({empSalary: empSalary});
	},

	render : function() {
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

		return (
			<div>
				<Form layout={layout}>
		 						<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="申请人" required={false} colon={true} className={layoutItem} >
											<Input type="text"  name="applyName" id="applyName"   value={this.state.empSalary.applyName} />
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="申请日期" required={false} colon={true} className={layoutItem} >
											<DatePicker  style={{width:'100%'}}  name="applyDate" id="applyDate"  format={Common.dateFormat} value={this.formatDate(this.state.empSalary.applyDate, Common.dateFormat)} />
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="调整类型" required={false} colon={true} className={layoutItem} >
											<DictSelect name="chgType" id="chgType"  appName='HR系统' optName='薪资调整类型'  value={this.state.empSalary.chgType} />
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工类型" required={false} colon={true} className={layoutItem} >
											<DictSelect name="empType" id="empType" value={this.state.empSalary.empType} appName='HR系统' optName='员工类型'/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col>
										<FormItem {...formItemLayout} label="调前薪水" required={false} colon={true} className={layoutItem}  >
											<Input type="text" name="befSalary" id="befSalary" value={this.state.empSalary.befSalary} />
										</FormItem>
									</Col>
									<Col>
										<FormItem {...formItemLayout} label="调后薪水" required={false} colon={true} className={layoutItem}  >
											<Input type="text" name="aftSalary" id="aftSalary" value={this.state.empSalary.aftSalary} />
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="调整原因" required={false} colon={true} className={layoutItem}  >
									<Input type="textarea" name="chgReason" id="chgReason" value={this.state.empSalary.chgReason} style={{height: '100px'}}/>
								</FormItem>
				</Form>
			</div>
		);
	}
});

export default DetailEmpSalary;
