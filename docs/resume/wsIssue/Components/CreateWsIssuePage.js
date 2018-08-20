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

var CreateWsIssuePage = React.createClass({
	getInitialState : function() {
		return {
			wsIssueSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			wsIssue: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('wsIssue')],
	onServiceComplete: function(data) {
		if(data.resource==='wsIssueList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'title', desc:'作品名称', required: true},
			{id: 'issueUrl', desc:'文档地址', required: true},
			{id: 'summary', desc:'作品说明', required: true},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.wsIssue.title='';
		this.state.wsIssue.issueUrl='';
		this.state.wsIssue.summary='';
	},

	initPage: function(wsIssue)
	{
		this.state.hints = {};
		Utils.copyValue(wsIssue, this.state.wsIssue);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		console.log('this.state.wsIssue', this.state.wsIssue);
		if(Common.formValidator(this, this.state.wsIssue)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateWsIssue( this.state.wsIssue );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		console.log('this.state.wsIssue', this.state.wsIssue);
		if(Common.formValidator(this, this.state.wsIssue)){
			this.setState({loading: true});
			ResumeActions.addWsIssue( this.state.wsIssue );
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
					<FormItem {...formItemLayout} label="作品名称" required={true} colon={true} className={layoutItem} help={hints.titleHint} validateStatus={hints.titleStatus}>
						<Input type="text" name="title" id="title" value={this.state.wsIssue.title } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="文档地址" required={true} colon={true} className={layoutItem} help={hints.issueUrlHint} validateStatus={hints.issueUrlStatus}>
						<Input type="text" name="issueUrl" id="issueUrl" value={this.state.wsIssue.issueUrl } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="作品说明" required={true} colon={true} className={layoutItem} help={hints.summaryHint} validateStatus={hints.summaryStatus}>
						<Input type="textarea" name="summary" id="summary" value={this.state.wsIssue.summary } onChange={this.handleOnChange}  style={{height:'140px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['wsIssueList/create', 'wsIssueList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateWsIssuePage;
