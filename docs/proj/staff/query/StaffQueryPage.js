'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Radio, Spin, Tabs } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import SearchResMember from '../../lib/Components/SearchResMember';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils'); 
import MemberInfoPage from './Components/MemberInfoPage';
import StaffProjPage from './Components/StaffProjPage';
import TempProjPage from './Components/TempProjPage';

var StaffQueryPage = React.createClass({
    getInitialState: function () {
        return {
            member: {},
            loading: false,
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },
    onSelectMember: function (data) {
        console.log('data', data)

        this.setState({
            member: data,
        })
    },
    
    render: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
        var staffCode = (this.state.member) ? this.state.member.staffCode : '';

        return (
            <div style={{ width: '100%', height: '100%', padding: '60px 0 0 0'}}>
                <div style={{ width: '100%', margin: '-40px 0 16px 0' }}>
                    <SearchResMember style={{ padding: '0 0 0 32px', width: '600px' }} corpUuid={corpUuid} onSelectMember={this.onSelectMember} />
                </div>

                <Tabs defaultActiveKey="1" tabBarStyle={{ paddingLeft: '16px'}}>
                    <TabPane tab="基本信息" key="1">
                        <MemberInfoPage resMember={this.state.member}/>
                    </TabPane>
                    <TabPane tab="项目经历" key="2" style={{ width: '100%', height: '100%'}}>
                        <StaffProjPage staffCode={staffCode} />
                    </TabPane>
                    <TabPane tab="临时项目" key="4" style={{ width: '100%', height: '100%' }}>
                        <TempProjPage resMember={this.state.member} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = StaffQueryPage;


