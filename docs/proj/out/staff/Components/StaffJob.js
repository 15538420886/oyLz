'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Input, Col, Row } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';
import LevelSelect from '../../../../hr/lib/Components/LevelSelect';
import JobTreeSelect from '../../../../hr/lib/Components/JobTreeSelect';

var StaffJobPage = React.createClass({
    getInitialState: function () {
        return {
            hints: {},
            job: {},
            validRules: [],
        }
    },

    mixins: [ModalForm('job')],

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'empLevel', desc: '员工级别', required: false, max: '32' },
            { id: 'userCost', desc: '结算单价', required: false, max: '32' },
            { id: 'techLevel', desc: '技术级别', required: false, max: '32' },
            { id: 'manLevel', desc: '管理级别', required: false, max: '32' },
            { id: 'techUuid', desc: '技术岗位', required: false, max: '24' },
            { id: 'manUuid', desc: '管理岗位', required: false, max: '24' }
        ];
    },
    fun: function () {
        var job = this.state.job;

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
        this.state.job.empLevel = '';
        this.state.job.userCost = '';
        this.state.job.techLevel = '';
        this.state.job.manLevel = '';
        this.state.job.techUuid = '';
        this.state.job.manUuid = '';
    },
    checkValue: function () {
        return Common.formValidator(this, this.state.job);
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        return (
            <Form layout={layout}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工级别" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
                            <LevelSelect name="empLevel" id="empLevel" value={this.state.job.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.userCostHint} validateStatus={hints.userCostStatus}>
                            <Input type="text" name="userCost" id="userCost" value={this.state.job.userCost} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="技术级别" required={false} colon={true} className={layoutItem} help={hints.techLevelHint} validateStatus={hints.techLevelStatus}>
                            <Input type="text" name="techLevel" id="techLevel" value={this.state.job.techLevel} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理级别" required={false} colon={true} className={layoutItem} help={hints.manLevelHint} validateStatus={hints.manLevelStatus}>
                            <Input type="text" name="manLevel" id="manLevel" value={this.state.job.manLevel} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="技术岗位" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
                            <JobTreeSelect ref="techUuidBox" name="techUuid" id="techUuid" value={this.state.job.techUuid} onSelect={this.handleOnSelected.bind(this, "techUuid")} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理岗位" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
                            <JobTreeSelect ref="manUuidBox" name="manUuid" id="manUuid" value={this.state.job.manUuid} onSelect={this.handleOnSelected.bind(this, "manUuid")} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
});

export default StaffJobPage;

