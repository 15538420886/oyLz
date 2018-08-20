import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col,Checkbox} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio';
import FlowRoleSelect from '../../lib/Components/FlowRoleSelect';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FlowDefStore = require('../data/FlowDefStore.js');
var FlowDefActions = require('../action/FlowDefActions');


var CreateFlowDefNodePage = React.createClass({
    getInitialState : function() {
        return {
            flowDefSet: {},
            loading: false,
            modal: false,
            flowDef: {},
            hints: {},
            validRules: [],
            flowDefNode:{},
            flowDefNodeSet:{},
        }
    },

    mixins: [Reflux.listenTo(FlowDefStore, "onServiceComplete"), ModalForm('flowDefNode')],
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
                    flowDefNode: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
             { id: 'noticeType', desc: '通知方式', max: 24,},
             { id: 'nodeNames', desc: '节点名称', required: true, max: 24,},
             { id: 'remindDay', desc: '催办天数', max: 24,},
             { id: 'procType', desc: '审批方式', max: 24,},
             { id: 'exitNotice', desc: '结束后通知已处理人', max: 24,},
             { id: 'ruleScript', desc: '进入规则', max: 24,},
             { id: 'roleLoc', desc: '地区相关', max: 24,},
             { id: 'roleUuid', desc: '角色',required: true, max: 24,},

        ];
    },

    clear : function(filter){
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.flowDefNodeSet = filter;
        this.state.flowDefNode.uuid='';
        this.state.flowDefNode.noticeType='邮件';
        this.state.flowDefNode.nodeName='';
        this.state.flowDefNode.roleUuid='';
        this.state.flowDefNode.remindDay='0';
        this.state.flowDefNode.procType='';
        this.state.flowDefNode.exitNotice='';
        this.state.flowDefNode.ruleScript='';
        this.state.flowDefNode.roleLoc='';


        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

    onClickSave : function(){
        if(Common.formValidator(this, this.state.flowDefNode)){
            this.state.flowDefNode.nodeName=this.state.flowDefNode.nodeNames;
            delete this.state.flowDefNode.nodeNames;
            this.setState({loading: true});
            var flowDefNodeSet = this.state.flowDefNodeSet;
            var defData=Utils.deepCopyValue(this.state.flowDefNodeSet);
            var flowDefNode = this.refs.flowDefNode.getLevelNode();
            this.state.flowDefNode.roleName = flowDefNode.roleName;
            if(defData.node){
                defData.node.push(this.state.flowDefNode);
            }
            else{
                defData.node=[this.state.flowDefNode];
            }

            FlowDefActions.updateFlowDef(defData);
        }

    },

    render : function(){
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
            <Modal visible={this.state.modal} width='540px' title="增加节点" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['flow-def/create']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} className={layoutItem} label='节点名称' required={true} colon={true} help={hints.nodeNamesHint} validateStatus={hints.nodeNamesStatus}>
                        <Input type='text' name='nodeNames' id='nodeNames' value={this.state.flowDefNode.nodeNames} onChange={this.handleOnChange} />
                    </FormItem>
                    <Row type="flex">
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='角色'required={true} colon={true} help={hints.roleUuidHint} validateStatus={hints.roleUuidStatus}>
                            <FlowRoleSelect ref="flowDefNode" name="roleUuid" id="roleUuid" value={this.state.flowDefNode.roleUuid} onSelect={this.handleOnSelected.bind(this, "roleUuid")}/>
                        </FormItem>
                    </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} style={{marginLeft:'24px'}} label='' colon={true} help={hints.roleLocHint} validateStatus={hints.roleLocStatus}>
                                <Checkbox  name='roleLoc'  id='roleLoc' checked={(this.state.flowDefNode.roleLoc !== '0') ? true : false} onChange={this.handleCheckBox}>地区相关</Checkbox>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label='通知方式' colon={true}>
                        <DictSelect name="noticeType" id="noticeType" value={this.state.flowDefNode.noticeType} appName='流程管理' optName='流程通知方式' onSelect={this.handleOnSelected.bind(this, "noticeType")}/>
                    </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='审批方式' colon={true} >
                                <DictRadio name="procType" id="procType" value={this.state.flowDefNode.procType} appName='流程管理' optName='流程审批方式' onChange={this.onRadioChange}/>
                            </FormItem >
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label='催办天数' colon={true} help={hints.remindDayHint} validateStatus={hints.remindDayStatus}>
                        <Input type='text' name='remindDay' id='remindDay' value={this.state.flowDefNode.remindDay} onChange={this.handleOnChange} />
                    </FormItem>
                        </Col>
                        <Col span="12">
                    <FormItem {...formItemLayout2}   className={layoutItem} label=''style={{marginLeft:'24px'}} colon={true} help={hints.exitNoticeHint} validateStatus={hints.exitNoticeStatus}>
                        <Checkbox name='exitNotice' id='exitNotice' checked={(this.state.flowDefNode.exitNotice !== '0') ? true : false} onChange={this.handleCheckBox}>结束后通知已处理人</Checkbox>
                    </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} className={layoutItem} label='进入规则' colon={true} help={hints.ruleScriptHint} validateStatus={hints.ruleScriptStatus}>
                        <Input type='textarea' name='ruleScript' id='ruleScript' style={{height: '100px'}} value={this.state.flowDefNode.ruleScript} onChange={this.handleOnChange} />
                    </FormItem>

                </Form>
            </Modal>
        );
    }
});

export default CreateFlowDefNodePage;