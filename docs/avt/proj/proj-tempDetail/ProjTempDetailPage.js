'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Table, Tabs, Row, Col, Spin } from 'antd';
import SelectProjTeam from '../../../proj/lib/Components/SelectProjTeam';

const FormItem = Form.Item;
const Option = Select.Option;
var ProjTempStore = require('../proj-temp/data/ProjTempStore');
var ProjTempActions = require('../proj-temp/action/ProjTempActions');
var ProjTempTablePage = require('./Components/ProjTempTablePage');

var ProjTempFormPage = React.createClass({
    getInitialState: function () {
        return {
            projTempSet: {
                recordSet: [],
                errMsg: '',
            },

            loading: false,
            projTemp: {},
        }
    },

    mixins: [Reflux.listenTo(ProjTempStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'update') {
            this.setState({
                loading: false,
                projTempSet: data,
            });
        }
    },

    componentDidMount: function () {
        var projTemp = {};
        Utils.copyValue(this.props.proj, projTemp);
        this.setState({
            projTemp: projTemp
        });
    },

    handleOnSelected1: function (id, value) {
        var projTemp = this.state.projTemp;
        projTemp[id] = value;
        this.setState({
            projTemp: projTemp
        });
    },

    handleOnChange: function (e) {
        var projTemp = this.state.projTemp;
        projTemp[e.target.id] = e.target.value;

        this.setState({
            loading: this.state.loading
        });
    },
    goBack: function () {
        if (this.props.goBack) {
            this.props.goBack();
        }
    },

    onClickSave: function () {
        this.setState({loading: true});
        ProjTempActions.updateProjTemp(this.state.projTemp);
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

        var projUuid = this.state.projTemp.projUuid;
        if (!projUuid) {
            projUuid = '';
        }

        var hints = this.state.hints;
        var form = (
            <Form layout={layout} style={{ width: '600px' }}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工编号" colon={true} className={layoutItem}>
                            <Input type="text" name="staffCode" id="staffCode" disabled={true} value={this.state.projTemp.staffCode} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工姓名" colon={true} className={layoutItem}>
                            <Input type="text" name="perName" id="perName" disabled={true} value={this.state.projTemp.perName} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="所在项目" colon={true} className={layoutItem}>
                            <Input type="text" name="projName" id="projName" disabled={true} value={this.state.projTemp.projName} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="入组日期" colon={true} className={layoutItem}>
                            <Input type="text" name="beginDate" id="beginDate" disabled={true} value={this.state.projTemp.beginDate} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="项目经理" colon={true} className={layoutItem}>
                            <Input type="text" name="pmName" id="pmName" disabled={true} value={this.state.projTemp.pmName} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="所在小组" colon={true} className={layoutItem}>
                            <SelectProjTeam name="teamUuid" id="teamUuid" projUuid={projUuid} value={this.state.projTemp.teamUuid} onChange={this.handleOnSelected1.bind(this, 'teamUuid')} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="承担角色" colon={true} className={layoutItem}>
                    <Input type="text" name="roleName" id="roleName" value={this.state.projTemp.roleName} onChange={this.handleOnChange} />
                </FormItem>
                <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                    <ServiceMsg ref='mxgBox' svcList={['proj-member/update']} />
                    <Button key="btnOK" type="primary" size="middle" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="middle" onClick={this.goBack}>返回</Button>
                </div>
            </Form>
        );

        return (
            <div style={{ padding: "20px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['proj_temp_member/update']} />
                <div style={{ fontSize: '12pt', padding:'0 0 16px 24px' }}>我所在的项目组</div>
                {
                    this.state.loading ? <Spin>{form}</Spin> : form
                }
                <ProjTempTablePage projUuid={projUuid} />
            </div>
        );
    }
});

module.exports = ProjTempFormPage;

