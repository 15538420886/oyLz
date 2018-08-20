'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../public/script/common');
import { Button, Table, Icon, Modal, Spin, Form, Input } from 'antd';
import ErrorMsg from '../../lib/Components/ErrorMsg';
const FormItem = Form.Item;
var Validator = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var ResetPasswdPage = React.createClass({
    getInitialState: function () {
        return {
            resetPasswd: {
                newEmail: "",
                newPasswd: "",
                confirmPad: "",
            },
            loading: false,
            hints: {},
            errMsg: '',
            validRules: [],
            count: 60,
            liked: true,
        }
    },

    componentDidMount: function () {
        this.state.validRules = [
            { id: 'username', desc: '用户名', required: true, max: '0' },
            { id: 'email', desc: '电子邮箱', required: true, max: '0' },
            { id: 'resetCode', desc: '验证码', required: false, max: '0' },
            { id: 'passwd', desc: '密码', required: false, max: '0' },
        ];
    },

    handleOnChange: function (e) {
        var resetPasswd = this.state.resetPasswd;
        resetPasswd[e.target.id] = e.target.value;
        Validator.validator(this, resetPasswd, e.target.id);
        this.setState({
            resetPasswd: resetPasswd
        });
    },

    showError: function (msg) {
        this.setState({
            errMsg: msg
        });
    },

    onDismiss: function () {
        this.setState({
            errMsg: ''
        });
    },

    goBack: function () {
        this.props.onBack();
    },

    times: function () {
        if (this.state.liked) {
            this.timer = setInterval(function () {
                var count = this.state.count;
                this.state.liked = false;
                count -= 1;
                if (count < 1) {
                    this.setState({
                        liked: true
                    });
                    count = 60;
                    clearInterval(this.timer);
                }
                this.setState({ count: count });
            }.bind(this), 1000);
        }
    },

    clickGetEmail: function () {
        //输入的邮箱
        var newEmail = this.state.resetPasswd.email;
        var username = this.state.resetPasswd.username;
        if (newEmail === null || newEmail === '' || username === null || username === '') {
            Common.errMsg('用户名和邮箱不能为空');
        }

        var url = Utils.authUrl + 'auth-user/reset-req';
        var loginData = {};
        loginData.username = username;
        loginData.email = newEmail;

        var self = this;
        Utils.doUpdateService(url, loginData).then(function (userData, status, xhr) {
            if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                Common.succMsg("邮件已发送！");
                self.times();
            }
            else {
                self.showError("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.showError('未知错误');
        });
    },

    clickRequestPwd: function (event) {
        var url = Utils.authUrl + 'auth-user/reset-passwd';
        var loginData = {};
        var newPasswd = this.state.resetPasswd.passwd;
        var confirmPad = this.state.resetPasswd.confirmPad;
        loginData.username = this.props.userName;
        loginData.passwd = newPasswd;
        loginData.resetCode = this.state.resetPasswd.resetCode;

        var self = this;
        Utils.doUpdateService(url, loginData).then(function (userData, status, xhr) {
            if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                if (newPasswd != confirmPad) {
                    Validator.warnMsg("两次输入需要一致！");
                } else {
                    Common.succMsg("密码修改成功！");
                    self.goBack();
                }
            }
            else {
                self.showError("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.showError('未知错误');
        });
    },

    render: function () {
        var errMsg = this.state.errMsg;
        var hints = this.state.hints;
        var layout = 'vertical';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 0 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
        };
        var text = this.state.liked ? '获取验证码' : this.state.count + ' s';

        return (
            <div style={{ width: '100%' }}>
                <div style={{ width: '300px', paddingTop: '100px', margin: '0 auto' }}>
                    <div style={{ width: '100%', height: '40px', lineHeight: '30px', fontSize: '16px', textAlign: 'center', marginBottom: '10px', letterSpacing: 3, color: '#fff', opacity: '.9' }}>重置密码</div>
                    <Form layout={layout}>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.usernameHint} validateStatus={hints.usernameStatus} >
                            <Input prefix={<Icon type="user" />} placeholder="用户名" type="text" name="username" id="username" value={this.state.resetPasswd.username} onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '10px' }} help={hints.emailHint} validateStatus={hints.emailStatus}>
                            <Input prefix={<Icon type="mail" />} placeholder="注册的邮箱" type="text" name="email" id="email" value={this.state.resetPasswd.email} onChange={this.handleOnChange} />
                            <Button style={{ position: 'absolute', right: '1px', top: '2px', height: '28px', zIndex: 2, fontSize: 12 }} key="btnEamil" size="large" onClick={this.clickGetEmail}>{text}</Button>
                            <p style={{ width: '100%', fontSize: 12, textAlign: 'right', color: '#fff', opacity: '.9' }}>验证码将会发送至您的注册邮箱</p>
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.resetCodeHint} validateStatus={hints.resetCodeStatus} >
                            <Input prefix={<Icon type="safety" />} placeholder="验证码" type="text" name="resetCode" id="resetCode" value={this.state.resetPasswd.resetCode} onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus} >
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="密码" type="password" name="passwd" id="passwd" value={this.state.resetPasswd.passwd} onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.confirmPadHint} validateStatus={hints.confirmPadStatus} >
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="确认密码" type="password" name="confirmPad" id="confirmPad" value={this.state.resetPasswd.confirmPad} onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                            <ErrorMsg message={errMsg} toggle={this.onDismiss} />
                            <Button type="primary" size="middle" onClick={this.clickRequestPwd} style={{ marginRight: '6px' }} loading={this.state.loading}>修改密码</Button>
                            <Button size="middle" onClick={this.goBack}>取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>);
    }
});

module.exports = ResetPasswdPage;
