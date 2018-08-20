import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Col, Row, DatePicker } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import CodeMap from '../../../../hr/lib/CodeMap';
import ProjCodeMap from '../../../lib/ProjCodeMap';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var ResMemberStore = require('../../../res/member/data/ResMemberStore');
var ResMemberActions = require('../../../res/member/action/ResMemberActions');
var ProjContext = require('../../../ProjContext');

var BaseInfoPage = React.createClass({
    getInitialState: function () {
        return {
            resMemberSet: {
                errMsg: ''
            },
            loading: false,
            resMember: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [ModalForm('resMember'), ProjCodeMap(), CodeMap()],

    // 第一次加载
    componentDidMount: function () {
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
        var obj = this.state.resMember;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
        var deptName = (obj.manType === "外协") ? obj.corpName : obj.deptName;
        var corpUuid = window.loginData.compUser.corpUuid;

        return (
            <div style={{ padding: "12px 0 16px 0px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['res-member/update']} />

                <Form layout={layout} style={{ width: '600px' }}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="员工编号" className={layoutItem}>
                                <Input type="text" name="staffCode" id="staffCode" value={obj.staffCode} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="姓名" className={layoutItem}>
                                <Input type="text" name="perName" id="perName" value={obj.perName} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任职部门" className={layoutItem}>
                                <Input type="text" name="deptName" id="deptName" value={deptName} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="归属地" className={layoutItem}>
                                <Input type="text" name="baseCity" id="baseCity" value={obj.baseCity} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="人员类型" className={layoutItem}>
                                <Input type="text" name="manType" id="manType" value={obj.manType} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="电话" className={layoutItem}>
                                <Input type="text" name="phoneno" id="phoneno" value={obj.phoneno} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="最高学历" className={layoutItem}>
                                <Input type="text" name="eduDegree" id="eduDegree" value={obj.eduDegree} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="毕业院校" className={layoutItem}>
                                <Input type="text" name="eduCollege" id="eduCollege" value={obj.eduCollege} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="工龄" className={layoutItem}>
                                <Col span='11'>
                                    <Input type="text" name="workYears_1" id="workYears_1" value={workYears.y} addonAfter="年" />
                                </Col>
                                <Col span='2' style={{ textAlign: 'center' }}>
                                </Col>
                                <Col span='11'>
                                    <Input type="text" name="workYears_2" id="workYears_2" value={workYears.m} addonAfter="月" />
                                </Col>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="行业经验" className={layoutItem}>
                                <Col span='11'>
                                    <Input type="text" name="induYears_1" id="induYears_1" value={induYears.y} addonAfter="年" />
                                </Col>
                                <Col span='2' style={{ textAlign: 'center' }}>
                                </Col>
                                <Col span='11'>
                                    <Input type="text" name="induYears_2" id="induYears_2" value={induYears.m} addonAfter="月" />
                                </Col>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ margin: '16px 0 0 0' }}>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="员工级别" className={layoutItem}>
                                <Input type="text" name="empLevel" id="empLevel" value={this.getLevelName(corpUuid, obj.empLevel)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="技术级别" className={layoutItem}>
                                <Input type="text" name="techLevel" id="techLevel" value={obj.techLevel} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="管理级别" className={layoutItem}>
                                <Input type="text" name="manLevel" id="manLevel" value={obj.manLevel} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="技术岗位" className={layoutItem}>
                                <Input type="text" name="techUuid" id="techUuid" value={obj.techName} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="管理岗位" className={layoutItem}>
                                <Input type="text" name="manUuid" id="manUuid" value={obj.manName} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ margin: '16px 0 0 0' }}>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="资源池" className={layoutItem}>
                                <Input type="text" name="poolUuid" id="poolUuid" value={obj.poolUuid} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="小组" className={layoutItem}>
                                <Input type="text" name="teamUuid" id="teamUuid" value={this.getResTeamName(obj.poolUuid, obj.teamUuid)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="核算成本" required={false} colon={true} className={layoutItem} help={hints.userCost} validateStatus={hints.userCost} >
                                <Input type="text" name="userCost" id="userCost" value={obj.userCost} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入池日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" format={Common.dateFormat} value={this.formatDate(obj.beginDate, Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ margin: '16px 0 0 0' }}>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="当前状态" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="resStatus" id="resStatus" value={obj.resStatus} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="项目名称" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="resName" id="resName" value={obj.resName} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="项目地址" required={false} colon={true} className={layoutItem} >
                                <Input type="text" name="resLoc" id="resLoc" value={obj.resLoc} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} >
                                <DatePicker style={{ width: '100%' }} name="resDate" id="resDate" format={Common.dateFormat} value={this.formatDate(obj.resDate, Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
});

export default BaseInfoPage;


