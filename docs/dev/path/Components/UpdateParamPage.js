import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
import PathContext from '../PathContext'

var UpdateParamPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            modal: false,
            oldName: '',
            param: {},
            hints: {},
            validRules: [],
            page: {},
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('param')],
    onServiceComplete: function (data) {
        if (data.operation === 'updatePage') {
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
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'name', desc: '名称', required: true, max: 64 },
            { id: 'value', desc: '值', required: true, max: 128 },
        ];
    },

    initPage: function (page, param) {
        this.state.hints = {};
        Utils.copyValue(param, this.state.param);
        this.state.page = page;
        this.state.oldName = param.name;

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.param)) {
            var page = {};
            Utils.copyValue(this.state.page, page);

            var params = [];
            if (page.params !== null && page.params !== undefined) {
                page.params.map((node, i) => {
                    if (this.state.oldName === node.name) {
                        params.push(this.state.param);
                    }
                    else {
                        params.push(node);
                    }
                });
            }

            page.params = params;

            this.setState({ loading: true });
            PageDesignActions.updatePage(PathContext.selectedRes.resName, page)
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
            <Modal visible={this.state.modal} width='540px' title="修改参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-design/updatePage']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="名称" required={true} colon={true} className={layoutItem} help={hints.nameHint} validateStatus={hints.nameStatus}>
                        <Input type="text" name="name" id="name" value={this.state.param.name} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="值" required={true} colon={true} className={layoutItem} help={hints.valueHint} validateStatus={hints.valueStatus}>
                        <Input type="text" name="value" id="value" value={this.state.param.value} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdateParamPage;

