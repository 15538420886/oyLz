import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
var Common = require('../../../../public/script/common');
var Validator = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Row, Col, Radio, DatePicker, } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var ProjHrReqStore = require('../data/ProjHrReqStore.js');
var ProjHrReqActions = require('../action/ProjHrReqActions');
var ProjContext = require('../../../ProjContext');
var CreateProjHrReqPage = React.createClass({
    getInitialState: function () {
        return {
            ProjHrReqSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            hints: {},
            validRules: [],
            HrReq: {}
        }
    },

    mixins: [Reflux.listenTo(ProjHrReqStore, "onServiceComplete"), ModalForm('HrReq')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false,
                    loading: false
                });
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
            { id: 'reqType', desc: '变更类型：离组、入组', required: false, max: '24' },
            { id: 'reqType2', desc: '时间类型：预期、即时', required: false, max: '24' },
            { id: 'beginDate', desc: '开始日期', required: true, max: '24' },
            { id: 'endDate', desc: '结束日期', required: true, max: '24' },
            { id: 'reqCount', desc: '人员数量', required: true, dataType: 'number', max: '24' },
            { id: 'reqMemo', desc: '说明', required: false, max: '512' },
        ];
    },

    clear: function (corpUuid) {
        this.state.hints = {};
        this.state.HrReq.endDate = '';
        this.state.HrReq.reqCount = '';
        this.state.HrReq.reqMemo = '';
        this.state.HrReq.reqType = '入组';
        this.state.HrReq.reqType2 = '即时';
        this.state.HrReq.status = "已开启";
        this.state.HrReq.beginDate = '' + Common.getToday();

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.HrReq)) {
            console.log(ProjContext.selectedProj);
            this.setState({ loading: true });
            this.state.HrReq.projUuid = ProjContext.selectedProj.uuid;
            this.state.HrReq.corpUuid = window.loginData.compUser.corpUuid;
            this.state.HrReq.projName = ProjContext.selectedProj.projName;
            this.state.HrReq.projLoc = ProjContext.selectedProj.projLoc;
            this.state.HrReq.pmName = ProjContext.selectedProj.pmName;
            ProjHrReqActions.createProjHrReq(this.state.HrReq);
            console.log(this.state.HrReq);
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
            <Modal visible={this.state.modal} width='560px' title="增加人员需求" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['proj-hr-req/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}>
                <Form layout={layout} style={{ width: '100%' }}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} value={this.state.value2} label="变更类型" required={false} colon={true} className={layoutItem} help={hints.reqTypeHint} validateStatus={hints.reqTypeStatus}>
                                <RadioGroup>
                                    <DictRadio name="reqType" id="reqType" appName='项目管理' optName='变更类型' onChange={this.onRadioChange} value={this.state.HrReq.reqType} />
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} value={this.state.value1} label="时间要求" required={false} colon={true} className={layoutItem} help={hints.reqType2Hint} validateStatus={hints.reqType2Status}>
                                <RadioGroup>
                                    <DictRadio name="reqType2" id="reqType2" appName='项目管理' optName='时间要求' onChange={this.onRadioChange} value={this.state.HrReq.reqType2} />
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="开始日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" onChange={this.handleOnSelDate.bind(this, "beginDate", Common.dateFormat)} value={this.formatDate(this.state.HrReq.beginDate, Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="结束日期" required={true} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" onChange={this.handleOnSelDate.bind(this, "endDate", Common.dateFormat)} value={this.formatDate(this.state.HrReq.endDate, Common.dateFormat)} />
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

export default CreateProjHrReqPage;

