﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var $ = require('jquery');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import ShowEnclosurePage from './ShowEnclosurePage';
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col, Upload,Icon, message} from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const Option = Select.Option;

var TmBugStore = require('../data/TmBugStore.js');
var TmBugActions = require('../action/TmBugActions');

var UpdateTmBugPage = React.createClass({
	getInitialState : function() {
		return {
			tmBugSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			tmBug: {},
			hints: {},
			validRules: [],
			tmBugSelectData: {},//转换后的全部数据
			tmBugSelectHtmlData: [],//转换后的全部模板数据
			mdlId: [],
			findVer: []
		}
	},

	mixins: [Reflux.listenTo(TmBugStore, "onServiceComplete"), ModalForm('tmBug')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.setState({
				  modal: false
			  });
			  console.log(this);
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  tmBugSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'bugName', desc: '缺陷名称', required: true, max: '255' },
			{ id: 'bugDesp', desc: '缺陷描述', required: false, max: '65535' },
			{ id: 'bugPriorty', desc: '优先级', required: true, max: '255' },
			{ id: 'bugStage', desc: '测试阶段', required: false, max: '255' },
			{ id: 'bugSeverity', desc: '严重程度', required: true, max: '255' },
			{ id: 'bugType', desc: '缺陷类型', required: true, max: '255' },
			{ id: 'bugChance', desc: '重现概率', required: false, max: '255' },
			{ id: 'sysId', desc: '发现系统', required: true, max: '255' },
			{ id: 'findVer', desc: '发现版本', required: false, max: '255' },
			{ id: 'mdlId', desc: '模块名称', required: false, max: '255' },
			{ id: 'caseCode', desc: '案例编码', required: false, max: '255' },
			{ id: 'bugResponsible', desc: '处理人', required: true, max: '255' },
		];
	},
	
	initPage: function(tmBug)
	{
		this.state.hints = {};
		Utils.copyValue(tmBug, this.state.tmBug);
		
		this.state.loading = false;
		this.state.tmBugSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
		var data = { flowNo: "0", object: {} }
		var self = this;
		$.ajax({
			type: "POST",
			url: "http://10.10.10.201:8082/tbug_s/tm-bug/createInit",
			data: JSON.stringify(data),
			contentType: "application/json",
		}).done(function (data) {

			var temp = data.object;
			var obj = {};
			var obj2 = {};
			// 所属系统
			var systemModel = self.toArray(temp.systemModel);

			// 模块名称
			var mdlId = systemModel;

			// 版本编码
			var findVer = systemModel;

			// 缺陷类型
			var bugType = self.toArray(temp.bugType);

			// 严重程度
			var bugSeverity = self.toArray(temp.bugSeverity);

			// 优先级
			var bugPriorty = self.toArray(temp.bugPriorty);

			// 重现概率
			var bugChance = self.toArray(temp.bugChance);

			// 测试阶段
			var bugStage = self.toArray(temp.bugStage);

			// 用例编码
			var caseCode = self.toArray(temp.bugStage);;

			// 处理人
			var bmUser = self.toArray(temp.bmUser);

			obj2.systemModel = systemModel;
			obj2.mdlId = mdlId;
			obj2.findVer = findVer;
			obj2.bugType = bugType;
			obj2.bugSeverity = bugSeverity;
			obj2.bugPriorty = bugPriorty;
			obj2.bugChance = bugChance;
			obj2.bugStage = bugStage;
			obj2.caseCode = caseCode;
			obj2.bmUser = bmUser;

			obj.systemModel = self.toHtml(systemModel, "sysname");

			obj.mdlId = self.toHtml(systemModel[0].bmSystemMdl, "sysName");

			obj.findVer = self.toHtml(systemModel[0].bmSystemVer, "sysVersion");

			obj.bugType = self.toHtml(bugType);

			obj.bugSeverity = self.toHtml(bugSeverity);

			obj.bugPriorty = self.toHtml(bugPriorty);

			obj.bugChance = self.toHtml(bugChance);

			obj.bugStage = self.toHtml(bugStage);

			obj.bmUser = self.toHtml(bmUser, "userName");
			self.setState({
				tmBugSelectHtmlData: obj,
				tmBugSelectData: obj2,
				mdlId: obj.mdlId,
				findVer: obj.findVer
			})

		});
	},
	//打开附件
	handleOpenEnclosureWindow: function (e) {
		var tmBug = {
			uuid: this.state.tmBug.uuid
		}
		if (tmBug != null) {
			this.refs.showEnclosure.initPage(tmBug);
			this.refs.showEnclosure.toggle();
		}
	},
	toArray: function (obj) {
		var list = [];
		for (var i = 0; i < obj.length; i++) {
			list.push(obj[i]);
		}
		return list;
	},
	//解析成HTMl
	toHtml: function (obj, name) {
		var html = obj.map((obj, index) => {
			var text = '';
			var textIndex = '';
			if (name != undefined) {
				text = obj[name];
				textIndex = index;
			} else {
				text = obj;
				textIndex = index;
			}
			return <Option value={text} tabindex={textIndex}>{text}</Option>
		})
		return html;
	},
	handleProvinceChange: function (value) {
		this.state.tmBug.sysId = value;
		this.state.hints.sysIdHint = null;
		this.state.hints.sysIdStatus = null
		var arr = this.state.tmBugSelectData.systemModel;
		var MdData = '';
		var MdDataHtml = [];
		var findVerHtml = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].sysname == value) {
				MdData = arr[i];
			}
		}
		MdDataHtml = this.toHtml(MdData.bmSystemMdl, "sysName");
		findVerHtml = this.toHtml(MdData.bmSystemVer, "sysVersion");
		this.setState({
			mdlId: MdDataHtml,
			findVer: findVerHtml
		})
	},
	onClickSave : function(){
		if(Common.formValidator(this, this.state.tmBug)){
			this.state.tmBugSet.operation = '';
			this.setState({loading: true});
			TmBugActions.updateTmBug( this.state.tmBug );
		}
	},
	render : function() {

		var layout = 'horizontal';
		var layoutItem = 'form-item-' + layout;
		const formItemLayout = {
			labelCol: ((layout == 'vertical') ? null : { span: 3 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 21 }),
		};
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 6 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
		};
		const formItemLayout3 = {
			labelCol: ((layout == 'vertical') ? null : { span: 10 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 14 }),
		};
		const formItemLayout4 = {
			labelCol: ((layout == 'vertical') ? null : { span: 12 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 12 }),
		};
		
		// 所属系统
		var systemModel = this.state.tmBugSelectHtmlData.systemModel;

		// 模块名称
		var mdlId = this.state.mdlId;

		// 版本编码
		var findVer = this.state.findVer;

		// 缺陷类型
		var bugType = this.state.tmBugSelectHtmlData.bugType;

		// 严重程度
		var bugSeverity = this.state.tmBugSelectHtmlData.bugSeverity;
		// 优先级
		var bugPriorty = this.state.tmBugSelectHtmlData.bugPriorty;

		// 重现概率
		var bugChance = this.state.tmBugSelectHtmlData.bugChance;

		// 测试阶段
		var bugStage = this.state.tmBugSelectHtmlData.bugStage;

		// 用例编码
		var caseCode = this.state.tmBugSelectHtmlData.caseCode;

		// 处理人
		var bmUser = this.state.tmBugSelectHtmlData.bmUser;


		var hints=this.state.hints;

		if (hints.bugPriortyHint) {
			hints.bugPriortyHint.props.children = '请选择优先级'
		}
		if (hints.bugResponsibleHint) {
			hints.bugResponsibleHint.props.children = '请选择处理人'
		}
		if (hints.bugSeverityHint) {
			hints.bugSeverityHint.props.children = '请选择严重程度'
		}
		if (hints.bugTypeHint) {
			hints.bugTypeHint.props.children = '请选择缺陷类型'
		}
		if (hints.deteSysIdHint) {
			hints.deteSysIdHint.props.children = '请选择所属系统'
		}

		return (
			<Modal visible={this.state.modal} width='740px' title="修改缺陷管理信息信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['tm-bug/update']}/>
					<span style={{ float: "left" }}>
					<Button key="btnEnclosure" size="large" onClick={this.handleOpenEnclosureWindow}>附件</Button>
					</span>
					<Button key="btnSave" size="large">保存并提交</Button>
					<Button key="btnOK" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
					<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			   
			  ]}
			>
				<Form layout={layout}>
					<Row>
						<Col>
							<FormItem {...formItemLayout} label="缺陷名称" required={true} colon={true} className={layoutItem} help={hints.bugNameHint} validateStatus={hints.bugNameStatus}>
								<Input type="text" name="bugName" id="bugName" value={this.state.tmBug.bugName} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<FormItem {...formItemLayout2} label="所属系统" required="true" help={hints.sysIdHint} validateStatus={hints.sysIdStatus}>
								<Select defaultValue='--' name="sysId" id="sysId" value={this.state.tmBug.sysId} style={{ width: "100%" }} onChange={this.handleProvinceChange}>
									{systemModel}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout3} label="版本编码" help={hints.findVerHint} validateStatus={hints.findVerStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="findVer" id="findVer" value={this.state.tmBug.findVer} onChange={(value) => { this.state.tmBug.findVer = value, this.setState({}) }}>
									{findVer}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout3} label="所属模块" help={hints.mdlIdHint} validateStatus={hints.mdlIdStatus} >
								<Select style={{ width: "100%" }} name="mdlId" id="mdlId" value={this.state.tmBug.mdlId} onChange={(value) => { this.state.tmBug.mdlId = value, this.setState({}) }}>
									{mdlId}
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							<FormItem {...formItemLayout4} label="缺陷类型" required="true" help={hints.bugTypeHint} validateStatus={hints.bugTypeStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="bugType" id="bugType" value={this.state.tmBug.bugType} onChange={(value) => { this.state.tmBug.bugType = value, this.state.hints.bugTypeHint = null; this.state.hints.bugTypeStatus = null; this.setState({}) }}>
									{bugType}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout4} label="严重程度" required="true" help={hints.bugSeverityHint} validateStatus={hints.bugSeverityStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="bugSeverity" id="bugSeverity" value={this.state.tmBug.bugSeverity} onChange={(value) => { this.state.tmBug.bugSeverity = value, this.state.hints.bugSeverityHint = null; this.state.hints.bugSeverityStatus = null; this.setState({}) }}>
									{bugSeverity}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout3} label="优先级" required="true" help={hints.bugPriortyHint} validateStatus={hints.bugPriortyStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="bugPriorty" id="bugPriorty" value={this.state.tmBug.bugPriorty} onChange={(value) => { this.state.tmBug.bugPriorty = value; this.state.hints.bugPriortyHint = null; this.state.hints.bugPriortyStatus = null; this.setState({}) }}>
									{bugPriorty}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout3} label="重现概率" help={hints.bugChanceHint} validateStatus={hints.bugChanceStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="bugChance" id="bugChance" value={this.state.tmBug.bugChance} onChange={(value) => { this.state.tmBug.bugChance = value, this.setState({}) }}>
									{bugChance}
								</Select>
							</FormItem>
						</Col>
					</Row>

					<Row>
						<Col span={6}>
							<FormItem {...formItemLayout4} label="测试阶段" help={hints.bugStageHint} validateStatus={hints.bugStageStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="bugStage" id="bugStage" value={this.state.tmBug.bugStage} onChange={(value) => { this.state.tmBug.bugStage = value, this.setState({}) }}>
									{bugStage}
								</Select>
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem {...formItemLayout2} label="用例编码" colon={true} help={hints.caseCodeHint} validateStatus={hints.caseCodeStatus}>
								<Input type="text" name="caseCode" id="caseCode" value={this.state.tmBug.caseCode} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout3} label="处理人" required={true} help={hints.bugResponsibleHint} validateStatus={hints.bugResponsibleStatus}>
								<Select defaultValue="--" style={{ width: "100%" }} name="bugResponsible" id="bugResponsible" value={this.state.tmBug.bugResponsible} onChange={(value) => { this.state.tmBug.bugResponsible = value, this.state.hints.bugResponsibleHint = null; this.state.hints.bugResponsibleStatus = null; this.setState({}) }}>
									{bmUser}
								</Select>
							</FormItem>
						</Col>
					</Row>
					<FormItem {...formItemLayout} style={{ postion: "relative" }} label="缺陷描述" colon={true} className={layoutItem} help={hints.bugDespHint} validateStatus={hints.bugDespStatus}>
						<Input type="textarea" name="bugDesp" id="bugDesp" value={this.state.tmBug.bugDesp} onFocus={this.handleHide} onBlur={this.handleShow} onChange={this.handleOnChange} style={{ height: '160px' }} />
					</FormItem>
				</Form>
				<ShowEnclosurePage ref="showEnclosure" />
			</Modal>
		);
	}
});

export default UpdateTmBugPage;

