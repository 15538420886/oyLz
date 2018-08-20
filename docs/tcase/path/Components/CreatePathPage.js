import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var PathStore = require('../data/TmCaseStore');
var PathActions = require('../action/TmCaseActions');


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
            { id: 'cateName', desc: '目录名称', required: true, max: 64 },
            { id: 'pathDesc', desc: '目录说明', max: 128 },
           
        ];
    },

    clear: function (pid, ord) {
        this.state.hints = {};
        this.state.path2.cateName = '';
       
        this.state.path2.pid = pid;
        this.state.path2.ord = ord;

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.path2)) {
            this.setState({ loading: true });
            console.log(this.state.path2)
            PathActions.createTmCase(this.state.path2);
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
            <Modal visible={this.state.modal} width='540px' title="新增用例模块" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-path/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                     <FormItem {...formItemLayout} label="所属系统" colon={true} className={layoutItem} help={hints.pathDescHint} validateStatus={hints.pathDescStatus}>
                        <DictSelect name="rsvStr1" id="rsvStr1" value={this.state.path2.rsvStr1} appName='用例管理' optName='所属系统' onSelect={this.handleOnSelected.bind(this, "rsvStr1")}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="模块名称" colon={true} className={layoutItem} help={hints.cateNameHint} validateStatus={hints.cateNameStatus}>
                        <Input type="text" name="cateName" id="cateName" value={this.state.path2.cateName} onChange={this.handleOnChange} />
                    </FormItem>                  
                </Form>
            </Modal>
        );
    }
});

export default CreatePathPage;
