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
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateSchPracPage = React.createClass({
	getInitialState : function() {
		return {
			schPracSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			schPrac: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('schPrac')],
	onServiceComplete: function(data) {
		if(data.resource==='pracList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'pracName', desc:'实践名称', required: true, max: 128},
			{id: 'endDate', desc:'时间',required: true, max: 24},
			{id: 'pracDesc', desc:'实践内容',required: true, max: 4000}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.schPracSet.operation='';
		this.state.schPrac.pracName='';
		this.state.schPrac.endDate="";
		this.state.schPrac.pracDesc='';
	},
	initPage: function(schPrac)
	{
		this.state.hints = {};
		Utils.copyValue(schPrac, this.state.schPrac);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.schPrac)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updatePrac( this.state.schPrac );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.schPrac)){
			this.setState({loading: true});
			ResumeActions.addPrac( this.state.schPrac );
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
		   			<FormItem  {...formItemLayout} label="时间" required={true} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
					    <MonthPicker name="endDate" id="endDate"  value={this.formatMonth(this.state.schPrac.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
					</FormItem>
		   			<FormItem {...formItemLayout} label="实践名称" required={true} colon={true} className={layoutItem} help={hints.pracNameHint} validateStatus={hints.pracNameStatus}>
						<Input type="text" name="pracName" id="pracName" value={this.state.schPrac.pracName} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="实践内容" required={true} colon={true} className={layoutItem} help={hints.pracDescHint} validateStatus={hints.pracDescStatus}>
						<Input type="textarea" name="pracDesc" id="pracDesc" value={this.state.schPrac.pracDesc} onChange={this.handleOnChange} style={{height:'200px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['pracList/create', 'pracList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreateSchPracPage;
