import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import DictSelect from '../../../../lib/Components/DictSelect';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var TestQuestStore = require('../data/TestQuestStore.js');
var TestQuestActions = require('../action/TestQuestActions');

var UpdateTestQuestPage = React.createClass({
    getInitialState : function() {
        return {
            questStoreSet: {},
            loading: false,
            modal: false,
            questStore: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(TestQuestStore, "onServiceComplete"), ModalForm('questStore')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'update'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    questStoreSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            { id: 'cateName', desc: '试卷名称', required: true, max: 64,},
            { id: 'cateLevel', desc: '难易等级',  max: 24,},
            { id: 'cateType', desc: '试卷类型',  max: 24,},
            { id: 'cateMemo', desc: '试卷说明', max: 512,},
            { id: 'category', desc: '类别', required: true, max: 24,},
            { id: 'cateMaker', desc: '出题人', max: 24,},
            { id: 'cateTime', desc: '考试时间', max: 64,},
        ];
    },

    initPage: function(questStore)
    {
        this.state.hints = {};
        Utils.copyValue(questStore, this.state.questStore);

        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

    onClickSave : function(){
        if(Common.formValidator(this, this.state.questStore)){
            this.setState({loading: true});
            TestQuestActions.updateQuestStore( this.state.questStore );
        }
    },

    render : function() {
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints=this.state.hints;
        return (
            <Modal visible={this.state.modal} width='590px' title="修改面试题库信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['quest-store/update']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='试卷名称' required={true} colon={true} help={hints.cateNameHint} validateStatus={hints.cateNameStatus}>
                                <Input type='text' name='cateName' id='cateName' value={this.state.questStore.cateName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='岗位类别' required={true} colon={true} help={hints.categoryHint} validateStatus={hints.categoryStatus}>
                                <DictSelect name="category" id="category" value={this.state.questStore.category} appName='招聘管理' optName='岗位类别' onSelect={this.handleOnSelected.bind(this, "category")}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='试卷类型' colon={true} help={hints.cateTypeHint} validateStatus={hints.cateTypeStatus}>
                                <DictRadio name="cateType" id="cateType"  value={this.state.questStore.cateType} appName='招聘管理' optName='试卷类型' onChange={this.onRadioChange}/>
                            </FormItem >
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem}label='难易等级' colon={true} help={hints.cateLevelHint} validateStatus={hints.cateLevelStatus} >
                                <DictRadio name="cateLevel" id="cateLevel"  value={this.state.questStore.cateLevel} appName='招聘管理' optName='题型等级' onChange={this.onRadioChange}/>
                            </FormItem >
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} className={layoutItem} label='试卷说明' colon={true} help={hints.cateMemoHint} validateStatus={hints.cateMemoStatus}>
                        <Input type='textarea' name='cateMemo' id='cateMemo' style={{height: '100px'}} value={this.state.questStore.cateMemo} onChange={this.handleOnChange} />
                    </FormItem>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='出题人' colon={true} help={hints.cateMakerHint} validateStatus={hints.cateMakerStatus}>
                                <Input type='text' name='cateMaker' id='cateMaker' value={this.state.questStore.cateMaker} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='考试时间' colon={true} help={hints.cateTimeHint} validateStatus={hints.cateTimeStatus}>
                                <Input type='text' name='cateTime' id='cateTime' value={this.state.questStore.cateTime} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
});

export default UpdateTestQuestPage;