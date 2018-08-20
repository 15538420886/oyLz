'use strict';
var $ = require('jquery');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'

import { Form, Button, Input, Icon, Checkbox } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
import CompSelect from '../../../login2/Components/CompSelect';
var LoginUtil = require('../../../login2/LoginUtil');


var LoginPage2 = withRouter(React.createClass({
    getInitialState: function () {
        if (LoginUtil.loadContext()) {
            this.props.router.push({
				pathname: Common.envHome,
                state: { from: 'login' }
            });
        }

        var corpUuid = '';
        if (Common.corpStruct === '单公司') {
            corpUuid = Common.corpUuid;
        }

        return {
            user: {
                userName: "",
                passwd: "",
                corpUuid: corpUuid
            },
            loading: false,
            isRemember: true,
            errMsg: '',
            hints: {},
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

        // 下载菜单
        var self = this;
        Utils.downAppMenu('运行和维护', 'MA').then(function (data) {
            self.state.loading = false;

            self.props.router.push({
                pathname: Common.envHome,
                state: { from: 'login' }
            });
        }, function (errMsg) {
            self.state.loading = false;
            self.showError(errMsg);
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

    render: function () {
        var errMsg = this.state.errMsg;

        var layout = 'vertical';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 0 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
        };

        var hints = this.state.hints;
        var corpBox = (Common.corpStruct === '单公司') ?
            null :
            <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.compUuidHint} validateStatus={hints.compUuidStatus}>
                <CompSelect name="corpUuid" id="corpUuid" ref='compSelect' value={this.state.user.corpUuid} onSelect={this.handleOnSelected.bind(this, "corpUuid")} onLoaded={this.onLoadCamp} />
            </FormItem>;

        return (
            <div style={{ width: '100%' }}>
                <div style={{ width: '300px', paddingTop: '100px', margin: '0 auto' }}>
                    <Form layout={layout}>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" type="text" name="userName" id="userName" value={this.state.user.userName} onChange={this.handleOnChange} onBlur={this.onUserNameFinished} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="密码" type="password" name="passwd" id="passwd" value={this.state.user.passwd} onChange={this.handleOnChange} />
                        </FormItem>
                        {corpBox}
                        <FormItem>
                            <ErrorMsg message={errMsg} toggle={this.onDismiss} />
                            <Checkbox id='remember' checked={this.state.isRemember} onChange={this.handleCheckBox}>记住用户名</Checkbox>
                            <Button key="btnOK" type="primary" size="large" onClick={this.clickLogin} style={{ width: '100%' }} loading={this.state.loading}>登录</Button>
                            {Common.resMode ? null : <Button key="btnOK1" type="primary" size="large" onClick={this.clickQuickLogin} style={{ width: '100%', marginTop: '20px' }} loading={this.state.loading}>快速登录</Button>}
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}));

module.exports = LoginPage2;
