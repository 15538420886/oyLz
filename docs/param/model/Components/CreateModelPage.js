import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
var ModelStore = require('../data/ModelStore');
var ModelActions = require('../action/ModelActions');

var CreateModelPage = React.createClass({
    getInitialState: function () {
        return {
            pathSet: {
                operation: '',
                errMsg: ''
            },
            modal: false,
            model2: {},
            hints: {},
            validRules: [],
            loading: false
        }
    },

    mixins: [Reflux.listenTo(ModelStore, "onServiceComplete"), ModalForm('model2')],
    //目录
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
                    pathSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'pathDesc', desc: '目录说明', required: false, max: '64' },
            { id: 'pathName', desc: '目录名称', required: true, max: '64' },
        ];
    },

    clear: function (groupUuid, corpUuid, isModel, puuid) {
        this.state.hints = {};
        this.state.loading = false;
        this.state.model2.isModel = '0';
        this.state.model2.pathName = '';
        this.state.model2.pathDesc = '';
        this.state.model2.corpUuid = corpUuid;
        this.state.model2.groupUuid = groupUuid;
        this.state.model2.puuid = puuid;
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.model2)) {
            this.state.model2.operation = '';
            this.setState({ loading: true });
            this.state.model2.modelCode = this.state.model2.pathName
            ModelActions.createPageModel(this.state.model2);
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
            <Modal visible={this.state.modal} width='540px' title={this.state.model2.isModel == 1 ? '增加模板' : '增加目录'} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['model-path/create']} />
                        <Button key="btnOK" type="primary" size="large" loading={this.state.loading} onClick={this.onClickSave}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="类型" colon={true} className={layoutItem} help={hints.hiberarchyHint} validateStatus={hints.campusLocStatus}>
                        <DictRadio name="isModel" id="isModel" value={this.state.model2.isModel} appName='项目管理' optName='模板类型' onChange={this.onRadioChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.state.model2.isModel == 1 ? '模板编号' : '目录名称'} colon={true} className={layoutItem} help={hints.pathNameHint} validateStatus={hints.pathNameStatus}>
                        <Input type="text" name='pathName' id='pathName' value={this.state.model2.pathName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.state.model2.isModel == 1 ? '模板名称' : '目录说明'} colon={true} className={layoutItem} help={hints.pathDescHint} validateStatus={hints.pathDescStatus}>
                        <Input type="text" name='pathDesc' id='pathDesc' value={this.state.model2.pathDesc} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateModelPage;
