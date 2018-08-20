'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../public/script/common');
import { Spin , Tabs} from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';

import DeptTablePage from './Components/DeptTablePage.js'
import DeptStaffPage from '../dept_staff/DeptStaffPage.js'
const TabPane = Tabs.TabPane;
 
var DeptPage = React.createClass({
    getInitialState : function() {
        return {
            isSelect: true,
            selectKey: '1',
            dept:{},
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },

    selectsRole:function(dept){
        this.setState({
            isSelect: false,
            selectKey:'2',
            dept:dept
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
	            	<ServiceMsg ref='mxgBox' svcList={['hr_dept/retrieve', 'hr_dept/remove','hr-dept-staff/retrieve', 'hr-dept-staff/remove']}/>
	            </div>
	            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="1" activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="部门管理" key="1" style={{width: '100%', height: '100%'}}>
	                        <DeptTablePage selectsRole={this.selectsRole.bind(this)} style={{width: '100%', height: '100%'}}/>
	                    </TabPane>
	                    <TabPane tab="人员维护" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
	                        <DeptStaffPage dept={this.state.dept} style={{width: '100%', height: '100%'}}/>
	                    </TabPane>
	                </Tabs>
	            </div>
	        </div>
	    );
    }
});

module.exports = DeptPage;