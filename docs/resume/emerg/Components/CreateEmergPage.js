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

var CreateEmergPage = React.createClass({
	getInitialState : function() {
		return {
			emergSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			emerg: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('emerg')],
	onServiceComplete: function(data) {
		if(data.resource==='emergList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'phoneNo', desc:'电话', dataType:'mobile' ,required: true},
			{id: 'phoneNo2', desc:'电话2',dataType:'mobile', required: false},
			{id: 'memo2', desc:'备注', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.emerg.peName='';
		this.state.emerg.relation='';
		this.state.emerg.phoneNo='';
		this.state.emerg.phoneNo2='';
		this.state.emerg.memo2='';
	},

	initPage: function(emerg)
	{
		this.state.hints = {};
		Utils.copyValue(emerg, this.state.emerg);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.emerg)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateEmerg( this.state.emerg );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.emerg)){
			this.setState({loading: true});
			ResumeActions.addEmerg( this.state.emerg );
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
						<Input type="text" name="peName" id="peName" value={this.state.emerg.peName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="关系" required={true} colon={true} className={layoutItem} help={hints.relationHint} validateStatus={hints.relationStatus}>
						<Input type="text" name="relation" id="relation" value={this.state.emerg.relation } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="电话" required={true} colon={true} className={layoutItem} help={hints.phoneNoHint} validateStatus={hints.phoneNoStatus}>
						<Input type="text" name="phoneNo" id="phoneNo" value={this.state.emerg.phoneNo } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="电话2" required={false} colon={true} className={layoutItem} help={hints.phoneNo2Hint} validateStatus={hints.phoneNo2Status}>
						<Input type="text" name="phoneNo2" id="phoneNo2" value={this.state.emerg.phoneNo2 } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
						<Input type="textarea" name="memo2" id="memo2" value={this.state.emerg.memo2 } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['emergList/create', 'emergList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateEmergPage;
