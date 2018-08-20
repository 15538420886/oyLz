import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import DictSelect from '../../../../lib/Components/DictSelect';
import ProjGroupSelect from '../../../lib/Components/ProjGroupSelect';

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var OrderItemStore = require('../data/OrderItemStore.js');
var OrderItemActions = require('../action/OrderItemActions');

var CreateOrderItemPage = React.createClass({
    getInitialState: function () {
        return {
            orderItemSet: {},
            loading: false,
            modal: false,
            orderItem: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(OrderItemStore, "onServiceComplete"), ModalForm('orderItem')],
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
                    orderItemSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'grpName', desc: '项目群名称', max: 64, },
            { id: 'deptCode', desc: '一级部门', max: 64, },
            { id: 'itemCode', desc: '任务编号', max: 64, },
            { id: 'itemName', desc: '任务名称', required: true, max: 128, },
            { id: 'itemDesc', desc: '任务说明', max: 3600, },
            { id: 'biziType', desc: '业务类型', max: 32, },
            { id: 'itemStatus', desc: '执行阶段', required: true, max: 64, },
            { id: 'beginDate', desc: '开始日期', max: 24, },
            { id: 'endDate', desc: '结束日期', max: 24, },
        ];
    },

    clear: function (orderUuid) {
        this.state.hints = {};
        this.state.orderItem.uuid = '';
        this.state.orderItem.corpUuid = window.loginData.compUser.corpUuid;
        this.state.orderItem.orderUuid = orderUuid;
        this.state.orderItem.grpName = '';
        this.state.orderItem.deptCode = '';
        this.state.orderItem.itemCode = '';
        this.state.orderItem.itemName = '';
        this.state.orderItem.itemDesc = '';
        this.state.orderItem.biziType = '开发';
        this.state.orderItem.itemStatus = '运行';
        this.state.orderItem.beginDate = '';
        this.state.orderItem.endDate = '';

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onSelectGroup: function (grp) {
        var item = this.state.orderItem;
        item.deptCode = grp.deptCode;
        item.grpUuid = grp.uuid;
        item.grpName = grp.grpName;
        this.setState({ item: item });
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.orderItem)) {
            this.setState({ loading: true });
            OrderItemActions.createOrderItem(this.state.orderItem);
        }
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

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='700px' title="增加任务信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['order_item/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='任务编号' colon={true} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
                                <Input type='text' name='itemCode' id='itemCode' value={this.state.orderItem.itemCode} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='任务名称' required={true} colon={true} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                <Input type='text' name='itemName' id='itemName' value={this.state.orderItem.itemName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='项目组' colon={true} help={hints.grpNameHint} validateStatus={hints.grpNameStatus}>
                                <ProjGroupSelect name='grpName' id='grpName' value={this.state.orderItem.grpName} onSelectGroup={this.onSelectGroup} />
                            </FormItem>
                        </Col>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='业务群' colon={true} help={hints.deptCodeHint} validateStatus={hints.deptCodeStatus}>
                                <Input type='text' name='deptCode' id='deptCode' value={this.state.orderItem.deptCode} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col>
                            <FormItem {...formItemLayout} className={layoutItem} label='任务说明' colon={true} help={hints.itemDescHint} validateStatus={hints.itemDescStatus}>
                                <Input type='textarea' name='itemDesc' id='itemDesc' style={{ height: '100px' }} value={this.state.orderItem.itemDesc} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='业务类型' colon={true} help={hints.biziTypeHint} validateStatus={hints.biziTypeStatus}>
                                <DictSelect name='biziType' id='biziType' appName='项目管理' optName='业务类型' value={this.state.orderItem.biziType} onSelect={this.handleOnSelected.bind(this, 'biziType')} />
                            </FormItem>
                        </Col>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='执行阶段' required={true} colon={true} help={hints.itemStatusHint} validateStatus={hints.itemStatusStatus}>
                                <DictSelect name='itemStatus' id='itemStatus' appName='项目管理' optName='订单状态' value={this.state.orderItem.itemStatus} onSelect={this.handleOnSelected.bind(this, 'itemStatus')} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='开始日期' colon={true} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker name='beginDate' id='beginDate' style={{ width: '100%' }} value={this.formatDate(this.state.orderItem.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, 'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span='12'>
                            <FormItem {...formItemLayout2} className={layoutItem} label='结束日期' colon={true} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                <DatePicker name='endDate' id='endDate' style={{ width: '100%' }} value={this.formatDate(this.state.orderItem.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, 'endDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
});

export default CreateOrderItemPage;
