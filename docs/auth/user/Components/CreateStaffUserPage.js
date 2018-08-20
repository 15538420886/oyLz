import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Modal, Button, Steps } from 'antd';
const Step = Steps.Step;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var CompUserStore = require('../data/CompUserStore.js');
var CompUserActions = require('../action/CompUserActions');
var AuthUserStore = require('../data/AuthUserStore.js');
var AuthUserActions = require('../action/AuthUserActions');
import FindUserPage from './FindUserPage';
import CompUserPage from './CompUserPage';

const steps = [{
    title: '建立基本信息',
    content: '建立用户基本信息',
},
{
    title: '创建用户',
    content: '创建公司内部的用户',
}];

var CreateStaffUserPage = React.createClass({
    getInitialState: function () {
        return {
            compUserSet: {
                errMsg: ''
            },
            authUserSet: {
                errMsg: ''
            },

            loading: false,
            current: 0,
            userExist: false,
            compUser: {},
            authUser: {},
        }
    },

    mixins: [Reflux.listenTo(CompUserStore, "onCompUserComplete"),
    Reflux.listenTo(AuthUserStore, "onAuthUserComplete")],

    onAuthUserComplete: function (data) {
        if (!this.props.modal || this.state.current !== 0) {
            return;
        }

        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功
                this.state.compUser.userName = this.state.authUser.userName;
                this.state.compUser.perName = this.state.authUser.perName;

                this.setState({
                    current: 1,
                    loading: false,
                    authUserSet: data
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    authUserSet: data
                });
            }
        }
        else if (data.operation === 'find') {
            this.refs.mxgBox.clear();
            this.setState({ userExist: false });
        }
    },
    onCompUserComplete: function (data) {
        if (!this.props.modal){
            return;
        }

        if (this.state.current === 1 && data.operation === 'create') {
            if (data.errMsg === '') {
                this.setState({
                    loading: false,
                });

                this.props.onSave('user');
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    compUserSet: data
                });
            }
        }
        else if (this.state.current === 0 && data.operation === 'find') {
            var flag = (data.errMsg === '用户已经存在');
            this.setState({ userExist: flag });
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },
    initStaff: function (user) {
        this.state.current = 0;
        this.state.userExist = false;
        this.state.compUserSet.errMsg = '';
        this.state.authUserSet.errMsg = '';

        var compUser = this.state.compUser;
        compUser.userName = user.perName;
        compUser.perName = user.perName;
        compUser.userCode = user.staffCode;
        compUser.userTitle = user.jobTitle;
        compUser.userType = '1';
        compUser.corpUuid = user.corpUuid;
        compUser.deptUuid = user.deptUuid;

        var authUser = this.state.authUser;
        authUser.idType = user.idType;
        authUser.idCode = user.idCode;
        authUser.userName = user.perName;
        authUser.perName = user.perName;
        authUser.phoneno = user.phoneno;
        authUser.email = user.email;
        authUser.passwd = '11111111';
        authUser.userStatus = '1';
        authUser.regType = '1';
        
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }

        if (this.refs.firstStepPage !== undefined) {
            this.refs.firstStepPage.findAuthUser();
        }
    },
    initOutStaff: function (user) {
        // console.log('user', user)
        this.state.current = 0;
        this.state.userExist = false;
        this.state.compUserSet.errMsg = '';
        this.state.authUserSet.errMsg = '';

        var compUser = this.state.compUser;
        compUser.userName = user.perName;
        compUser.perName = user.perName;
        compUser.userCode = user.staffCode;
        compUser.userTitle = user.jobTitle;
        compUser.userType = '2';
        compUser.corpUuid = user.corpUuid;
        compUser.deptUuid = user.outUuid;

        var authUser = this.state.authUser;
        authUser.idType = user.idType;
        authUser.idCode = user.idCode;
        authUser.userName = user.perName;
        authUser.perName = user.perName;
        authUser.phoneno = user.phoneno;
        authUser.email = user.email;
        authUser.passwd = '11111111';
        authUser.userStatus = '1';
        authUser.regType = '1';

        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }

        if (this.refs.firstStepPage !== undefined) {
            this.refs.firstStepPage.findAuthUser();
        }
    },

    onClickSave: function () {
        if (this.state.current === 0) {
            var flag = this.refs.firstStepPage.onClickSave();
            if (flag == 1) {
                this.state.compUser.userName = this.state.authUser.userName;
                this.state.compUser.perName = this.state.authUser.perName;

                this.setState({
                    current: 1
                });
            }
            else if (flag == 2) {
                // 等待创建用户
                this.setState({ loading: true });
            }
        }
        else {
            var flag = this.refs.compUserPage.onClickSave();
            if (flag) {
                // 等待创建用户
                this.setState({ loading: true });
            }
        }
    },

    render: function () {
        const { current } = this.state;
        var btnSave = (current === 0) ? '下一步' : '保存';

        return (
            <div style={{ width: '100%' }}>
                <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>

                <div style={{ paddingTop: '20px' }}>
                    {
                        (current === 0) ?
                            <FindUserPage ref='firstStepPage' authUser={this.state.authUser} corpUuid={this.state.compUser.corpUuid} from='staff'/> :
                            <CompUserPage ref='compUserPage' compUser={this.state.compUser} corpUuid={this.state.compUser.corpUuid}/>
                    }
                </div>

                <div key="footerDiv" style={{ display: 'block', textAlign: 'right', padding: '8px 0 0 0' }}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-user/create', 'auth-user/find', 'comp-user/create', 'comp-user/find']} />
                    <Button key="btnOK" type="primary" size="large" disabled={this.state.userExist} onClick={this.onClickSave} loading={this.state.loading}>{btnSave}</Button>{' '}
                </div>
            </div>
        );
    }
});

export default CreateStaffUserPage;
