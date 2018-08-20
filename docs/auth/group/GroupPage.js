'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal,Tabs} from 'antd';
const TabPane = Tabs.TabPane;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var GroupInfoPage = require('./Components/GroupInfoPage');
var AppInfoPage = require('./Components/AppInfoPage');
var RolesPage = require('./Components/RolesPage');

var GroupPage = React.createClass({
    getInitialState : function() {
        var appgroup = null;
        if(this.props.location.query != null){
            var str = this.props.location.query.appGroup;
            appgroup = JSON.parse(str);
        }

        return {
            appGroup: appgroup,
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },

    render : function() {
        return (
            <div className='tab-page'>
                <Tabs defaultActiveKey="1" tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="基本信息" key="1" style={{width: '100%', height: '100%'}}>
                        <GroupInfoPage ref="groupInfo" appGroup={this.state.appGroup} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                    <TabPane tab="关联应用" key="2" style={{width: '100%', height: '100%'}}>
                        <AppInfoPage ref="appInfo" appGroup={this.state.appGroup} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                    <TabPane tab="角色组管理" key="3" style={{width: '100%', height: '100%'}}>
                        <RolesPage ref="rolesPage" appGroup={this.state.appGroup} style={{width: '100%', height: '100%'}}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = GroupPage;
