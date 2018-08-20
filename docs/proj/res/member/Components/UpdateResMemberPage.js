import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
import CodeMap from '../../../../hr/lib/CodeMap';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Tabs, Col, Row, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
var ResMemberStore = require('../data/ResMemberStore.js');
var ResMemberActions = require('../action/ResMemberActions');
var ProjContext = require('../../../ProjContext');

var UpdateResMemberPage = React.createClass({
    getInitialState: function () {
        return {
            resMemberSet: {
                errMsg: ''
            },
            loading: false,
            modal: false,
            resMember: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), ModalForm('resMember'), CodeMap()],
    onServiceComplete: function (data) {
        if (data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    resMemberSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'roleName', desc: '角色', required: false, max: '64' },
            { id: 'perName', desc: '姓名', required: false, max: '32' },
            { id: 'beginDate', desc: '开始日期', required: true, max: '24' },
            { id: 'resHour', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];
        this.initPage(this.props.resMember);
    },

    componentWillReceiveProps: function (newProps) {
        this.initPage(newProps.resMember);
    },

    initPage: function (resMember) {
        Utils.copyValue(resMember, this.state.resMember);

        this.setState({ loading: false, hints: {} });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onClickSave: function () {
        var member = this.state.resMember;
        if (Common.formValidator(this, member)) {
            if (member.poolUuid === member.resUuid) {
                member.resDate = member.beginDate;
            }

            this.setState({ loading: true });
            ResMemberActions.updateResMember(member);
        }
    },

    goBack: function () {
        this.props.onBack();
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
        var boo = this.state.resMember.userUuid ? false : true;
        var corpUuid = window.loginData.compUser.corpUuid;

        var obj = this.state.resMember;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
        var deptName = (obj.manType === "外协") ? obj.corpName : obj.deptName;

        // 判断能否修改入池时间
        var editAble = (obj.resStatus === '资源池' && obj.beginDate === obj.resDate);

        return (
            <div style={{ padding: "20px 0 16px 0px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['res-member/update']} />

                <Form layout={layout} style={{ width: '600px' }}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="员工编号" className={layoutItem}>
                                <Input type="text" name="staffCode" id="staffCode" value={this.state.resMember.staffCode} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="姓名" className={layoutItem}>
                                <Input type="text" name="perName" id="perName" value={this.state.resMember.perName} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任职部门" className={layoutItem}>
                                <Input type="text" name="deptName" id="deptName" value={deptName} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="归属地" className={layoutItem}>
                                <Input type="text" name="baseCity" id="baseCity" value={this.state.resMember.baseCity} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="人员类型" className={layoutItem}>
                                <Input type="text" name="manType" id="manType" value={this.state.resMember.manType} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="电话" className={layoutItem}>
                                <Input type="text" name="phoneno" id="phoneno" value={this.state.resMember.phoneno} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="最高学历" className={layoutItem}>
                                <Input type="text" name="eduDegree" id="eduDegree" value={this.state.resMember.eduDegree} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="毕业院校" className={layoutItem}>
                                <Input type="text" name="eduCollege" id="eduCollege" value={this.state.resMember.eduCollege} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="工龄" className={layoutItem}>
                                <Col span='11'>
                                    <Input type="text" name="workYears_1" id="workYears_1" value={workYears.y} addonAfter="年" onChange={this.handleOnChange2} disabled={true} />
                                </Col>
                                <Col span='2' style={{ textAlign: 'center' }}>
                                </Col>
                                <Col span='11'>
                                    <Input type="text" name="workYears_2" id="workYears_2" value={workYears.m} addonAfter="月" onChange={this.handleOnChange2} disabled={true} />
                                </Col>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="行业经验" className={layoutItem}>
                                <Col span='11'>
                                    <Input type="text" name="induYears_1" id="induYears_1" value={induYears.y} addonAfter="年" onChange={this.handleOnChange2} disabled={true} />
                                </Col>
                                <Col span='2' style={{ textAlign: 'center' }}>
                                </Col>
                                <Col span='11'>
                                    <Input type="text" name="induYears_2" id="induYears_2" value={induYears.m} addonAfter="月" onChange={this.handleOnChange2} disabled={true} />
                                </Col>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="员工级别" className={layoutItem}>
                                <Input type="text" name="empLevel" id="empLevel" value={this.getLevelName(corpUuid, this.state.resMember.empLevel)} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="技术级别" className={layoutItem}>
                                <Input type="text" name="techLevel" id="techLevel" value={this.state.resMember.techLevel} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="管理级别" className={layoutItem}>
                                <Input type="text" name="manLevel" id="manLevel" value={this.state.resMember.manLevel} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="技术岗位" className={layoutItem}>
                                <Input type="text" name="techUuid" id="techUuid" value={this.state.resMember.techName} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="管理岗位" className={layoutItem}>
                                <Input type="text" name="manUuid" id="manUuid" value={this.state.resMember.manName} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入池日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" format={Common.dateFormat} value={this.formatDate(this.state.resMember.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "beginDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="时间" required={true} colon={true} className={layoutItem} help={hints.resHourHint} validateStatus={hints.resHourStatus}>
                                <Input type="text" name="resHour" id="resHour" value={this.state.resMember.resHour} onChange={this.handleOnChange} disabled={!editAble}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="核算成本" required={false} colon={true} className={layoutItem} help={hints.userCost} validateStatus={hints.userCost} >
                        <Input type="text" name="userCost" id="userCost" value={this.state.resMember.userCost} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                        <Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
});

export default UpdateResMemberPage;

