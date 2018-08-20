'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
import UserTablePage from './Components/UserTablePage';
import UserPrivPage from './Components/UserPrivPage';

var SysUserPage = React.createClass({
    getInitialState: function () {
        var deptUuid = '';
        var deptName = '';
        var campusUuid = '';
        var campusName = '';

        // console.log('this.props.location', this.props.location);
        if (Common.corpStruct === '单公司') {
            deptUuid = Common.corpUuid;
            deptName = Common.corpName;
            campusUuid = Common.campusUuid;
            campusName = Common.campusName;
        }
        else {
            var q = this.props.location.query;
            if (q != null && typeof (q) != 'undefined') {
                if (q.deptUuid != null && typeof (q.deptUuid) != 'undefined') {
                    deptUuid = q.deptUuid;
                    deptName = q.deptName;
                    campusUuid = q.campusUuid;
                    campusName = q.campusName;
                }
            }
        }

        return {
            deptUuid: deptUuid,
            deptName: deptName,
            campusUuid: campusUuid,
            campusName: campusName,

            viewType: 'user',
            compUser: null,
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.refs.userTable.loadData(this.state.deptUuid, this.state.deptName, true);
    },
    handleGoBack: function () {
        browserHistory.push({
            pathname: '/auth/CorpPage/',
            query: {
                campusUuid: this.state.campusUuid,
                campusName: this.state.campusName
            },
        });
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
        var visible = (this.state.viewType === 'user') ? '' : 'none';
        var privPage = null;
        if (this.state.viewType === 'priv') {
            privPage = (
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="权限管理" key="2" style={{ width: '100%', height: '100%' }}>
                        <UserPrivPage compUser={this.state.compUser} />
                    </TabPane>
                </Tabs>
            );
        }

        var funcBack = (Common.corpStruct === '单公司') ? null : this.handleGoBack;
        var cs = Common.getGridMargin(this, 0);
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className='grid-page' style={{ padding: cs.padding, display: visible }}>
                    <div style={{ margin: cs.margin }}>
                        <ServiceMsg ref='mxgBox' svcList={['comp-user/retrieve', 'comp-user/remove']} />
                    </div>
                    <div style={{ height: '100%' }}>
                        <UserTablePage ref='userTable' corpUuid={this.state.deptUuid} type='sys' funcBack={funcBack} onSetPriv={this.onClickPriv} />
                    </div>
                </div>
                {privPage}
            </div >
        );
    }
});

module.exports = SysUserPage;
