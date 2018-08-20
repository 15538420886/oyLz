'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../public/script/utils');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Icon, Button, Spin } from 'antd';
var SyncTableActions = require('./action/SyncTableActions');
var SyncTableStore = require('./data/SyncTableStore');

var SyncTablePage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            appList: [
                {
                    name: 'hr(人力管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'hr' },
                    downUrl: Utils.hrUrl + 'scan/download-dbjson',
                    compareUrl: Utils.hrUrl + 'scan/retrie-differ',
                    syncUrl: Utils.hrUrl + 'scan/update-tables'
                },
                {
                    name: 'auth(用户管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'auth' },
                    downUrl: Utils.authUrl + '/scan/download-dbjson',
                    compareUrl: Utils.authUrl + 'scan/retrie-differ',
                    syncUrl: Utils.authUrl + 'scan/update-tables'
                },
                {
                    name: 'resume(简历管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'resume' },
                    downUrl: Utils.resumeUrl + 'scan/download-dbjson',
                    compareUrl: Utils.resumeUrl + 'scan/retrie-differ',
                    syncUrl: Utils.resumeUrl + 'scan/update-tables'
                },
                {
                    name: 'camp(考勤管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'camp' },
                    downUrl: Utils.campUrl + 'scan/download-dbjson',
                    compareUrl: Utils.campUrl + 'scan/retrie-differ',
                    syncUrl: Utils.campUrl + 'scan/update-tables'
                },
                {
                    name: 'param(参数管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'param' },
                    downUrl: Utils.paramUrl + 'scan/download-dbjson',
                    compareUrl: Utils.paramUrl + 'scan/retrie-differ',
                    syncUrl: Utils.paramUrl + 'scan/update-tables'
                },
                {
                    name: 'proj(项目管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'proj' },
                    downUrl: Utils.projUrl + 'scan/download-dbjson',
                    compareUrl: Utils.projUrl + 'scan/retrie-differ',
                    syncUrl: Utils.projUrl + 'scan/update-tables'
                },
                {
                    name: 'dev(开发管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'dev' },
                    downUrl: Utils.devUrl + 'scan/download-dbjson',
                    compareUrl: Utils.devUrl + 'scan/retrie-differ',
                    syncUrl: Utils.devUrl + 'scan/update-tables'
                },
                {
                    name: 'flow(审批流程)',
                    param: { hostAddr: Utils.dbUrl, schema: 'flow' },
                    downUrl: Utils.flowUrl + 'scan/download-dbjson',
                    compareUrl: Utils.flowUrl + 'scan/retrie-differ',
                    syncUrl: Utils.flowUrl + 'scan/update-tables'
                },
                {
                    name: 'cost(差旅报销)',
                    param: { hostAddr: Utils.dbUrl, schema: 'cost' },
                    downUrl: Utils.costUrl + 'scan/download-dbjson',
                    compareUrl: Utils.costUrl + 'scan/retrie-differ',
                    syncUrl: Utils.costUrl + 'scan/update-tables'
                },
                {
                    name: 'ats(招聘管理)',
                    param: { hostAddr: Utils.dbUrl, schema: 'ats' },
                    downUrl: Utils.atsUrl + 'scan/download-dbjson',
                    compareUrl: Utils.atsUrl + 'scan/retrie-differ',
                    syncUrl: Utils.atsUrl + 'scan/update-tables'
                },
            ]
        }
    },

    mixins: [Reflux.listenTo(SyncTableStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false
        });
    },

    // 第一次加载
    componentDidMount: function () {
    },
    handleClickDown: function (app) {
        var url = app.downUrl + '?hostAddr=' + app.param.hostAddr + '&schema=' + app.param.schema;
        window.location.href = Utils.fmtGetUrl(url);
    },
    handleClickCompare: function (app) {
        this.setState({
            loading: true
        });

        SyncTableActions.compareTable(app);
    },
    handleClickSync: function (app) {
        this.setState({
            loading: true
        });

        SyncTableActions.syncTable(app);
    },

    render: function () {
        var cardList =
            this.state.appList.map((app, i) => {
                return <div key={app.name} className='card-div' style={{ width: 300 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }}>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{app.name}</h3></div>
                        <div className="ant-card-body" style={{ cursor: 'pointer' }}>
                            <a href="#" onClick={this.handleClickDown.bind(this, app)}>下载</a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.handleClickCompare.bind(this, app)}>比较</a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.handleClickSync.bind(this, app)}>同步</a>
                        </div>
                    </div>
                </div>
            });

        return (
            <div className='form-page' style={{ padding: "8px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['scan/scan-api', 'scan/scan-auth']} />
                <div style={{ marginLeft: '16px', marginBottom: '14px' }}>服务清单</div>
                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..."><div style={{ minHeight: '200px' }}>{cardList}</div></Spin>
                        :
                        <div>{cardList}</div>
                }
            </div>);
    }
});

module.exports = SyncTablePage;
