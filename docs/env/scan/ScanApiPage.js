'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../public/script/utils');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Icon, Button, Spin } from 'antd';
var ScanActions = require('./action/ScanActions');
var ScanStore = require('./data/ScanStore');

var ScanApiPage = React.createClass({
	getInitialState: function () {
		return {
			loading: false,
			appList:[
				{
					name: 'hr(人力管理)',
					param: '人力管理',
					authUrl: Utils.hrUrl+'scan/hr-auth',
					compTableUrl: Utils.hrUrl+'scan/comp-table',
					syncTableUrl: Utils.hrUrl+'scan/sync-table',
					downTableUrl: Utils.hrUrl+'scan/down-table'
				},
				{
					name: 'auth(用户管理)',
					param: '授权管理',
					authUrl: Utils.authUrl+'scan/auth',
					apiUrl: Utils.authUrl+'scan/auth-api',
					compTableUrl: Utils.authUrl+'scan/comp-table',
					syncTableUrl: Utils.authUrl+'scan/sync-table',
					downTableUrl: Utils.authUrl+'scan/down-table'
				},
				{
					name: 'resume(简历管理)',
					param: '简历管理',
					authUrl: Utils.resumeUrl+'scan/resume-auth',
					apiUrl: Utils.resumeUrl+'scan/resume-api',
					compTableUrl: Utils.resumeUrl+'scan/comp-table',
					syncTableUrl: Utils.resumeUrl+'scan/sync-table',
					downTableUrl: Utils.resumeUrl+'scan/down-table'
				},
				{
					name: 'param(参数管理)',
					param: '参数管理',
					authUrl: Utils.paramUrl+'scan/param-auth',
					apiUrl: Utils.paramUrl+'scan/param-api',
					compTableUrl: Utils.paramUrl+'scan/comp-table',
					syncTableUrl: Utils.paramUrl+'scan/sync-table',
					downTableUrl: Utils.paramUrl+'scan/down-table'
				},
			]
		}
	},

    mixins: [Reflux.listenTo(ScanStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false
        });
    },

	// 第一次加载
	componentDidMount: function () {
	},
	handleDownClick: function(app){
        
	},
	handleCompClick: function(app){
        this.setState({
            loading: true
        });

        ScanActions.compareTable(app);
	},
	handleSyncClick: function(app){
        this.setState({
            loading: true
        });

        ScanActions.syncTable(app);
	},

	render: function () {
        var cardList =
	      	this.state.appList.map((app, i) => {
				return <div key={app.name} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}}>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{app.name}</h3></div>
						<div className="ant-card-body" style={{cursor:'pointer'}}>
							<a href="#" onClick={this.handleDownClick.bind(this, app)}>下载表结构</a>
							<span className="ant-divider" />
							<a href="#" onClick={this.handleCompClick.bind(this, app)}>比较表结构</a>
							<span className="ant-divider" />
							<a href="#" onClick={this.handleSyncClick.bind(this, app)}>更新表结构</a>
						</div>
					</div>
				</div>
	      	});

		return (
			<div className='form-page' style={{width:'100%', paddingLeft: '16px'}}>
				<ServiceMsg ref='mxgBox' svcList={['scan/table-comp', 'scan/table-sync']}/>

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..."><div style={{minHeight: '200px'}}>{cardList}</div></Spin>
                        :
                        <div>{cardList}</div>
                }
			</div>);
	}
});

module.exports = ScanApiPage;
