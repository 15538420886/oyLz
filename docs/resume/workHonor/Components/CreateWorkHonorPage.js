import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateWorkHonorPage = React.createClass({
	getInitialState : function() {
		return {
			workHonorSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			workHonor: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('workHonor')],
	onServiceComplete: function(data) {
		if(data.resource==='workHonorList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'memo2', desc:'公司名称', required: true, max: 32},
			{id: 'hoName', desc:'荣誉名称',required: true, max: 32},
			{id: 'hoLevel', desc:'荣誉级别',required: true, max: 32},
			{id: 'beginDate', desc:'时间',required: true, max: 24},
			{id: 'hoDesc', desc:'说明',required: true, max: 1024},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.workHonorSet.operation='';
		this.state.workHonor.memo2='';
		this.state.workHonor.hoName='';
		this.state.workHonor.hoLevel='公司级';
		this.state.workHonor.beginDate=null;
		this.state.workHonor.hoDesc='';
	},
	initPage: function(workHonor)
	{
		this.state.hints = {};
		Utils.copyValue(workHonor, this.state.workHonor);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.workHonor)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateWorkHonor( this.state.workHonor );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.workHonor)){
			this.setState({loading: true});
			ResumeActions.addWorkHonor( this.state.workHonor );
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
		   			<FormItem {...formItemLayout} label="公司名称" required={true} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
						<Input type="text" name="memo2" id="memo2" value={this.state.workHonor.memo2} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="荣誉名称" required={true} colon={true} className={layoutItem} help={hints.hoNameHint} validateStatus={hints.hoNameStatus}>
						<Input type="text" name="hoName" id="hoName" value={this.state.workHonor.hoName} onChange={this.handleOnChange} />
					</FormItem>

					<FormItem {...formItemLayout} label="荣誉级别" required={true} colon={true} className={layoutItem} help={hints.hoLevelHint} validateStatus={hints.hoLevelStatus} >
						<DictSelect name="hoLevel" id="hoLevel" value={this.state.workHonor.hoLevel}  appName='简历系统' optName='荣誉级别' onSelect={this.handleOnSelected.bind(this, "hoLevel")} />
					</FormItem >
		   			<FormItem  {...formItemLayout} label="时间" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
						<MonthPicker name="beginDate" id="beginDate"  value={this.formatMonth(this.state.workHonor.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
					</FormItem>
					<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.hoDescHint}   validateStatus={hints.hoDescStatus}>
						<Input type="textarea" name="hoDesc" id="hoDesc" value={this.state.workHonor.hoDesc} onChange={this.handleOnChange} style={{height:'150px'}}/>
					</FormItem>

				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['workHonorList/create', 'workHonorList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreateWorkHonorPage;
