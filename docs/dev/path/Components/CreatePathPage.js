﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var PathStore = require('../data/PathStore');
var PathActions = require('../action/PathActions');


var CreatePathPage = React.createClass({
    getInitialState: function () {
        return {
            pathSet: {
                errMsg: ''
            },

            loading: false,
            modal: false,
            path2: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(PathStore, "onServiceComplete"), ModalForm('path2')],
    onServiceComplete: function (data) {
        if (this.state.modal && (data.operation === 'create' || data.operation === 'createResource')) {
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
                    pathSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'pathName', desc: '目录名称', required: true, max: 64 },
            { id: 'pathDesc', desc: '目录说明', max: 128 },
            { id: 'isPage', desc: '是否页面', required: false },
        ];
    },

    clear: function (appUuid, puuid) {
        this.state.hints = {};
        this.state.path2.pathName = '';
        this.state.path2.pathDesc = '';
        this.state.path2.isPage = '0';
        this.state.path2.appUuid = appUuid;
        this.state.path2.puuid = puuid;

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.path2)) {
            this.setState({ loading: true });
            PathActions.createPagePath(this.state.path2);
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
            <Modal visible={this.state.modal} width='540px' title="增加路径" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-path/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="目录名称" colon={true} className={layoutItem} help={hints.pathNameHint} validateStatus={hints.pathNameStatus}>
                        <Input type="text" name="pathName" id="pathName" value={this.state.path2.pathName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="目录说明" colon={true} className={layoutItem} help={hints.pathDescHint} validateStatus={hints.pathDescStatus}>
                        <Input type="text" name="pathDesc" id="pathDesc" value={this.state.path2.pathDesc} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否页面" colon={true} className={layoutItem} help={hints.isPageHint} validateStatus={hints.isPageStatus}>
                        <DictRadio name="isPage" id="isPage" appName='common' optName='是否' onChange={this.onRadioChange} value={this.state.path2.isPage} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreatePathPage;
