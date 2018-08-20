import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var Validator = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Tabs, Col, Row, Radio, DatePicker, InputNumber } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
var HrReqStore = require('../data/ProjHrReqStore.js');
var HrReqActions = require('../action/ProjHrReqActions');
var ProjContext = require('../../../ProjContext');

var UpdateHrReqPage = React.createClass({
    getInitialState: function () {
        return {
            HrReqSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            HrReq: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(HrReqStore, "onServiceComplete"), ModalForm('HrReq')],
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
                    HrReqSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'reqType', desc: '变更类型', required: false, max: '24' },
            { id: 'reqType2', desc: '时间类型', required: false, max: '24' },
            { id: 'beginDate', desc: '开始日期', required: true, max: '24' },
            { id: 'endDate', desc: '结束日期', required: true, max: '24' },
            { id: 'reqCount', desc: '人员数量', required: true, dataType: 'number', max: '24' },
            { id: 'reqMemo', desc: '说明', required: false, max: '512' },
            { id: 'status', desc: '状态', required: false, max: '12' },
        ];
        // this.initPage( this.props.ProjHrReq );
    },

    initPage: function (HrReq) {
        this.state.hints = {};
        Utils.copyValue(HrReq, this.state.HrReq);
        //console.log(this.state.ProjHrReq);
        this.state.loading = false;
        this.state.HrReqSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },


    onClickSave: function () {
        if (Common.formValidator(this, this.state.HrReq)) {
            this.state.HrReqSet.operation = '';
            this.setState({ loading: true });
            HrReqActions.updateProjHrReq(this.state.HrReq);
        }
    },

    goBack: function () {
        this.props.onBack();
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
        // var d = new Date();
        //       var beginDate = this.state.ProjHrReqSet.beginDate === undefined ? ''+( d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) : this.state.ProjHrReqSet.beginDate;

        return (
            <Modal visible={this.state.modal} width='560px' title="修改人员需求" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['proj-hr-req/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}>
                <Form layout={layout} style={{ width: '100%' }}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="变更类型" required={false} colon={true} className={layoutItem} help={hints.reqTypeHint} validateStatus={hints.reqTypeStatus}>
                                <RadioGroup onChange={this.onChange} >
                                    <DictRadio name="reqType" id="reqType" appName='项目管理' optName='变更类型' value={this.state.HrReq.reqType} onChange={this.onRadioChange} />
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="时间要求" required={false} colon={true} className={layoutItem} help={hints.reqType2Hint} validateStatus={hints.reqType2Status}>
                                <RadioGroup onChange={this.onChange1} >
                                    <DictRadio name="reqType2" id="reqType2" appName='项目管理' optName='时间要求' value={this.state.HrReq.reqType2} onChange={this.onRadioChange} />
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="预计日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" value={this.formatDate(this.state.HrReq.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "beginDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="预计日期" required={true} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.reqCountStatus}>
                                <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" value={this.formatDate(this.state.HrReq.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "endDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="人员数量" required={true} colon={true} className={layoutItem} help={hints.reqCountHint} validateStatus={hints.reqCountStatus}>
                                <Input type="text" name="reqCount" id="reqCount" value={this.state.HrReq.reqCount} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.reqMemoHint} validateStatus={hints.reqMemoStatus} >
                        <Input type="textarea" name="reqMemo" id="reqMemo" onChange={this.handleOnChange} style={{ height: '140px' }} value={this.state.HrReq.reqMemo} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="处理状态" required={false} colon={true} className={layoutItem} help={hints.statusHint} validateStatus={hints.statusStatus} >
                        <RadioGroup onChange={this.onChange} >
                            <DictRadio name="status" id="status" value={this.state.HrReq.status} appName='项目管理' optName='人员需求状态' onChange={this.onRadioChange} />
                        </RadioGroup>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdateHrReqPage;

