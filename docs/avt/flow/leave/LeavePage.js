'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Modal, Button, Input, Select,Tabs } from 'antd';
const TabPane = Tabs.TabPane;

var LeaveApplyStore = require('./data/LeaveApplyStore');
var LeaveApplyActions = require('./action/LeaveApplyActions');
var LeaveLogPerStore = require('../../check/leave_log/data/LeaveLogPerStore');
var LeaveLogPerActions = require('../../check/leave_log/action/LeaveLogPerActions');

import LeaveLogPerPage from '../../check/leave_log/Components/LeaveLogPerPage';
import LeaveLogDetailPage from '../../check/leave_log/Components/LeaveLogDetailPage';
import LeaveQueryPage from '../../check/leave/LeaveQueryPage';
import CreatePaidLeavePage from './Components/CreatePaidLeavePage';
import CreateUnpaidLeavePage from './Components/CreateUnpaidLeavePage';
import UpdatePaidLeavePage from './Components/UpdatePaidLeavePage';
import UpdateUnpaidLeavePage from './Components/UpdateUnpaidLeavePage';
import CancelUnpaidLeavePage from './Components/CancelUnpaidLeavePage';
import CancelPaidLeavePage from './Components/CancelPaidLeavePage';
import LeaveApplyPage from './LeaveApplyPage';

var LeavePage = React.createClass({
    getInitialState: function () {
        return {
             leaveSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
            leaveLoading: false,
            leave: {},
            userUuid:'',

        }
    },

    mixins: [Reflux.listenTo(LeaveApplyStore, "onServiceComplete"),Reflux.listenTo(LeaveLogPerStore, "onServiceComplete2")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            leaveSet: data
        });
     
    },
     onServiceComplete2: function (data) {
        if (data.operation === 'retrieve') {
            this.setState({
                leaveLoading: false,
                leave: data.leavelogper || {}
            });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        if (window.loginData.compUser) {
            this.setState({ loading: true, leaveLoading: true });
            var filter = {
                corpUuid: window.loginData.compUser.corpUuid,
                staffCode: window.loginData.compUser.userCode
            }
            LeaveApplyActions.initLeaveApply(filter);
            //查leave
            var corpUuid = window.loginData.compUser.corpUuid;
            var staffCode = window.loginData.compUser.userCode;
            LeaveLogPerActions.initLeaveLogPerInfo(corpUuid, staffCode);
        }
    },
  
    render: function () {
        var cs = Common.getGridMargin(this, 0);
        var recordSet = this.state.leaveSet.recordSet;
        var unpaidTab = null;
        var paidTab = null;
        var cancelUpaidTab = null;
        var cancelPaidTab = null;
        for(var i=0;i<recordSet.length;i++) {
            if(recordSet[i].status != '已销假' && recordSet[i].status != '撤销' && recordSet[i].status != '待休假') {
                if(recordSet[i].leaveType === '病假' || recordSet[i].leaveType === '事假' || recordSet[i].leaveType === '其他无薪假期'){
                    unpaidTab = <TabPane tab="修改无薪假" key="1" style={{ width: '100%', height: '100%' }}><UpdateUnpaidLeavePage leaveApply = {recordSet[i]}/></TabPane>
                } else {
                    paidTab = <TabPane tab="修改带薪假" key="2" style={{ width: '100%', height: '100%' }}><UpdatePaidLeavePage leaveApply={recordSet[i]} leave={this.state.leave}/></TabPane>
                }
            }
            if(recordSet[i].status == '待休假') {
                if(recordSet[i].leaveType === '病假' || recordSet[i].leaveType === '事假' || recordSet[i].leaveType === '其他无薪假期'){
                    cancelUpaidTab = <TabPane tab="无薪假销假" key="7" style={{ width: '100%', height: '100%' }}><CancelUnpaidLeavePage leaveApply = {recordSet[i]}/></TabPane>
                } else {
                    cancelPaidTab = <TabPane tab="带薪假销假" key="8" style={{ width: '100%', height: '100%' }}><CancelPaidLeavePage leaveApply={recordSet[i]} leave={this.state.leave}/></TabPane>
                }
            } 
        }

        return (
	        <div className='tab-page' style={{padding: cs.padding}}>
	        	<div style={{margin: cs.margin}}>
	            	<ServiceMsg ref='mxgBox' svcList={['leave_apply/retrieve']}/>
	            </div>
	            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="1" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                        {
                            unpaidTab ? unpaidTab :
                                <TabPane tab="无薪假申请" key="1" style={{ width: '100%', height: '100%' }}>
                                    <CreateUnpaidLeavePage />
                                </TabPane>
                            
                        }
                        {
                            paidTab? paidTab :
                                <TabPane tab="带薪假申请" key="2" style={{ width: '100%', height: '100%' }}>
                                    <CreatePaidLeavePage leave={this.state.leave} />
                                </TabPane>
                        }
                        {
                            cancelUpaidTab? cancelUpaidTab :''
                        }
                        {
                            cancelPaidTab? cancelPaidTab :''
                        }
	                    <TabPane tab="剩余假期" key="3" style={{width: '100%', height: '100%'}}>
                            <LeaveLogPerPage/>
	                    </TabPane>
                        <TabPane tab="剩余假期明细" key="4" style={{width: '100%', height: '100%'}}>
                            <LeaveLogDetailPage userUuid={this.state.userUuid}/>
	                    </TabPane>
                        <TabPane tab="休假记录" key="5" style={{width: '100%', height: '100%'}}>
                            <LeaveQueryPage/>
	                    </TabPane>
                         <TabPane tab="休假申请记录" key="6" style={{width: '100%', height: '100%'}}>
                            <LeaveApplyPage/>
	                    </TabPane>
	                </Tabs>
	            </div>
	        </div>
	    );
    }
});

module.exports = LeavePage;

