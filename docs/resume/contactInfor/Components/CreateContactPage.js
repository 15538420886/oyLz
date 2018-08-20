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
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateContactPage = React.createClass({
	getInitialState : function() {
		return {
			contactSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			contact: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('contact')],
	onServiceComplete: function(data) {
		if(data.resource==='contactList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'contType', desc:'类型', required: true, max: 128},
			{id: 'contData1', desc:'内容1',required: true, max: 1024},
			{id: 'contData2', desc:'内容2',required: false, max: 1024}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.contactSet.operation='';
		this.state.contact.contType='户籍地址';
		this.state.contact.contData1='';
		this.state.contact.contData2='';
	},

	initPage: function(contact)
	{
		this.state.hints = {};
		Utils.copyValue(contact, this.state.contact);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.contact)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateContact( this.state.contact );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.contact)){
			this.setState({loading: true});
			ResumeActions.addContact( this.state.contact );
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
					<FormItem {...formItemLayout} label="标题"  required={true}  colon={true} className={layoutItem} help={hints.contTypeHint} validateStatus={hints.contTypeStatus}>
						<DictSelect name="contType" id="contType" value={this.state.contact.contType}  appName='简历系统' optName='联系方式' onSelect={this.handleOnSelected.bind(this, "contType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="内容1"  required={true}  colon={true} className={layoutItem} help={hints.contData1Hint} validateStatus={hints.contData1Status}>
						<Input type="textarea" name="contData1" id="contData1" value={this.state.contact.contData1} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="内容2"  required={false}  colon={true} className={layoutItem} help={hints.contData2Hint} validateStatus={hints.contData2Status}>
						<Input type="textarea" name="contData2" id="contData2" value={this.state.contact.contData2} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['contactList/create', 'contactList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateContactPage;
