import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var PathStore = require('../data/PathStore.js');
var PathActions = require('../action/PathActions');

var UpdatePathPage = React.createClass({
    getInitialState: function () {
        return {
            pathSet: {
                errMsg: ''
            },

            loading: false,
            modal: false,
            path: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(PathStore, "onServiceComplete"), ModalForm('path')],
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

    initPage: function (path) {
        this.state.hints = {};
        Utils.copyValue(path, this.state.path);

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.path)) {
            this.setState({ loading: true });
            PathActions.updatePagePath(this.state.path );
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
            <Modal visible={this.state.modal} width='540px' title="修改路径信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-path/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="目录名称" colon={true} className={layoutItem} help={hints.pathNameHint} validateStatus={hints.pathNameStatus}>
                        <Input type="text" name="pathName" id="pathName" value={this.state.path.pathName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="目录说明" colon={true} className={layoutItem} help={hints.pathDescHint} validateStatus={hints.pathDescStatus}>
                        <Input type="text" name="pathDesc" id="pathDesc" value={this.state.path.pathDesc} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否页面" colon={true} className={layoutItem} help={hints.isPageHint} validateStatus={hints.isPageStatus}>
                        <DictRadio name="isPage" id="isPage" appName='common' optName='是否' onChange={this.onRadioChange} value={this.state.path.isPage} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdatePathPage;
