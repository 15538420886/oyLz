'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Spin } from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var UserPrivStore = require('../data/UserPrivStore');
var UserPrivActions = require('../action/UserPrivActions');
var CorpAppAuthStore = require('../../corp-app-auth/data/CorpAppAuthStore');
var CorpAppAuthActions = require('../../corp-app-auth/action/CorpAppAuthActions');

var FntAppStore = require('../../fnt-app/app/data/FntAppStore');
var FntAppActions = require('../../fnt-app/app/action/FntAppActions');

import RoleCheckPage1 from './RoleCheckPage1';


var UserPrivPage = React.createClass({
    getInitialState: function () {
        return {
            userPrivSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            appLoading: false,
            userLoading: false,
            appMap: {},
            appList: [],

            userPriv: null,	// 选中的APP
            action: 'query',
            compUser: this.props.compUser,
        }
    },

    mixins: [Reflux.listenTo(UserPrivStore, "onServiceComplete"),
        Reflux.listenTo(FntAppStore, "onLoadAppComplete"),
        Reflux.listenTo(CorpAppAuthStore, "onLoadUserComplete")
    ],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            userPrivSet: data
        });
    },
    onLoadAppComplete: function (data) {
        var appMap = {};
        if (data.errMsg === '') {
            data.recordSet.map((app, i) => {
                appMap[app.uuid] = app;
            });
        }

        this.setState({
            appLoading: false,
            appMap: appMap,
            appList: data.recordSet,
        });
    },
    onLoadUserComplete: function (data) {
        this.setState({
            userLoading: false,
            compUser: data.compUser,
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });

        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
        UserPrivActions.retrieveUserPriv(corpUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true, appLoading: true, userLoading: true });
        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
        UserPrivActions.initUserPriv(corpUuid);
        FntAppActions.initFntApp();

        // 取用户权限
        CorpAppAuthActions.getUserByUuid(this.props.compUser.uuid);
    },
    handleAppClick: function (userPriv) {
        this.setState({ userPriv: userPriv });
        this.refs.roleCheck.loadData(this.state.compUser, userPriv.appUuid);
    },
    onBack: function () {
        this.setState({ action: 'query' });
    },

    render: function () {
        var selectedApps = [];
        var recordSet = this.state.userPrivSet.recordSet;
        var appUuid = (this.state.userPriv === null) ? '' : this.state.userPriv.appUuid;
        recordSet.map((userPriv, i) => {
            var app = this.state.appMap[userPriv.appUuid];
            if (app !== null && typeof (app) !== 'undefined') {
                userPriv['uuid'] = app.uuid;
                userPriv['appCode'] = app.appCode;
                userPriv['appName'] = app.appName;
                selectedApps.push(userPriv);
            }
        });

        var privAppMap = {};
        var user = this.state.compUser;
        if (user.appAuthList !== undefined && user.appAuthList !== null) {
            user.appAuthList.map((app, i) => {
                privAppMap[app.appUuid] = app;
            });
        }

        var cardList =
            selectedApps.map((app, i) => {
                var privApp = privAppMap[app.uuid];
                // console.log('privAppMap', privAppMap, app, privApp)
                var icon = (privApp === undefined || privApp === null) ? null : <Icon type="check" />;

                var title = null;
                if (this.state.userPriv === app) {
                    title = <span style={{ color: '#49a9ee'}}>{app.appCode}</span>;
                }
                else {
                    title = app.appCode;
                }

                return <div key={app.uuid} className='card-div' style={{ width: 300 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleAppClick.bind(this, app)} title='点击修改权限信息'>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{title}</h3></div>
                        <div className="ant-card-extra">
                            {icon}
                        </div>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{app.appName}</div>
                    </div>
                </div>
            });

        var compUser = this.props.compUser;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var loading = this.state.loading || this.state.appLoading || this.state.userLoading;
        var cs = Common.getCardMargin(this);
        var appCard =
            <div className='card-page' style={{ padding: cs.padding, display: visible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-corp-app/retrieve', 'auth-corp-app/remove']} />
                    <div className='toolbar-card'>
                        <div style={{ float: 'left' }}>
                            <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>用户【{compUser.perName}】的权限设置</div>
                        </div>
                    </div>
                </div>

                {
                    loading ?
                        <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
                }
            </div>;
        return (
              <div className='grid-page' style={{padding: cs.padding}}>
                    <div style={{margin: cs.margin}}>     
                         <ServiceMsg ref='mxgBox' svcList={['app-auth1/update', 'app-auth1/create','app-auth1/remove','comp-user/get-by-uuid']}/>
                    </div>  
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div className='left-tree' style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                            {appCard}
                        </div>
                        <div className='left-tree' style={{ flex: '0 0 280px', width: '280px',  overflowY: 'auto', overflowX: 'hidden' }}>
                            <RoleCheckPage1 ref='roleCheck' appUuid={appUuid} user={user} />
                        </div>
                     </div>
              </div>  
        );
    }
});

module.exports = UserPrivPage;


