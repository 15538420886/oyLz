﻿'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Row, Col, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
import LevelSelect from '../../lib/Components/LevelSelect';
import JobTreeSelect from '../../lib/Components/JobTreeSelect';


var EmpJobPage = React.createClass({
    getInitialState: function () {
        return {
            afterChange: this.afterChange,
            hints: {},
            empJob: {},
            validRules: [],

            user: {},
            datas: {},
        }
    },

    mixins: [ModalForm('empJob')],

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'empLevel', desc: '员工级别', required: false, max: '0' },
            { id: 'techLevel', desc: '技术级别', required: false, max: '0' },
            { id: 'manLevel', desc: '管理级别', required: false, max: '0' },
            { id: 'manUuid', desc: '管理岗位', required: false, max: '24' },
            { id: 'techUuid', desc: '技术岗位', required: false, max: '24' },
            { id: 'empType', desc: '员工类型', required: false, max: '32' },
        ];
    },
    fun: function () {
        var job = this.state.empJob;

        var techNode = this.refs.techUuidBox.getJobNode();
        // console.log('techNode',techNode)
        if (techNode.jobName === null || techNode.jobName === '' || techNode.jobName === techNode.jobCode) {
            job.techName = techNode.jobCode;
        }
        else {
            job.techName = techNode.jobCode + '(' + techNode.jobName + ')';
        }

        var manNode = this.refs.manUuidBox.getJobNode();
        if (manNode.jobName === null || manNode.jobName === '' || manNode.jobName === manNode.jobCode) {
            job.manName = manNode.jobCode;
        }
        else {
            job.manName = manNode.jobCode + '(' + manNode.jobName + ')';
        }
    },
    clear: function () {
        this.state.hints = {};
        this.state.empJob.empLevel = '';
        this.state.empJob.techLevel = '';
        this.state.empJob.manLevel = '';
        this.state.empJob.manUuid = '';
        this.state.empJob.techUuid = '';
        this.state.empJob.empType = '';
    },
    checkValue: function () {
        return Common.formValidator(this, this.state.empJob);
    },
    afterChange: function (id, value) {
        if (id === 'techUuid') {
            var empJob = this.state.empJob;
            //if (!empJob.techLevel) {
            var techNode = this.refs.techUuidBox.getJobNode(value);
            empJob.techLevel = techNode.jobCode;
            //}
        }
        else if (id === 'manUuid') {
            var empJob = this.state.empJob;
            //if (!empJob.manLevel) {
            var manNode = this.refs.manUuidBox.getJobNode(value);
            empJob.manLevel = manNode.jobCode;
            //}
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout_0 = {
            labelCol: ((layout == 'vertical') ? null : { span: 5 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 19 }),
        };
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 7 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 17 }),
        };

        var hints = this.state.hints;
        return (
            <Form layout={layout} style={{margin: '8px 0 0 0'}}>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="员工类型" required={false} colon={true} className={layoutItem} help={hints.empTypeHint} validateStatus={hints.empTypeStatus}>
                            <DictSelect name="empType" id="empType" value={this.state.empJob.empType} appName='HR系统' optName='员工类型' onSelect={this.handleOnSelected.bind(this, "empType")} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="员工级别" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
                            <LevelSelect ref="empLevelBox" name="empLevel" id="empLevel" value={this.state.empJob.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="技术岗位" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
                            <JobTreeSelect ref="techUuidBox" name="techUuid" id="techUuid" value={this.state.empJob.techUuid} onSelect={this.handleOnSelected.bind(this, "techUuid")} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="技术级别" required={false} colon={true} className={layoutItem} help={hints.techLevelHint} validateStatus={hints.techLevelStatus}>
                            <Input type="text" name="techLevel" id="techLevel" value={this.state.empJob.techLevel} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="管理岗位" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
                            <JobTreeSelect ref="manUuidBox" name="manUuid" id="manUuid" value={this.state.empJob.manUuid} onSelect={this.handleOnSelected.bind(this, "manUuid")} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="管理级别" required={false} colon={true} className={layoutItem} help={hints.manLevelHint} validateStatus={hints.manLevelStatus}>
                            <Input type="text" name="manLevel" id="manLevel" value={this.state.empJob.manLevel} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
});

module.exports = EmpJobPage;
