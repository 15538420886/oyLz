import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Row, Col, Modal, Button, Input, Select, DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import UserProjSelect from '../../../../proj/lib/Components/UserProjSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var LeaveApplyUtil = require('../LeaveApplyUtil');

var LeaveApplyStore = require('../data/LeaveApplyStore.js');
var LeaveApplyActions = require('../action/LeaveApplyActions');

var CancelPaidLeaveApplyPage = React.createClass({
    getInitialState: function () {
        return {
            workDailySet: {},
            loading: false,
            modal: false,
            leaveApply: {},
            leave: {},
            leaveType: '',
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(LeaveApplyStore, "onServiceComplete"), ModalForm('leaveApply')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    workDailySet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'releaseDay', desc: '销假日期', required: true, max: '16' },
            { id: 'spend', desc: '实修天数', required: true, dataType: 'number', max: '16' },
        ];
    },

    initPage: function (leaveApply, leave) {
        this.state.hints = {};
        Utils.copyValue(leaveApply, this.state.leaveApply);
        this.state.leaveType = leaveApply.leaveType;
        var accrued = leaveApply.accrued;
        var bf1 = '0', bf2 = '0';
        var pos = accrued.indexOf('.');
        if (pos > 0) {
            bf1 = accrued.substr(0, pos);
            bf2 = accrued.substr(pos + 1);
        }
        else {
            bf1 = accrued;
        }
        this.state.leaveApply.accruedDay = bf1;
        this.state.leaveApply.accruedHour = bf2;
        this.state.leaveApply.spend = '';
        this.state.leaveApply.releaseDay = Common.getToday() + '';
        this.state.loading = false;
        this.state.leave = leave;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    checkValue: function (value, rule, page) {
        if (rule.id === 'beginHour' || rule.id === 'endHour') {
            var num = parseInt(value);
            if (num > 18 || num < 9) {
                return '[请输入9~18]';
            }
        }
        else if (rule.id === 'accruedDay') {
            if (parseInt(value) > 365) {
                return '[请输入0~365]';
            }
        }
        else if (rule.id === 'accruedHour') {
            if (parseInt(value) > 7) {
                return '[请输入0~7]';
            }
        }
    },

    handleOnSelected2: function (id, value) {
        var obj = this.state.leaveApply;
        obj[id] = value;
        Common.validator(this, obj, id);
        this.setState({
            modal: this.state.modal,
            leaveType: value,
        });
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.leaveApply)) {
            var userProj = this.refs.userProj.getUserProjNode();
            this.state.leaveApply.projName = userProj.projName;
            this.setState({ loading: true });
            LeaveApplyActions.cancelLeaveApply(this.state.leaveApply);
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
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 7 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 17 }),
        };

        var hints = this.state.hints;
        const dateFormat = Common.dateFormat;
        var fields = LeaveApplyUtil.getRemnantFields(this);
        var fields2 = LeaveApplyUtil.getRemnantFields2(this);

        var status = this.state.leaveApply.status;
        var isProv = (status === '待休假');

        const form =
            <Form layout={layout}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout2} label="假期类型" required={false} colon={true} className={layoutItem} >
                            <Input type="text" name="leaveType" id="leaveType" value={Utils.getOptionName('HR系统', '假期类型', this.state.leaveApply.leaveType, false, this)} readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout3} label="剩余天数" required={false} colon={true} className={layoutItem}>
                            {fields.bfFields}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout2} label="项目组" required={false} colon={true} className={layoutItem} >
                            <UserProjSelect ref="userProj" name="projUuid" id="projUuid" value={this.state.leaveApply.projUuid} onSelect={this.handleOnSelected.bind(this, "projUuid")}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="开始日期" required={true} colon={true} className={layoutItem}>
                            <Col span="13">
                                <FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                    <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" value={this.formatDate(this.state.leaveApply.beginDate, dateFormat)} format={dateFormat} readOnly={true}/>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem help={hints.beginHourHint} validateStatus={hints.beginHourStatus} style={{ margin: '0 0 0 8px' }}>
                                    <InputGroup compact>
                                        <Input style={{ width: '65%' }} type="text" name="beginHour" id="beginHour" value={this.state.leaveApply.beginHour} readOnly={true} />
                                        <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="时" readOnly={true} />
                                    </InputGroup>
                                </FormItem>
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout3} label="结束日期" required={true} colon={true} className={layoutItem}>
                            <Col span="13">
                                <FormItem help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                    <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" value={this.formatDate(this.state.leaveApply.endDate, dateFormat)} format={dateFormat} readOnly={true} />
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem className={layoutItem} help={hints.endHourHint} validateStatus={hints.endHourStatus} style={{ margin: '0 0 0 8px' }}>
                                    <InputGroup compact>
                                        <Input style={{ width: '65%' }} type="text" name="endHour" id="endHour" value={this.state.leaveApply.endHour} readOnly={true} />
                                        <Input style={{ width: '35%', textAlign: 'center' }} defaultValue="时" readOnly={true} />
                                    </InputGroup>
                                </FormItem>
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="申请天数" required={false} colon={true} className={layoutItem}>
                            {fields2.readOnlySpendFields}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout3} label="备注" required={false} colon={true} className={layoutItem} >
                            <Input type="text" name="memo2" id="memo2" value={this.state.leaveApply.memo2} readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="休假事由" required={false} colon={true} className={layoutItem} >
                    <Input type="textarea" name="reason" id="reason" value={this.state.leaveApply.reason} readOnly={true} />
                </FormItem>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="销假日期" required={true} colon={true} className={layoutItem} help={hints.releaseDayHint} validateStatus={hints.releaseDayStatus}>
                            <DatePicker name="releaseDay" id="releaseDay" value={this.formatDate(this.state.leaveApply.releaseDay, dateFormat)} format={dateFormat} onChange={this.handleOnSelDate.bind(this, "releaseDay", dateFormat)} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout3} label="实休天数" required={true} colon={true} className={layoutItem} help={hints.spendHint} validateStatus={hints.spendStatus}>
                            <Input type="text" name="spend" id="spend" value={this.state.leaveApply.spend} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>;

        return (
            <Modal visible={this.state.modal} width='640px' title="带薪假销假" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['leave_apply/cancel']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading} disabled={!isProv}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                {form}
            </Modal>
        );
    }
});

export default CancelPaidLeaveApplyPage;