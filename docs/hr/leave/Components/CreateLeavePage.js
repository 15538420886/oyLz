'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'
var Common = require('../../../public/script/common');
import { Form, Modal, Button, Input, Select,Tabs } from 'antd';
const FormItem = Form.Item;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import SearchEmployee from '../../lib/Components/SearchEmployee'
const TabPane = Tabs.TabPane;
var LeaveStore = require('../data/LeaveStore.js');
var LeaveActions = require('../action/LeaveActions');

var CreateLeavePage2 = React.createClass({
    getInitialState : function() {
        return {
            user:{},
            leave:{},
            message:''
        }
    },

    // 第一次加载
    componentDidMount : function(){
       this.clear();
    },

    mixins: [Reflux.listenTo(LeaveStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false
			  });
		  }
	  }
	},

    clear: function(){
        this.state.leave.uuid='';
        this.state.leave.corpUuid= window.loginData.compUser.corpUuid;
        this.state.leave.annual=0;
        this.state.leave.wedding=0;
        this.state.leave.maternity=0;
        this.state.leave.paternity=0;
        this.state.leave.dayoff=0;
        this.state.leave.family=0;
        this.state.leave.funeral=0;
        this.state.leave.paidLeave=0;
        this.state.leave.otherLeave=0;
        this.state.message='';
    },

    showError:function(data){
        this.setState({
            message:data,
        })
        
    },

    onSelectEmpLoyee:function(data){
        this.state.leave.uuid = data.uuid;
        this.state.leave.staffCode = data.staffCode;
        this.state.leave.perName = data.perName;
        this.state.leave.deptName = data.deptName;
        this.state.message='';
        this.setState({
            user:data,
        })
    },

    onClickSave:function(){   
        LeaveActions.createHrLeave(this.state.leave);
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
	    var selectKey = this.state.selectKey;
	    var cs = Common.getGridMargin(this, 0);
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
        var boo = this.state.leave.uuid? false : true ;
	    return (
	        <div className='tab-page' style={{padding: cs.padding}}>
	        	<div style={{margin: cs.margin}}>
	            	<ServiceMsg ref='mxgBox' svcList={['hr-leave/create']}/>
	            </div>
	            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="2"  onChange={this.onTabChange}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
	                    </TabPane>
	                    <TabPane tab="增加员工假日信息" key="2" style={{width: '100%', height: '100%'}}>
	                        <div style={{width:'400px',margin:'50px'}} >
                                <div style={{margin:'0 0 30px 0'}}>
                                    <SearchEmployee corpUuid={this.state.corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee}/>
                                    <p style={{color:'red',textAlign:'right'}}>{this.state.message}</p>
                                </div>
                                <Form layout={layout}>
                                    <FormItem {...formItemLayout} label="员工编号" required={false} colon={true} className={layoutItem}>
                                        <Input type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode }/>
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem}>
                                        <Input type="text" name="perName" id="perName" value={this.state.user.perName }/>
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="部门名称" required={false} colon={true} className={layoutItem}>
                                        <Input type="text" name="deptName" id="deptName" value={this.state.user.deptName }/>
                                    </FormItem>
                                    <FormItem style={{textAlign:'right'}} required={false} colon={true} className={layoutItem}>
                                        <Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                        <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                    </FormItem>
                                </Form>
                            </div>
	                    </TabPane>
	                </Tabs>
	            </div>
	        </div>
	    );
    }
});

var CreateLeavePage = withRouter(CreateLeavePage2);
module.exports = CreateLeavePage;
