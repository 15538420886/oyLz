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
					apiUrl: Utils.hrUrl+'scan/hr-api'
				},
				{
					name: 'auth(用户管理)',
					param: '授权管理',
					authUrl: Utils.authUrl+'scan/auth',
					apiUrl: Utils.authUrl+'scan/auth-api'
				},
				{
					name: 'resume(简历管理)',
					param: '简历管理',
					authUrl: Utils.resumeUrl+'scan/resume-auth',
					apiUrl: Utils.resumeUrl+'scan/resume-api'
				},
				{
					name: 'camp(考勤管理)',
					param: '考勤管理',
					authUrl: Utils.campUrl+'scan/camp-auth',
					apiUrl: Utils.campUrl+'scan/camp-api'
				},
				{
					name: 'param(参数管理)',
					param: '参数管理',
					authUrl: Utils.paramUrl+'scan/param-auth',
					apiUrl: Utils.paramUrl+'scan/param-api'
				},
				{
					name: 'proj(项目管理)',
					param: '项目管理',
					authUrl: Utils.projUrl+'scan/proj-auth',
					apiUrl: Utils.projUrl+'scan/proj-api'
                },
                {
                    name: 'cloud(参数管理)',
                    param: 'CLOUD参数服务',
                    authUrl: Utils.configUrl + 'scan/config-auth',
                    apiUrl: Utils.configUrl + 'scan/config-api'
                },
                {
                    name: 'dev(开发管理)',
                    param: '开发管理',
                    authUrl: Utils.devUrl + 'scan/dev-auth',
                    apiUrl: Utils.devUrl + 'scan/dev-api'
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
	handleScanApiClick: function(app){
        this.setState({
            loading: true
        });

		ScanActions.scanApi(app);
	},
	handleScanAuthClick: function(app){
        this.setState({
            loading: true
        });

        ScanActions.scanAuth(app);
	},

	render: function () {
        var cardList =
	      	this.state.appList.map((app, i) => {
				return <div key={app.name} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}}>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{app.name}</h3></div>
						<div className="ant-card-body" style={{cursor:'pointer'}}>
							<a href="#" onClick={this.handleScanApiClick.bind(this, app)}>扫描API</a>
							<span className="ant-divider" />
							<a href="#" onClick={this.handleScanAuthClick.bind(this, app)}>扫描权限</a>
						</div>
					</div>
				</div>
	      	});

		return (
			<div className='form-page' style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['scan/scan-api', 'scan/scan-auth']}/>
				
				<div style={{marginLeft:'16px', marginBottom:'14px'}}>服务清单</div>

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
