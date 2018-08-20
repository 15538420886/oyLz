import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import ShowEnclosurePage from './ShowEnclosurePage';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var TmBugStore = require('../data/TmBugStore.js');
var TmBugActions = require('../action/TmBugActions');

var ShowDetailPage = React.createClass({
    getInitialState: function () {
        return {
            tmBugSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            modal: false,
            tmBug: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(TmBugStore, "onServiceComplete"), ModalForm('tmBug')],
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
                    tmBugSet: data
                });
            }
        }
    },

    init: function (InTmBug) {

        this.state.hints = {};
        this.state.tmBug.uuid = InTmBug.uuid;
        this.state.tmBug.bugName = InTmBug.bugName;
        this.state.tmBug.bugDesp = InTmBug.bugDesp;
        this.state.tmBug.bugPriorty = InTmBug.bugPriorty;
        this.state.tmBug.bugStage = InTmBug.bugStage;
        this.state.tmBug.bugSeverity = InTmBug.bugSeverity;
        this.state.tmBug.bugType = InTmBug.bugType;
        this.state.tmBug.bugChance = InTmBug.bugChance;
        this.state.tmBug.sysId = InTmBug.sysId;
        this.state.tmBug.findVer = InTmBug.findVer;
        this.state.tmBug.mdlId = InTmBug.mdlId;
        this.state.tmBug.caseCode = InTmBug.caseCode;
        this.state.tmBug.bugResponsible = InTmBug.bugResponsible;
        this.state.tmBug.closedUser = InTmBug.closedUser;
        this.state.tmBug.isclosed = InTmBug.isclosed;
        this.state.tmBug.closedDate = InTmBug.closedDate;
        this.state.tmBug.closeDesp = InTmBug.closeDesp;

        this.state.loading = false;
        this.state.tmBugSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    //打开附件
    handleOpenEnclosureWindow: function (e) {
        var tmBug = {
            uuid: this.state.tmBug.uuid
        }
      
        if (tmBug != null) {
            this.refs.showEnclosure.initPage(tmBug);
            this.refs.showEnclosure.toggle();
        }
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
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 12 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 12 }),
        };
        const formItemLayout4 = {
            labelCol: ((layout == 'vertical') ? null : { span: 16 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 8 }),
        };
        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='640px' title="查看管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['tm-bug/create']} />
                        <span style={{ float: "left" }}>
                            <Button key="btnEnclosure" size="large" onClick={this.handleOpenEnclosureWindow}>附件</Button>
                        </span>
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label="缺陷名称" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="bugName" id="bugName" value={this.state.tmBug.bugName} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout2} label="所属系统" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="sysId" id="sysId" value={this.state.tmBug.sysId} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="模块名称" colon={true} className={layoutItem} >
                                <Input type="text" name="mdlId" id="mdlId" value={this.state.tmBug.mdlId} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="版本编码" colon={true} className={layoutItem}>
                                <Input type="text" name="findVer" id="findVer" value={this.state.tmBug.findVer} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout4} label="缺陷类型" required={true} colon={true} className={layoutItem}>
                                <Input type="text" name="bugType" id="bugType" value={this.state.tmBug.bugType} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout4} label="严重程度" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="bugSeverity" id="bugSeverity" value={this.state.tmBug.bugSeverity} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="优先级" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="bugPriorty" id="bugPriorty" value={this.state.tmBug.bugPriorty} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="重现概率" colon={true} className={layoutItem} >
                                <Input type="text" name="bugChance" id="bugChance" value={this.state.tmBug.bugChance} disabled />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout4} label="测试阶段" colon={true} className={layoutItem} >
                                <Input type="text" name="bugStage" id="bugStage" value={this.state.tmBug.bugStage} disabled />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout2} label="用例编码" colon={true} className={layoutItem} >
                                <Input type="text" name="caseCode" id="caseCode" value={this.state.tmBug.caseCode} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="处理人" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="bugResponsible" id="bugResponsible" value={this.state.tmBug.bugResponsible} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label="缺陷描述" colon={true} className={layoutItem}>
                                {this.state.bgtext ? this.state.bgtext : ""}
                                <Input type="textarea" name="bugDesp" id="bugDesp" disabled style={{ height: '160px' }} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout4} label="关闭状态" required={true} colon={true} className={layoutItem}>
                                <Input type="text" name="isclosed" id="isclosed" value={this.state.tmBug.isclosed} disabled/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout4} label="关闭人" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="closedUser" id="closedUser" value={this.state.tmBug.closedUser} disabled />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="关闭日期" required={true} colon={true} className={layoutItem} >
                                <Input type="text" name="closedDate" id="closedDate" value={this.state.tmBug.closedDate} disabled/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout3} label="关闭描述" colon={true} className={layoutItem} >
                                <Input type="text" name="closeDesp" id="closeDesp" value={this.state.tmBug.closeDesp} disabled/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <ShowEnclosurePage ref="showEnclosure" />
            </Modal>
        );
    }
});

export default ShowDetailPage;