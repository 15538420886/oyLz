'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Modal, Button, Input, Select,Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ProjMemberPage from './ProjMemberPage';
import DispOrderPage from '../../disp_order/DispOrderPage';
import ProjCondPage2 from '../../../proj/proj_cond/ProjCondPage2';

import ProjContext from '../../../ProjContext';
var ProjDispStore = require('../data/ProjDispStore');
var ProjDispActions = require('../action/ProjDispActions');

import CreateProjMemberPage from '../../disp_order/Components/CreateProjMemberPage';
import UpdateProjMemberPage from '../../disp_order/Components/UpdateProjMemberPage';
import UpdateProjCondPage from '../../../proj/proj_cond/Components/UpdateProjCondPage2';

var ProjMebDispPage = React.createClass({
    getInitialState : function() {
        return {
            user:{},
            projDisp:{},
            message: '',
            memberDisp: {},
            action: 'tab'
        }
    },

    // 第一次加载
    componentDidMount : function(){
    //    this.clear();
    },

    mixins: [Reflux.listenTo(ProjDispStore, "onServiceComplete")],
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

    goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }  
    },
     
    doAction:function(name, disp){
        this.setState({ action: name, memberDisp: disp})
    },

    onGoBack: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
        else {
            this.setState({ action: 'tab' });
        }
    },
    render : function() {
        var projDisp = this.props.proj;
	    var selectKey = this.state.selectKey;
	    var cs = Common.getGridMargin(this, 0);

        var visible = (this.state.action === 'tab') ? '' : 'none';
        var tabPage = 
	        <div className='tab-page' style={{padding: cs.padding, display:visible}}>
	        	<div style={{margin: cs.margin}}>
	            	<ServiceMsg ref='mxgBox' svcList={['proj_info/create']}/>
	            </div>
	            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                        </TabPane>
	                    <TabPane tab="调度指令" key="2" style={{width: '100%', height: '100%'}}>
                            <DispOrderPage doAction={this.doAction} projDisp={projDisp} />
                        </TabPane>
                        <TabPane tab="人员筹备" key="3" style={{ width: '100%', height: '100%' }}>
                            <ProjCondPage2 doAction={this.doAction} projDisp={projDisp} />
                        </TabPane>
                        <TabPane tab="项目组成员" key="4" style={{width: '100%', height: '100%'}}>
                           <ProjMemberPage projDisp={projDisp}/>
                        </TabPane>
	                </Tabs>
	            </div>
	        </div>

            var page = null;
            if(this.state.action === 'create-disp'){
                page = <CreateProjMemberPage onBack={this.onGoBack}/>;
            } else if(this.state.action === 'update-disp') {
                page = <UpdateProjMemberPage onBack={this.onGoBack} projMember={this.state.memberDisp}/>;
            } else if(this.state.action === 'update-cond') {
                page = <UpdateProjCondPage onBack={this.onGoBack} cond={this.state.memberDisp}/>;
            }
    
	    return (
            <div style={{width: '100%',height:'100%'}}>
                {tabPage}
                {page}
            </div>
	    );
    }
});

module.exports = ProjMebDispPage;
