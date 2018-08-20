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

var CreateFamilyPage = React.createClass({
	getInitialState : function() {
		return {
			familySet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			family: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('family')],
	onServiceComplete: function(data) {
		if(data.resource==='familyList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'compName', desc:'公司', required: false},
			{id: 'title', desc:'职务', required: false},
			{id: 'phoneNo', desc:'电话', dataType:'mobile', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.family.peName='';
		this.state.family.relation='';
		this.state.family.compName='';
		this.state.family.title='';
		this.state.family.phoneNo='';
	},

	initPage: function(family)
	{
		this.state.hints = {};
		Utils.copyValue(family, this.state.family);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.family)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateFamily( this.state.family );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.family)){
			this.setState({loading: true});
			ResumeActions.addFamily( this.state.family );
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
						<Input type="text" name="peName" id="peName" value={this.state.family.peName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="关系" required={true} colon={true} className={layoutItem} help={hints.relationHint} validateStatus={hints.relationStatus}>
						<DictSelect name="relation" id="relation" value={this.state.family.relation } appName='简历系统' optName='家庭关系' onChange={this.handleOnSelected.bind(this, "relation")} />
					</FormItem>
					<FormItem {...formItemLayout} label="公司" required={false} colon={false} className={layoutItem} help={hints.compNameHint} validateStatus={hints.compNameStatus}>
						<Input type="text" name="compName" id="compName" value={this.state.family.compName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="职务" required={false} colon={false} className={layoutItem} help={hints.titleHint} validateStatus={hints.titleStatus}>
						<Input type="text" name="title" id="title" value={this.state.family.title } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="电话" required={false} colon={false} className={layoutItem} help={hints.phoneNoHint} validateStatus={hints.phoneNoStatus}>
						<Input type="text" name="phoneNo" id="phoneNo" value={this.state.family.phoneNo } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['familyList/create', 'familyList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateFamilyPage;
