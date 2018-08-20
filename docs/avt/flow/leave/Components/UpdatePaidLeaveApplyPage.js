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
            afterChange: this.afterChange,
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
            { id: 'leaveType', desc: '假期类型', required: true, max: '32' },
            { id: 'beginDate', desc: '开始日期', required: true, max: '24' },
            { id: 'endDate', desc: '结束日期', required: true, max: '24' },
            { id: 'beginHour', desc: '开始时', required: true, dataType: 'number', validator: this.checkValue, max: '12' },
            { id: 'endHour', desc: '结束时', required: true, dataType: 'number', validator: this.checkValue, max: '12' },
            { id: 'accrued', desc: '休假天数', required: false, dataType: 'number', validator: this.checkValue, max: '16' },
            { id: 'reason', desc: '休假原因', required: false, max: '2048' },
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

    afterChange: function (id, value) {
        if (id === 'beginDate' || id === 'beginHour' || id === 'endDate' || id === 'endHour') {
            //计算请假天数
            LeaveApplyUtil.calcLeafDays(this.state.leaveApply);
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
            var accruedHour = parseInt(this.state.leaveApply.accruedHour) > 0 ? '.' + this.state.leaveApply.accruedHour : '';
            this.state.leaveApply.accrued = this.state.leaveApply.accruedDay + accruedHour;
            var userProj = this.refs.userProj.getUserProjNode();
            this.state.leaveApply.projName = userProj.projName;
            this.setState({ loading: true });
            LeaveApplyActions.updateLeaveApply(this.state.leaveApply);
        }
    },

    onClickRevoke: function () {
        this.setState({ loading: true });
        LeaveApplyActions.revokeLeaveApply(this.state.leaveApply);
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 3 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 21 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 7 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 17 }),
        };

        var hints = this.state.hints;
        const dateFormat = Common.dateFormat;
        var fields = LeaveApplyUtil.getRemnantFields(this);
        var fields2 = LeaveApplyUtil.getRemnantFields2(this);

        var isProv = false;
        var cardList = [];
        var provNodes = this.state.leaveApply.provNodes;
        if (provNodes) {
            cardList =
                provNodes.map((node, i) => {
                    return <div className='card-div' style={{ width: 200 }}>
                        <div className="ant-card ant-card-bordered" style={{ width: '100%', border: '1px solid red' }} >
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>
                                <p>{node.provName}</p>
                                <p>({node.provStatus}, {node.provDate})</p>
                            </div>
                        </div>
                    </div>
                });

            if (provNodes.length > 0) {
                isProv = true;
            }
        }

        var isFinish = false;
        var cancelStyle = { color: 'red' };
        var status = this.state.leaveApply.status;
        if (status === '撤销' || status === '已销假') {
            isProv = true;
            isFinish = true;
            cancelStyle = null;
        }

        var nextRole = this.state.leaveApply.nextRole;
        if (nextRole) {
            var obj = <div className='card-div' style={{ width: 200 }}>
                <div className="ant-card ant-card-bordered" style={{ width: '100%', border: '1px solid red' }} >
                    <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>
                        <p>{nextRole}</p>
                        <p>(最后期限：{this.state.leaveApply.remDate})</p>
                    </div>
                </div>
            </div>;

            cardList.push(obj);
        }

        const divWidth = 220 * cardList.length + 10 + 'px';

        return (
            <Modal visible={this.state.modal} width='640px' title="修改带薪假" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['leave_apply/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading} disabled={isProv}>保存</Button>{' '}
                        <Button key="btnRevoke" size="large" onClick={this.onClickRevoke} style={cancelStyle} disabled={isFinish} >撤销</Button>
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="假期类型" required={false} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                                <Input type="text" name="leaveType" id="leaveType" value={Utils.getOptionName('HR系统', '假期类型', this.state.leaveApply.leaveType, false, this)} disabled={true} />
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
                                        <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" value={this.formatDate(this.state.leaveApply.beginDate, dateFormat)} format={dateFormat} onChange={this.handleOnSelDate.bind(this, "beginDate", dateFormat)} />
                                    </FormItem>
                                </Col>
                                <Col span="11">
                                    <FormItem help={hints.beginHourHint} validateStatus={hints.beginHourStatus} style={{ margin: '0 0 0 8px' }}>
                                        <InputGroup compact>
                                            <Input style={{ width: '65%' }} type="text" name="beginHour" id="beginHour" value={this.state.leaveApply.beginHour} onChange={this.handleOnChange} />
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
                                        <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" value={this.formatDate(this.state.leaveApply.endDate, dateFormat)} format={dateFormat} onChange={this.handleOnSelDate.bind(this, "endDate", dateFormat)} />
                                    </FormItem>
                                </Col>
                                <Col span="11">
                                    <FormItem className={layoutItem} help={hints.endHourHint} validateStatus={hints.endHourStatus} style={{ margin: '0 0 0 8px' }}>
                                        <InputGroup compact>
                                            <Input style={{ width: '65%' }} type="text" name="endHour" id="endHour" value={this.state.leaveApply.endHour} onChange={this.handleOnChange} />
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
                                {fields2.spendFields}
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout3} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                                <Input type="text" name="memo2" id="memo2" value={this.state.leaveApply.memo2} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="休假事由" required={false} colon={true} className={layoutItem} help={hints.payMemoHint} validateStatus={hints.payMemoStatus} >
                        <Input type="textarea" name="reason" id="reason" value={this.state.leaveApply.reason} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem layout='vertical' label="审批状态" required={false} colon={true} className={layoutItem} help={hints.payMemoHint} validateStatus={hints.payMemoStatus} >
                        <div style={{ width: '100%', padding: '14px', border: '1px solid #eee', overflowX: 'scroll' }}>
                            <div style={{ width: divWidth, height: '120px' }}>{cardList}</div>
                        </div>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CancelPaidLeaveApplyPage;
