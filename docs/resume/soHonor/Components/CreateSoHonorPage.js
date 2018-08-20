import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select ,Row ,Col ,DatePicker } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateSoHonorPage = React.createClass({
	getInitialState : function() {
		return {
			soHonorSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			soHonor: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('soHonor')],
	onServiceComplete: function(data) {
		if(data.resource==='soHonorList' && (data.operation === 'create' || data.operation === 'update')){
			if( data.errMsg === ''){
				this.state.btnOpen=false;
				this.clear();
			}

			this.setState({loading: false});
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.clear();
		this.state.validRules = [
			{id: 'hoName', desc:'奖项名称', required: true},
			{id: 'hoLevel', desc:'颁发机构', required: true},
			{id: 'beginDate', desc:'开始日期', required: true},
			{id: 'endDate', desc:'终止日期', required: false},
			{id: 'hoDesc', desc:'内容', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.soHonor.hoName='';
		this.state.soHonor.hoLevel='';
		this.state.soHonor.beginDate='';
		this.state.soHonor.endDate='';
		this.state.soHonor.hoDesc='';
	},

	initPage: function(soHonor)
	{
		this.state.hints = {};
		Utils.copyValue(soHonor, this.state.soHonor);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.soHonor)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateSoHonor( this.state.soHonor );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.soHonor)){
			this.setState({loading: true});
			ResumeActions.addSoHonor( this.state.soHonor );
		}
	},
	onClickBack:function(){
		browserHistory.push({
			pathname: '/resume2/PreviewPage/',
        });
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};

		var hints=this.state.hints;
		return (
            <div className='resume-form'>
				<Form layout={layout}>
					<FormItem {...formItemLayout} label="奖项名称" required={true} colon={true} className={layoutItem} help={hints.hoNameHint} validateStatus={hints.hoNameStatus}>
						<Input type="text" name="hoName" id="hoName" value={this.state.soHonor.hoName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="颁发机构" required={true} colon={true} className={layoutItem} help={hints.hoLevelHint} validateStatus={hints.hoLevelStatus}>
						<Input type="text" name="hoLevel" id="hoLevel" value={this.state.soHonor.hoLevel } onChange={this.handleOnChange} />
					</FormItem>

					<FormItem {...formItemLayout} label="开始时间" required={true} colon={true} className={layoutItem}>
						<Col span="6">
							<FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  value={this.formatMonth(this.state.soHonor.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
							</FormItem>
						</Col>
						<Col span="2" style={{textAlign: 'center'}}>
							到
						</Col>
						<Col span="6">
							<FormItem help={hints.endDateHint} validateStatus={hints.endDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="endDate" id="endDate"  value={this.formatMonth(this.state.soHonor.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
							</FormItem>
						</Col>
					</FormItem>
					<FormItem {...formItemLayout} label="内容" required={false} colon={true} className={layoutItem} help={hints.hoDescHint} validateStatus={hints.hoDescStatus}>
						<Input type="textarea" name="hoDesc" id="hoDesc" value={this.state.soHonor.hoDesc } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['soHonorList/create', 'soHonorList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateSoHonorPage;
