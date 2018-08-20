import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Modal, Button, Steps } from 'antd';
const Step = Steps.Step;

var Utils = require('../../../public/script/utils');
var EmployeeStore2 = require('../data/EmployeeStore2.js');
var WorkLogActions = require('../action/WorkLogActions.js');
var CompUserStore = require('../../../auth/user/data/CompUserStore');
var CompUserActions = require('../../../auth/user/action/CompUserActions');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import CloseAccountPage from './CloseAccountPage';
import HMDelEmailPage from './HMDelEmailPage';

const steps = [{
    title: '关停账号',
    content: '删除企业账号',
},
{
    title: '删除邮箱',
    content: '手工删除公司邮箱',
}];

var DimissTodoPage = React.createClass({
    getInitialState: function () {
        return {
            compUserSet: {
                recordSet: [],
                errMsg: '',
            },

            modal: false,
            loading: false,
            current: 0,
            staffCode: '',
            compUser: {},
            userUuid: '',
            email: ''
        }
    },

    mixins: [Reflux.listenTo(EmployeeStore2, "onEmployeeComplete"), Reflux.listenTo(CompUserStore, "onCompUserComplete")],
    onEmployeeComplete: function (data) {
        this.setState({
            loading: false,
            current: 1,
            email: data.recordSet.email
        });
    },
    onCompUserComplete: function (data) {
        if (data.operation === 'remove') {
            if (data.errMsg === '') {
                WorkLogActions.retrieveEmpLoyee(this.state.userUuid);
                return;
            }
        }
        else {
            if (!data.recordSet || data.recordSet.length !== 1) {
                this.state.current = 1;
                if (data.recordSet.length > 1) {
                    alert('员工编号[' + this.state.staffCode + ']多于一个企业账号');
                }
            }
            else {
                this.state.compUser = data.recordSet[0];
            }

            this.state.compUserSet = data;
        }

        this.setState({
            loading: false,
        });
    },

    // 第一次加载
    componentDidMount: function () {
    },
    initStaff: function (workLog) {
        this.state.userUuid = workLog.userUuid;
        this.state.staffCode = workLog.staffCode;

        this.setState({
            loading: true,
        });

        var filter = { userCode: workLog.staffCode };
        filter.corpUuid = window.loginData.compUser.corpUuid;
        CompUserActions.retrieveCompUserPage(filter, 0, 0);
    },
    onClickSave: function () {
        if (this.state.current === 0) {
            if (this.state.compUser.uuid) {
                this.setState({
                    loading: true,
                });

                CompUserActions.deleteCompUser(this.state.compUser.uuid);
            }
            else {
                // 查询用户信息，自动跳转
                WorkLogActions.retrieveEmpLoyee(this.state.userUuid);
            }
        }
        else {
            this.toggle();
        }
    },

    toggle: function () {
        this.setState({
            current: 0,
            modal: !this.state.modal
        });
    },

    render: function () {
        const { current } = this.state;
        var btnSave = (current === 0) ? '删除企业账号' : '处理完成';

        return (
            <Modal visible={this.state.modal} width='560px' title="离职后续操作" maskClosable={false} onCancel={this.toggle}
                footer={null}
            >
                <div style={{ width: '100%' }}>
                    <Steps current={current}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>

                    <div style={{ paddingTop: '20px' }}>
                        {
                            (current === 0) ?
                                <CloseAccountPage ref='accountPage' compUser={this.state.compUser} /> :
                                <HMDelEmailPage ref='HMDelEmailPage' email={this.state.email} />
                        }
                    </div>

                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right', padding: '8px 0 0 0' }}>
                        <ServiceMsg ref='mxgBox' svcList={['comp-user/retrieve', 'hr-employee/retrieve']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>{btnSave}</Button>{' '}
                    </div>
                </div>
            </Modal>
        );
    }
});

export default DimissTodoPage;
