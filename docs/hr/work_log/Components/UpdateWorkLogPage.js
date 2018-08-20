import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import SearchEmployee from '../../lib/Components/SearchEmployee';
import DictSelect from '../../../lib/Components/DictSelect';
import AutoInput from '../../../lib/Components/AutoInput';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DeptTreeSelect from '../../lib/Components/DeptTreeSelect';

import { Form, Modal, Button, Input, Select, Row, Col, DatePicker, Tabs } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var WorkLogStore = require('../data/WorkLogStore.js');
var WorkLogActions = require('../action/WorkLogActions');

var UpdateWorkLogPage = React.createClass({
    getInitialState: function () {
        return {
            workLogSet: {
                operation: '',
                errMsg: ''
            },

            loading: false,
            workLog: {},
            hints: {},
            validRules: [],
        }
    },

    mixins: [Reflux.listenTo(WorkLogStore, "onServiceComplete"), ModalForm('workLog')],
    onServiceComplete: function (data) {
        if (data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack(this.state.workLog);
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    workLogSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'applyName', desc: '申请人', required: false, max: '24' },
            { id: 'applyDate', desc: '申请日期', required: false, max: '16' },
            { id: 'befMemo', desc: '调前说明', required: false, max: '512' },
            { id: 'aftMemo', desc: '调后说明', required: false, max: '512' },
            { id: 'chgReason', desc: '原因', required: false, max: '1024' },
            { id: 'manager', desc: '直接主管', required: false, max: '24' },
            { id: 'approver', desc: '审批人', required: false, max: '24' },
            { id: 'effectDate', desc: '生效日期', required: false, max: '24' },
            { id: 'hrName', desc: 'HR人员', required: false, max: '24' },
            { id: 'deptName', desc: '部门名称', required: false, max: '128' },
            { id: 'staffCode', desc: '员工编号', required: false, max: '128' },
        ];

        this.initPage(this.props.workLog);
    },
    componentWillReceiveProps: function (newProps) {
        // this.initPage( newProps.workLog );
    },

    initPage: function (workLog) {
        Utils.copyValue(workLog, this.state.workLog);
        this.state.workLog.newDeptUuid = this.state.workLog.deptUuid;

        this.setState({ loading: false, hints: {} });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        var chgType = this.state.workLog.chgType;
        if (chgType === '转部门') {
            this.state.workLog.aftMemo = '';
            var aft = this.refs.aftMemoBox;
            var name = aft.state.deptMap[this.state.workLog.newDeptUuid];
            if (name !== undefined && name !== '') {
                this.state.workLog.aftMemo = name;

                // 修改部门
                this.state.workLog.deptName = name;
                this.state.workLog.deptUuid = this.state.workLog.newDeptUuid;
            }
        }

        if (Common.formValidator(this, this.state.workLog)) {
            this.setState({ loading: true });
            WorkLogActions.updateHrWorkLog(this.state.workLog);
        }
    },
    goBack: function (workLog) {
        this.props.onBack(workLog);
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
        var chgFields = [];
        var chgType = this.state.workLog.chgType;
        var reasonTitle = '变更原因';
        if (chgType === '转部门') {
            chgFields.push(
                <FormItem {...formItemLayout} label="原部门" required={false} colon={true} className={layoutItem} help={hints.befMemoHint} validateStatus={hints.befMemoStatus} >
                    <Input type="text" name="befMemo" id="befMemo" disabled={true} value={this.state.workLog.befMemo} onChange={this.handleOnChange} />
                </FormItem>
            );

            chgFields.push(
                <FormItem {...formItemLayout} label="新部门" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
                    <DeptTreeSelect ref='aftMemoBox' name="newDeptUuid" id="newDeptUuid" value={this.state.workLog.newDeptUuid} onSelect={this.handleOnSelected.bind(this, "newDeptUuid")} />
                </FormItem>
            );
        }
        else if (chgType === '调属地') {
            chgFields.push(
                <FormItem {...formItemLayout} label="原归属地" required={false} colon={true} className={layoutItem} help={hints.befMemoHint} validateStatus={hints.befMemoStatus} >
                    <Input type="text" name="befMemo" id="befMemo" disabled={true} value={this.state.workLog.befMemo} onChange={this.handleOnChange} />
                </FormItem>
            );

            chgFields.push(
                <FormItem {...formItemLayout} label="新归属地" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
                    <AutoInput name='aftMemo' id='aftMemo' paramName='城市' value={this.state.workLog.aftMemo} onChange={this.handleOnSelected.bind(this, "aftMemo")} />
                </FormItem>
            );
        }
        else if (chgType === '转正') {
            reasonTitle = '转正申请';

            chgFields.push(
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="转正日期" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
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
                        <FormItem {...formItemLayout2} label="离职日期" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
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
                        <FormItem {...formItemLayout2} label="辞退日期" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
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
                        <FormItem {...formItemLayout2} label="开除日期" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
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
                        <FormItem {...formItemLayout2} label="入职日期" required={true} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
                            <DatePicker style={{ width: '100%' }} name="aftMemo" id="aftMemo" format={Common.dateFormat} value={this.formatDate(this.state.workLog.aftMemo, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "aftMemo", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
            );
        }
        else {
            chgFields.push(
                <FormItem {...formItemLayout} label="调前说明" required={false} colon={true} className={layoutItem} help={hints.befMemoHint} validateStatus={hints.befMemoStatus} >
                    <Input type="textarea" name="befMemo" id="befMemo" value={this.state.workLog.befMemo} onChange={this.handleOnChange} />
                </FormItem>
            );

            chgFields.push(
                <FormItem {...formItemLayout} label="调后说明" required={false} colon={true} className={layoutItem} help={hints.aftMemoHint} validateStatus={hints.aftMemoStatus}>
                    <Input type="textarea" name="aftMemo" id="aftMemo" value={this.state.workLog.aftMemo} onChange={this.handleOnChange} />
                </FormItem>
            );
        }

        var isNotNull = (chgType === '转部门' || chgType === '调属地');
        var len = this.state.validRules.length;
        for (var i = 0; i < len; i++) {
            var r = this.state.validRules[i];
            if (r.id === 'aftMemo') {
                r.required = isNotNull;
            }
        }

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="修改工作变更日志" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "20px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['hr_work_log/update']} />

                            <Form layout={layout} style={{ width: '640px' }}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                            <Input style={{ zIndex: '2' }} type="text" name="staffCode" id="staffCode" value={this.state.workLog.staffCode} disabled={true} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                            <Input style={{ zIndex: '2' }} type="text" name="perName" id="perName" value={this.state.workLog.perName} disabled={true} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="部门名称" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                                            <Input style={{ zIndex: '2' }} type="text" name="deptName" id="deptName" value={this.state.workLog.deptName} disabled={true} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="变更类型" required={false} colon={true} className={layoutItem} help={hints.chgTypeHint} validateStatus={hints.chgTypeStatus}>
                                            <DictSelect name="chgType" id="chgType" appName='HR系统' optName='工作变更类型' value={this.state.workLog.chgType} onSelect={this.handleOnSelected.bind(this, "chgType")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="申请人" required={false} colon={true} className={layoutItem} help={hints.applyNameHint} validateStatus={hints.applyNameStatus}>
                                            <Input type="text" name="applyName" id="applyName" value={this.state.workLog.applyName} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="申请日期" required={false} colon={true} className={layoutItem} help={hints.applyDateHint} validateStatus={hints.applyDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="applyDate" id="applyDate" format={Common.dateFormat} value={this.formatDate(this.state.workLog.applyDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "applyDate", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                {chgFields}
                                <FormItem {...formItemLayout} label={reasonTitle} required={false} colon={true} className={layoutItem} help={hints.chgReasonHint} validateStatus={hints.chgReasonStatus} >
                                    <Input type="textarea" name="chgReason" id="chgReason" value={this.state.workLog.chgReason} onChange={this.handleOnChange} style={{ height: '100px' }} />
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="直接主管" required={false} colon={true} className={layoutItem} help={hints.managerHint} validateStatus={hints.managerStatus}>
                                            <Input type="text" name="manager" id="manager" value={this.state.workLog.manager} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approverHint} validateStatus={hints.approverStatus}>
                                            <Input type="text" name="approver" id="approver" value={this.state.workLog.approver} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="effectDate" id="effectDate" format={Common.dateFormat} value={this.formatDate(this.state.workLog.effectDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "effectDate", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="HR人员" required={false} colon={true} className={layoutItem} help={hints.hrNameHint} validateStatus={hints.hrNameStatus} >
                                            <Input type="text" name="hrName" id="hrName" value={this.state.workLog.hrName} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

export default UpdateWorkLogPage;
