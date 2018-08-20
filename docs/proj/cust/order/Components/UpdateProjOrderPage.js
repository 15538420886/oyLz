import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchProjGroup from '../../../lib/Components/SearchProjGroup';
var ProjOrderStore = require('../data/ProjOrderStore.js');
var ProjOrderActions = require('../action/ProjOrderActions');

var UpdateProjOrderPage = React.createClass({
    getInitialState: function () {
        return {
            orderSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            order: {},
            contract: {},
            list: [],
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(ProjOrderStore, "onServiceComplete"), ModalForm('order')],
    onServiceComplete: function (data) {
        if (data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    orderSet: data
                });
            }
        } else if (data.operation === 'retrieve1') {
            if (data.errMsg === '') {
                this.setState({
                    contract: data.list
                });
            }

        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'ordCode', desc: '订单编号', required: false, max: '64' },
            { id: 'ordName', desc: '订单名称', required: true, max: '128' },
            { id: 'ordDesc', desc: '订单说明', required: false, max: '2000' },
            { id: 'realCust', desc: '最终用户', required: false, max: '64' },
            { id: 'delivCity', desc: '交付城市', required: false, max: '64' },
            { id: 'ordType', desc: '订单类型', required: false, max: '64' },
            { id: 'biziType', desc: '业务类型', required: false, max: '32' },
            { id: 'payType', desc: '结算类型', required: false, max: '32' },
            { id: 'ordAmount', desc: '订单金额', required: false, max: '16' },
            { id: 'signDate', desc: '签订日期', required: false, max: '24' },
            { id: 'beginDate', desc: '开始日期', required: false, max: '24' },
            { id: 'endDate', desc: '结束日期', required: false, max: '24' },
            { id: 'ordStatus', desc: '执行阶段', required: false, max: '64' },
            { id: 'grpName', desc: '项目群名称', required: false, max: '64' },
            { id: 'deptCode', desc: '一级部门', required: false, max: '64' },
            { id: 'contUuid', desc: '合同编号', required: true, max: '24' },
            { id: 'grpUuid', desc: '项目组', required: true, max: '24' },
        ];
        this.initPage(this.props.order);
    },

    initPage: function (order) {
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.custUuid = order.custUuid;

        this.state.hints = {};
        Utils.copyValue(order, this.state.order);
        this.refs.searchBox.setValue(order.grpName);

        ProjOrderActions.retrieveProjContract(filter);
        this.setState({ loading: false, hints: {} });
        this.state.orderSet.operation = '';
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.order)) {
            this.state.orderSet.operation = '';
            this.setState({ loading: true });
            ProjOrderActions.updateProjOrder(this.state.order);
        }
    },

    onSelectProjGroup: function (data) {
        this.state.order.grpUuid = data.uuid;
        this.state.order.grpName = data.grpName;
        this.state.order.deptCode = data.deptCode;
        this.refs.searchBox.setValue(data.grpName);
        this.setState({
            user: data,
        })
    },
    goBack: function () {
        this.props.onBack();
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
        var boo = this.state.order.corpUuid ? false : true;
        var corpUuid = window.loginData.compUser.corpUuid;
        return (
            <div style={{ padding: "20px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['proj-order/update']} />
                <Form layout={layout} style={{ width: '600px' }}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="合同编号" required={false} colon={true} className={layoutItem} help={hints.contCodeHint} validateStatus={hints.contCodeStatus}>
                                <Input type="text" name="contCode" id="contCode" value={this.state.contract.contCode} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="客户名称" required={false} colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
                                <Input type="text" name="custName" id="custName" value={this.state.order.custName} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="合同名称" required={false} colon={true} className={layoutItem} help={hints.contNameHint} validateStatus={hints.contNameStatus}>
                            <Input type="text" name="contName" id="contName" value={this.state.contract.contName} onChange={this.handleOnChange} disabled={true} />
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="项目组" required={true} colon={true} className={layoutItem} help={hints.grpUuidHint} validateStatus={hints.grpUuidStatus}>
                                <SearchProjGroup corpUuid={corpUuid} showError={this.showError} onSelectGroup={this.onSelectProjGroup} ref="searchBox" name="grpName" id='grpName' value={this.state.order.grpName} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="业务群" required={false} colon={true} className={layoutItem} help={hints.deptCodeHint} validateStatus={hints.deptCodeStatus}>
                                <Input type="text" name="deptCode" id="deptCode" value={this.state.order.deptCode} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单编号" required={false} colon={true} className={layoutItem} help={hints.ordCodeHint} validateStatus={hints.ordCodeStatus}>
                                <Input type="text" name="ordCode" id="ordCode" value={this.state.order.ordCode} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单名称" required={true} colon={true} className={layoutItem} help={hints.ordNameHint} validateStatus={hints.ordNameStatus}>
                                <Input type="text" name="ordName" id="ordName" value={this.state.order.ordName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="订单说明" required={false} colon={true} className={layoutItem} help={hints.ordDescHint} validateStatus={hints.ordDescStatus}>
                            <Input type="textarea" name="ordDesc" id="ordDesc" value={this.state.order.ordDesc} onChange={this.handleOnChange} />
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="最终用户" required={false} colon={true} className={layoutItem} help={hints.realCustHint} validateStatus={hints.realCustStatus}>
                                <Input type="text" name="realCust" id="realCust" value={this.state.order.realCust} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="交付城市" required={false} colon={true} className={layoutItem} help={hints.delivCityHint} validateStatus={hints.delivCityStatus}>
                                <Input type="text" name="delivCity" id="delivCity" value={this.state.order.delivCity} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单类型" required={false} colon={true} className={layoutItem} help={hints.ordTypeHint} validateStatus={hints.ordTypeStatus}>
                                <DictSelect name="ordType" id="ordType" value={this.state.order.ordType} appName='项目管理' optName='订单类型' onSelect={this.handleOnSelected.bind(this, "ordType")} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="业务类型" required={false} colon={true} className={layoutItem} help={hints.biziTypeHint} validateStatus={hints.biziTypeStatus}>
                                <DictSelect name="biziType" id="biziType" value={this.state.order.biziType} appName='项目管理' optName='订单业务类型' onSelect={this.handleOnSelected.bind(this, "biziType")} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="结算类型" required={false} colon={true} className={layoutItem} help={hints.payTypeHint} validateStatus={hints.payTypeStatus}>
                                <DictSelect name="payType" id="payType" value={this.state.order.payType} appName='项目管理' optName='订单结算类型' onSelect={this.handleOnSelected.bind(this, "payType")} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单金额" required={false} colon={true} className={layoutItem} help={hints.ordAmountHint} validateStatus={hints.ordAmountStatus}>
                                <Input type="text" name="ordAmount" id="ordAmount" value={this.state.order.ordAmount} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="签订日期" required={false} colon={true} className={layoutItem} help={hints.signDateHint} validateStatus={hints.signDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="signDate" id="signDate" value={this.formatDate(this.state.order.signDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "signDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="执行阶段" required={false} colon={true} className={layoutItem} help={hints.ordStatusHint} validateStatus={hints.ordStatusStatus}>
                                <DictSelect name="ordStatus" id="ordStatus" value={this.state.order.ordStatus} appName='项目管理' optName='订单状态' onSelect={this.handleOnSelected.bind(this, "ordStatus")} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" value={this.formatDate(this.state.order.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "beginDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="结束日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" value={this.formatDate(this.state.order.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "endDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                        <Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
});

export default UpdateProjOrderPage;