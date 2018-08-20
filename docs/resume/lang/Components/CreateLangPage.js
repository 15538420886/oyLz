import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio';
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateLangPage = React.createClass({
	getInitialState : function() {
		return {
			langSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			lang: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('lang')],
	onServiceComplete: function(data) {
		if(data.resource==='langList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'langName', desc:'外语语种', required: true},
			{id: 'readLevel', desc:'读写', required: true},
			{id: 'oralLevel', desc:'听说', required: true},
			{id: 'langCert', desc:'相关证书', required: false},
			{id: 'workLang', desc:'工作语言', required: false},
			{id: 'studyLang', desc:'留学语言', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.lang.langName='';
		this.state.lang.readLevel='';
		this.state.lang.oralLevel='';
		this.state.lang.langCert='';
		this.state.lang.workLang='0';
		this.state.lang.studyLang='0';
	},

	initPage: function(lang)
	{
		this.state.hints = {};
		Utils.copyValue(lang, this.state.lang);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.lang)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateLang( this.state.lang );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.lang)){
			this.setState({loading: true});
			ResumeActions.addLang( this.state.lang );
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
					<FormItem {...formItemLayout} label="外语语种" required={true} colon={true} className={layoutItem} help={hints.langNameHint} validateStatus={hints.langNameStatus}>
						<DictSelect name="langName" id="langName" value={this.state.lang.langName } appName='简历系统' optName='工作语言' onChange={this.handleOnSelected.bind(this, "langName")} />
					</FormItem>
					<FormItem {...formItemLayout} label="读写" required={true} colon={true} className={layoutItem} help={hints.readLevelHint} validateStatus={hints.readLevelStatus}>
						<DictSelect name="readLevel" id="readLevel" value={this.state.lang.readLevel } appName='简历系统' optName='熟练程度' onChange={this.handleOnSelected.bind(this, "readLevel")} />
					</FormItem>
					<FormItem {...formItemLayout} label="听说" required={true} colon={true} className={layoutItem} help={hints.oralLevelHint} validateStatus={hints.oralLevelStatus}>
						<DictSelect name="oralLevel" id="oralLevel" value={this.state.lang.oralLevel } appName='简历系统' optName='熟练程度' onChange={this.handleOnSelected.bind(this, "oralLevel")} />
					</FormItem>
					<FormItem {...formItemLayout} label="相关证书" colon={true} className={layoutItem} help={hints.langCertHint} validateStatus={hints.langCertStatus}>
						<Input type="text" name="langCert" id="langCert" value={this.state.lang.langCert } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="工作语言" colon={true} className={layoutItem} help={hints.workLangHint} validateStatus={hints.workLangStatus}>
						<DictRadio name="workLang" id="workLang" value={this.state.lang.workLang} appName='common' optName='是否' onChange={this.onRadioChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="留学语言" colon={true} className={layoutItem} help={hints.studyLangHint} validateStatus={hints.studyLangStatus}>
						<DictRadio name="studyLang" id="studyLang" value={this.state.lang.studyLang} appName='common' optName='是否' onChange={this.onRadioChange}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['langList/create', 'langList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateLangPage;
