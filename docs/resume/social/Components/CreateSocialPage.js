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

var CreateSocialPage = React.createClass({
	getInitialState : function() {
		return {
			socialSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			social: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('social')],
	onServiceComplete: function(data) {
		if(data.resource==='socialList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'peName', desc:'姓名', required: true},
			{id: 'relation', desc:'关系', required: true},
			{id: 'title', desc:'职务', required: true},
			{id: 'compName', desc:'公司', required: false},
			{id: 'phoneNo', desc:'电话',dataType:'mobile',  required: false},
			{id: 'compLoc', desc:'地址', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.social.peName='';
		this.state.social.relation='';
		this.state.social.title='';
		this.state.social.compName='';
		this.state.social.phoneNo='';
		this.state.social.compLoc='';
	},

	initPage: function(social)
	{
		this.state.hints = {};
		Utils.copyValue(social, this.state.social);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.social)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateSocial( this.state.social );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.social)){
			this.setState({loading: true});
			ResumeActions.addSocial( this.state.social );
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
					<FormItem {...formItemLayout} label="姓名" required={true} colon={true} className={layoutItem} help={hints.peNameHint} validateStatus={hints.peNameStatus}>
						<Input type="text" name="peName" id="peName" value={this.state.social.peName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="关系" required={true} colon={true} className={layoutItem} help={hints.relationHint} validateStatus={hints.relationStatus}>
						<Input type="text" name="relation" id="relation" value={this.state.social.relation } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="职务" required={true} colon={true} className={layoutItem} help={hints.titleHint} validateStatus={hints.titleStatus}>
						<Input type="text" name="title" id="title" value={this.state.social.title } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="公司" required={false} colon={true} className={layoutItem} help={hints.compNameHint} validateStatus={hints.compNameStatus}>
						<Input type="text" name="compName" id="compName" value={this.state.social.compName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="电话" required={false} colon={true} className={layoutItem} help={hints.phoneNoHint} validateStatus={hints.phoneNoStatus}>
						<Input type="text" name="phoneNo" id="phoneNo" value={this.state.social.phoneNo } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="地址" required={false} colon={true} className={layoutItem} help={hints.compLocHint} validateStatus={hints.compLocStatus}>
						<Input type="textarea" name="compLoc" id="compLoc" value={this.state.social.compLoc } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['socialList/create', 'socialList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateSocialPage;
