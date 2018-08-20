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

var CreateOtherSkillPage = React.createClass({
	getInitialState : function() {
		return {
			otherSkillSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			otherSkill: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('otherSkill')],
	onServiceComplete: function(data) {
		if(data.resource==='otherSkillList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'skName', desc:'技能名称', required: true},
			{id: 'skLevel', desc:'熟练程度', required: true},
			{id: 'skTime', desc:'使用时长', required: false},
			{id: 'skDesc', desc:'技能描述', required: false},
			{id: 'skHonor', desc:'相关证书', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.otherSkill.skName='';
		this.state.otherSkill.skLevel='';
		this.state.otherSkill.skTime='';
		this.state.otherSkill.skDesc='';
		this.state.otherSkill.skHonor='';
	},

	initPage: function(otherSkill)
	{
		this.state.hints = {};
		Utils.copyValue(otherSkill, this.state.otherSkill);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.otherSkill)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateOtherSkill( this.state.otherSkill );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.otherSkill)){
			this.setState({loading: true});
			ResumeActions.addOtherSkill( this.state.otherSkill );
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
					<FormItem {...formItemLayout} label="技能名称" required={true} colon={true} className={layoutItem} help={hints.skNameHint} validateStatus={hints.skNameStatus}>
						<Input type="text" name="skName" id="skName" value={this.state.otherSkill.skName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="熟练程度" required={true} colon={true} className={layoutItem} help={hints.skLevelHint} validateStatus={hints.skLevelStatus}>
						<DictSelect name="skLevel" id="skLevel" value={this.state.otherSkill.skLevel } appName='简历系统' optName='熟练程度' onChange={this.handleOnSelected.bind(this, "skLevel")} />
					</FormItem>
					<FormItem {...formItemLayout} label="使用时长" colon={true} className={layoutItem} help={hints.skTimeHint} validateStatus={hints.skTimeStatus}>
						<Input type="text" name="skTime" id="skTime" value={this.state.otherSkill.skTime } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="相关证书" colon={true} className={layoutItem} help={hints.skHonorHint} validateStatus={hints.skHonorStatus}>
						<Input type="text" name="skHonor" id="skHonor" value={this.state.otherSkill.skHonor } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="技能描述" colon={true} className={layoutItem} help={hints.skDescHint} validateStatus={hints.skDescStatus}>
                        <Input type="textarea" name="skDesc" id="skDesc" value={this.state.otherSkill.skDesc} onChange={this.handleOnChange} style={{ height: '120px' }}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['otherSkillList/create', 'otherSkillList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateOtherSkillPage;
