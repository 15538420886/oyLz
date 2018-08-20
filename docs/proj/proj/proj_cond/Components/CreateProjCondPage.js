import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Col, Row, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';
import ProjCodeMap from '../../../lib/ProjCodeMap';
var ProjContext = require('../../../ProjContext');
import SearchResMember from '../../../lib/Components/SearchResMember';
var ProjCondPageStore = require('../data/ProjCondPageStore');
var ProjCondPageActions = require('../action/ProjCondPageActions');

var CreateProjCondPage = React.createClass({
    getInitialState: function () {
        return {
            contSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            cond: {},
            hints: {},
            validRules: [],
        }
    },

    mixins: [Reflux.listenTo(ProjCondPageStore, "onServiceComplete"), ProjCodeMap(), ModalForm('cond')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    contSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'perName', desc: '姓名', required: true, max: '32' },
            { id: 'staffCode', desc: '员工编号', required: true, true: '32' },
            { id: 'refTime', desc: '推荐时间', required: false, max: '64' },
            { id: 'refJob', desc: '推荐岗位', required: false, max: '64' },
            { id: 'refMemo', desc: '推荐说明', required: false, max: '64' },
        ];
    },

    clear: function () {
        this.state.hints = {};
        this.state.cond.projUuid = ProjContext.selectedProj.uuid;
        this.state.cond.projName = ProjContext.selectedProj.projName;
        this.state.cond.perName = '';
        this.state.cond.staffCode = '';
        this.state.cond.poolUuid = '';
        this.state.cond.baseCity = '';
        this.state.cond.status = '';
        this.state.cond.refName = '项目组';
        this.state.cond.refJob = '';
        this.state.cond.refMemo = '';
        this.state.cond.provStatus = '未处理';

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.cond)) {
            this.setState({ loading: true });
            var date = new Date();
            this.state.cond.corpUuid = window.loginData.compUser.corpUuid;
            this.state.cond.refDate = '' + Common.getToday();
            this.state.cond.refTime = date.getHours() + ':' + date.getMinutes();
            ProjCondPageActions.createProjCond(this.state.cond);
        }
    },
    onSelectMember: function (data) {
        var cond = this.state.cond;
        cond.staffCode = data.staffCode;
        cond.perName = data.perName;
        cond.userId = data.userId;
        cond.poolUuid = data.poolUuid;
        cond.baseCity = data.baseCity;
        cond.teamUuid = data.teamUuid;
        cond.resStatus = data.resStatus;
        cond.resName = data.resName;
        this.setState({
            cond: cond
        })
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

        var poolUuid = this.state.cond.poolUuid;
        var poolName = poolUuid;
        if (poolUuid !== null && poolUuid !== undefined && poolUuid !== '') {
            poolName = this.getResPoolName(poolUuid);
            if (poolName !== poolUuid) {
                this.state.cond.poolName = poolName;
            }
        }

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="推荐组员" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['proj_cond/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row>
                        <Col span="4">
                        </Col>
                        <Col span="20">
                            <FormItem label="" colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
                                <SearchResMember onSelectMember={this.onSelectMember} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="员工编号" required={true} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                <Input type="text" name="staffCode" id="staffCode" value={this.state.cond.staffCode} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="员工姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                <Input type="text" name="perName" id="perName" value={this.state.cond.perName} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="资源池" colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                <Input type="text" name="poolName" id="poolName" value={poolName} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="属地" colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                <Input type="text" name="baseCity" id="baseCity" value={this.state.cond.baseCity} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="当前状态" colon={true} className={layoutItem} help={hints.resStatusHint} validateStatus={hints.resStatusStatus}>
                                <Input type="text" name="resStatus" id="resStatus" value={this.state.cond.resStatus} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="所在项目" colon={true} className={layoutItem} help={hints.resNameHint} validateStatus={hints.resNameStatus}>
                                <Input type="text" name="resName" id="resName" value={this.state.cond.resName} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="推荐岗位" required={false} colon={true} className={layoutItem} help={hints.refJobHint} validateStatus={hints.refJobStatus}>
                                <Input type="text" name="refJob" id="refJob" value={this.state.cond.refJob} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem {...formItemLayout2} label="推荐说明" required={false} colon={true} className={layoutItem} help={hints.refMemoHint} validateStatus={hints.refMemoStatus} >
                        <Input type="textarea" name="refMemo" id="refMemo" onChange={this.handleOnChange} style={{ height: '140px' }} value={this.state.cond.refMemo} />
                    </FormItem>

                </Form>
            </Modal>
        );
    }
});

export default CreateProjCondPage;
