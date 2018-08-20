import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Input, Row, Col} from 'antd';
const FormItem = Form.Item;
var EmployeeJobStore = require('../data/EmployeeJobStore');
var EmpJobActions = require('../action/EmpJobActions');

var DetailsFromPage = React.createClass({
	getInitialState : function() {
		return {
			empJob: {},
		}
	},

	// 第一次加载
	componentDidMount : function(){
	},
	initPage: function(empJob)
	{
		Utils.copyValue(empJob, this.state.empJob);
		this.setState({hints: {}});
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

		var hints=this.state.hints;
		return (
			<div>
				<Form layout={layout}>
					<FormItem {...formItemLayout} label="调整原因" required={false} colon={true} className={layoutItem}>
						<Input type="textarea" name="chgReason" id="chgReason" value={this.state.empJob.chgReason }/>
					</FormItem>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="approver" id="approver" value={this.state.empJob.approver }/>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="effectDate" id="effectDate" value={this.state.empJob.effectDate }/>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
});

export default DetailsFromPage;
