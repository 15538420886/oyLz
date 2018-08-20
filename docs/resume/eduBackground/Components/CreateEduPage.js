import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select ,DatePicker, Col } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
import DictRadio from '../../../lib/Components/DictRadio';
import DictSelect from '../../../lib/Components/DictSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');


var CreateEduPage = React.createClass({
	getInitialState : function() {
		return {
			eduSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			edu: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('edu')],
	onServiceComplete: function(data) {
		if(data.resource==='eduList' && (data.operation === 'create' || data.operation === 'update')){
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
          {id: 'beginDate', desc:'开始时间', required: true, max: 16},
          {id: 'endDate', desc:'结束时间', required: true, max: 16},
          {id: 'schName', desc:'学校', required: true, max: 128},
          {id: 'deptName', desc:'专业',required: true, max: 256},
          {id: 'qualName', desc:'学历/学位',required: true, max: 256},
		];
	},

	clear : function(appId){
		this.state.hints = {};
		this.state.eduSet.operation='';
		this.state.edu.qualName='本科';
		this.state.edu.schName='';
		this.state.edu.deptName='';
		this.state.edu.studType="是";
		this.state.edu.appId = appId;
	},

	initPage: function(edu)
	{
		this.state.hints = {};
		Utils.copyValue(edu, this.state.edu);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.edu)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateEdu( this.state.edu );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.edu)){
			this.setState({loading: true});
			ResumeActions.addEdu( this.state.edu );
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
				<FormItem {...formItemLayout}  required={true}  label="时间" required={true} colon={true} className={layoutItem}>
					<Col span="6">
						<FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
							<MonthPicker style={{width:'100%'}} name="beginDate" id="beginDate"  value={this.formatMonth(this.state.edu.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)}/>
						</FormItem>
					</Col>
					<Col span="2" style={{textAlign: 'center'}}>
						到
					</Col>
					<Col span="6">
						<FormItem help={hints.endDateHint}  required={true}  validateStatus={hints.endDateStatus}>
							<MonthPicker style={{width:'100%'}}  name="endDate" id="endDate"  value={this.formatMonth(this.state.edu.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)}/>
						</FormItem>
					</Col>
				</FormItem>
			   	<FormItem {...formItemLayout} label="学校" required={true} colon={true} className={layoutItem} help={hints.schNameHint} validateStatus={hints.schNameStatus}>
				    <Input type="text" name="schName" id="schName" value={this.state.edu.schName} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="专业" required={true} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
					<Input type="text" name="deptName" id="deptName" value={this.state.edu.deptName} onChange={this.handleOnChange}/>
					</FormItem>
			   	<FormItem {...formItemLayout}  required={true}  label="学历/学位" colon={true} className={layoutItem} help={hints.qualNameHint} validateStatus={hints.qualNameStatus}>
					<DictSelect name="qualName" id="qualName" value={this.state.edu.qualName}  appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "qualName")}/>
				</FormItem>
				<FormItem {...formItemLayout}  required={true}  label="是否统招：" colon={true} className={layoutItem} help={hints.paraStatusHint} validateStatus={hints.campusLocStatus}>
		            <DictRadio name="studType" id="studType" appName='简历系统' optName='是否统招' onChange={this.onRadioChange} value={this.state.edu.studType}/>
			    </FormItem>
			  </Form>
			  <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
				  <ServiceMsg ref='mxgBox' svcList={['eduList/create', 'eduList/update']}/>
				  <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
		   		  <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} disabled={!this.state.btnOpen} loading={this.state.loading}>保存</Button>{' '}
		   		  <Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			  </div>
			</div>
		);
	}
});

export default CreateEduPage;
