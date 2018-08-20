'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Icon, Modal, Tabs} from 'antd';
const TabPane = Tabs.TabPane;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import EmployeeTablePage from './Components/EmployeeTablePage';
import DeptTree from '../dept/Components/DeptTree';
import CreateEmployeePage from './Components/CreateEmployeePage';
import CreateUserPage from './Components/CreateUserPage';

import BranchStaffPage from '../branch_staff/BranchStaffPage.js'


var EmployeePage = React.createClass({
    getInitialState : function() {
        return {
            employee: null,
            action: 'query',
            dept: {},
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },
    onSelectDept: function(dept){
    	if(dept === null){
        	this.refs.empTable.loadData(null);
    	}
    	else{
        	this.refs.empTable.loadData(dept);
        }
    },
    onViewEmployee: function(employee){
    	this.setState({employee: employee});
    },

    //点击Tab后回调
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.setState({employee: null});
        }
    },
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    onCreateStaff: function (dept) {
        this.state.dept = dept;
        if (typeof (dept.uuid) === 'undefined') {
            return;
        }

        this.setState({ action: 'create' });
    },
    nextCreateUser: function (user, job) {
        this.refs.nextWindow.toggle();
        this.refs.nextWindow.initStaff(user, job);
    },

	render : function() {
        var visible='';
        var emp = this.state.employee;
        if (emp !== null || this.state.action !== 'query'){
            visible = 'none';
        }

        // 主页面
        var cs = Common.getGridMargin(this, 0);
        var empTable =
        	<div className='grid-page' style={{padding: cs.padding, display:visible}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_dept/retrieve', 'hr-employee/retrieve', 'hr-employee/remove']}/>
				</div>
        		<div style={{display: 'flex', height:'100%'}}>
                    <div className='left-tree' style={{flex: '0 0 230px', width: '230px', overflowY:'auto', overflowX:'hidden'}}>
                        <DeptTree onSelectDept={this.onSelectDept}/>
                    </div>
                    <div style={{width:'100%'}}>
                        <EmployeeTablePage ref='empTable' onViewEmployee={this.onViewEmployee} onCreateStaff={this.onCreateStaff} funcCreateUser={this.nextCreateUser}/>
                    </div>
                </div>
            </div>;

        // 没有选中员工时
        if (emp === null) {
            var page = null;
            if (this.state.action === 'create') {
                page = <CreateEmployeePage dept={this.state.dept} onBack={this.onGoBack} funcCreateUser={this.nextCreateUser} />
            }

            return (
                <div style={{width: '100%', height: '100%'}}>
                    {empTable}
                    {page}

                    <CreateUserPage ref="nextWindow" />
                </div>
            );
        }

        var viewPage = (
            <div className='tab-page'>
                <Tabs ref='EmpTabs' defaultActiveKey='20' onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="岗位" key="30" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="工资福利" key="40" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="假日管理" key="50" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="劳动合同" key="60" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="工资单" key="70" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="报销记录" key="80" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="休假记录" key="90" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="调薪记录" key="100" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                    <TabPane tab="工作调动" key="110" style={{ width: '100%', height: '100%' }}>

                    </TabPane>
                </Tabs>
            </div>
        );

        return (
            <div style={{width: '100%', height: '100%'}}>
                {empTable}
                {viewPage}
            </div>
		);
	}
});

module.exports = EmployeePage;
