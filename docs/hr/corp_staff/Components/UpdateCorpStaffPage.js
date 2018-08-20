import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select} from 'antd';
const FormItem = Form.Item;

import EmailInput from '../../../lib/Components/EmailInput';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import AutoInput from '../../../lib/Components/AutoInput';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var CorpStore = require('../data/CorpStaffStore.js');
var CorpActions = require('../action/CorpStaffActions');

var UpdateCorpPage = React.createClass({
	getInitialState : function() {
		return {
			staffSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			staff: {},
			hints: {},
			validRules: [],
			result:[]
		}
	},

	mixins: [Reflux.listenTo(CorpStore, "onServiceComplete"), ModalForm('staff')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.setState({
				  modal: false
			  });
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  staffSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'perName', desc:'用户姓名', required: true, max: 32},
			{id: 'jobTitle', desc:'职位', required: true, max: '64'},
			{id: 'phoneno', desc:'电话', required: true, dataType:'mobile', max: '64'},
			{id: 'email', desc:'电子邮箱', required: false, dataType:'email', max: '64'},
            { id: 'jobDesc', desc:'职务说明', required: false, max: '1024'},
            { id: 'officeLoc', desc: '办公地址', required: false, max: '256' },
		];
	},
	
	initPage: function(staff)
	{
		this.state.hints = {};
		Utils.copyValue(staff, this.state.staff);
		this.state.loading = false;
		this.state.staffSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.staff)){
			this.state.staffSet.operation = '';
			this.setState({loading: true});
			CorpActions.updateCorpStaff( this.state.staff );
		}
	},

	handleSearch : function (value) {
		let result;
		if (!value || value.indexOf('@') >= 0) {
		result = [];
		} else {
		result = Validator.eMailList.map(domain => `${value}@${domain}`);
		}
		this.setState({ result });
	},

	emailOnChange: function(value){
		var obj = this.state.staff;
		obj.email = value;
		Validator.validator(this, obj, 'email');
		this.setState({
			loading: this.state.loading
		});
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		let result = this.state.result;
		const children = result.map((email) => {
			return <Option key={email}>{email}</Option>;
		});
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改关系人信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
				    <ServiceMsg ref='mxgBox' svcList={['hr_corp_staff/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="用户姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
						<Input type="text" name="perName" id="perName" value={this.state.staff.perName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="职位" required={true} colon={true} className={layoutItem} help={hints.jobTitleHint} validateStatus={hints.jobTitleStatus}>
						<Input type="text" name="jobTitle" id="jobTitle" value={this.state.staff.jobTitle} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="电话" required={true} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
						<Input type="text" name="phoneno" id="phoneno" value={this.state.staff.phoneno} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="电子邮箱" colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
                        <EmailInput name="email" id="email" value={this.state.staff.email} onChange={this.emailOnChange} />
					</FormItem>
                    <FormItem {...formItemLayout} label="办公地址" required={false} colon={true} className={layoutItem} help={hints.officeLocHint} validateStatus={hints.officeLocStatus}>
                        <AutoInput name='officeLoc' id='officeLoc' paramName='办公场地' value={this.state.staff.officeLoc} onChange={this.handleOnSelected.bind(this, "officeLoc")} />
					</FormItem>
					<FormItem {...formItemLayout} label="职务说明" colon={true} className={layoutItem} help={hints.jobDescHint} validateStatus={hints.jobDescStatus}>
                        <Input type="textarea" name="jobDesc" id="jobDesc" value={this.state.staff.jobDesc} onChange={this.handleOnChange} style={{ height: '60px' }}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateCorpPage;

