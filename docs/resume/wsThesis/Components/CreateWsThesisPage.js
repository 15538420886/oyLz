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

var CreateWsThesisPage = React.createClass({
	getInitialState : function() {
		return {
			wsThesisSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			wsThesis: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('wsThesis')],
	onServiceComplete: function(data) {
		if(data.resource==='wsThesisList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'title', desc:'论文名称', required: true},
			{id: 'journal', desc:'发表期刊', required: true},
			{id: 'isbn', desc:'期刊号', required: false},
			{id: 'honor', desc:'所获奖项', required: false},
			{id: 'summary', desc:'论文摘要', required: false},
			{id: 'workCont', desc:'参与内容', required: true},
			{id: 'thesisUrl', desc:'文档地址', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.wsThesis.title='';
		this.state.wsThesis.journal='';
		this.state.wsThesis.isbn='';
		this.state.wsThesis.honor='';
		this.state.wsThesis.summary='';
		this.state.wsThesis.workCont='';
		this.state.wsThesis.thesisUrl='';
	},

	initPage: function(wsThesis)
	{
		this.state.hints = {};
		Utils.copyValue(wsThesis, this.state.wsThesis);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.wsThesis)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateWsThesis( this.state.wsThesis );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.wsThesis)){
			this.setState({loading: true});
			ResumeActions.addWsThesis( this.state.wsThesis );
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
					<FormItem {...formItemLayout} label="论文名称" required={true} colon={true} className={layoutItem} help={hints.titleHint} validateStatus={hints.titleStatus}>
						<Input type="text" name="title" id="title" value={this.state.wsThesis.title } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="发表期刊" required={true} colon={true} className={layoutItem} help={hints.journalHint} validateStatus={hints.journalStatus}>
						<Input type="text" name="journal" id="journal" value={this.state.wsThesis.journal } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="期刊号" required={false} colon={true} className={layoutItem} help={hints.isbnHint} validateStatus={hints.isbnStatus}>
						<Input type="text" name="isbn" id="isbn" value={this.state.wsThesis.isbn } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="所获奖项" required={false} colon={true} className={layoutItem} help={hints.honorHint} validateStatus={hints.honorStatus}>
						<Input type="text" name="honor" id="honor" value={this.state.wsThesis.honor } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="论文摘要" required={false} colon={true} className={layoutItem} help={hints.summaryHint} validateStatus={hints.summaryStatus}>
						<Input type="textarea" name="summary" id="summary" value={this.state.wsThesis.summary } onChange={this.handleOnChange} style={{height:'140px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="参与内容" required={true} colon={true} className={layoutItem} help={hints.workContHint} validateStatus={hints.workContStatus}>
						<Input type="textarea" name="workCont" id="workCont" value={this.state.wsThesis.workCont } onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="文档地址" required={false} colon={true} className={layoutItem} help={hints.thesisUrlHint} validateStatus={hints.thesisUrlStatus}>
						<Input type="text" name="thesisUrl" id="thesisUrl" value={this.state.wsThesis.thesisUrl } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['wsThesisList/create', 'wsThesisList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateWsThesisPage;
