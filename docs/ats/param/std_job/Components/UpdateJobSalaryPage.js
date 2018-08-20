import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import DictRadio from '../../../../lib/Components/DictRadio';

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var JobSalaryStore = require('../data/JobSalaryStore');
var JobSalaryActions = require('../action/JobSalaryActions');

var UpdateJobSalaryPage = React.createClass({
	getInitialState : function() {
		return {
			jobSalarySet: {},
			loading: false,
			modal: false,
			jobSalary: {},
			hints: {},
			validRules: [],
		}
	},

	mixins: [Reflux.listenTo(JobSalaryStore, "onServiceComplete"), ModalForm('jobSalary')],
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
				  jobSalarySet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'jobLocal', desc: '地区', required: true, max: 64,},
			{ id: 'jobSalary', desc: '工资范围', max: 24,},
			{ id: 'jobNature', desc: '工作性质', max: 24,},
		];
	},
	
	initPage: function(jobSalary)
	{
		this.state.hints = {};
		Utils.copyValue(jobSalary, this.state.jobSalary);
		this.setState({loading: false});
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.jobSalary)){
			this.setState({loading: true});
			var filterObj = {};
            filterObj.filter = this.props.stdJobUuid;
            filterObj.object = this.state.jobSalary;
			JobSalaryActions.updateStdJob(filterObj);
		}
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改工资信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['stdJob/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} className={layoutItem} label='地区' required={true} colon={true} help={hints.jobLocalHint} validateStatus={hints.jobLocalStatus}>
						<Input type='text' name='jobLocal' id='jobLocal' value={this.state.jobSalary.jobLocal} onChange={this.handleOnChange} disabled={true} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='工作性质' colon={true} help={hints.jobNatureHint} validateStatus={hints.jobNatureStatus}>
						<DictRadio name='jobNature' id='jobNature' appName='招聘管理' optName='工作性质' value={this.state.jobSalary.jobNature} onChange={this.onRadioChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='工资范围' colon={true} help={hints.jobSalaryHint} validateStatus={hints.jobSalaryStatus}>
						<Input type='text' name='jobSalary' id='jobSalary' value={this.state.jobSalary.jobSalary} onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateJobSalaryPage;