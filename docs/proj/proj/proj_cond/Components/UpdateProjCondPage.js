import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
import SelectProjTeam from '../../../lib/Components/SelectProjTeam';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import PreviewPage from '../../../../resume/preview/PreviewPage';
import ProjContext from '../../../ProjContext';
import CodeMap from '../../../../hr/lib/CodeMap';
import StaffProjPage from '../../../staff/query/Components/StaffProjPage';

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var ProjCondPageStore = require('../data/ProjCondPageStore');
var ProjCondPageActions = require('../action/ProjCondPageActions');

var UpdateProjCondPage = React.createClass({
    getInitialState: function () {
        return {
            condSet: {
                errMsg: ''
            },
            loading: false,
            cond: {},
            userId:'',
            member: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [ Reflux.listenTo(ProjCondPageStore, "onServiceComplete"), CodeMap(), ModalForm('cond')],
    onServiceComplete: function (data) {
        if (data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.props.onBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    condSet: data
                });
            }
        }
        else if (data.operation === 'retrieveMember') {
            if (data.errMsg === '') {
                // 成功，渲染数据
                this.setState({
                    loading: false,
                    condSet: data,
                    member: data.member,
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    condSet: data
                });
            }
        }


    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'refMemo', desc: '推荐说明', required: false, max: '64' },
            { id: 'refJob', desc: '推荐岗位', required: false, max: '64' },
            { id: 'lastDate', desc: '最后期限', required: false, max: '16' },
        ];
        this.initPage(this.props.cond);
    },

    initPage: function (cond) {
        this.state.userId = cond.userId;
        Utils.copyValue(cond, this.state.cond);
        
        this.setState({ loading: false, hints: {} });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        this.setState({ loading: true });
        ProjCondPageActions.getMember(cond.staffCode);
    },

    onClickSave: function (flag) {
        var cond = this.state.cond;
        if (Common.formValidator(this, cond)) {
            if (flag === '确认') {
                cond.provCode = window.loginData.compUser.userCode;
                cond.provName = window.loginData.authUser.perName;

                var date = new Date();
                cond.provDate = '' + Common.getToday();
                cond.provTime = date.getHours() + ':' + date.getMinutes();
            }

            this.setState({ loading: true });
            ProjCondPageActions.updateProjCond(cond);
        }
    },
    onSave: function () {
        this.onClickSave('保存');
    },
    onWaitIntv: function () {
        this.state.cond.provStatus = "待面试";
        this.onClickSave('确认');
    },
    onWaitEnter: function () {
        this.state.cond.provStatus = "待入组";
        this.onClickSave('确认');
    },
    onUnapt: function () {
        this.state.cond.provStatus = "不合适";
        this.onClickSave('确认');
    },
    onCancel: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        var prov = (this.state.cond.refName !== "项目组");

        var obj = this.state.member;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
        var corpName = (obj.corpName === null || obj.corpName === '') ? obj.deptName : obj.corpName;
      
        var btns = [];
        if (prov) {
            btns.push(
                <FormItem {...formItemLayout2} label="处理意见" required={false} colon={true} className={layoutItem} help={hints.provMemoHint} validateStatus={hints.provMemoStatus} >
                    <Input type="textarea" name="provMemo" id="provMemo" onChange={this.handleOnChange} style={{ height: '70px' }} value={this.state.cond.provMemo} />
                </FormItem>
            );

            btns.push(
                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                    <Button key="btnStatus1" type="primary" size="large" disabled={this.state.disbtn} onClick={this.onWaitIntv} loading={this.state.loading}>待面试</Button>{' '}
                    <Button key="btnStatus2" size="large" disabled={this.state.disbtn} onClick={this.onWaitEnter}>待入组</Button>{' '}
                    <Button key="btnStatus3" size="large" disabled={this.state.disbtn} onClick={this.onUnapt}>不合适</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.onCancel}>取消</Button>
                </FormItem>
            );
        }
        else {
            btns.push(
                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.onCancel}>取消</Button>
                </FormItem>
            );
        }

        var form =
            <Form layout={layout} style={{ width: '600px' }}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工编号" className={layoutItem}>
                            <Input type="text" name="staffCode" id="staffCode" value={this.state.cond.staffCode} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工姓名" className={layoutItem}>
                            <Input type="text" name="perName" id="perName" value={this.state.cond.perName} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="公司名称" className={layoutItem}>
                            <Input type="text" name="corpName" id="corpName" value={corpName} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="归属地" className={layoutItem}>
                            <Input type="text" name="baseCity" id="baseCity" value={obj.baseCity} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="最高学历" className={layoutItem}>
                            <Input type="text" name="eduDegree" id="eduDegree" value={obj.eduDegree} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="毕业院校" className={layoutItem}>
                            <Input type="text" name="eduCollege" id="eduCollege" value={obj.eduCollege} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="工龄" className={layoutItem}>
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
                        <FormItem {...formItemLayout} label="行业经验" className={layoutItem}>
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
                        <FormItem {...formItemLayout} label="员工级别" className={layoutItem}>
                            <Input type="text" name="empLevel" id="empLevel" value={this.getLevelName(obj.corpUuid, obj.empLevel)} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="技术级别" required={false} colon={true} className={layoutItem}>
                            <Input type="text" name="techLevel" id="techLevel" value={obj.techLevel} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理级别" required={false} colon={true} className={layoutItem}>
                            <Input type="text" name="manLevel" id="manLevel" value={obj.manLevel} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="技术岗位" required={false} colon={true} className={layoutItem}>
                            <Input type="text" name="techUuid" id="techUuid" value={obj.techName} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理岗位" required={false} colon={true} className={layoutItem}>
                            <Input type="text" name="manUuid" id="manUuid" value={obj.manName} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label="资源池" >
                            <Input type="text" name="poolName" id="poolName" value={this.state.cond.poolName} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label="当前状态" colon={true} className={layoutItem} >
                            <Input type="text" name="status" id="status" value={obj.resStatus} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} className={layoutItem} label="所在项目" colon={true} className={layoutItem} >
                            <Input type="text" name="resName" id="resName" value={obj.resName} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="推荐岗位" required={false} colon={true} className={layoutItem} help={hints.refJobHint} validateStatus={hints.refJobStatus}>
                            <Input type="text" name="refJob" id="refJob" value={this.state.cond.refJob} onChange={this.handleOnChange} disabled={prov} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="锁定日期" required={false} colon={true} className={layoutItem} help={hints.lastDateHint} validateStatus={hints.lastDateStatus}>
                            <DatePicker style={{ width: '100%' }} name="lastDate" id="lastDate" value={this.formatDate(this.state.cond.lastDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "lastDate", Common.dateFormat)} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>

                <FormItem {...formItemLayout2} label="推荐说明" required={false} colon={true} className={layoutItem} help={hints.refMemoHint} validateStatus={hints.refMemoStatus} >
                    <Input type="textarea" name="refMemo" id="refMemo" onChange={this.handleOnChange} style={{ height: '70px' }} value={this.state.cond.refMemo} disabled={prov} />
                </FormItem>

                {btns}
            </Form>;
        return (
            <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                </TabPane>
                <TabPane tab="基本信息" key="2" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                        <ServiceMsg ref='mxgBox' svcList={['proj_cond/update', 'res-member/retrieveMember']} />
                        {this.state.loading ? <Spin>{form}</Spin> : form}
                    </div>
                </TabPane>
                <TabPane tab="项目经历" key="3" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "24px 12px 16px 0", height: '100%', overflowY: 'auto' }}>
                        <StaffProjPage staffCode={this.state.cond.staffCode} />
                    </div>
                </TabPane>
                <TabPane tab="个人简历" key="4" style={{ width: '100%', height: '100%' }}>
                    <PreviewPage  userId={this.state.userId} />
                </TabPane>
            </Tabs>
        );
    }
});

module.exports = UpdateProjCondPage;
