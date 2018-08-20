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

var CreateIdentityPage = React.createClass({
	getInitialState : function() {
		return {
			identitySet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			identity: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('identity')],
	onServiceComplete: function(data) {
		if(data.resource==='identityList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'idType', desc:'类型', required: true, max: 128},
			{id: 'idData1', desc:'内容1',required: true, max: 256},
			{id: 'idData2', desc:'内容2',required: false, max: 256}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.identitySet.operation='';
		this.state.identity.idType='身份证';
		this.state.identity.idData1='';
		this.state.identity.idData2='';
	},

	initPage: function(identity)
	{
		this.state.hints = {};
		Utils.copyValue(identity, this.state.identity);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.identity)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateIdentity( this.state.identity );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.identity)){
			this.setState({loading: true});
			ResumeActions.addIdentity( this.state.identity );
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
					<FormItem {...formItemLayout} label="类型"  required={true}  colon={true} className={layoutItem} help={hints.idTypeHint} validateStatus={hints.idTypeStatus}>
						<DictSelect name="idType" id="idType"  value={this.state.identity.idType}  appName='简历系统' optName='身份信息' onSelect={this.handleOnSelected.bind(this, "idType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="内容1"  required={true}  colon={true} className={layoutItem} help={hints.idData1Hint} validateStatus={hints.idData1Status}>
						<Input type="textarea" name="idData1" id="idData1" value={this.state.identity.idData1} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
					<FormItem {...formItemLayout} label="内容2"  required={false}  colon={true} className={layoutItem} help={hints.idData2Hint} validateStatus={hints.idData2Status}>
						<Input type="textarea" name="idData2" id="idData2" value={this.state.identity.idData2} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['identityList/create', 'identityList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateIdentityPage;
