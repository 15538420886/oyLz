import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';

import { Form, Button, Input, Select, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var AuthUserStore = require('../data/AuthUserStore.js');
var AuthUserActions = require('../action/AuthUserActions');
var CompUserStore = require('../data/CompUserStore');
var CompUserActions = require('../action/CompUserActions');

var FindUserPage = React.createClass({
    getInitialState: function () {
        return {
            authUserSet: {
                authUser: {},
                errMsg: ''
            },

            loading: false,
            btnNext: false,
            isExist: false,
            hints: {},
            validRules: [],

            lastIdType: '',
            lastIdCode: ''
        }
    },

    mixins: [Reflux.listenTo(AuthUserStore, "onAuthUserComplete"), Reflux.listenTo(CompUserStore, "onCompUserComplete")],
    onAuthUserComplete: function (data) {
        if (data.operation === 'find') {
            var authUser = this.props.authUser;
            this.state.lastIdType = authUser.idType;
            this.state.lastIdCode = authUser.idCode;

            if (this.props.from !== 'staff' && this.props.from !== 'out') {
                authUser.email = '';
                authUser.phoneno = '';
                authUser.userName = '';
                authUser.perName = '';
            }

            // 判断用户是否已经存在
            this.state.isExist = false;
            var user = data.authUser;
            if (user !== null && typeof (user) !== "undefined") {
                var userID = user.userId;
                if (userID !== '' && userID !== null && typeof (userID) !== "undefined") {
                    this.state.isExist = true;
                }
            }

            if (!this.state.isExist) {
                var idType = authUser.idType;
                if (idType === '电子邮箱') {
                    authUser.email = authUser.idCode;
                }
                else if (idType === '手机号') {
                    authUser.phoneno = authUser.idCode;
                }

                authUser.passwd = '11111111';
            }
            else {
                if (this.props.from === 'staff' || this.props.from === 'out') {
                    if (authUser.perName !== user.perName) {
                        Validator.warnMsg("用户已经存在，但是姓名不一致[" + authUser.perName + "][" + user.perName + "]");
                    }
                }

                authUser.email = user.email;
                authUser.phoneno = user.phoneno;
                authUser.passwd = user.passwd;

                if (data.errMsg === '') {
                    authUser.userName = user.userName;
                    authUser.perName = user.perName;
                }
            }

            this.setState({
                loading: this.state.isExist,
                authUserSet: data
            });

            if (this.state.isExist) {
                // 检查用户是否已经【CompUser】存在
                CompUserActions.getCompUser(this.props.corpUuid, user.userName);
            }
        }
    },
    onCompUserComplete: function (data) {
        if (data.operation === 'find') {
            this.setState({
                loading: false
            });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'idCode', desc: '身份内容', required: true, max: 64 },
            { id: 'userName', desc: '用户名', required: true, max: 24 },
            { id: 'passwd', desc: '密码', required: true },
            { id: 'perName', desc: '用户姓名', required: true, max: 32 },
            { id: 'phoneno', desc: '电话', required: true, dataType: 'mobile', max: 32 },
            { id: 'email', desc: '电子邮箱', required: true, dataType: 'email', max: 32 },
        ];

        if (this.props.from === 'staff' || this.props.from === 'out') {
            this.findAuthUser();
        }
    },

    clear: function () {
        this.state.hints = {};
        this.state.lastIdType = '';
        this.state.lastIdCode = '';
    },

    handleOnChange: function (e) {
        var authUser = this.props.authUser;
        authUser[e.target.id] = e.target.value;
        Validator.validator(this, authUser, e.target.id);
        this.setState({
            authUserSet: this.state.authUserSet
        });
    },

    handleOnSelected: function (id, value, option) {
        var authUser = this.props.authUser;
        authUser[id] = value;
        if (!this.findAuthUser()) {
            this.setState({
                authUserSet: this.state.authUserSet
            });
        }
    },
    onIdCodeFinished: function (e) {
        this.findAuthUser();
    },
    findAuthUser: function () {
        if (this.state.lastIdType === this.props.authUser.idType &&
            this.state.lastIdCode === this.props.authUser.idCode)
        {
            return;
        }

        this.state.authUserSet.authUser = {};
        this.state.authUserSet.errMsg = '';

        this.state.btnNext = false;
        var authUser = this.props.authUser;
        var idType = authUser.idType;
        var idCode = authUser.idCode;
        if (idType === '' || idType === null || typeof (idType) === "undefined") {
            return false;
        }

        if (idCode === '' || idCode === null || typeof (idCode) === "undefined") {
            return false;
        }

        if (idType === '身份证') {
            this.state.validRules[0].dataType = 'idcard18';
        }
        else if (idType === '电子邮箱') {
            this.state.validRules[0].dataType = 'email';
        }
        else if (idType === '手机号') {
            this.state.validRules[0].dataType = 'mobile';
        }
        else {
            this.state.validRules[0].dataType = '';
        }

        if (!Validator.validator(this, authUser, 'idCode')) {
            this.setState({
                authUserSet: this.state.authUserSet
            });

            return true;
        }

        this.setState({ loading: true });
        this.state.btnNext = true;
        AuthUserActions.getAuthUser(idType, idCode);
        return true;
    },

    onClickSave: function () {
        if (!this.state.btnNext) {
            Validator.setError(this, 'idCode', '请输入身份信息');
            return 0;
        }

        if (this.state.isExist) {
            return 1;
        }

        if (Validator.formValidator(this, this.props.authUser)) {
            AuthUserActions.createAuthUser(this.props.authUser);
            return 2;
        }

        return 0;
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        var form = <Form layout={layout}>
            <FormItem {...formItemLayout} label="身份类型" required={true} colon={true} className={layoutItem} help={hints.idTypeHint} validateStatus={hints.idTypeStatus}>
                <DictSelect name="idType" id="idType" appName='用户管理' optName='身份类型' value={this.props.authUser.idType} onSelect={this.handleOnSelected.bind(this, "idType")} />
            </FormItem>
            <FormItem {...formItemLayout} label="身份内容" required={true} colon={true} className={layoutItem} help={hints.idCodeHint} validateStatus={hints.idCodeStatus}>
                <Input type="text" name="idCode" id="idCode" value={this.props.authUser.idCode} onChange={this.handleOnChange} onBlur={this.onIdCodeFinished} />
            </FormItem>
            <FormItem {...formItemLayout} label="用户名" required={true} colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
                <Input type="text" name="userName" id="userName" value={this.props.authUser.userName} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="用户姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                <Input type="text" name="perName" id="perName" value={this.props.authUser.perName} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="电话" required={true} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
                <Input type="text" name="phoneno" id="phoneno" value={this.props.authUser.phoneno} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="电子邮箱" required={true} colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
                <Input type="text" name="email" id="email" value={this.props.authUser.email} onChange={this.handleOnChange} />
            </FormItem>
            {this.state.isExist ? null :
                <FormItem {...formItemLayout} label="密码" required={true} colon={true} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                    <Input type="text" name="passwd" id="passwd" value={this.props.authUser.passwd} onChange={this.handleOnChange} />
                </FormItem>
            }
        </Form>;

        return (this.state.loading ?
            <Spin tip="检查用户是否已经存在...">{form}</Spin> : form
        );
    }
});

export default FindUserPage;
