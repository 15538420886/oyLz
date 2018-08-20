import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Button, Icon, Input, DatePicker, Tabs, Col, Row, Spin, Upload } from 'antd';
const FormItem = Form.Item;
const { MonthPicker} = DatePicker;
const TabPane = Tabs.TabPane;
var SalaryLogStore = require('../data/SalaryLogStore');
var SalaryLogAction = require('../action/SalaryLogAction');

var UploadSalaryPage = React.createClass({
	getInitialState : function() {
		return {
			loading: false,
			salary: {},
			salaryFile: null,
			hints: {},
			validRules: []
		}
	},

	mixins: [
			Reflux.listenTo(SalaryLogStore, "onServiceComplete"),
			ModalForm('salary')
	],
	onServiceComplete: function(data) {
	  if( data.operation === 'upload'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  this.setState({loading: false});
		  }
	  };
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
        	{id: 'salaryMonth', desc:'发放月份', required: true, max: '24'},
        	{id: 'salaryFile', desc:'工资单文件', required: true, max: '128'},
        	{id: 'salaryName', desc:'工资条名称', required: true, max: '64'},
        ];

		this.initPage();
	},
	componentWillReceiveProps:function(newProps){
	},
	initPage: function(){
		this.setState( {loading:false, hints:{}, salary:{}, salaryFile: null} );
		if(  typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},
	beforeUpload: function(file) {
		this.state.salary.salaryFile = file.name;
		this.setState( {salaryFile: file} );
		return false;
	},

	onClickSave : function(salaryList){
		if(!Common.formValidator(this, this.state.salary)){
			return;
		}

        this.setState({ loading: true });
        this.state.salary.corpUuid = window.loginData.compUser.corpUuid;
		SalaryLogAction.uploadFile( this.state.salary, this.state.salaryFile );
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		var form=(
			 <Form layout={layout} style={{margin:'12px 0 0 0'}}>
				<Row>
					<FormItem {...formItemLayout} label="工资单名称" required={true} colon={true} className={layoutItem} help={hints.salaryNameHint} validateStatus={hints.salaryNameStatus}>
						<Input type="text" name="salaryName" id="salaryName" value={this.state.salary.salaryName } onChange={this.handleOnChange} />
					</FormItem>
				</Row>
				<Row>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="发放月份" required={true} colon={true} className={layoutItem} help={hints.salaryMonthHint} validateStatus={hints.salaryMonthStatus}>
						<MonthPicker name="salaryMonth" id="salaryMonth" style={{width:'100%'}} value={this.formatDate(this.state.salary.salaryMonth, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"salaryMonth", Common.monthFormat)}/>
					</FormItem>
				  </Col>
				  <Col span="12">
						<FormItem {...formItemLayout2} label="发薪日期" required={false} colon={true} className={layoutItem} help={hints.payDateHint} validateStatus={hints.payDateStatus}>
							<DatePicker name="payDate" id="payDate" style={{width:'100%'}} value={this.formatDate(this.state.salary.payDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"payDate", Common.dateFormat)}/>
						</FormItem>
				  </Col>
				</Row>
				<Row>
					<FormItem {...formItemLayout} label="工资单文件" required={true} colon={true} className={layoutItem} help={hints.salaryFileHint} validateStatus={hints.salaryFileStatus}>
						<Col span="19">
							<Input type="text" name="salaryFile" id="salaryFile" value={this.state.salary.salaryFile} readOnly={true}/>
						</Col>
						<Col span="5">
							<Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{width: '100%'}}>
								<Button icon="upload" style={{width: '100%', marginLeft: '4px'}}>选择文件</Button>
							</Upload>
						</Col>
					</FormItem>
				</Row>
				<Row>
				  <Col span="12">
					<FormItem {...formItemLayout2} label="文件密码" required={false} colon={true} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
						<Input type="text" name="passwd" id="passwd" value={this.state.salary.passwd } onChange={this.handleOnChange} />
					</FormItem>
				  </Col>
				</Row>
				<Row>
					<FormItem style={{textAlign:'right',margin:'12px 0'}} className={layoutItem}>
						<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>上传文件</Button>
						<Button key="btnClose" size="large" onClick={this.goBack} style={{margin: '0 0 0 12px'}}>取消</Button>
					</FormItem>
				</Row>
			</Form>
		);

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onTabClick={this.goBack}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="上传工资单文件" key="2" style={{width: '100%', height: '100%'}}>
                      <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                        <div style={{padding:"8px",height: '100%',overflowY: 'auto'}} >
                          <div style={{width:'100%', maxWidth:'600px'}}>
				        	<ServiceMsg ref='mxgBox' svcList={['hr-salary-log/upload']}/>
				        	{form}
						  </div>
						</div>
					  </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default UploadSalaryPage;
