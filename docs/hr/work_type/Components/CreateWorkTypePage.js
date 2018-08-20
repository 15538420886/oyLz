﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var WorkTypeStore = require('../data/WorkTypeStore');
var WorkTypeActions = require('../action/WorkTypeActions');

var CreateWorkTypePage = React.createClass({
    getInitialState: function () {
        return {
            workTypeSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            workType: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(WorkTypeStore, "onServiceComplete"), ModalForm('workType')],
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
                    workTypeSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'workType', desc: '职业类型', required: true, max: 32 },
            { id: 'workDomain', desc: '条线名称', required: false, max: 64 },
            { id: 'workName', desc: '工种名称', required: true, max: 64 },
            { id: 'workDesc', desc: '工种说明', required: false, max: 1024 },
        ];
    },

    clear: function (corpUuid) {
        this.state.hints = {};
        this.state.workType.uuid = '';
        this.state.workType.corpUuid = corpUuid;

        this.state.workType.workType = '';
        this.state.workType.workDomain = '';
        this.state.workType.workName = '';
        this.state.workType.workDesc = '';

        this.state.loading = false;
        this.state.workTypeSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.workType)) {
            this.state.workTypeSet.operation = '';
            this.setState({ loading: true });
            WorkTypeActions.createHrWorkType(this.state.workType);
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加管理" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-work-type/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="职业类型" required={true} colon={true} className={layoutItem} help={hints.workTypeHint} validateStatus={hints.workTypeStatus}>
                        <DictSelect name="workType" id="workType" value={this.state.workType.workType} appName='HR系统' optName='职业类型' onSelect={this.handleOnSelected.bind(this, "workType")} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="条线名称" colon={true} className={layoutItem} help={hints.workDomainHint} validateStatus={hints.workDomainStatus}>
                        <DictSelect name="workDomain" id="workDomain" value={this.state.workType.workDomain} appName='HR系统' optName='条线名称' onSelect={this.handleOnSelected.bind(this, "workDomain")} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="工种名称" required={true} colon={true} className={layoutItem} help={hints.workNameHint} validateStatus={hints.workNameStatus}>
                        <Input type="text" name="workName" id="workName" value={this.state.workType.workName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="工种说明" colon={true} className={layoutItem} help={hints.workDescHint} validateStatus={hints.workDescStatus}>
                        <Input type="textarea" name="workDesc" id="workDesc" value={this.state.workType.workDesc} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateWorkTypePage;

