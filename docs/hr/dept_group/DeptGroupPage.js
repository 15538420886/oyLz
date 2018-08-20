'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../public/script/common');
import { Spin , Tabs} from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';

import GroupTablePage from './Components/GroupTablePage.js'
import GroupStaffPage from '../group_staff/GroupStaffPage.js'
const TabPane = Tabs.TabPane;

var DeptGroupPage = React.createClass({
    getInitialState : function() {
        return {
            isSelect: true,
            selectKey: '1',
            group:{},
        }
    },

    componentDidMount : function(){
       
    },
    selectsRole:function(group){
        this.setState({
            isSelect: false,
            selectKey:'2',
            group:group
        })
    },
    //点击Tab后回调
    onTabClick:function(){
        this.setState({
            isSelect: true,
            selectKey:'1'
        });
    },
    
    render : function() {
	    var selectKey = this.state.selectKey;
	    var cs = Common.getGridMargin(this, 0);
	    return (
	        <div className='tab-page' style={{padding: cs.padding}}>
	        	<div style={{margin: cs.margin}}>
	            	<ServiceMsg ref='mxgBox' svcList={['hr-group-staff/retrieve', 'hr-group-staff/remove','hr_dept_group/retrieve', 'hr_dept_group/remove']}/>
	            </div>
	            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="1" activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="事业群管理" key="1" style={{width: '100%', height: '100%'}}>
	                        <GroupTablePage selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
	                    </TabPane>
	                    <TabPane tab="人员维护" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
	                        <GroupStaffPage group={this.state.group} style={{width: '100%', height: '100%'}}/>
	                    </TabPane>
	                </Tabs>
	            </div>
	        </div>
	    );
    }
});

module.exports = DeptGroupPage;

