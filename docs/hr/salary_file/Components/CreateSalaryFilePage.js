import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictRadio from '../../../lib/Components/DictRadio';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var SalaryFileStore = require('../data/SalaryFileStore.js');
var SalaryFileActions = require('../action/SalaryFileActions');

var CreateSalaryFilePage = React.createClass({
	getInitialState : function() {
		return {
			salaryFileSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			salaryFile: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(SalaryFileStore, "onServiceComplete"), ModalForm('salaryFile')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
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
	              salaryFileSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'colIndex', desc:'列编号', required: true, max: '4'},
			{id: 'colName', desc:'列名称', required: true, max: '64'},
			{id: 'itemCode', desc:'工资代码', required: true, max: '64'},
			{id: 'salaryItem', desc:'工资项', required: true, max: '12'},
		];
	},
	
	clear : function(corpUuid){
		this.state.hints = {};
		this.state.salaryFile.uuid='';
		this.state.salaryFile.corpUuid = corpUuid;
		this.state.salaryFile.colIndex = '';
		this.state.salaryFile.colName = '';
		this.state.salaryFile.itemCode = '';
		this.state.salaryFile.salaryItem = '1';

		
		this.state.loading = false;
	    this.state.salaryFileSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.salaryFile)){
			this.state.salaryFileSet.operation = '';
			this.setState({loading: true});
			SalaryFileActions.createHrSalaryFileItem( this.state.salaryFile );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加工资单" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_salary_file_item/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="列编号" required={true} colon={true} className={layoutItem} help={hints.colIndexHint} validateStatus={hints.colIndexStatus}>
						<Input type="text" name="colIndex" id="colIndex" value={this.state.salaryFile.colIndex} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="列名称" required={true}  colon={true} className={layoutItem} help={hints.colNameHint} validateStatus={hints.colNameStatus}>
						<Input type="text" name="colName" id="colName" value={this.state.salaryFile.colName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工资代码" required={true}  colon={true} className={layoutItem} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
						<Input type="text" name="itemCode" id="itemCode" value={this.state.salaryFile.itemCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工资项" required={true}  colon={true} className={layoutItem} help={hints.salaryItemHint} validateStatus={hints.salaryItemStatus}>
						<DictRadio name="salaryItem" id="salaryItem" value={this.state.salaryFile.salaryItem} appName='common' optName='是否' onChange={this.onRadioChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateSalaryFilePage;

