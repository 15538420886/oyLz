'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
import UserTablePage from './Components/UserTablePage'; 
import DeptTree from './Components/DeptTree';
import UserPrivPage from './Components/UserPrivPage';

var UserPage = React.createClass({
    getInitialState: function () {
        return {
            viewType: 'user',
            compUser: null,
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },

    onSelectDept: function (dept) {
        if (dept === null) {
            this.refs.userTable.loadData('', '');
        }
        else {
            this.refs.userTable.loadData(dept.uuid, dept.deptName);
        }
    },
    onClickPriv: function (compUser) {
        this.setState({ compUser: compUser, viewType: 'priv' });
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.setState({ viewType: 'user' });
        }
    },

    render: function () {
        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;

        var visible = (this.state.viewType === 'user') ? '' : 'none';
        var privPage = null;
        if (this.state.viewType === 'priv') {
            privPage = (
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="权限管理" key="2" style={{ width: '100%', height: '100%' }}>
                        <UserPrivPage compUser={this.state.compUser}/>
                    </TabPane>
                </Tabs>
            );
        }

        var cs = Common.getGridMargin(this, 0);
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className='grid-page' style={{ padding: cs.padding, display: visible ,overflow:'auto'}}>
                    <div style={{ margin: cs.margin }}>
                        <ServiceMsg ref='mxgBox' svcList={['auth-user/retrieve', 'comp-user/retrieve', 'comp-user/remove']} />
                    </div>
                    <div style={{ width: '100%' }}>
                        <UserTablePage ref='userTable' corpUuid={corpUuid} onSetPriv={this.onClickPriv} />
                    </div>
                </div>
                {privPage}
            </div >
        );
    }
});

module.exports = UserPage;

/*
<div style={{ display: 'flex', height: '100%' }}>
    <div className='left-tree' style={{ flex: '0 0 230px', width: '230px', overflowY: 'auto', overflowX: 'hidden' }}>
        <DeptTree corpUuid={corpUuid} onSelectDept={this.onSelectDept} />
    </div>
    <div style={{ width: '100%' }}>
        <UserTablePage ref='userTable' corpUuid={corpUuid} onSetPriv={this.onClickPriv} />
    </div>
</div>
*/

