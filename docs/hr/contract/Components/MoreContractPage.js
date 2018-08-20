import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Col ,DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ContractStore = require('../data/ContractStore');
var ContractActions = require('../action/ContractActions');

var MoreContractPage = React.createClass({
	getInitialState : function() {
		return {
			modal: this.props.moreFilter,
			hints: {},
			validRules: [],

			contract: {
				staffCode: '',
				perName: '',
				baseCity: '',
				date1: '',
				date2: '',
				expiryDate: '',
			},
		}
	},

	mixins: [ModalForm('contract')],
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
			{id: 'expiryDate', desc:'失效日期', required: false, max: '24'},
			{id: 'perName', desc:'员工', required: false, max: '0'},
			{id: 'staffCode', desc:'员工号', required: false, max: '0'},
			{id: 'baseCity', desc:'归属地', required: false, max: '128'},

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

		var hints=this.state.hints;
		return (
			<div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
				   		<Col span="8">
				  	 	<FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
							<Input type="text" name="staffCode" id="staffCode" value={this.state.contract.staffCode } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
							<Input type="text" name="perName" id="perName" value={this.state.contract.perName } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
							<Input type="text" name="baseCity" id="baseCity" value={this.state.contract.baseCity } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.date1Hint} validateStatus={hints.date1Status}>
							<DatePicker style={{width:'100%'}} name="date1" id="date1"  value={this.formatDate(this.state.contract.date1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date1", Common.dateFormat)}/>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="到" required={false} colon={true} className={layoutItem} help={hints.date2Hint} validateStatus={hints.date2Status}>
							<DatePicker style={{width:'100%'}} name="date2" id="date2"  value={this.formatDate(this.state.contract.date2, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date2", Common.dateFormat)}/>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="失效日期" required={false} colon={true} className={layoutItem} help={hints.expiryDateHint} validateStatus={hints.expiryDateStatus}>
							<DatePicker style={{width:'100%'}} name="expiryDate" id="expiryDate"  value={this.formatDate(this.state.contract.expiryDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"expiryDate", Common.dateFormat)}/>
						</FormItem>
						</Col>
					</Form>
				</div>
			</div>
		);
	}
});

export default MoreContractPage;
