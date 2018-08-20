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

var CreateWsProjPage = React.createClass({
	getInitialState : function() {
		return {
			wsProjSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			wsProj: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('wsProj')],
	onServiceComplete: function(data) {
		if(data.resource==='wsProjList' && (data.operation === 'create' || data.operation === 'update')){
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
		{id: 'projName', desc:'作品名称', required: true},
		{id: 'projUrl', desc:'开源地址', required: true},
		{id: 'projDesc', desc:'作品说明', required: false},
		{id: 'workCont', desc:'参与内容', required: true},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.wsProj.projName='';
		this.state.wsProj.projUrl='';
		this.state.wsProj.projDesc='';
		this.state.wsProj.workCont='';
	},

	initPage: function(wsProj)
	{
		this.state.hints = {};
		Utils.copyValue(wsProj, this.state.wsProj);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.wsProj)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateWsProj( this.state.wsProj );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.wsProj)){
			this.setState({loading: true});
			ResumeActions.addWsProj( this.state.wsProj );
		}
	},
	onClickBack:function(){
		browserHistory.push({
          	pathname:'/resume2/PreviewPage/',
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
					<FormItem {...formItemLayout} label="作品名称" required={true} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
						<Input type="text" name="projName" id="projName" value={this.state.wsProj.projName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="开源地址" required={true} colon={true} className={layoutItem} help={hints.projUrlHint} validateStatus={hints.projUrlStatus}>
						<Input type="text" name="projUrl" id="projUrl" value={this.state.wsProj.projUrl } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="作品说明" required={false} colon={true} className={layoutItem} help={hints.projDescHint} validateStatus={hints.projDescStatus}>
						<Input type="textarea" name="projDesc" id="projDesc" value={this.state.wsProj.projDesc } onChange={this.handleOnChange}  style={{height:'140px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="参与内容" required={true} colon={true} className={layoutItem} help={hints.workContHint} validateStatus={hints.workContStatus}>
						<Input type="textarea" name="workCont" id="workCont" value={this.state.wsProj.workCont } onChange={this.handleOnChange}  style={{height:'100px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['wsProjList/create', 'wsProjList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateWsProjPage;
