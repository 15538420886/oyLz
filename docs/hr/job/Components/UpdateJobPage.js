import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var JobStore = require('../data/JobStore.js');
var JobActions = require('../action/JobActions');

var UpdateJobPage = React.createClass({
    getInitialState: function () {
        return {
            jobSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            job: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(JobStore, "onServiceComplete"), ModalForm('job')],
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
                    jobSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'jobCode', desc: '岗位编码', required: true, max: '32' },
            { id: 'jobName', desc: '岗位名称', required: true, max: '32' },
            { id: 'jobDesc', desc: '岗位说明', required: false, max: '1024' },
            { id: 'unitTime', desc: '结算单位', required: false, max: '32' },
            { id: 'unitPrice', desc: '结算单价', required: false, max: '32' },
            { id: 'unitCost', desc: '平均成本', required: false, max: '32' },
            { id: 'jobResponse', desc: '岗位职责', required: false, max: '4000' },
            { id: 'jobQualify', desc: '岗位要求', required: false, max: '4000' },
            { id: 'levelUuid', desc: '最低级别编码', required: false, max: '24' },
            { id: 'levelUuid2', desc: '最高级别编码', required: false, max: '24' },
        ];
    },

    initPage: function (job) {
        this.state.hints = {};
        Utils.copyValue(job, this.state.job);

        this.state.loading = false;
        this.state.jobSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.job)) {
            this.state.jobSet.operation = '';
            this.setState({ loading: true });
            JobActions.updateHrJob(this.state.job);
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
            <Modal visible={this.state.modal} width='640px' title="修改岗位信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-job/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="岗位编码" required={true} colon={true} className={layoutItem} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
                                <Input type="text" name="jobCode" id="jobCode" value={this.state.job.jobCode} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="岗位名称" required={true} colon={true} className={layoutItem} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
                                <Input type="text" name="jobName" id="jobName" value={this.state.job.jobName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="岗位说明" required={false} colon={true} className={layoutItem} help={hints.jobDescHint} validateStatus={hints.jobDescStatus}>
                        <Input type="textarea" name="jobDesc" id="jobDesc" value={this.state.job.jobDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="结算单位" required={false} colon={true} className={layoutItem} help={hints.unitTimeHint} validateStatus={hints.unitTimeStatus}>
                                <DictSelect name="unitTime" id="unitTime" value={this.state.job.unitTime} appName='HR系统' optName='结算单位' onSelect={this.handleOnSelected.bind(this, "unitTime")} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.unitPriceHint} validateStatus={hints.unitPriceStatus}>
                                <Input type="text" name="unitPrice" id="unitPrice" value={this.state.job.unitPrice} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="平均成本" required={false} colon={true} className={layoutItem} help={hints.unitCostHint} validateStatus={hints.unitCostStatus}>
                                <Input type="text" name="unitCost" id="unitCost" value={this.state.job.unitCost} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="岗位职责" required={false} colon={true} className={layoutItem} help={hints.jobResponseHint} validateStatus={hints.jobResponseStatus}>
                        <Input type="textarea" name="jobResponse" id="jobResponse" value={this.state.job.jobResponse} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="岗位要求" required={false} colon={true} className={layoutItem} help={hints.jobQualifyHint} validateStatus={hints.jobQualifyStatus}>
                        <Input type="textarea" name="jobQualify" id="jobQualify" value={this.state.job.jobQualify} onChange={this.handleOnChange} style={{height:'80px'}} />
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="最低级别" required={false} colon={true} className={layoutItem} help={hints.levelUuidHint} validateStatus={hints.levelUuidStatus}>
                                <Input type="text" name="levelUuid" id="levelUuid" value={this.state.job.levelUuid} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="最高级别" required={false} colon={true} className={layoutItem} help={hints.levelUuid2Hint} validateStatus={hints.levelUuid2Status}>
                                <Input type="text" name="levelUuid2" id="levelUuid2" value={this.state.job.levelUuid2} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
});

export default UpdateJobPage;
