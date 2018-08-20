import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, } from 'antd';
const FormItem = Form.Item;

import JsModelTreeSelect from '../../lib/Components/JsModelTreeSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
import PathContext from '../PathContext'

var UpdatePaperPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            modal: false,
            page: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('page')],
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
            { id: 'pageName', desc: '页面名称', required: true, max: 64 },
            { id: 'tempUuid', desc: '页面模板', required: true, max: 128 },
            { id: 'pageDesc', desc: '页面说明', required: false },
        ];
    },

    initPage: function (page) {
        this.state.hints = {};
        Utils.copyValue(page, this.state.page);

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.page)) {
            this.setState({ loading: true });
            PageDesignActions.updatePage(PathContext.selectedRes.resName, this.state.page)
        }
    },
    onSelect:function(value,tem){
        var page2 = this.state.page;
        page2.tempUuid = value;

        if (page2.pageName === '' || page2.pageName === null) {
            var pageName = this.refs.modelTree.state.modelMap[value];
            if (pageName !== undefined && pageName !== null) {
                page2.pageName = pageName;
            }
        }

        this.setState({
            page:page2
        })  
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
            <Modal visible={this.state.modal} width='540px' title="修改页面" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-design/updatePage']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="页面名称" required={true} colon={true} className={layoutItem} help={hints.pageNameHint} validateStatus={hints.pageNameStatus}>
                        <Input type="text" name="pageName" id="pageName" value={this.state.page.pageName} onChange={this.handleOnChange} />
                    </FormItem>
                     <FormItem {...formItemLayout} label="页面模板" required={true} colon={true} className={layoutItem} help={hints.tempUuidHint} validateStatus={hints.tempUuidStatus}>
                        <JsModelTreeSelect ref='modelTree' name="tempUuid" id="tempUuid" value={this.state.page.tempUuid} onSelect={this.onSelect}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="页面说明" colon={true} className={layoutItem} help={hints.pageDescHint} validateStatus={hints.pageDescStatus}>
                        <Input type="textarea" name="pageDesc" id="pageDesc" value={this.state.page.pageDesc} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdatePaperPage;
