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

var UpdateField2Page = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            modal: false,
            oldName: '',
            field: {},
            hints: {},
            validRules: [],
            page: {},
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('field')],
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
            { id: 'fieldID', desc: '字段名称', required: true, max: 64 },
            { id: 'colSpan', desc: '宽度', max: 16 },
            { id: 'param', desc: '参数', max: 256 },
        ];
    },

    initPage: function (page, field) {
        this.state.hints = {};
        Utils.copyValue(field, this.state.field);
        this.state.page = page;
        this.state.oldName = field.fieldID;

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.field)) {
            var page = {};
            Utils.copyValue(this.state.page, page);

            var fields = [];
            if (page.fields !== null && page.fields !== undefined) {
                page.fields.map((node, i) => {
                    if (this.state.oldName === node.fieldID) {
                        fields.push(this.state.field);
                    }
                    else {
                        fields.push(node);
                    }
                });
            }

            page.fields = fields;

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
            <Modal visible={this.state.modal} width='540px' title="修改字段信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-design/updatePage']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="字段名称" required={true} colon={true} className={layoutItem} help={hints.fieldIDHint} validateStatus={hints.fieldIDStatus}>
                        <Input type="text" name="fieldID" id="fieldID" value={this.state.field.fieldID} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="宽度" colon={true} className={layoutItem} help={hints.colSpanHint} validateStatus={hints.colSpanStatus}>
                        <Input type="text" name="colSpan" id="colSpan" value={this.state.field.colSpan} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="参数" colon={true} className={layoutItem} help={hints.paramHint} validateStatus={hints.paramStatus}>
                        <Input type="textarea" name="param" id="param" value={this.state.field.param} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdateField2Page;

