import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Row, Col, Modal, Button, Input, Select, DatePicker,Spin } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import UserProjSelect from '../../../../proj/lib/Components/UserProjSelect';
import LeaveInput from '../../../lib/Components/LeaveInput';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var LeaveApplyUtil = require('../LeaveApplyUtil');

var LeaveApplyStore = require('../data/LeaveApplyStore.js');
var LeaveApplyActions = require('../action/LeaveApplyActions');

var CreateUnpaidLeavePage = React.createClass({
    getInitialState: function () {
        return {
            afterChange: this.afterChange,
            leaveApplySet: {},
            loading: false,
            modal: false,
            leaveApply: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(LeaveApplyStore, "onServiceComplete"), ModalForm('leaveApply')],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            leaveApplySet: data
        });  
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'leaveType', desc: '假期类型', required: true, max: '32' },
            { id: 'beginDate', desc: '开始日期', required: true, max: '24' },
            { id: 'beginHour', desc: '开始时', required: true, dataType: 'number', validator: this.checkValue, max: '12' },
            { id: 'endDate', desc: '结束日期', required: true, max: '24' },
            { id: 'memo2', desc: '备注', required: false, max: '512' },
            { id: 'reason', desc: '休假原因', required: false, max: '2048' },
        ];
        this.clear();
    },

    clear: function () {
        this.state.hints = {};
        this.state.leaveApply.perName = window.loginData.authUser.perName;
        this.state.leaveApply.proposer = window.loginData.authUser.perName;
        this.state.leaveApply.staffCode = window.loginData.compUser.userCode;
        this.state.leaveApply.corpUuid = window.loginData.compUser.corpUuid;
        this.state.leaveApply.deptUuid = window.loginData.compUser.deptUuid;
        this.state.leaveApply.applyDay = Common.getToday() + '';
        this.state.leaveApply.status = '待审批';
        this.state.leaveApply.flowCode = 'cost.LEAVE';
        this.state.leaveApply.provNodes = [];
        this.state.leaveApply.leaveType = '';
        this.state.leaveApply.beginDate = '';
        this.state.leaveApply.beginHour = '9';
        this.state.leaveApply.endDate = '';
        this.state.leaveApply.endHour = '18';
        this.state.leaveApply.accrued = '';
        this.state.leaveApply.accruedDay = '';
        this.state.leaveApply.accruedHour = '0';
        this.state.leaveApply.memo2 = '';
        this.state.leaveApply.reason = '';
        this.state.leaveApply.projUuid = '';
        this.state.leaveApply.projName = '';

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
        return ''
    },
    afterChange: function (id, value) {
        if (id === 'beginDate' || id === 'beginHour' || id === 'endDate' || id === 'endHour') {
            //计算请假天数
            LeaveApplyUtil.calcLeafDays(this.state.leaveApply);
        }
    },
    handleOnChange2: function (e) {
        var obj = this.state.leaveApply;
        obj[e.target.id] = e.target.value;
        var msg = this.checkValue(e.target.value, { id: e.target.id });
        this.state.hints[e.target.id + 'Hint'] = msg;
        Common.validator(this, obj, e.target.id);
        this.setState({
            loading: this.state.loading
        });
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.leaveApply)) {
            this.state.leaveApply.accruedDay = this.refs.LeaveInput.state.accruedDay;
            this.state.leaveApply.accruedHour = this.refs.LeaveInput.state.accruedHour;
            var h = this.state.leaveApply.accruedHour;
            var accruedHour = parseInt(h) > 0 ? '.' + h : '';
            this.state.leaveApply.accrued = this.state.leaveApply.accruedDay + accruedHour;
            var userProj = this.refs.userProj.getUserProjNode();
            this.state.leaveApply.projName = userProj.projName;
            this.setState({ loading: true });
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
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        const dateFormat = Common.dateFormat;
        
        var form=<Form layout={layout} style={{width:'700px'}}>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                        <DictSelect name="leaveType" id="leaveType" value={this.state.leaveApply.leaveType} appName='HR系统' optName='假期类型2' onSelect={this.handleOnSelected.bind(this, "leaveType")} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label="项目组" required={false} colon={true} className={layoutItem} >
                        <UserProjSelect mode='create' ref="userProj" name="projUuid" id="projUuid" value={this.state.leaveApply.projUuid} onSelect={this.handleOnSelected.bind(this, "projUuid")} setDefProj={this.setDefProj}/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout} label="开始日期" required={true} colon={true} className={layoutItem}>
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
                    <FormItem {...formItemLayout} label="结束日期" required={true} colon={true} className={layoutItem}>
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
                    <FormItem {...formItemLayout} label="申请天数" required={true} colon={true} className={layoutItem}>
                        <LeaveInput ref='LeaveInput' type={'dayoff'} readOnly={false} value={this.state.leaveApply}></LeaveInput>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                        <Input type="text" name="memo2" id="memo2" value={this.state.leaveApply.memo2} onChange={this.handleOnChange} />
                    </FormItem>
                </Col>
            </Row>
            <FormItem {...formItemLayout2} label="休假事由" required={false} colon={true} className={layoutItem} help={hints.payMemoHint} validateStatus={hints.payMemoStatus} >
                <Input type="textarea" name="reason" id="reason" value={this.state.leaveApply.reason} onChange={this.handleOnChange} style={{ height: '100px' }} />
            </FormItem>
            <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                <Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
            </div>
        </Form>;

        return (
             <div style={{padding:"24px 0 16px 20px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['leave_apply/create']}/>
				{this.state.loading ? <Spin>{form}</Spin> : form}
			</div>
            
        );
    }
});

export default CreateUnpaidLeavePage;