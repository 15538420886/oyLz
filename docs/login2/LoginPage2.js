'use strict';
var $ = require('jquery');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'

import { Form, Button, Input, Icon, Checkbox } from 'antd';
const FormItem = Form.Item;

var Common = require('../public/script/common');
var Utils = require('../public/script/utils');
import ErrorMsg from '../lib/Components/ErrorMsg';
import CompSelect from './Components/CompSelect';
import ModPasswdPage from './Components/ModPasswdPage';
import ResetPasswdPage from './Components/ResetPasswdPage';
var LoginUtil = require('./LoginUtil');

import CanvasDotePage from './Components/CanvasDotePage';


var LoginPage2 = withRouter(React.createClass({
    getInitialState: function () {
        var storage = window.localStorage;
        var flag = (storage.isRemember === '1');
        var userName = (flag ? storage.userName : '');

        var corpUuid = '';
        if (Common.corpStruct === '单公司') {
            corpUuid = Common.corpUuid;
        }
        else if (flag){
            corpUuid = storage.corpUuid;
        }

        var loginData = window.sessionStorage.getItem('loginData');
        if (loginData !== null && typeof (loginData) !== 'undefined') {
            var skip = false;
            var loc = this.props.location;
            if (loc !== null && typeof (loc) !== 'undefined') {
                var path = loc.pathname;
                if (path !== '') {
                    if (loc.search !== '') {
                        skip = true;
                    }
                    else if (path !== '/' && path !== '/index.html' && path !== '/test.html') {
                        skip = true;
                    }
                }
            }

            if (skip && LoginUtil.loadContext()) {
                this.props.router.push({
                    pathname: '/main/DeskPage/',
                    state: { from: 'login' }
                });
            }
            else {
                window.sessionStorage.removeItem('loginData');
            }
        }

        return {
            user: {
                userName: userName,
                passwd: "",
                corpUuid: corpUuid
            },
            loading: false,
            isRemember: flag,
            errMsg: '',
            hints: {},
            action: 'login',
            validRules: []
        }
    },

    // 第一次加载
    componentDidMount: function () {
        LoginUtil.downConfig(this);

        this.state.validRules = [
            { id: 'userName', desc: '用户名', required: true, max: 24 },
            { id: 'passwd', desc: '密码', required: true, max: 16 }
        ];
    },
    showError: function (msg) {
        this.setState({
            errMsg: msg
        });
    },
    onConfigLoaded: function () {
        if (this.refs.compSelect !== undefined) {
            this.refs.compSelect.loadCorps();
        }
    },

    clickLogin: function (event) {
        var passwd = this.state.user.passwd;
        this.state.errMsg = '';
        if (!Common.formValidator(this, this.state.user)) {
            return;
        }

        var url = Utils.authUrl + 'auth-user/login';
        var pwd = Common.calcMD5(passwd);

        var loginData = {};
        loginData.password = pwd;
        loginData.username = this.state.user.userName;
        var self = this;
        this.setState({ loading: true });
        Utils.loginService(url, loginData).then(function (userData, status, xhr) {
            self.state.loading = false;
            if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                if (passwd == '11111111' || passwd == '12345678') {
                    self.setState({ action: 'modify' });
                } else {
                    self.loginSuccess(userData.object);
                }
            }
            else {
                self.showError("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.state.loading = false;
            self.showError('未知错误');
        });
    },

    clickQuickLogin: function (event) {
        this.state.user.corpUuid = Common.corpUuid;

        var url = Utils.authUrl + 'auth-user/login';
        var loginData = {};
        loginData.password = 'admin';
        loginData.username = 'admin';

        var self = this;
        this.setState({ loading: true });
        Utils.loginService(url, loginData).then(function (userData, status, xhr) {
            self.state.loading = false;
            if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                self.loginSuccess(userData.object);
            }
            else {
                self.showError("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.state.loading = false;
            self.showError('未知错误');
        });
    },

    loginSuccess: function (loginData) {
        var corpUuid = this.state.user.corpUuid;
        LoginUtil.saveLoginData(loginData, corpUuid);

        var storage = window.localStorage;
        storage.isRemember = (this.state.isRemember ? '1' : '0');
        storage.userName = (this.state.isRemember ? this.state.user.userName : '');
        storage.corpUuid = (this.state.isRemember ? this.state.user.corpUuid : '');

        this.props.router.push({
            pathname: '/main/DeskPage/',
            state: { from: 'login' }
        });
    },

    handleOnChange: function (e) {
        var user = this.state.user;
        user[e.target.id] = e.target.value;
        Common.validator(this, user, e.target.id);
        this.setState({
            user: user
        });
    },
    handleCheckBox: function (e) {
        var value = e.target.checked;
        this.setState({
            isRemember: value
        });
    },
    handleOnSelected: function (id, value, option) {
        var user = this.state.user;
        user[id] = value;
        this.setState({
            user: user
        });
    },
    onUserNameFinished: function (e) {
        if (Common.corpStruct !== '单公司') {
            this.refs.compSelect.loadData(this.state.user.userName);
        }
    },
    onLoadCamp: function (corpUuid) {
        var user = this.state.user;
        user.corpUuid = corpUuid;
        this.setState({
            user: user
        });
    },
    onDismiss: function () {
        this.setState({
            errMsg: ''
        });
    },

    onGoBack: function () {
        this.setState({ action: 'login' });
    },

    reqPsd: function(){
        this.setState({ action: 'request' });
    },

    render: function () {
        var errMsg = this.state.errMsg;

        var layout = 'vertical';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 0 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
        };
        var userName = this.state.user.userName;
        var hints = this.state.hints;
        var visible = (this.state.action === 'login') ? '' : 'none';

        var qr = { imageSize: '5', zoom: '4', title: 'icerno' };
        qr.data = 'http://124.202.135.197:18580/apk/icerno.apk';
        var str = JSON.stringify(qr);
        str = encodeURI(str);
        str = str.replace(/&/g, '%26');
        var qrUrl = '/param_s/QRCode/create?data=' + str;
        // var qrUrl = 'https://124.202.135.197:18443/param_s/' + 'QRCode/create?data=' + str;

        var corpBox = (Common.corpStruct === '单公司') ?
            null :
            <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.compUuidHint} validateStatus={hints.compUuidStatus}>
                <CompSelect style={{opacity:'.9'}} name="corpUuid" id="corpUuid" ref='compSelect' value={this.state.user.corpUuid} onSelect={this.handleOnSelected.bind(this, "corpUuid")} onLoaded={this.onLoadCamp} />
            </FormItem>;

        var contactTable =
            <div style={{ width: '100%' }} style={{ display: visible}}>
                <div style={{ width: '300px',height:'300px',position:'fixed',margin: '-150px -150px',top:'50%',left:'50%' }}>
                    <Form layout={layout}>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} style={{opacity:'.9'}} placeholder="用户名" type="text" name="userName" id="userName" value={this.state.user.userName} onChange={this.handleOnChange} onBlur={this.onUserNameFinished} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} style={{opacity:'.9'}} placeholder="密码" type="password" name="passwd" id="passwd" value={this.state.user.passwd} onChange={this.handleOnChange} />
                        </FormItem>
                        {corpBox}
                        <FormItem>
                            <ErrorMsg message={errMsg} toggle={this.onDismiss} />
                            <Checkbox id='remember' style={{color:'#fff',opacity:'.9'}} checked={this.state.isRemember} onChange={this.handleCheckBox}>记住用户名</Checkbox>
                            <a onClick={this.reqPsd} style={{float:'right',marginTop:'1px',color:'#fff'}}>忘记密码？</a>
                            <Button key="btnOK" type="primary" size="large" onClick={this.clickLogin} style={{ width: '100%', opacity:'.9' }} loading={this.state.loading}>登录</Button>
                            {Common.resMode ? null : <Button key="btnOK1" type="primary" size="large" onClick={this.clickQuickLogin} style={{ width: '100%', marginTop: '20px' ,opacity:'.9'}} loading={this.state.loading}>快速登录</Button>}
                        </FormItem>
                    </Form>
                </div>
                <div style={{ padding: '15px 0 0 15px' }}>
                    <img src={qrUrl} style={{ width: 80, height: 80 }} />
                    <p style={{ color: '#FFFFFF', paddingTop: '6px' }}>android 客户端</p>
                </div>
            </div>

        var page = null;
        if (this.state.action === 'modify') {
            page = <ModPasswdPage onBack={this.onGoBack} />;
        }else if (this.state.action === 'request') {
            page = <ResetPasswdPage userName={userName} onBack={this.onGoBack} />;
        }

        return (
            <div style={{ width: '100%', height: '100%' ,background:'#0e1a53', opacity:'.92'}}>
                <CanvasDotePage />
                {contactTable}
                {page}
            </div>
        )
    }
}));

module.exports = LoginPage2;
