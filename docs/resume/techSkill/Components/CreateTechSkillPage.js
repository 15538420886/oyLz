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

var CreateTechSkillPage = React.createClass({
	getInitialState : function() {
		return {
			techSkillSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			techSkill: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('techSkill')],
	onServiceComplete: function(data) {
		if(data.resource==='techSkillList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'skTime', desc:'使用时长', required: true},
			{id: 'skHonor', desc:'相关证书', required: false},
			{id: 'skDesc', desc:'技能说明', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.techSkill.skName='';
		this.state.techSkill.skLevel='';
		this.state.techSkill.skTime='';
		this.state.techSkill.skHonor='';
		this.state.techSkill.skDesc='';
	},

	initPage: function(techSkill)
	{
		this.state.hints = {};
		Utils.copyValue(techSkill, this.state.techSkill);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.techSkill)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateTechSkill( this.state.techSkill );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.techSkill)){
			this.setState({loading: true});
			ResumeActions.addTechSkill( this.state.techSkill );
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
						<Input type="text" name="skName" id="skName" value={this.state.techSkill.skName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="熟练程度" required={true} colon={true} className={layoutItem} help={hints.skLevelHint} validateStatus={hints.skLevelStatus}>
						<DictSelect name="skLevel" id="skLevel" value={this.state.techSkill.skLevel } appName='简历系统' optName='熟练程度' onChange={this.handleOnSelected.bind(this, "skLevel")} />
					</FormItem>
					<FormItem {...formItemLayout} label="使用时长" required={true} colon={true} className={layoutItem} help={hints.skTimeHint} validateStatus={hints.skTimeStatus}>
						<Input type="text" name="skTime" id="skTime" value={this.state.techSkill.skTime } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="相关证书" colon={true} className={layoutItem} help={hints.skHonorHint} validateStatus={hints.skHonorStatus}>
						<Input type="text" name="skHonor" id="skHonor" value={this.state.techSkill.skHonor } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="技能说明" colon={true} className={layoutItem} help={hints.skDescHint} validateStatus={hints.skDescStatus}>
                        <Input type="textarea" name="skDesc" id="skDesc" value={this.state.techSkill.skDesc} onChange={this.handleOnChange} style={{height: '120px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['techSkillList/create', 'techSkillList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateTechSkillPage;
