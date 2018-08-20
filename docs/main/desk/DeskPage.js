'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Icon, Button, Spin } from 'antd';

var DeskPage = React.createClass({
    getInitialState: function () {
		return {
			loading: false,
			appList:[
				{
					name: '个人查询中心',
					url: '@/avt.html',
                    hint: 'HR、考勤、工资条查询',
                    menu: '个人查询中心',
                    roleApp:'*AVT'
				},
				{
					name: '用户管理',
					url: '@/uman.html',
                    hint: '用户创建、权限分配',
                    menu: '用户管理',
                    roleApp:'HR'
				},
				{
					name: '人力资源管理',
					url: '@/hr.html',
                    hint: '6个合同待签，8个休假单待核销，26个招聘需求',
                    menu: '人力资源管理',
                    roleApp: 'HR'
				},
				{
					name: '项目和资源池管理',
					url: '@/proj.html',
                    hint: '项目和资源池管理',
                    menu: '资源池',
                    roleApp: 'PROJ'
                },
                {
                    name: '考勤管理',
                    url: '@/camp.html',
                    hint: '工位管理、考勤查询',
                    menu: '考勤管理',
                    roleApp: 'HR'
                },
                {
                    name: '简历管理',
                    url: '@/resume.html',
                    hint: '简历管理',
                    menu: '简历管理',
                    roleApp: 'HR'
                },
                {
                    name: '招聘管理',
                    url: '@/ats.html',
                    hint: '招聘需求，面试管理',
                    menu: '招聘管理',
                    roleApp: 'HR'
                },
				{
					name: '出差和报销管理',
					url: '@/cost.html',
                    hint: '出差和报销管理',
                    menu: '报销管理',
                    roleApp: 'OA'
                },
                {
                    name: '运行和维护',
                    url: '@/env.html',
                    hint: '12台服务器，60个正常应用，3个异常应用',
                    menu: '运行和维护',
                    roleApp: 'MA'
                },
                {
                    name: '配置管理',
                    url: '@/auth.html',
                    hint: '权限维护、模板管理',
                    menu: '配置管理',
                    roleApp: 'MA'
                },
                {
                    name: '开发管理',
                    url: '@/dev.html',
                    hint: '开发管理',
                    menu: '开发管理',
                    roleApp: 'STUDIO'
                },
                {
                    name: '固定资产管理',
                    url: '@/asset.html',
                    hint: '固定资产的采购、入库、出库管理',
                    menu: '固定资产',
                    roleApp:'OA'
                },
                {
                    name: '缺陷管理',
                    url: '@/tbug.html',
                    hint: '项目中的bug管理',
                    menu: '缺陷管理',
                    roleApp:'OA'
                },
                 {
                    name: '用例管理',
                    url: '@/tcase.html',
                    hint: '项目中的用例管理',
                    menu: '用例管理',
                    roleApp:'OA'
                }
			]
		}
	},
    
	// 第一次加载
    componentDidMount: function () {
	},
    handleAppClick: function (app) {
        var m = Utils.getAppMenu(app.menu);
        if (m) {
            this.openApp(app);
            return;
        }
        
        // 先下载菜单
        this.setState({ loading: true });
        var url = Utils.authUrl + 'fnt-app-menu/appName';
        var self = this;
        Utils.doCreateService(url, app.menu).then(function (result) {
            console.log(result)
            self.setState({ loading: false });
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Utils.saveAppMenu(app.menu, result.object);
                self.openApp(app);
            }
            else {
                Common.errMsg("下载菜单错误[" + result.errCode + "][" + result.errDesc + "]");
                if (result.errCode === 'AUTH09') {
                    browserHistory.push({
                        pathname: '/index.html'
                    });
                }
            }
        }, function (value) {
            self.setState({ loading: false });
            Common.errMsg("下载菜单错误");
        });
    },
    openApp: function (app) {
        Utils.setSelectedApp(app.roleApp);
        Utils.setActiveMenuName( app.menu);
        
        if (app.url.charAt(0) === '@') {
            document.location.href = app.url.substr(1);//会清空utils的数据
        }
        else {
            browserHistory.push({
                pathname: app.url,
                state: { from: 'desk' }
            });
        }
    },

	render: function () {
        var cardList = [];

        var appList = this.state.appList;
        var appLen = appList.length;
        for (var x = 0; x < appLen; x++) {
            var app = appList[x];
            var flag = Utils.checkAppPriv(app.roleApp);
            if (flag !== 0) {
                var style = (flag === 1) ? { width: '100%' } : { width: '100%', border: '1px solid red'};
                cardList.push(
                    <div key={app.name} className='card-div' style={{ width: 300 }}>
                        <div className="ant-card ant-card-bordered" style={ style } onClick={this.handleAppClick.bind(this, app)} >
                            <div className="ant-card-head"><h3 className="ant-card-head-title">{app.name}</h3></div>
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>
                                {app.hint}
                            </div>
                        </div>
                    </div>
                );
            }
        }

		return (
			<div className='form-page' style={{width:'100%', padding: '24px 16px 0 16px'}}>
                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..."><div style={{minHeight: '200px'}}>{cardList}</div></Spin>
                        :
                        <div>{cardList}</div>
                }
			</div>);
	}
});

module.exports = DeskPage;
