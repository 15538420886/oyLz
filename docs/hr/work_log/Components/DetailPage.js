import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select, DatePicker, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var DetailPage = React.createClass({
    getInitialState: function () {
        return {
            workLog: {},
        }
    },

    mixins: [ModalForm('')],
    componentDidMount: function () {
    },

    initPage: function (workLog) {
        this.setState({ workLog: workLog });
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


        var chgFields = [];
        var chgType = this.state.workLog.chgType;
        var reasonTitle = '变更原因';
        if (chgType === '转部门') {
            chgFields.push(
                <FormItem {...formItemLayout} label="原部门" required={false} colon={true} className={layoutItem} >
                    <Input type="text" name="befMemo" id="befMemo" disabled={true} value={this.state.workLog.befMemo} onChange={this.handleOnChange} />
                </FormItem>
            );

            chgFields.push(
                <FormItem {...formItemLayout} label="新部门" required={true} colon={true} className={layoutItem} >
                    <DeptTreeSelect ref='aftMemoBox' name="newDeptUuid" id="newDeptUuid" value={this.state.workLog.newDeptUuid} onSelect={this.handleOnSelected.bind(this, "newDeptUuid")} />
                </FormItem>
            );
        }
        else if (chgType === '调属地') {
            chgFields.push(
                <FormItem {...formItemLayout} label="原归属地" required={false} colon={true} className={layoutItem}>
                    <Input type="text" name="befMemo" id="befMemo" disabled={true} value={this.state.workLog.befMemo} onChange={this.handleOnChange} />
                </FormItem>
            );

            chgFields.push(
                <FormItem {...formItemLayout} label="新归属地" required={true} colon={true} className={layoutItem}>
                    <AutoInput name='aftMemo' id='aftMemo' paramName='城市' value={this.state.workLog.aftMemo} onChange={this.handleOnSelected.bind(this, "aftMemo")} />
                </FormItem>
            );
        }
        else if (chgType === '转正') {
            reasonTitle = '转正申请';

            chgFields.push(
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="转正日期" required={true} colon={true} className={layoutItem}>
                            <DatePicker style={{ width: '100%' }} name="aftMemo" id="aftMemo" format={Common.dateFormat} value={this.formatDate(this.state.workLog.aftMemo, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "aftMemo", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
            );
        }
        else if (chgType === '离职') {
            reasonTitle = '离职原因';

            chgFields.push(
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="离职日期" required={true} colon={true} className={layoutItem} >
                            <DatePicker style={{ width: '100%' }} name="aftMemo" id="aftMemo" format={Common.dateFormat} value={this.formatDate(this.state.workLog.aftMemo, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "aftMemo", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
            );
        }
        else if (chgType === '辞退') {
            reasonTitle = '辞退原因';

            chgFields.push(
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="辞退日期" required={true} colon={true} className={layoutItem} >
                            <DatePicker style={{ width: '100%' }} name="aftMemo" id="aftMemo" format={Common.dateFormat} value={this.formatDate(this.state.workLog.aftMemo, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "aftMemo", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
            );
        }
        else if (chgType === '开除') {
            reasonTitle = '开除原因';

            chgFields.push(
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="开除日期" required={true} colon={true} className={layoutItem}>
                            <DatePicker style={{ width: '100%' }} name="aftMemo" id="aftMemo" format={Common.dateFormat} value={this.formatDate(this.state.workLog.aftMemo, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "aftMemo", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
            );
        }
        else if (chgType === '入职') {
            reasonTitle = '入职说明';

            chgFields.push(
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="入职日期" required={true} colon={true} className={layoutItem}>
                            <DatePicker style={{ width: '100%' }} name="aftMemo" id="aftMemo" format={Common.dateFormat} value={this.formatDate(this.state.workLog.aftMemo, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "aftMemo", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
            );
        }
        else {
            chgFields.push(
                <FormItem {...formItemLayout} label="调前说明" required={false} colon={true} className={layoutItem} >
                    <Input type="textarea" name="befMemo" id="befMemo" value={this.state.workLog.befMemo} onChange={this.handleOnChange} />
                </FormItem>
            );

            chgFields.push(
                <FormItem {...formItemLayout} label="调后说明" required={false} colon={true} className={layoutItem} >
                    <Input type="textarea" name="aftMemo" id="aftMemo" value={this.state.workLog.aftMemo} onChange={this.handleOnChange} />
                </FormItem>
            );
        }


        return (
            <div>
                <Form layout={layout}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="部门名称" required={false} colon={true} className={layoutItem} >
                                <Input style={{ zIndex: '2' }} type="text" name="deptName" id="deptName" value={this.state.workLog.deptName} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="变更类型" required={false} colon={true} className={layoutItem} >
                                <DictSelect name="chgType" id="chgType" appName='HR系统' optName='员工状态' value={this.state.workLog.chgType} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="申请人" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="applyName" id="applyName" value={this.state.workLog.applyName} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="申请日期" required={false} colon={true} className={layoutItem}>
                                <DatePicker style={{ width: '100%' }} name="applyDate" id="applyDate" format={Common.dateFormat} value={this.formatDate(this.state.workLog.applyDate, Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                    {chgFields}
                    <FormItem {...formItemLayout} label={reasonTitle} required={false} colon={true} className={layoutItem}>
                        <Input type="textarea" name="chgReason" id="chgReason" value={this.state.workLog.chgReason} style={{ height: '100px' }} />
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="直接主管" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="manager" id="manager" value={this.state.workLog.manager} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="approver" id="approver" value={this.state.workLog.approver} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem}>
                                <DatePicker style={{ width: '100%' }} name="effectDate" id="effectDate" format={Common.dateFormat} value={this.formatDate(this.state.workLog.effectDate, Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="HR人员" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="hrName" id="hrName" value={this.state.workLog.hrName} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
});

export default DetailPage;
