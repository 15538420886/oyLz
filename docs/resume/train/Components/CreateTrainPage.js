import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker, Col, Row } from 'antd';
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

var CreateTrainPage = React.createClass({
	getInitialState : function() {
		return {
			trainSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			train: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('train')],
	onServiceComplete: function(data) {
		if(data.resource==='trainList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'beginDate', desc:'开始时间', required: true, max: '0'},
			{id: 'endDate', desc:'结束时间', required: false, max: '0'},
			{id: 'trainType', desc:'培训类型', required: true, max: '0'},
			{id: 'trainComp', desc:'培训机构', required: true, max: '0'},
			{id: 'trainCourse', desc:'培训课程', required: true, max: '0'},
			{id: 'trainLoc', desc:'培训地点', required: false, max: '0'},
			{id: 'trainCert', desc:'获得证书', required: false, max: '0'},
			{id: 'trainCont', desc:'详细说明', required: false, max: '0'},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.train.beginDate='';
		this.state.train.endDate='';
		this.state.train.trainType='';
		this.state.train.trainComp='';
		this.state.train.trainCourse='';
		this.state.train.trainLoc='';
		this.state.train.trainCert='';
		this.state.train.trainCont='';
	},
	initPage: function(train)
	{
		this.state.hints = {};
		Utils.copyValue(train, this.state.train);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.train)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateTrain( this.state.train );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.train)){
			this.setState({loading: true});
			ResumeActions.addTrain( this.state.train );
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

					<FormItem {...formItemLayout} label="培训时间" required={true} colon={true} className={layoutItem}>
						<Col span="6">
							<FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  value={this.formatMonth(this.state.train.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
							</FormItem>
						</Col>
						<Col span="2" style={{textAlign: 'center'}}>
							到
						</Col>
						<Col span="6">
							<FormItem help={hints.endDateHint} validateStatus={hints.endDateStatus}>
								<MonthPicker style={{width:'100%'}}  name="endDate" id="endDate" value={this.formatMonth(this.state.train.endDate, Common.monthFormat)} format={Common.monthFormat} onChange={this.handleOnSelMonth.bind(this,"endDate", Common.monthFormat)}/>
							</FormItem>
							 formatMonth
						</Col>
					</FormItem>

					<FormItem {...formItemLayout} label="培训类型" required={true} colon={true} className={layoutItem} help={hints.trainTypeHint} validateStatus={hints.trainTypeStatus}>
						<DictSelect name="trainType" id="trainType" value={this.state.train.trainType } appName='简历系统' optName='培训类型' onChange={this.handleOnSelected.bind(this, "trainType")} />
					</FormItem>
					<FormItem {...formItemLayout} label="培训机构" required={true} colon={true} className={layoutItem} help={hints.trainCompHint} validateStatus={hints.trainCompStatus}>
						<Input type="text" name="trainComp" id="trainComp" value={this.state.train.trainComp } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="培训课程" required={true} colon={true} className={layoutItem} help={hints.trainCourseHint} validateStatus={hints.trainCourseStatus}>
						<Input type="text" name="trainCourse" id="trainCourse" value={this.state.train.trainCourse } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="培训地点" required={false} colon={true} className={layoutItem} help={hints.trainLocHint} validateStatus={hints.trainLocStatus}>
						<Input type="text" name="trainLoc" id="trainLoc" value={this.state.train.trainLoc } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="获得证书" required={false} colon={true} className={layoutItem} help={hints.trainCertHint} validateStatus={hints.trainCertStatus}>
						<Input type="text" name="trainCert" id="trainCert" value={this.state.train.trainCert } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="详细说明" required={false} colon={true} className={layoutItem} help={hints.trainContHint} validateStatus={hints.trainContStatus}>
						<Input type="textarea" name="trainCont" id="trainCont" value={this.state.train.trainCont } onChange={this.handleOnChange} style={{height:'140px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['trainList/create', 'trainList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreateTrainPage;
