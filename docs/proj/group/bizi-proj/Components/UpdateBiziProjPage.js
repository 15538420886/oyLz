import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictSelect from '../../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select, Tabs, DatePicker, Row, Col } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
var BiziProjStore = require('../data/BiziProjStore.js');
var BiziProjActions = require('../action/BiziProjActions');

var UpdateBiziProjPage = React.createClass({
	getInitialState : function() {
		return {
			biziProjSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			biziProj: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(BiziProjStore, "onServiceComplete"), ModalForm('biziProj')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  biziProjSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'projCode', desc:'项目编号', required: false, max: '64'},
            { id: 'projType', desc: '项目类型', required: true, max: '64'},
			{id: 'projName', desc:'项目名称', required: true, max: '128'},
			{id: 'projHost', desc:'主办方', required: false, max: '256'},
			{id: 'beginDate', desc:'开始日期', required: false, max: '24'},
			{id: 'endDate', desc:'结束日期', required: false, max: '24'},
			{id: 'projLevel', desc:'重要级别', required: false, max: '32'},
            { id: 'projLoc', desc: '举办城市', required: true, max: '128'},
			{id: 'pmName', desc:'负责人姓名', required: false, max: '32'},
			{id: 'projFund', desc:'项目预算', required: false, max: '128'},
			{id: 'projAim', desc:'项目目的', required: false, max: '1000'},
			{id: 'projDesc', desc:'说明', required: false, max: '3000'},
		];
		this.initPage( this.props.biziProj );
	},
	componentWillReceiveProps:function(newProps){
		
	},
	
	initPage: function(biziProj)
	{
		Utils.copyValue(biziProj, this.state.biziProj);

		if (this.refs.empSearchBox !== undefined) {
            this.refs.empSearchBox.setValue(biziProj.pmName);
        }

		this.setState( {loading: false, hints: {}} );
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onSelectProj:function(data){
        this.state.biziProj.pmUuid = data.uuid;
		this.state.biziProj.pmCode = data.staffCode;
		this.state.biziProj.pmName = data.perName;
		this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.biziProj)){
			this.setState({loading: true});
			BiziProjActions.updateBiziProjInfo( this.state.biziProj );
		}
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
		var corpUuid=window.loginData.compUser.corpUuid
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改项目" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['bizi-proj/update']}/>
                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="项目编号" required={false} colon={true} className={layoutItem} help={hints.projCodeHint} validateStatus={hints.projCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="projCode" id="projCode" value={this.state.biziProj.projCode } onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="项目类型" required={true} colon={true} className={layoutItem} help={hints.projTypeHint} validateStatus={hints.projTypeStatus}>
											<DictSelect name="projType" id="projType" value={this.state.biziProj.projType} appName='项目管理' optName='事务项目类型' onSelect={this.handleOnSelected.bind(this, "projType")}/>
										</FormItem>
									</Col>
								</Row>
								
                                <FormItem {...formItemLayout} label="项目名称" required={true} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
									<Input style={{zIndex:'2'}} type="text" name="projName" id="projName" value={this.state.biziProj.projName } onChange={this.handleOnChange}/>
								</FormItem>
								<FormItem {...formItemLayout} label="主办方" required={false} colon={true} className={layoutItem} help={hints.projHostHint} validateStatus={hints.projHostStatus}>
									<Input style={{zIndex:'2'}} type="text" name="projHost" id="projHost" value={this.state.biziProj.projHost } onChange={this.handleOnChange}/>
								</FormItem>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
		                                    <DatePicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.biziProj.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
		                                </FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结束日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
		                                    <DatePicker  style={{width:'100%'}}  name="endDate" id="endDate"  format={Common.dateFormat} value={this.formatDate(this.state.biziProj.endDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"endDate", Common.dateFormat)}/>
		                                </FormItem>
									</Col>
								</Row>	
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="重要级别" required={false} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
											<DictSelect name="projLevel" id="projLevel" value={this.state.biziProj.projLevel} appName='项目管理' optName='重要级别' onSelect={this.handleOnSelected.bind(this, "projLevel")}/>
										</FormItem>
									</Col>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="举办城市" required={true} colon={true} className={layoutItem} help={hints.projLocHint} validateStatus={hints.projLocStatus} >
											<Input type="text" name="projLoc" id="projLoc" value={this.state.biziProj.projLoc} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="项目经理" required={false} colon={true} className={layoutItem} help={hints.pmNameHint} validateStatus={hints.pmNameStatus}>
											<SearchEmployee corpUuid={corpUuid} showError={this.showError}  ref='empSearchBox' type="text"  name="pmName" id="pmName" value={this.state.biziProj.pmName} onSelectMember={this.onSelectProj}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="项目预算" required={false} colon={true} className={layoutItem} help={hints.projFundHint} validateStatus={hints.projFundStatus} >
											<Input type="text" name="projFund" id="projFund" value={this.state.biziProj.projFund} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="项目目的" required={false} colon={true} className={layoutItem} help={hints.projAimHint} validateStatus={hints.projAimStatus} >
									<Input type="textarea" name="projAim" id="projAim" value={this.state.biziProj.projAim} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								<FormItem {...formItemLayout} label="项目说明" required={false} colon={true} className={layoutItem} help={hints.projDescHint} validateStatus={hints.projDescStatus} >
									<Input type="textarea" name="projDesc" id="projDesc" value={this.state.biziProj.projDesc} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
									<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
								</FormItem>
							</Form>
                        </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default UpdateBiziProjPage;

