'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col, Spin} from 'antd'; 
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Validator = require('../../../public/script/common');
var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
import SelectOptsPage from './SelectOptsPage'
import PathContext from '../PathContext';

var UpdateFieldPage = React.createClass({
    getInitialState: function () {
        return {
            fieldSet: {
                errMsg: ''
            },
            
            loading: false,
            modal: false,
            field: {},
            hints: {},
            validRules: [],
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('field')],

    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'updateFields') {
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
                    fieldSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            {id: 'id', desc:'名称', required: true, max: '0'},
            {id: 'type', desc:'类型', required: false, max: '0'},
            {id: 'desc', desc:'标题', required: true, max: '0'},
            {id: 'required', desc:'必输', required: false, max: '0'},
            {id: 'max', desc:'最大长度', required: false, max: '0'},
            {id: 'min', desc:'最小长度', required: false, max: '0'},
            {id: 'datatype', desc:'数据类型', required: false, max: '0'},
            {id: 'pattern', desc:'正则表达式', required: false, max: '0'},
            {id: 'patternPrompt', desc:'错误提示', required: false, max: '0'},
            {id: 'validator', desc:'有效性检查函数', required: false, max: '0'},
            {id: 'defValue', desc:'缺省值', required: false, max: '0'},
            {id: 'opts', desc:'检索字段', required: false, max: '0'},
            {id: 'showCode', desc:'是否显示代码', required: false, max: '0'},
        ];
    },

    initPage: function (field) {
        this.state.hints = {};
        Utils.copyValue(field, this.state.field);

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.field)) {
            this.setState({ loading: true });

            var resNode = PathContext.pageRes;
            var src = resNode.fields;

            var fields = [];
            var id = this.state.field.id;
            if (src !== null && src !== undefined) {
                src.map((node, i) => {
                    if (node.id === id) {
                        fields.push(this.state.field);
                    }
                    else {
                        fields.push(node);
                    }
                });
            }
            PageDesignActions.updateFields(PathContext.selectedRes.resName, fields)
        }
    },
    setValue:function(opts){
        var field = this.state.field;
        field.opts = '#'+ opts.appName +'.'+opts.indexName;
        this.setState({
            field:field
        })
    },
    onOptsSelect:function(){
        this.refs.SelectOptsPage.toggle()
    },
    
    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        
        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="修改字段" maskClosable={false} style={{marginTop:'-15px'}} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-design/updateFields']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="名称" required={true} colon={true} className={layoutItem} help={hints.idHint} validateStatus={hints.idStatus}>
                                <Input type="text" name="id" id="id" readOnly={true} value={this.state.field.id} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="标题" required={true} colon={true} className={layoutItem} help={hints.descHint} validateStatus={hints.descStatus}>
                                <Input type="text" name="desc" id="desc" value={this.state.field.desc} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="必输" colon={true} className={layoutItem} help={hints.requiredHint} validateStatus={hints.requiredStatus}>
                                <DictRadio name="required" id="required" appName='common' optName='是否' onChange={this.onRadioChange} value={this.state.field.required} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="最大长度" colon={true} help={hints.maxint} validateStatus={hints.maxStatus}>
                                <Input type="text" name="max" id="max" value={this.state.field.max} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="最小长度" colon={true} help={hints.minHint} validateStatus={hints.minStatus}>
                                <Input type="text" name="min" id="min" value={this.state.field.min} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="数据类型" colon={true} className={layoutItem} help={hints.datatypeHint} validateStatus={hints.datatypeStatus}>
                                <DictSelect name="datatype" id="datatype" value={this.state.field.datatype} appName='项目管理' optName='数据类型' onSelect={this.handleOnSelected.bind(this, "datatype")} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="检查函数" colon={true} help={hints.validatorHint} validateStatus={hints.validatorStatus}>
                                <Input type="text" name="validator" id="validator" value={this.state.field.validator} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="正则表达式" colon={true} className={layoutItem} help={hints.patternHint} validateStatus={hints.patternStatus}>
                                <Input type="text" name="pattern" id="pattern" value={this.state.field.pattern} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="错误提示" colon={true} className={layoutItem} help={hints.patternPromptHint} validateStatus={hints.patternPromptStatus}>
                                <Input type="text" name="patternPrompt" id="patternPrompt" value={this.state.field.patternPrompt} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="字段类型" required={true} colon={true} help={hints.typeHint} validateStatus={hints.typeStatus}>
                                <DictSelect name="type" id="type" value={this.state.field.type} appName='项目管理' optName='字段类型' onSelect={this.handleOnSelected.bind(this, "type")} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="缺省值" colon={true} help={hints.defValueHint} validateStatus={hints.defValueStatus}>
                                <Input type="text" name="defValue" id="defValue" value={this.state.field.defValue} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="检索字段" colon={true} className={layoutItem} help={hints.optsHint} validateStatus={hints.optsStatus}>
                                <Search id='opts' name='opts' value={this.state.field.opts} onSearch={this.onOptsSelect} readOnly={true}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem {...formItemLayout} label="显示代码" colon={true} className={layoutItem} help={hints.showCodeHint} validateStatus={hints.showCodeStatus}>
                                <DictRadio name="showCode" id="showCode" appName='common' optName='是否' onChange={this.onRadioChange} value={this.state.field.showCode} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectOptsPage ref="SelectOptsPage" setValue={this.setValue}/>
            </Modal>
        );
    }
});

export default UpdateFieldPage;
