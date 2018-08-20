import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');

import DictSelect from '../../../lib/Components/DictSelect';
import LevelSelect from '../../lib/Components/LevelSelect';
import JobTreeSelect from '../../lib/Components/JobTreeSelect';
import { Form, Modal, Button, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var EmployeeJobStore = require('../data/EmployeeJobStore');
var EmpJobActions = require('../action/EmpJobActions');


var MoreEmpJobPage = React.createClass({
	getInitialState : function() {
		return {
			modal: this.props.moreFilter,
			hints: {},
			validRules: [],

			empJob: {
				staffCode: '',
				perName: '',
				baseCity: '',
				empLevel: '',
				manUuid: '',
				techUuid: '',
			},
		}
	},

	mixins: [ModalForm('empJob')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'staffCode', desc:'员工编号', required: false, max: '0'},
			{id: 'perName', desc:'姓名', required: false, max: '0'},
			{id: 'empLevel', desc:'员工级别', required: false, max: '0'},
			{id: 'baseCity', desc:'归属地', required: false, max: '0'},
			{id: 'manUuid', desc:'管理岗位', required: false, max: '24'},
			{id: 'techUuid', desc:'技术岗位', required: false, max: '24'},
		];
	},

	render : function(){
		if( !this.state.modal ){
			return null;
		}

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
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'900px',padding:'20px 0px'}}>
				   		<Col span="8">
							<FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
								<Input type="text" name="perName" id="perName" value={this.state.empJob.perName } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem {...formItemLayout2} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
								<Input type="text" name="staffCode" id="staffCode" value={this.state.empJob.staffCode } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
								<Input type="text" name="baseCity" id="baseCity" value={this.state.empJob.baseCity } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem {...formItemLayout2} label="员工级别" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
								<LevelSelect name="empLevel" id="empLevel" value={this.state.empJob.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")}/>
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem {...formItemLayout2} label="技术岗位" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
								<JobTreeSelect name="techUuid" id="techUuid" value={this.state.empJob.techUuid}  onSelect={this.handleOnSelected.bind(this, "techUuid")}/>
							</FormItem>
						</Col>
						<Col span="8">
							<FormItem {...formItemLayout2} label="管理岗位" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
								<JobTreeSelect name="manUuid" id="manUuid" value={this.state.empJob.manUuid} onSelect={this.handleOnSelected.bind(this, "manUuid")}/>
							</FormItem>
						</Col>
					</Form>
				</div>
			</div>
		);
	}
});

export default MoreEmpJobPage;
