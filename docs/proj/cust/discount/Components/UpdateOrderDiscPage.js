import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var OrderDiscStore = require('../data/OrderDiscStore.js');
var OrderDiscActions = require('../action/OrderDiscActions');

var UpdateOrderDiscPage = React.createClass({
    getInitialState: function () {
        return {
            orderDiscSet: {},
            loading: false,
            modal: false,
            orderDisc: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(OrderDiscStore, "onServiceComplete"), ModalForm('orderDisc')],
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
                    orderDiscSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'disDate', desc: '折让日期', max: 24, },
            { id: 'discount', desc: '折让金额', required: true, max: 16, datatype: 'int', },
            { id: 'approver', desc: '审批人', max: 24, },
            { id: 'discReason', desc: '折让原因', max: 1024, },
        ];
    },

    initPage: function (orderDisc) {
        this.state.hints = {};
        Utils.copyValue(orderDisc, this.state.orderDisc);

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.orderDisc)) {
            this.setState({ loading: true });
            OrderDiscActions.updateOrderDisc(this.state.orderDisc);
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
        return (
            <Modal visible={this.state.modal} width='540px' title="修改折让信息信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['order-disc/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='折让日期' colon={true} help={hints.disDateHint} validateStatus={hints.disDateStatus}>
                                <DatePicker name='disDate' id='disDate' style={{ width: '100%' }} value={this.formatDate(this.state.orderDisc.disDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, 'disDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='折让金额' required={true} colon={true} help={hints.discountHint} validateStatus={hints.discountStatus}>
                                <Input type='text' name='discount' id='discount' value={this.state.orderDisc.discount} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='审批人' colon={true} help={hints.approverHint} validateStatus={hints.approverStatus}>
                                <Input type='text' name='approver' id='approver' value={this.state.orderDisc.approver} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col>
                            <FormItem {...formItemLayout} className={layoutItem} label='折让原因' colon={true} help={hints.discReasonHint} validateStatus={hints.discReasonStatus}>
                                <Input type='textarea' name='discReason' id='discReason' style={{ height: '100px' }} value={this.state.orderDisc.discReason} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
});

export default UpdateOrderDiscPage;
