import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import AutoInput from '../../../lib/Components/AutoInput';
import DictSelect from '../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var BranchStore = require('../data/BranchStore.js');
var BranchActions = require('../action/BranchActions');

var UpdateBranchPage = React.createClass({
    getInitialState: function () {
        return {
            branchSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            branch: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(BranchStore, "onServiceComplete"), ModalForm('branch')],
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
                    branchSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'branchType', desc: '类型', required: true, max: '32' },
            { id: 'branchName', desc: '公司名称', required: true, max: '128' },
            { id: 'branchCity', desc: '城市', required: true, max: '128' },
            { id: 'branchLoc', desc: '办公地址', required: false, max: '256' },
            { id: 'manager', desc: '总经理', required: false, max: '32' },
            { id: 'contact', desc: '联络人', required: false, max: '32' },
            { id: 'capital', desc: '注册资金', required: false, max: '32' },
            { id: 'trdAmount', desc: '交易总额', required: false, max: '32' },
            // {id: 'branchCode', desc:'公司代码', required: false, max: '64'},
            { id: 'branchPhone', desc: '电话', required: false, dataType: 'mobile', max: '128' },
        ];
    },

    initPage: function (branch) {
        this.state.hints = {};
        Utils.copyValue(branch, this.state.branch);

        this.state.loading = false;
        this.state.branchSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.branch)) {
            this.state.branchSet.operation = '';
            this.setState({ loading: true });
            BranchActions.updateHrBranch(this.state.branch);
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
            <Modal visible={this.state.modal} width='640px' title="修改分公司信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-branch/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row>
                        <Col span="11">
                            <FormItem {...formItemLayout2} label="类型" required={true} colon={true} className={layoutItem} help={hints.branchTypeHint} validateStatus={hints.branchTypeStatus}>
                                <DictSelect name="branchType" id="branchType" value={this.state.branch.branchType} appName='HR系统' optName='分公司类型' onSelect={this.handleOnSelected.bind(this, "branchType")} />
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem {...formItemLayout2} label="公司名称" required={true} colon={true} className={layoutItem} help={hints.branchNameHint} validateStatus={hints.branchNameStatus}>
                                <Input type="text" name="branchName" id="branchName" value={this.state.branch.branchName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem {...formItemLayout2} label="城市" required={true} colon={true} className={layoutItem} help={hints.branchCityHint} validateStatus={hints.branchCityStatus}>
                                <AutoInput name='branchCity' id='branchCity' paramName='城市' value={this.state.branch.branchCity} onChange={this.handleOnSelected.bind(this, "branchCity")} />
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem {...formItemLayout2} label="电话" colon={true} className={layoutItem} help={hints.branchPhoneHint} validateStatus={hints.branchPhoneStatus}>
                                <Input type="text" name="branchPhone" id="branchPhone" value={this.state.branch.branchPhone} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem {...formItemLayout2} label="总经理" colon={true} className={layoutItem} help={hints.managerHint} validateStatus={hints.managerStatus}>
                                <Input type="text" name="manager" id="manager" value={this.state.branch.manager} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem {...formItemLayout2} label="联络人" colon={true} className={layoutItem} help={hints.contactHint} validateStatus={hints.contactStatus}>
                                <Input type="text" name="contact" id="contact" value={this.state.branch.contact} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem {...formItemLayout2} label="注册资金" colon={true} className={layoutItem} help={hints.capitalHint} validateStatus={hints.capitalStatus}>
                                <Input type="text" name="capital" id="capital" value={this.state.branch.capital} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem {...formItemLayout2} label="交易总额" colon={true} className={layoutItem} help={hints.trdAmountHint} validateStatus={hints.trdAmountStatus}>
                                <Input type="text" name="trdAmount" id="trdAmount" value={this.state.branch.trdAmount} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>


                    <FormItem {...formItemLayout} label="办公地址" colon={true} className={layoutItem} help={hints.branchLocHint} validateStatus={hints.branchLocStatus}>
                        <AutoInput name='branchLoc' id='branchLoc' paramName='办公场地' value={this.state.branch.branchLoc} onChange={this.handleOnSelected.bind(this, "branchLoc")} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="公司描述" colon={true} className={layoutItem} help={hints.branchDescHint} validateStatus={hints.branchDescStatus}>
                        <Input type="textarea" name="branchDesc" id="branchDesc" value={this.state.branch.branchDesc} onChange={this.handleOnChange} style={{ height: '100px' }} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdateBranchPage;

