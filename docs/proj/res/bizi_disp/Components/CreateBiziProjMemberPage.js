﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Tabs, Col, Row, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchResMember from '../../../lib/Components/SearchResMember'
var BiziProjMemberStore = require('../data/BiziProjMemberStore.js');
var BiziDispActions = require('../action/BiziDispActions');

var CreateBiziProjMemberPage = React.createClass({
	getInitialState : function() {
		return {
			loading: false,
			modal: false,
            biziProjMember: {},
            user: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(BiziProjMemberStore, "onServiceComplete"), ModalForm('biziProjMember')],
	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
          if (data.errMsg === '') {
              // 补充用户信息
              var projCount = data.recordSet.length;
              var proj = data.recordSet[projCount - 1];
              var user = this.state.user;
              if (proj.userUuid === user.uuid) {
                  proj.baseCity = user.baseCity;
                  proj.corpName = user.corpName;
                  proj.deptName = user.deptName;
                  proj.manType = user.manType;
                  proj.phoneno = user.phoneno;
              }

	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            { id: 'beginDate', desc: '入组日期', required: true, max: '24' },
            { id: 'beginTime', desc: '入组时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];
        
		this.clear();
	},
	
	clear : function(corpUuid){
		this.state.hints = {};
		this.state.biziProjMember.uuid='';
		this.state.biziProjMember.userUuid='';
		this.state.biziProjMember.corpUuid = window.loginData.compUser.corpUuid;
        this.state.biziProjMember.staffCode = '';
		this.state.biziProjMember.perName='';
		this.state.biziProjMember.baseCity='';
		this.state.biziProjMember.corpName='';
        this.state.biziProjMember.deptName = '';
        this.state.biziProjMember.projUuid = this.props.biziProj.uuid;
        this.state.biziProjMember.projName = this.props.biziProj.projName;
        this.state.biziProjMember.projLoc = this.props.biziProj.projLoc;
        this.state.biziProjMember.beginDate = ''+Common.getToday();
        this.state.biziProjMember.beginTime = '09:00';
		
        this.setState({ loading: false });
	    if( typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onSelectBiziProjMember:function(data){
		this.state.biziProjMember.userUuid = data.uuid;
		this.state.biziProjMember.staffCode = data.staffCode;
		this.state.biziProjMember.perName = data.perName;
		this.state.biziProjMember.baseCity = data.baseCity;
		this.state.biziProjMember.corpName = data.corpName;
		this.state.biziProjMember.deptName = data.deptName;
		this.state.biziProjMember.manType = data.manType;
		this.state.biziProjMember.phoneno = data.phoneno;

        this.setState({ user: data });
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.biziProjMember)) {
            this.setState({ loading: true });
            BiziDispActions.createBiziProjMember(this.state.biziProjMember);
        }
	},

	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if (activeKey === '1' || activeKey === '2'){
            this.props.onBack(activeKey);
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
        var boo = this.state.biziProjMember.userUuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;
	    return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="3"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="项目组人员" key="2" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
					<TabPane tab="人员入组" key="3" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"8px 0 16px 8px"}}>
                            <ServiceMsg ref='mxgBox' svcList={['bizi-proj-member/create']}/>
                            <SearchResMember style={{ padding: '16px 0 16px 32px', width: '100%', maxWidth: '600px'}} corpUuid={corpUuid} showError={this.showError} onSelectMember={this.onSelectBiziProjMember}/>
                            <Form layout={layout} style={{width:'100%', maxWidth:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.biziProjMember.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.biziProjMember.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工类型" required={false} colon={true} className={layoutItem} help={hints.manTypeHint} validateStatus={hints.manTypeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="manType" id="manType" value={this.state.biziProjMember.manType } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
											<Input style={{zIndex:'2'}} type="text" name="baseCity" id="baseCity" value={this.state.biziProjMember.baseCity } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="公司" required={false} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
									<Input type="text" name="corpName" id="corpName" value={this.state.biziProjMember.corpName } disabled={true}/>
								</FormItem>
								<FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
									<Input type="text" name="deptName" id="deptName" value={this.state.biziProjMember.deptName } disabled={true}/>
								</FormItem>
                                <Row style={{paddingTop: '16px'}}>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
											<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.biziProjMember.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="入组时间" required={true} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
											<Input type="text" name="beginTime" id="beginTime" value={this.state.biziProjMember.beginTime} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

module.exports = CreateBiziProjMemberPage;

