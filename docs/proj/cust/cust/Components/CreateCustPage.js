﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';
import QuickFill from '../../../../lib/Components/QuickFill';

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var CustStore = require('../data/CustStore.js');
var CustActions = require('../action/CustActions');

var CreateCustPage = React.createClass({
    getInitialState: function () {
        return {
            custSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            cust: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(CustStore, "onServiceComplete"), ModalForm('cust')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.beforeClose();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    custSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'custCode', desc: '客户编号', required: false, max: '64' },
            { id: 'custName', desc: '客户简称', required: true, max: '64' },
            { id: 'custDesc', desc: '客户名称', required: false, max: '3000' },
            { id: 'custLoc', desc: '客户地址', required: false, max: '256' },
            { id: 'marketArea', desc: '销售区域', required: false, max: '64' },
            { id: 'custManager', desc: '客户经理', required: false, max: '32' },
            { id: 'custValue', desc: '客户价值', required: false, max: '64' },
            { id: 'custEval', desc: '客户评价', required: false, max: '256' },
            { id: 'delivArea', desc: '交付区域', required: false, max: '64' },
            { id: 'custIndust', desc: '所属行业', required: false, max: '64' },
        ];
    },

    handleKeyDown: function (e) {
        if (73 == e.keyCode && e.ctrlKey && e.altKey) {
            var w = this.refs.QuickFillWindow;
            if (w) {
                w.initPage(this.state.validRules);
                w.toggle();
            }
        }
    },

    beforeClose: function () {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.setState({
            modal: false
        });
    },

    clear: function (corpUuid) {
        window.addEventListener('keydown', this.handleKeyDown);

        this.state.hints = {};
        this.state.cust.uuid = '';
        this.state.cust.corpUuid = corpUuid;

        this.state.loading = false;
        this.state.custSet.operation = '';
        this.state.cust.custCode = '';
        this.state.cust.custName = '';
        this.state.cust.custLoc = '';
        this.state.cust.marketArea = '';
        this.state.cust.custManager = '';
        this.state.cust.custValue = '';
        this.state.cust.custEval = '';
        this.state.cust.custDesc = '';
        this.state.cust.delivArea = '';
        this.state.cust.custIndust = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.cust)) {
            this.state.custSet.operation = '';
            this.setState({ loading: true });
            CustActions.createProjCust(this.state.cust);
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
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 8 }),
        };
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加客户#" maskClosable={false} onOk={this.onClickSave} onCancel={this.beforeClose}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['proj_cust/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.beforeClose}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout2} label="客户编号" required={false} colon={true} className={layoutItem} help={hints.custCodeHint} validateStatus={hints.custCodeStatus}>
                        <Input type="text" name="custCode" id="custCode" value={this.state.cust.custCode} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="客户简称" required={true} colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
                        <Input type="text" name="custName" id="custName" value={this.state.cust.custName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="客户名称" required={false} colon={true} className={layoutItem} help={hints.custDescHint} validateStatus={hints.custDescStatus}>
                        <Input type="textarea" name="custDesc" id="custDesc" value={this.state.cust.custDesc} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="客户地址" required={false} colon={true} className={layoutItem} help={hints.custLocHint} validateStatus={hints.custLocStatus}>
                        <Input type="text" name="custLoc" id="custLoc" value={this.state.cust.custLoc} onChange={this.handleOnChange} />
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout3} label="销售区域" required={false} colon={true} className={layoutItem} help={hints.marketAreaHint} validateStatus={hints.marketAreaStatus}>
                                <DictSelect name="marketArea" class="row" id="marketArea" value={this.state.cust.marketArea} appName='项目管理' optName='销售区域' onSelect={this.handleOnSelected.bind(this, "marketArea")} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout3} label="交付区域" required={false} colon={true} className={layoutItem} help={hints.delivAreaHint} validateStatus={hints.delivAreaStatus}>
                                <DictSelect name="delivArea" id="delivArea" value={this.state.cust.delivArea} appName='项目管理' optName='交付区域' onSelect={this.handleOnSelected.bind(this, "delivArea")} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout3} label="客户经理" required={false} colon={true} className={layoutItem} help={hints.custManagerHint} validateStatus={hints.custManagerStatus}>
                                <Input type="text" name="custManager" id="custManager" value={this.state.cust.custManager} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout3} label="所属行业" required={false} colon={true} className={layoutItem} help={hints.custIndustHint} validateStatus={hints.custIndustStatus}>
                                <DictSelect name="custIndust" id="custIndust" value={this.state.cust.custIndust} appName='项目管理' optName='所属行业' onSelect={this.handleOnSelected.bind(this, "custIndust")} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout2} label="客户价值" required={false} colon={true} className={layoutItem} help={hints.custValueHint} validateStatus={hints.custValueStatus}>
                        <Input type="text" name="custValue" id="custValue" value={this.state.cust.custValue} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="客户评价" required={false} colon={true} className={layoutItem} help={hints.custEvalHint} validateStatus={hints.custEvalStatus}>
                        <Input type="textarea" name="custEval" id="custEval" value={this.state.cust.custEval} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
                <QuickFill ref='QuickFillWindow' self={this} object='cust' />
            </Modal>
        );
    }
});

export default CreateCustPage;

