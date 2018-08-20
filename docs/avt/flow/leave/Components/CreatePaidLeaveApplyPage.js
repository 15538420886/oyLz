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

var CreatePaidLeaveApplyPage = React.createClass({
    getInitialState: function () {
        return {
            afterChange: this.afterChange,
            leaveApplySet: {},
            loading: false,
            modal: false,
            leaveApply: {},
            leave: {},
            leave2: {},
            leaveType: '',
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(LeaveApplyStore, "onServiceComplete"), ModalForm('leaveApply')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
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
                    leaveApplySet: data
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

    clear: function (leave) {
        this.state.hints = {};
        // this.state.leaveApply.userUuid = '';
        this.state.leaveApply.perName = window.loginData.authUser.perName;
        this.state.leaveApply.proposer = window.loginData.authUser.perName;
        this.state.leaveApply.staffCode = window.loginData.compUser.userCode;
        this.state.leaveApply.corpUuid = window.loginData.compUser.corpUuid;
        this.state.leaveApply.deptUuid = window.loginData.compUser.deptUuid;
        this.state.leaveApply.applyDay = Common.getToday() + '';
        this.state.leaveApply.status = '待审批';
        this.state.leaveApply.flowCode = 'cost.LEAVE';
        this.state.leaveApply.provNodes = [];
        this.state.leaveApply.leaveType = 'dayoff';
        this.state.leaveApply.beginDate = '';
        this.state.leaveApply.beginHour = '9';
        this.state.leaveApply.endDate = '';
        this.state.leaveApply.endHour = '18';
        this.state.leaveApply.accrued = '';
        this.state.leaveApply.accruedHour = '0';
        this.state.leaveApply.accruedDay = '';
        // this.state.leaveApply.spend='';
        this.state.leaveApply.memo2 = '';
        this.state.leaveApply.reason = '';

        this.state.leaveApply.projUuid = '';
        this.state.leaveApply.projName = '';
        // userUuid = ''		varchar(24) not null	COMMENT '员工UUID',
        // branchUuid=''		varchar(24)		COMMENT '分公司UUID',
        // deptName=''		varchar(128)	COMMENT '部门名称',
        // baseCity=''		varchar(128)	COMMENT '归属地',
        // projUuid=''		varchar(24)		COMMENT '项目UUID',
        // projName=''		varchar(128)	COMMENT '项目名称',
        // formCode = ''		varchar(64)		COMMENT '申请单编号',

        // manager = ''			varchar(16)		COMMENT '直接主管',
        // releaseDay = '';		varchar(16)		COMMENT '销假日期',
        // modTime = ''; 		varchar(24)		COMMENT '修改时间'，

        // flowUuid = '';			流程UUID
        // flowStatus = '';			流程结果
        // nextRole = '';			下个审批角色
        // remDate	 = '';			催办日期


        this.state.leaveType = 'dayoff';
        this.state.leave = leave;
        this.state.loading = false;
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
            var msg = LeaveApplyUtil.isLeaveValid(this);
            if (msg) {
                Common.errMsg(msg);
                return;
            }

            var accruedHour = parseInt(this.state.leaveApply.accruedHour) > 0 ? '.' + this.state.leaveApply.accruedHour : '';
            this.state.leaveApply.accrued = this.state.leaveApply.accruedDay + accruedHour;
            this.setState({ loading: true });
            var userProj = this.refs.userProj.getUserProjNode();
            this.state.leaveApply.projName = userProj.projName;
            LeaveApplyActions.createLeaveApply(this.state.leaveApply);
        }
    },
    setDefProj: function(proj){
        this.state.leaveApply.projUuid = proj.uuid;
        this.state.leaveApply.projName = proj.projName;
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

        const form =
            <Form layout={layout}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                            <DictSelect name="leaveType" id="leaveType" value={this.state.leaveApply.leaveType} appName='HR系统' optName='假期类型' onSelect={this.handleOnSelected2.bind(this, "leaveType")} />
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
                            <UserProjSelect mode='create' ref="userProj" name="projUuid" id="projUuid" value={this.state.leaveApply.projUuid} onSelect={this.handleOnSelected.bind(this, "projUuid")} setDefProj={this.setDefProj}/>
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
                        <FormItem {...formItemLayout2} label="申请天数" required={true} colon={true} className={layoutItem}>
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
                    <Input type="textarea" name="reason" id="reason" value={this.state.leaveApply.reason} onChange={this.handleOnChange} style={{height:'100px'}}/>
                </FormItem>
            </Form>;

        return (
            <Modal visible={this.state.modal} width='640px' title="申请带薪假" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-leave/retrieve', 'leave_apply/create']} />
                        <Button key="btnOK" type="primary" size="large" disabled={!this.state.leave[this.state.leaveType] || this.state.leave[this.state.leaveType] == 0} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                {form}
            </Modal>
        );
    }
});

export default CreatePaidLeaveApplyPage;
