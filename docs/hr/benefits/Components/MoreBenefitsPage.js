import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const FormItem = Form.Item;

var BenefitsStore = require('../data/BenefitsStore');
var BenefitsActions = require('../action/BenefitsActions');
var MoreBenefitsPage = React.createClass({
	getInitialState : function() {
		return {
			modal: this.props.moreFilter,
			hints: {},
			validRules: [],

			benefits: {
				s1: '',
				s2: '',
				staffCode: '',
				perName: '',
				baseCity: '',
				entryDate2: '',
				entryDate1: '',
			},
		}
	},

	mixins: [ModalForm('benefits')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 's1', desc:'工资范围下限', required: false, max: '0'},
			{id: 's2', desc:'工资范围上限', required: false, max: '0'},
			{id: 'perName', desc:'姓名', required: false, max: '0'},
			{id: 'staffCode', desc:'员工编号', required: false, max: '0'},
			{id: 'baseCity', desc:'归属地', required: false, max: '0'},
			{id: 'entryDate1', desc:'入职日期开始时间', required: false, max: '0'},
			{id: 'entryDate2', desc:'入职日期结束时间', required: false, max: '0'},
			
		];
	},
	

	render : function(){
		if( !this.state.modal ){
			return null;
		};
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		return (
			<div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
						<Row>
				   		<Col span="8">
				  	 	<FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
							<Input type="text" name="staffCode" id="staffCode" value={this.state.benefits.staffCode } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="员工" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
							<Input type="text" name="perName" id="perName" value={this.state.benefits.perName } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
				            <Input type="text" name="baseCity" id="baseCity" value={this.state.benefits.baseCity } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						</Row>
						<Row>
						<Col span="6">
						<FormItem {...formItemLayout2} label="入职日期" required={false} colon={true} className={layoutItem} help={hints.entryDate1Hint} validateStatus={hints.entryDate1Status}>
							<DatePicker name="entryDate1" id="entryDate1" value={this.formatDate(this.state.benefits.entryDate1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"entryDate1", Common.dateFormat)}/>
						</FormItem>
						</Col>
						<Col span="5">
							<FormItem {...formItemLayout} label="到" required={false} colon={true} className={layoutItem} help={hints.entryDate2Hint} validateStatus={hints.entryDate2Status}>
								<DatePicker name="entryDate2" id="entryDate2" value={this.formatDate(this.state.benefits.entryDate2, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"entryDate2", Common.dateFormat)}/>
							</FormItem>
						</Col>
						<Col span="3">
						</Col>
						<Col span="5">
						<FormItem {...formItemLayout2} label="工资范围" required={false} colon={true} className={layoutItem} help={hints.s1Hint} validateStatus={hints.s1Status}>
							<Input type="text" name="s1" id="s1" value={this.state.benefits.s1 } onChange={this.handleOnChange} />
						</FormItem>
						</Col>
						<Col span="5">
							<FormItem {...formItemLayout} label="到" required={false} colon={true} className={layoutItem} help={hints.s2Hint} validateStatus={hints.s2Status}>
								<Input type="text" name="s2" id="s2" value={this.state.benefits.s2 } onChange={this.handleOnChange} />
							</FormItem>
						
						</Col>
						</Row>
					</Form>
				</div>
			</div>

		);
	}
});

export default MoreBenefitsPage;
