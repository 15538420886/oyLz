'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../public/script/common');
import { Form, Modal, Button, Input, Select,Tabs } from 'antd';
const FormItem = Form.Item;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import SearchEmployee from '../../lib/Components/SearchEmployee';
import LeaveInfor from './LeaveInfor';
import LeaveDetailPage from '../../leave_detail/LeaveDetailPage';
import LeaveLogPage from '../../leave_log/LeaveLogPage';
const TabPane = Tabs.TabPane;
var LeaveStore = require('../data/LeaveStore.js');
var LeaveActions = require('../action/LeaveActions');

var UpdateLeavePage = React.createClass({
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
        var leave = this.props.leave;
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
	                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
	                    </TabPane>
	                    <TabPane tab="假日信息" key="2" style={{width: '100%', height: '100%'}}>
	                        <LeaveInfor leave={leave} />
	                    </TabPane>
                        <TabPane tab="假日明细" key="3" style={{width: '100%', height: '100%'}}>
	                        <LeaveDetailPage leave={leave} />
	                    </TabPane>
                        <TabPane tab="休假日志" key="4" style={{width: '100%', height: '100%'}}>
	                        <LeaveLogPage leave={leave} />
	                    </TabPane>
	                </Tabs>
	            </div>
	        </div>
	    );
    }
});

module.exports = UpdateLeavePage;
