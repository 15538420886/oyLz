import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var BuildStore = require('../data/BuildStore.js');
var BuildActions = require('../action/BuildActions');

var CreateBuildPage = React.createClass({
    getInitialState: function () {
        return {
            buildSet: {
                operation: '',
                errMsg: ''
            },

            loading: false,
            modal: false,
            build: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(BuildStore, "onServiceComplete"), ModalForm('build')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    buildSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'buildCode', desc: '建筑名称', required: true, max: 128 },
            { id: 'cityName', desc: '城市', max: 64 },
            { id: 'address', desc: '地址', max: 256 }
        ];
    },

    clear: function (campUuid) {
        this.state.hints = {};
        this.state.build.buildCode = '';
        this.state.build.address = '';
        this.state.build.campUuid = campUuid;

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.build)) {
            this.setState({ loading: true });
            BuildActions.createHrBuild(this.state.build);
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
            <Modal visible={this.state.modal} width='540px' title="增加楼宇" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr-build/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="建筑名称" required={true} colon={true} className={layoutItem} help={hints.buildCodeHint} validateStatus={hints.buildCodeStatus}>
                        <Input type="text" name="buildCode" id="buildCode" value={this.state.build.buildCode} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="城市" colon={true} className={layoutItem} help={hints.cityNameHint} validateStatus={hints.cityNameStatus}>
                        <Input type="text" name="cityName" id="cityName" value={this.state.build.cityName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="地址" colon={true} className={layoutItem} help={hints.addressHint} validateStatus={hints.addressStatus}>
                        <Input type="text" name="address" id="address" value={this.state.build.address} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateBuildPage;
