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

var CreateOtherPage = React.createClass({
	getInitialState : function() {
		return {
			otherSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			other: {},
			hints: {},
			validRules: [],
			
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('other')],
	onServiceComplete: function(data) {
		if(data.resource==='otherList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'infoType', desc:'标题', required: true, max: 128},
			{id: 'infoData1', desc:'内容',required: true, max: 256}
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.otherSet.operation='';
		this.state.other.infoType='宗教信仰';
		this.state.other.infoData1='';
	},

	initPage: function(other)
	{
		this.state.hints = {};
		Utils.copyValue(other, this.state.other);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.other)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateOther( this.state.other );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.other)){
			this.setState({loading: true});
			ResumeActions.addOther( this.state.other );
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
		   			<FormItem {...formItemLayout}  required={true}  label="标题" colon={true} className={layoutItem} help={hints.infoTypeHint} validateStatus={hints.infoTypeStatus}>
						<DictSelect name="infoType" id="infoType" value={this.state.other.infoType}  appName='简历系统' optName='其他信息' onSelect={this.handleOnSelected.bind(this, "infoType")}/>
					</FormItem>
					<FormItem {...formItemLayout}  required={true}  label="内容" colon={true} className={layoutItem} help={hints.infoData1Hint} validateStatus={hints.infoData1Status}>
						<Input type="textarea" name="infoData1" id="infoData1" value={this.state.other.infoData1} onChange={this.handleOnChange} style={{height:'100px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['otherList/create', 'otherList/update']}/>
					<Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateOtherPage;
