import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select , DatePicker, Col, Row } from 'antd';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
var ResumeStore = require('../../resume/data/ResumeStore');
var ResumeActions = require('../../resume/action/ResumeActions');

var CreateCertPage = React.createClass({
	getInitialState : function() {
		return {
			certSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			modal: false,
			btnOpen:false,
			cert: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"), ModalForm('cert')],
	onServiceComplete: function(data) {
		if(data.resource==='certList' && (data.operation === 'create' || data.operation === 'update')){
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
			{id: 'certType', desc:'证书类型', required: false},
			{id: 'certName', desc:'证书名称', required: true},
			{id: 'certOrg', desc:'颁发机构', required: false},
			{id: 'beginDate', desc:'获得时间', required: true},
			{id: 'certScore', desc:'分数', required: false},
			{id: 'certDesc', desc:'证书说明', required: false},
		];
	},

	clear : function(){
		this.state.hints = {};
		this.state.cert.certType='';
		this.state.cert.certName='';
		this.state.cert.certOrg='';
		this.state.cert.beginDate='';
		this.state.cert.certScore='';
		this.state.cert.certDesc='';
	},

	initPage: function(cert)
	{
		this.state.hints = {};
		Utils.copyValue(cert, this.state.cert);
		this.setState({btnOpen: true});
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.cert)){
			if(this.state.btnOpen==true){
				this.setState({loading: true});
				ResumeActions.updateCert( this.state.cert );
			}
			else{
				this.onClickAdd();
			}
		}
	},
	onClickAdd:function(){
		if(Common.formValidator(this, this.state.cert)){
			this.setState({loading: true});
			ResumeActions.addCert( this.state.cert );
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
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};

		var hints=this.state.hints;
		return (
            <div className='resume-form'>
				<Form layout={layout}>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="证书类型" required={false} colon={true} className={layoutItem} help={hints.certTypeHint} validateStatus={hints.certTypeStatus}>
								<DictSelect name="certType" id="certType" value={this.state.cert.certType } appName='简历系统' optName='证书类型' onChange={this.handleOnSelected.bind(this, "certType")} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="证书名称" required={true} colon={true} className={layoutItem} help={hints.certNameHint} validateStatus={hints.certNameStatus}>
								<Input type="text" name="certName" id="certName" value={this.state.cert.certName } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>
					<FormItem {...formItemLayout} label="颁发机构" required={false} colon={true} className={layoutItem} help={hints.certOrgHint} validateStatus={hints.certOrgStatus}>
						<Input type="text" name="certOrg" id="certOrg" value={this.state.cert.certOrg } onChange={this.handleOnChange} />
					</FormItem>
					<Row>
						<Col span='12'>
							<FormItem {...formItemLayout2} label="获得时间" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<MonthPicker style={{width:'100%'}} name="beginDate" id="beginDate" value={this.formatMonth(this.state.cert.beginDate,Common.monthFormat )}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
							</FormItem>
						</Col>
						<Col span='12'>
							<FormItem {...formItemLayout2} label="分数" required={false} colon={true} className={layoutItem} help={hints.certScoreHint} validateStatus={hints.certScoreStatus}>
								<Input type="text" name="certScore" id="certScore" value={this.state.cert.certScore } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>
					<FormItem {...formItemLayout} label="证书说明" required={false} colon={true} className={layoutItem} help={hints.certDescHint} validateStatus={hints.certDescStatus}>
                        <Input type="textarea" name="certDesc" id="certDesc" value={this.state.cert.certDesc} onChange={this.handleOnChange} style={{ height: '120px'}}/>
					</FormItem>
				</Form>
				<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['certList/create', 'certList/update']}/>
					 <Button key="btnUpdate" type="primary" size="large" onClick={this.onClickAdd} loading={this.state.loading}>新增</Button>{' '}
			   		<Button key="btnOK" type="primary" size="large" disabled={!this.state.btnOpen} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnBack" size="large" onClick={this.onClickBack}>返回</Button>
			   </div>
			</div>
		);
	}
});

export default CreateCertPage;
