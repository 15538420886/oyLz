'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjContext = require('../../../proj/ProjContext');

import { Form, Modal, Button, Input, Select, Table, Tabs, Row, Col, Spin } from 'antd';
import SelectProjTeam from '../../../proj/lib/Components/SelectProjTeam';

const FormItem = Form.Item;
const Option = Select.Option;
var ProjInfoStore = require('./data/ProjInfoStore');
var ProjInfoActions = require('./action/ProjInfoActions');
var ProjInfoTablePage = require('./Components/ProjInfoTablePage');

var ProjInfoPage = React.createClass({
    getInitialState: function () {
        return {
            projInfoSet: {
                errMsg: '',
                projInfo: {},
            },
            projInfo: {},
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ProjInfoStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'user-proj' || data.operation === 'update') {
            var projInfo = {};
            Utils.copyValue(data.projInfo, projInfo);
            this.setState({
                loading: false,
                projInfoSet: data,
                projInfo: projInfo,
            });
        }
    },

    componentDidMount: function () {
        this.initPage();
    },

    initPage: function () {
        if (window.loginData.compUser) {
            this.setState({ loading: true });

            var filter = {};
            filter.corpUuid = window.loginData.compUser.corpUuid;
            filter.staffCode = window.loginData.compUser.userCode;
            ProjInfoActions.initProjMember(filter);
        }
    },

    handleOnSelected1: function (id, value) {
        var projInfo = this.state.projInfo;
        projInfo[id] = value;
        this.setState({
            projInfo: projInfo
        });
    },

    handleOnChange: function (e) {
        var projInfo = this.state.projInfo;
        projInfo[e.target.id] = e.target.value;

        this.setState({
            loading: this.state.loading
        });
    },

    onClickSave: function () {
        this.setState({loading: true});
        ProjInfoActions.updateProjMember1(this.state.projInfo);
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
        var projUuid = this.state.projInfo.projUuid;
        if (!projUuid) {
            projUuid = '';
        }
        var hints = this.state.hints;

        var form = (
            <Form layout={layout} style={{ width: '600px' }}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工编号" colon={true} className={layoutItem}>
                            <Input type="text" name="staffCode" id="staffCode" disabled={true} value={this.state.projInfo.staffCode} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工姓名" colon={true} className={layoutItem}>
                            <Input type="text" name="perName" id="perName" disabled={true} value={this.state.projInfo.perName} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="所在项目" colon={true} className={layoutItem}>
                            <Input type="text" name="projName" id="projName" disabled={true} value={this.state.projInfo.projName} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="入组日期" colon={true} className={layoutItem}>
                            <Input type="text" name="beginDate" id="beginDate" disabled={true} value={this.state.projInfo.beginDate} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="项目经理" colon={true} className={layoutItem}>
                            <Input type="text" name="pmName" id="pmName" disabled={true} value={this.state.projInfo.pmName} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="所在小组" colon={true} className={layoutItem}>
                            <SelectProjTeam name="teamUuid" id="teamUuid" projUuid={projUuid} value={this.state.projInfo.teamUuid} onChange={this.handleOnSelected1.bind(this, 'teamUuid')} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="承担角色" colon={true} className={layoutItem}>
                    <Input type="text" name="roleDesc" id="roleDesc" value={this.state.projInfo.roleDesc} onChange={this.handleOnChange} />
                </FormItem>
                <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                    <Button key="btnOK" type="primary" size="middle" onClick={this.onClickSave} loading = {this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="middle" onClick={this.toggle}>取消</Button>
                </div>
            </Form>
        );

        return (
            <div style={{ padding: "20px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['proj-member/user-proj', 'proj-member/update']} />
                <div style={{ fontSize: '12pt', padding: '0 0 16px 24px' }}>我所在的项目组</div>
                {
                    this.state.loading ? <Spin>{form}</Spin> : form
                }
                <ProjInfoTablePage projUuid={projUuid} />
            </div>
        );
    }
});

module.exports = ProjInfoPage;

