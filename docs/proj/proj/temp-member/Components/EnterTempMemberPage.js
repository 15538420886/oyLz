import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var ProjContext = require('../../../ProjContext');

var ProjTempMemberStore = require('../data/ProjTempMemberStore');
var ProjTempMemberActions = require('../action/ProjTempMemberActions');


var EnterTempMemberPage = React.createClass({
	getInitialState : function() {
		return {
			tempMemberSet: {
				errMsg : ''
			},
			loading: false,
			modal: false,
			tempMember: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(ProjTempMemberStore, "onServiceComplete"), ModalForm('tempMember')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
				 this.goBack();
		  } else{
			  // 失败
			  this.setState({
				  loading: false,
				  tempMemberSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'resLoc', desc:'项目地址', required: false, max: '24'},
            {id: 'beginDate', desc:'入组日期', required: false, max: '24'},
			{id: 'beginTime', desc:'入组时间', required: false, max: '24'},
			{id: 'roleName', desc:'承担角色', required: false, max: '64'},
            {id: 'oldprojLevel', desc:'客户定级', required: false, max: '64'},
			{id: 'olduserPrice', desc:'结算单价', required: false, max: '16'},
            {id: 'projLevel', desc:'新定级', required: true, max: '64'},
			{id: 'userPrice', desc:'结算单价', required: true, max: '16'}, 	
        	{id: 'effectDate', desc:'生效日期', required: true, max: '24'}
        ];

        this.initPage(this.props.tempMember );
	},
	
	initPage: function(tempMember)
	{
		Utils.copyValue(tempMember, this.state.tempMember);
		this.setState( {loading: false, hints: {}} );
        this.state.tempMember.oldprojLevel = this.state.tempMember.projLevel;
        this.state.tempMember.olduserPrice = this.state.tempMember.userPrice;

        this.state.tempMember.projLevel = '';
        this.state.tempMember.userPrice = '';

		if( typeof(this.refs.mxgBox ) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.tempMember)){
			this.setState({loading: true});
            ProjTempMemberActions.chgProjMemberLevel( this.state.tempMember );
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
        };

        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
		
		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}></TabPane>
					<TabPane tab="人员定级" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto',width:'100%',}}>
			            	<div style={{width:'100%', maxWidth:'700px'}}>
								<ServiceMsg ref='mxgBox' svcList={['proj-member/update']}/>
								<Form layout={layout}>
									<Row>	
										<Col span="12">	
											<FormItem {...formItemLayout} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
												<Input type="text" name="staffCode" id="staffCode" value={this.state.tempMember.staffCode } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
												<Input type="text" name="perName" id="perName" value={this.state.tempMember.perName } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
									</Row>
                                    <Row>	
										<Col span="12">
											<FormItem {...formItemLayout} label="入组日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
												<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  value={this.formatDate(this.state.tempMember.beginDate, Common.dateFormat)}  disabled={true} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)} />
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
												<Input type="text" name="beginTime" id="beginTime" value={this.state.tempMember.beginTime } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
                                    </Row>
                                    <FormItem {...formItemLayout2} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                                        <Input type="text" name="roleName" id="roleName" value={this.state.tempMember.roleName} onChange={this.handleOnChange} disabled={true} />
                                    </FormItem>
									<Row> 
                                        <Col span="12">	     
                                            <FormItem {...formItemLayout} label="客户定级" required={false} colon={true} className={layoutItem} help={hints.oldprojLevelHint} validateStatus={hints.oldprojLevelStatus}>
												<Input type="text" name="oldprojLevel" id="oldprojLevel" value={this.state.tempMember.oldprojLevel } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
                                        <Col span="12">	
											<FormItem {...formItemLayout} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.olduserPriceHint} validateStatus={hints.olduserPriceStatus}>
												<Input type="text" name="olduserPrice" id="olduserPrice" value={this.state.tempMember.olduserPrice } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
									</Row>	
                                    <Row> 
                                        <Col span="12">	     
                                            <FormItem {...formItemLayout} label="新定级" required={true} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
												<Input type="text" name="projLevel" id="projLevel" value={this.state.tempMember.projLevel } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
                                        <Col span="12">			
											<FormItem {...formItemLayout} label="结算单价" required={true} colon={true} className={layoutItem} help={hints.userPriceHint} validateStatus={hints.userPriceStatus}>
												<Input type="text" name="userPrice" id="userPrice" value={this.state.tempMember.userPrice } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
									</Row>	
									
									<Row>	
										<Col span="12">		
                                            <FormItem {...formItemLayout} label="生效日期" required={true} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
                                                <DatePicker  style={{width:'100%'}} name="effectDate" id="effectDate"  value={this.formatDate(this.state.tempMember.effectDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.dateFormat)}/>
                                            </FormItem>
										</Col>
									</Row>
								</Form>
								<Form layout={layout}>
									<FormItem style={{textAlign:'right',padding:'4px 0'}} required={false} colon={true} className={layoutItem}>
										<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading} disabled={false}>保存</Button>{' '}
										<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
									</FormItem>
								</Form>	
							</div>	
                        </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default EnterTempMemberPage;

