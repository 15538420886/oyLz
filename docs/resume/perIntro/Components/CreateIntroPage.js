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

var CreateIntroPage = React.createClass({
	getInitialState : function() {
		return {
			introSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			intro: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('intro')],
	onServiceComplete: function(data) {
		if(data.resource==='introList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'introName', desc:'标题', required: true, max: 128},
			{id: 'intro', desc:'简介',required: true, max: 4000}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.introSet.operation='';
		this.state.intro.introName='兴趣爱好';
		this.state.intro.intro='';
	},

	initPage: function(intro)
	{
		this.state.hints = {};
		Utils.copyValue(intro, this.state.intro);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.intro)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateIntro( this.state.intro );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.intro)){
			this.setState({loading: true});
			ResumeActions.addIntro( this.state.intro );
			console.log(this.state.intro)
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
					<FormItem {...formItemLayout} label="标题"  required={true}  colon={true} className={layoutItem} help={hints.introNameHint} validateStatus={hints.introNameStatus}>
						<DictSelect name="introName" id="introName" value={this.state.intro.introName}  appName='简历系统' optName='个人介绍' onSelect={this.handleOnSelected.bind(this, "introName")}/>
					</FormItem>
					
					
					<FormItem {...formItemLayout} label="简介"  required={true}  colon={true} className={layoutItem} help={hints.introHint} validateStatus={hints.introStatus}>
						<Input type="textarea" name="intro" id="intro" value={this.state.intro.intro} onChange={this.handleOnChange} style={{height:'200px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['introList/create', 'introList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			    </div>
			</div>
		);
	}
});

export default CreateIntroPage;
