import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Table, Button, Icon, Input, Form } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
import SearchEmployee from '../../lib/Components/SearchEmployee';
var EmployeeStore = require('../data/EmployeeStore2');
var EmployeeActions = require('../action/EmployeeActions'); 
import SelectDeptStaffPage from './SelectDeptStaffPage';
import SelectPoolStaffPage from './SelectPoolStaffPage';

var SendMailPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            mailList: [],
            mailBody: '',
            perName: '',
        }
    },
    mixins: [Reflux.listenTo(EmployeeStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'mail') {
            alert(data.errMsg);
            if (this.props.onSave) {
                this.props.onSave('notice');
            }
            else {
                this.setState({ loading: false });
            }
        }
    },

    
    // 第一次加载
    componentDidMount: function () {
        var type = this.props.type;
        if (type === 'out') {
            this.initOutStaff(this.props.obj.user, this.props.obj.job);
        }
        else if (type === 'staff') {
            this.initStaff(this.props.obj.user, this.props.obj.job);
        }

        this.setState({ loading: false });
    },
    initStaff: function (user) {
        // console.log('user', user)
        this.state.loading = false;
        this.state.perName = user.perName;
        this.state.mailList = [];

        var str = user.deptName + '员工：' + user.perName + '，编号：' + user.staffCode
            + '\n已于：' + Common.getToday() + ' 办理入职手续，请协助办理相关事宜，谢谢\n人力资源部，' + window.loginData.authUser.perName
            + '\n此邮件地址不能回复，如有疑问请回复邮件：' + window.loginData.authUser.email;
        this.state.mailBody = str;

        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    initOutStaff: function (user) {
        // console.log('user', user)
        this.state.loading = false;
        this.state.perName = user.perName;
        this.state.mailList = [];

        var str = '外协人员：' + user.perName + '，编号：' + user.staffCode
            + '\n已于：' + Common.getToday() + ' 办理入职手续，请协助办理相关事宜，谢谢\n' + window.loginData.authUser.perName
            + '\n此邮件地址不能回复，如有疑问请回复邮件：' + window.loginData.authUser.email;
        this.state.mailBody = str;

        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onSelectEmpLoyee: function (data) {
        var user = null;

        var email = data.email;
        if (!email) {
            Common.infoMsg('[' + data.perName+']没有注册邮箱');
            return;
        }

        var len = this.state.mailList.length;
        for (var i = 0; i < len; i++) {
            if (this.state.mailList[i].email === email) {
                user = this.state.mailList[i];
                break;
            }
        }

        if (!user) {
            user = { staffCode: data.staffCode, perName: data.perName, email: data.email };
            this.state.mailList.push(user);
            this.setState({ loading: false });
        }
    },

    onClickDelete: function (mail, event) {
        var email = mail.email;
        var len = this.state.mailList.length;
        for (var i = 0; i < len; i++) {
            if (this.state.mailList[i].email === email) {
                this.state.mailList.splice(i, 1);
                break;
            }
        }

        this.setState({ loading: false });
    },
    onSelectDeptUser: function () {
        this.refs.deptWindow.toggle();
    },
    onSelectResUser: function () {
        this.refs.resWindow.toggle();
    },
    onSelectDeptStaff: function (staff) {
        var user = null;

        var email = staff.email;
        if (!email) {
            Common.infoMsg('[' + staff.perName + ']没有注册邮箱');
            return;
        }

        var len = this.state.mailList.length;
        for (var i = 0; i < len; i++) {
            if (this.state.mailList[i].email === email) {
                user = this.state.mailList[i];
                break;
            }
        }

        if (!user) {
            user = { staffCode: staff.staffCode, perName: staff.perName, email: staff.email };
            this.state.mailList.push(user);
            this.setState({ loading: false });
        }
    },
    onSelectResStaff: function (staff) {
        var user = null;
        console.log('staff', staff)

        var email = staff.email;
        if (!email) {
            Common.infoMsg('[' + staff.perName + ']没有注册邮箱');
            return;
        }

        var len = this.state.mailList.length;
        for (var i = 0; i < len; i++) {
            if (this.state.mailList[i].email === email) {
                user = this.state.mailList[i];
                break;
            }
        }

        if (!user) {
            user = { staffCode: staff.staffCode, perName: staff.perName, email: staff.email };
            this.state.mailList.push(user);
            this.setState({ loading: false });
        }
    },
    handleOnChange: function (e) {
        this.setState({ mailBody: e.target.value });
    },

    onClickSave: function () {
        var len = this.state.mailList.length;
        if (len === 0) {
            Common.infoMsg("请选择邮件接收人");
            return;
        }

        var obj = { mailBody: this.state.mailBody, perName: this.state.perName, mailList: this.state.mailList };
        this.setState({ loading: true });
        EmployeeActions.sendEntryMail(obj);
    },

    render: function () {
        const columns = [
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 100,
            },
            {
                title: '电子邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 200,
            },
            {
                title: '',
                key: 'action',
                width: 40,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];
        
        var recordSet = this.state.mailList;
        var corpUuid = window.loginData.compUser.corpUuid;

        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 2 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 22 }),
        };

        return (
            <div style={{ width: '100%' }}>
                <div style={{ padding: '0 0 10px 0' }}>
                    <div style={{ float: 'left' }}>
                        <Button icon={Common.iconAdd} title="选择部门干系人" type="primary" onClick={this.onSelectDeptUser} />
                        <Button icon={Common.iconAdd} title="选择资源池干系人" onClick={this.onSelectResUser} style={{ marginLeft: '4px', visibility:'hidden' }} />
                    </div>
                    <div style={{ textAlign: 'right', width: '100%' }}>
                        <SearchEmployee style={{width: '220px' }} corpUuid={corpUuid} onSelectEmpLoyee={this.onSelectEmpLoyee} />
                    </div>
                </div>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.staffCode} pagination={false} size="middle" bordered={Common.tableBorder} scroll={{ y: 158 }}/>

                <FormItem label="" required={false} colon={true} className={layoutItem} style={{ padding: '20px 0 0 0' }}>
                    <Input type="textarea" name="mailBody" id="mailBody" value={this.state.mailBody} onChange={this.handleOnChange} style={{ height: '110px' }} />
                </FormItem>

                <div key="footerDiv" style={{ display: 'block', textAlign: 'right', padding: '8px 0 0 0' }}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>发送邮件</Button>{' '}
                </div>

                <SelectDeptStaffPage ref='deptWindow' onSelectStaff={this.onSelectDeptStaff} />
                <SelectPoolStaffPage ref='resWindow' onSelectStaff={this.onSelectResStaff} />
            </div>
        );
    }
});

export default SendMailPage;
