import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Spin } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import PathContext from '../PathContext'
import JsModelTreeSelect from '../../lib/Components/JsModelTreeSelect';
var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
var JsModelInfoStore = require('../../js-model/data/JsModelInfoStore.js');
var JsModelInfoActions = require('../../js-model/action/JsModelInfoActions');

var CreatePaperPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            modal: false,
            page: {},
            hints: {},
            validRules: [],
            params: '',
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), Reflux.listenTo(JsModelInfoStore, "onJsModelComplete"), ModalForm('page')],
    onServiceComplete: function (data) {
        if (data.operation === 'createPage') {
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
    onJsModelComplete: function (data) {
        if (data.operation === 'retrieve') {
            var params = '';
            var modelSet = data.recordSet;
            if (modelSet !== null && modelSet.length > 0) {
                params = modelSet[0].modelName;
            }

            // console.log('params', params);
            this.state.params = params;
            this.refs.modelTree.setState({ loading: false });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'pageName', desc: '页面名称', required: true, max: 64 },
            { id: 'tempUuid', desc: '页面模板', required: true, max: 128 },
            { id: 'pageDesc', desc: '页面说明', required: false },
        ];
    },

    clear: function () {
        this.state.hints = {};
        this.state.page = {
            pageID: '',
            pageName: '',
            tempUuid: '',
            tempName: '',
            mathodName: '',
            pageDesc: '',
            pageBody: ''
        };

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.page)) {
            var page = this.state.page;
            var str = this.state.params;
            var params = null;
            console.log('str', str)
            if (str !== null && str !== '') {
                params = [];

                var arr = str.split('\n');
                arr.map((para, i) => {
                    para = para.trim();
                    var pos = para.indexOf('=');
                    if (pos > 0) {
                        var p = {};
                        p.name = para.substr(0, pos);
                        p.value = '';
                        params.push(p);
                    }
                });
            }

            this.setState({ loading: true });
            page.params = params;
            PageDesignActions.createPage(PathContext.selectedRes.resName, page)
        }
    },
    onSelect: function (value, tem) {
        var page2 = this.state.page;
        page2.tempUuid = value;

        var pageName = this.refs.modelTree.state.modelMap[value];
        if (pageName !== undefined && pageName !== null) {
            page2.pageName = pageName;
        }

        this.setState({
            page: page2,
            params: '',
        });

        // 查找参数
        this.refs.modelTree.setState({ loading: true });
        JsModelInfoActions.retrieveJsModelInfo(value, '#');
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
            <Modal visible={this.state.modal} width='540px' title="增加页面" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-design/createPage']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="页面模板" required={true} colon={true} className={layoutItem} help={hints.tempUuidHint} validateStatus={hints.tempUuidStatus}>
                        <JsModelTreeSelect ref='modelTree' name="tempUuid" id="tempUuid" value={this.state.page.tempUuid} onSelect={this.onSelect} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="页面名称" required={true} colon={true} className={layoutItem} help={hints.pageNameHint} validateStatus={hints.pageNameStatus}>
                        <Input type="text" name="pageName" id="pageName" value={this.state.page.pageName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="页面说明" colon={true} className={layoutItem} help={hints.pageDescHint} validateStatus={hints.pageDescStatus}>
                        <Input type="textarea" name="pageDesc" id="pageDesc" value={this.state.page.pageDesc} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreatePaperPage;
