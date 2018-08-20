import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Col ,DatePicker } from 'antd';
import DeptTreeSelect from '../../lib/Components/DeptTreeSelect';
import DictSelect from '../../../lib/Components/DictSelect';
const FormItem = Form.Item;
const Option = Select.Option;

var LeaveLogStore = require('../data/LeaveLogStore');
var LeaveLogActions = require('../action/LeaveLogActions');

var MoreLeavelLogPage = React.createClass({
	getInitialState : function() {
		return {
			modal: this.props.moreFilter,
			hints: {},
			validRules: [],

			leaveLog: {
				staffCode: '',
				perName: '',
				baseCity: '',
				date1: '',
				date2: '',
				deptUuid:'',
				leaveType:'',
			},
		}
	},

	mixins: [ModalForm('leaveLog')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'date1', desc:'生效日期', required: false, max: '0'},
			{id: 'date2', desc:'到', required: false, max: '0'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'baseCity', desc:'归属地', required: false, max: '128'},
			{id: 'leaveType', desc:'假期类型', required: false, max: '32'},
			{id: 'deptUuid', desc:'部门UUID', required: false, max: '24'},
		];
	},

	render : function(){
		if( !this.state.modal ){
			return null;
		}

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 10}),
			wrapperCol: ((layout=='vertical') ? null : {span: 14}),
		};
		var hints=this.state.hints;
		return (
			<div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '800px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
						<Col span="7">
							<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
								<Input type="text" name="perName" id="perName" value={this.state.leaveLog.perName } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
				   		<Col span="7">
				  	 	<FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
							<Input type="text" name="staffCode" id="staffCode" value={this.state.leaveLog.staffCode } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="10">
						<FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
							<Input type="text" name="baseCity" id="baseCity" value={this.state.leaveLog.baseCity } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="7">
						<FormItem {...formItemLayout} label="类型" required={false} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.jleaveTypeStatus}>
							<DictSelect name="leaveType" id="leaveType"  appName='HR系统' optName='假期类型'  value={this.state.leaveLog.leaveType} onSelect={this.handleOnSelected.bind(this, "leaveType")}/>
						</FormItem>
						</Col>
						<Col span="7">
						<FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptUuidHint} validateStatus={hints.deptUuidStatus}>
							<DeptTreeSelect name="deptUuid" id="deptUuid" value={this.state.leaveLog.deptUuid} onSelect={this.handleOnSelected.bind(this, "deptUuid")}/>
						</FormItem>
						</Col>
						<Col span="10">
							<FormItem {...formItemLayout} label="休假日期" required={false} colon={true} className={layoutItem}>
								<Col span="10">
									<FormItem help={hints.date1Hint} validateStatus={hints.date1Status}>
										<DatePicker style={{width:'100%'}} name="date1" id="date1"  value={this.formatDate(this.state.leaveLog.date1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date1", Common.dateFormat)}/>
									</FormItem>
								</Col>
								<Col span="4" style={{textAlign:'center'}}>
									到
								</Col>
								<Col span="10">
									<FormItem help={hints.date2Hint} validateStatus={hints.date2Status}>
										<DatePicker style={{width:'100%'}} name="date2" id="date2"  value={this.formatDate(this.state.leaveLog.date2, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date2", Common.dateFormat)}/>
									</FormItem>
								</Col>
							</FormItem>
						</Col>
					</Form>
				</div>
			</div>
		);
	}
});

export default MoreLeavelLogPage;
