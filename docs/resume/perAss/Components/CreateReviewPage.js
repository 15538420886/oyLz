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

var CreateReviewPage = React.createClass({
	getInitialState : function() {
		return {
			reviewSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			review: {},
			hints: {},
			validRules: [],

		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('review')],
	onServiceComplete: function(data) {
		if(data.resource==='reviewList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'reName', desc:'标题',required: true, max: 64},
			{id: 'review', desc:'描述',required: true, max: 4000}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.reviewSet.operation='';
		this.state.review.reName='';
		this.state.review.reLevel='evaluation';
		this.state.review.review='';
	},

	initPage: function(review)
	{
		this.state.hints = {};
		Utils.copyValue(review, this.state.review);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.review)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateReview( this.state.review );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.review)){
			this.setState({loading: true});
			ResumeActions.addReview( this.state.review );
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
                    <FormItem {...formItemLayout} label="标题" required={true} colon={true} className={layoutItem} help={hints.reNameHint} validateStatus={hints.reNameStatus}>
                        <DictSelect name="reName" id="reName" value={this.state.review.reName} appName='简历系统' optName='个人评价' onSelect={this.handleOnSelected.bind(this, "reName")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="描述"  required={true}  colon={true} className={layoutItem} help={hints.reviewHint} validateStatus={hints.reviewStatus}>
						<Input type="textarea" name="review" id="review" value={this.state.review.review} onChange={this.handleOnChange} style={{height:'200px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['reviewList/create', 'reviewList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateReviewPage;
