import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker, Tabs, Col, Row } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import DictRadio from '../../../../lib/Components/DictRadio';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

var ProjContext = require('../../../ProjContext');
import SearchResMember from '../../../lib/Components/SearchResMember';
import SelectProjTeam from '../../../lib/Components/SelectProjTeam';
var ProjTempMemberStore = require('../data/ProjTempMemberStore');
var ProjTempMemberActions = require('../action/ProjTempMemberActions');

var CreateTempMemberPage = React.createClass({
    getInitialState: function () {
        return {
            tempMemberSet: {
                errMsg: ''
            },

            loading: false,
            tempMember: {},
            user: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(ProjTempMemberStore, "onServiceComplete"), ModalForm('tempMember')],
    onServiceComplete: function (data) {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    tempMemberSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'staffCode', desc: '员工编号', required: false, max: '64' },
            { id: 'perName', desc: '姓名', required: false, max: '32' },
            { id: 'teamUuid', desc: '小组UUID', required: false, max: '24' },
            { id: 'projLevel', desc: '客户定级', required: false, max: '64' },
            { id: 'userPrice', desc: '结算单价', required: false, max: '16' },
            { id: 'beginDate', desc: '入组日期', required: false, max: '24' },
            { id: 'beginTime', desc: '入组时间', required: false, max: '24' },
            { id: 'roleName', desc: '角色名称', required: true, max: '24' },
        ];

        this.clear();
    },

    clear: function () {
        this.state.hints = {};
        this.state.tempMember.uuid = '';
        this.state.tempMember.corpUuid = window.loginData.compUser.corpUuid;
        this.state.tempMember.projUuid = ProjContext.selectedProj.uuid;
        this.state.tempMember.projName = ProjContext.selectedProj.projName;
        this.state.tempMember.projLoc = ProjContext.selectedProj.projLoc;
        this.state.tempMember.grpUuid = ProjContext.selectedProj.parentUuid;
        this.state.tempMember.userUuid = '';
        this.state.tempMember.staffCode = '';
        this.state.tempMember.perName = '';
        this.state.tempMember.manStatus = '入组';
        this.state.tempMember.teamUuid = '';
        this.state.tempMember.projLevel = '';
        this.state.tempMember.userPrice = '';
        this.state.tempMember.roleName = '';

        this.state.tempMember.beginDate = '' + Common.getToday();
        this.state.tempMember.beginTime = '09:00';
        this.state.tempMember.endDate = '#';
        this.state.tempMember.dispType = '';

        this.state.loading = false;
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onSelectMember: function (data) {
        this.state.tempMember.userUuid = data.uuid;
        this.state.tempMember.staffCode = data.staffCode;
        this.state.tempMember.perName = data.perName;

        this.setState({
            user: data,
        })
    },
    showError: function (data) {
        console.log(data)
    },
    onClickSave: function () {
        var member = this.state.tempMember;
        member.applyTime = member.beginDate;

        this.setState({ loading: true });
        ProjTempMemberActions.createProjTempMember(member);
    },
    goBack: function () {
        this.props.onBack();
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        var boo = this.state.tempMember.userUuid ? false : true;
        var corpUuid = window.loginData.compUser.corpUuid;
        var deptName = this.state.user.corpName;
        if (deptName === '' || deptName === null) {
            deptName = this.state.user.deptName;
        }

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '20px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="增加人员" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ width: '100%', maxWidth: '700px' }}>
                            <ServiceMsg ref='mxgBox' svcList={['proj_temp_member/create']} />
                            <SearchResMember style={{ padding: '20px 0 16px 32px', width: '700px' }} onSelectMember={this.onSelectMember} />

                            <Form layout={layout}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                            <Input type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode} disabled={true} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                            <Input type="text" name="perName" id="perName" value={this.state.user.perName} disabled={true} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="公司名称" required={false} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
                                            <Input type="text" name="corpName" id="corpName" value={deptName} disabled={true} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                            <Input type="text" name="baseCity" id="baseCity" value={this.state.user.baseCity} disabled={true} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="项目小组" required={false} colon={true} className={layoutItem} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
                                            <SelectProjTeam name="teamUuid" id="teamUuid" projUuid={ProjContext.selectedProj.uuid} value={this.state.tempMember.teamUuid} onChange={this.handleOnSelected.bind(this, 'teamUuid')} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="用户定级" required={false} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
                                            <Input type="text" name="projLevel" id="projLevel" value={this.state.tempMember.projLevel} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.userPriceHint} validateStatus={hints.userPriceStatus}>
                                            <Input type="text" name="userPrice" id="userPrice" value={this.state.tempMember.userPrice} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="入组日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" format={Common.dateFormat} value={this.formatDate(this.state.tempMember.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "beginDate", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                                            <Input type="text" name="beginTime" id="beginTime" value={this.state.tempMember.beginTime} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                                    <Input type="text" name="roleName" id="roleName" value={this.state.tempMember.roleName} onChange={this.handleOnChange} />
                                </FormItem>
                                <FormItem style={{ textAlign: 'right', padding: '4px 0' }} required={false} colon={true} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading} disabled={boo}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = CreateTempMemberPage;
