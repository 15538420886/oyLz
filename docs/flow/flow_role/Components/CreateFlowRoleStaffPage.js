import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../hr/lib/Components/SearchEmployee';
import SearchResMember from '../../../proj/lib/Components/SearchResMember';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FlowRoleStore = require('../data/FlowRoleStore');
var FlowRoleActions = require('../action/FlowRoleActions');
var OrgFindStore = require('../data/OrgFindStore');
var OrgFindActions = require('../action/OrgFindActions');

var CreateFlowRolePage = React.createClass({
    getInitialState: function () {
        return {
            flowRoleSet: {},
            loading: false,
            flowRole: {},
            hints: {},
            validRules: [],
            operation: '',
            FlowRoleStaff: {},
        }
    },

    mixins: [Reflux.listenTo(FlowRoleStore, "onServiceComplete"), Reflux.listenTo(OrgFindStore, "onFindComplete"), ModalForm('flowRole')],
    onServiceComplete: function (data) {
        if (data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    flowRoleSet: data
                });
            }
        }
    },
    onFindComplete: function (data) {
        console.log('data', data)
        if (data.errMsg === '') {
            this.state.flowRole.orgName = data.orgName;
            if (data.operation === "grp") {
                this.state.flowRole.orgUuid = data.orgUuid;
            }
        } 

        this.setState({
            loading: false
        });
    },

    // 第一次加载
    componentDidMount: function () {

        this.state.validRules = [
            { id: 'staffCode', desc: '员工编号', max: 24, },
            { id: 'perName', desc: '员工姓名', max: 24, },
            { id: 'baseCity', desc: '所属地', max: 24, },
            { id: 'email', desc: '电子邮件', max: 24, },
            { id: 'phone', desc: '电话', max: 24, },
        ];

        this.initPage(this.props.flowRoleStaff);
    },

    //传递父极的参数
    initPage: function (FlowRoleStaff) {
        this.setState({ FlowRoleStaff: FlowRoleStaff });
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.flowRole)) {
            this.setState({ loading: true });
            if (!this.state.FlowRoleStaff.staff) {
                this.state.FlowRoleStaff.staff = [];
            }
            this.state.FlowRoleStaff.staff.push(this.state.flowRole);
            FlowRoleActions.updateFlowRole2(this.state.FlowRoleStaff);
        }
    },
    goBack: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },
    onSelectEmpLoyee: function (data) {
        console.log('data', roleLevel, data)
        var member = this.state.flowRole;
        member.corpUuid = window.loginData.compUser.corpUuid;
        member.staffCode = data.staffCode;
        member.perName = data.perName;
        member.email = data.email;
        member.baseCity = data.baseCity;
        member.phone = data.phoneno;

        var roleLevel = this.state.FlowRoleStaff.roleLevel;
        if (roleLevel === '部门') {
            member.orgUuid = data.deptUuid;
            member.orgName = data.deptName;
        }
        else if (roleLevel === '事业群') {
            // 查询事业群
            OrgFindActions.findDeptGrp(data.deptUuid);
            this.setState({ loading: true });
            return;
        }

        this.setState({ loading: false });
    },
    onSelectProj: function (data) {
        var member = this.state.flowRole;
        member.userId = data.userId;
        member.staffCode = data.staffCode;
        member.perName = data.perName;
        member.email = data.email;
        member.baseCity = data.baseCity;
        member.phone = data.phoneno;
        member.orgName = data.deptName;

        var roleLevel = this.state.FlowRoleStaff.roleLevel;
        if (roleLevel === '资源池') {
            member.orgUuid = data.poolUuid;
            OrgFindActions.findPool(data.poolUuid);
        }
        else {
            member.orgUuid = data.teamUuid;
            OrgFindActions.findPoolTeam(data.teamUuid);
        }

        // 查询资源池 或 小组名称
        this.setState({ loading: true });
    },

    render: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
        var savedisable = this.state.flowRole.staffCode ? false : true;
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        var roleLevel = this.state.FlowRoleStaff.roleLevel
        var tab = (roleLevel == '资源池' || roleLevel == '资源池小组') ? '增加资源池人员' : "增加员工";

        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        if (this.state.FlowRoleStaff) {

        }

        var form = <Form layout={layout} style={{ width: '600px' }}>
            <Row type="flex">
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label='员工编号' colon={true} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                        <Input type='text' name='staffCode' id='staffCode' value={this.state.flowRole.staffCode} onChange={this.handleOnChange} disabled={true} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label='员工姓名' colon={true} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                        <Input type='text' name='perName' id='perName' value={this.state.flowRole.perName} onChange={this.handleOnChange} disabled={true} />
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex">
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label='电话' colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                        <Input type='text' name='phone' id='phone' value={this.state.flowRole.phone} onChange={this.handleOnChange} disabled={true} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label='邮件' colon={true} help={hints.emailHint} validateStatus={hints.emailStatus}>
                        <Input type='text' name='email' id='email' value={this.state.flowRole.email} onChange={this.handleOnChange} disabled={true} />
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex">
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label='组织名称' colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}>
                        <Input type='text' name='orgName' id='orgName' value={this.state.flowRole.orgName} onChange={this.handleOnChange} disabled={true} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} className={layoutItem} label='属地' colon={true} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                        <Input type='text' name='baseCity' id='baseCity' value={this.state.flowRole.baseCity} onChange={this.handleOnChange} disabled={true} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} disabled={savedisable} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                </FormItem>
            </Row>
        </Form>

        var formPage = null;
        if (this.state.FlowRoleStaff.roleLevel == '部门' || this.state.FlowRoleStaff.roleLevel == '事业群' || this.state.FlowRoleStaff.roleLevel == '总公司' || this.state.FlowRoleStaff.roleLevel == '子公司') {
            formPage = <SearchEmployee style={{ padding: '10px 0 16px 32px', width: '600px' }} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee} />
        }
        else {
            formPage = <SearchResMember style={{ padding: '10px 0 16px 32px', width: '600px' }} corpUuid={corpUuid} showError={this.showError} onSelectMember={this.onSelectProj} />
        }

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab={tab} key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "8px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['flow_role/create', 'org-find/pool', 'org-find/team', 'org-find/grp']} />
                            {formPage}
                            {
                                this.state.loading ? <Spin>{form}</Spin> : form
                            }

                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default CreateFlowRolePage;