import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker, Col } from 'antd';
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

var CreateSchHonorPage = React.createClass({
	getInitialState : function() {
		return {
			SchHonorSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			SchHonor: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('SchHonor')],
	onServiceComplete: function(data) {
		if(data.resource==='honor2List' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'schName', desc:'学校', required: true, max: 128},
			{id: 'hoName', desc:'获得奖项',required: true, max: 32},
			{id: 'hoLevel', desc:'奖项级别',required: true, max: 32},
			{id: 'endDate', desc:'时间',required: true, max: 24},
			{id: 'hoDesc', desc:'说明',required: false, max: 2048}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.SchHonorSet.operation='';
		this.state.SchHonor.schName='';
		this.state.SchHonor.hoName='';
		this.state.SchHonor.hoLevel='班级组';
		this.state.SchHonor.endDate=null;
		this.state.SchHonor.hoDesc='';
	},
	initPage: function(SchHonor)
	{
		this.state.hints = {};
		Utils.copyValue(SchHonor, this.state.SchHonor);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.SchHonor)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateHonor2( this.state.SchHonor );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.SchHonor)){
			this.setState({loading: true});
			ResumeActions.addHonor2( this.state.SchHonor );
		}
	},
	onClickBack:function(){
		browserHistory.push({
			pathname: '/resume2/PreviewPage/',
        });
	},

	render : function(){
		var errMsg = '';
		var operation =this.state.SchHonorSet.operation;
		if( operation === 'create'||operation === 'update'){
			if(this.state.SchHonorSet.errMsg != ''){
				errMsg = this.state.SchHonorSet.errMsg;
			}
			else{
				this.clear();
				this.state.modal = false;
			}
		}

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
		   			<FormItem {...formItemLayout} required={true} label="学校" colon={true} className={layoutItem} help={hints.schNameHint} validateStatus={hints.schNameStatus}>
						<Input type="text" name="schName" id="schName" value={this.state.SchHonor.schName} onChange={this.handleOnChange} />
					</FormItem>

					<FormItem {...formItemLayout} required={true} label="获得奖项" colon={true} className={layoutItem}>
						<Col span="12">
							<FormItem help={hints.hoNameHint} validateStatus={hints.hoNameStatus}>
								<Input type="text" name="hoName" id="hoName" value={this.state.SchHonor.hoName} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem help={hints.hoLevelHint} validateStatus={hints.hoLevelStatus}>
								<DictSelect name="hoLevel" id="hoLevel" value={this.state.SchHonor.hoLevel}  appName='简历系统' optName='奖项级别' onSelect={this.handleOnSelected.bind(this, "hoLevel")} />
							</FormItem>
						</Col>
					</FormItem>

					<FormItem  {...formItemLayout} required={true} label="时间" colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
					    <MonthPicker name="endDate" id="endDate"  value={this.formatMonth(this.state.SchHonor.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
					</FormItem>
					<FormItem {...formItemLayout} required={false} label="说明" colon={true} className={layoutItem} help={hints.hoDescHint} validateStatus={hints.hoDescStatus}>
						<Input type="textarea" name="hoDesc" id="hoDesc" value={this.state.SchHonor.hoDesc} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['honor2List/create', 'honor2List/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreateSchHonorPage;
