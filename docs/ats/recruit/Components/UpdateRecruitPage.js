import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col, DatePicker, AutoComplete } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import AutoInput from '../../../lib/Components/AutoInput';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var RecruitStore = require('../data/RecruitStore.js');
var RecruitActions = require('../action/RecruitActions');

import PerformLogPage from './PerformLogPage';
import HrPersonSelect from '../../lib/Components/HrPersonSelect';

import StdJobSelect from '../../lib/Components/StdJobSelect';
import TestQuestSelect from '../../lib/Components/TestQuestSelect';
import AtsCodeMap from '../../lib/AtsCodeMap';

const induYearList = ['0', '1', '2', '3', '4', '5', '6'];

var UpdateRecruitPage = React.createClass({
    getInitialState: function () {
        return {
            recruitSet: {},
            loading: false,
            recruit: {},
            hints: {},
            validRules: [],
            category: '',
        }
    },

    mixins: [Reflux.listenTo(RecruitStore, "onServiceComplete"), ModalForm('recruit'),AtsCodeMap()],
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
                    recruitSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'jobName', desc: '岗位名称', max: 64, required: true, },
            { id: 'category', desc: '岗位类别', max: 64, required: true },
            { id: 'jobCode', desc: '岗位代码', max: 64, required: false, },
            { id: 'reasons', desc: '招聘原因', max: 24, required: true, },
            { id: 'applyCount', desc: '需求人数', max: 24, required: true, },
            { id: 'deadDate', desc: '最晚到岗时间', max: 24, required: true, },
            { id: 'jobCity', desc: '工作城市', max: 64, required: true, },
            { id: 'jobAddress', desc: '工作地点', max: 64, required: false, },
            { id: 'jobNature', desc: '工作性质', max: 64, required: false, },
            { id: 'eduDegree', desc: '最低学历', max: 64, required: false, },
            { id: 'induYears', desc: '工作经验', max: 32, required: false, },
            { id: 'outJob', desc: '出差要求', max: 64, required: false, },
            { id: 'personType', desc: '人员类型', max: 24, required: false, },
            { id: 'jobSalary', desc: '薪资范围', max: 64, required: false, },
            { id: 'induType', desc: '行业类型', max: 64, required: false, },
            { id: 'jobDesc', desc: '岗位职责', max: 64, required: true, },
            { id: 'jobRequire', desc: '岗位要求', max: 32, required: true, },
            { id: 'applyDept', desc: '申请部门', max: 64, required: false, },
            { id: 'applyName', desc: '需求提出人', max: 64, required: false, },
            { id: 'interviewer', desc: '面试官', max: 64, required: false, },
            { id: 'writeQuest', desc: '笔试题', max: 64, required: false, },
            { id: 'applyDate', desc: '申请日期', max: 24, required: false, },
            { id: 'hrPerson', desc: '人力专员', max: 24, required: false, },
            { id: 'priority', desc: '优先级', max: 24, required: false, },
            { id: 'applyCode', desc: '申请单编号', max: 64, required: false, },
            { id: 'status', desc: '状态', max: 24, required: false, },
            { id: 'delivChannel', desc: '投放渠道', max: 24, required: false, },
            { id: 'delivDate', desc: '投放日期', max: 24, required: false, },
        ];
        this.initPage(this.props.recruit);
    },

    initPage: function (recruit) {
        this.state.hints = {};
        Utils.copyValue(recruit, this.state.recruit);

        this.setState({
            loading: false
        });

        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.recruit)) {
            this.setState({ loading: true });
            RecruitActions.updateRecruit(this.state.recruit);
        }
    },

    goBack: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    OnHandleCategoryChange : function(value) {
        this.state.category = value;
        var category = this.state.category;
    },

    handleOnSelected1: function (id, value) {
        var recruit = this.state.recruit;
        recruit[id] = value;
        this.setState({
            recruit: recruit
        });

        var category = this.state.category;
        var stdJobArr = this.refs.createWindow.handleJobCodeChange(value,category);
        var recruit = this.state.recruit;
        recruit.eduDegree = stdJobArr.eduDegree;
        recruit.induYears = stdJobArr.induYears;
        recruit.jobLevel = stdJobArr.jobLevel;
        recruit.jobDesc = stdJobArr.jobDesc;
        recruit.jobRequire = stdJobArr.jobRequire;
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
        var corpUuid = window.loginData.compUser.corpUuid;
        this.state.recruit.jobCode = this.getJobCodeName(corpUuid, this.state.recruit.jobCode);
        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="招聘申请单" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['recruit/update']} />
                            <Form layout={layout} style={{ width: '660px' }}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位名称' required={true} colon={true} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
                                            <Input type='text' name='jobName' id='jobName' value={this.state.recruit.jobName} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位类别' required={true} colon={true} help={hints.categoryHint} validateStatus={hints.categoryStatus}>
                                            <DictSelect name='category' id='category' appName='招聘管理' optName='岗位类别' value={this.state.recruit.category} onSelect={this.handleOnSelected.bind(this, 'category')} onChange={this.OnHandleCategoryChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位代码' colon={true} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
                                            <StdJobSelect ref="jobCode" name="jobCode" id="jobCode" value={this.state.recruit.jobCode} onSelect={this.handleOnSelected1.bind(this, "jobCode")} ref="createWindow" category={this.state.recruit.category} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='招聘原因' required={true} colon={true} help={hints.reasonsHint} validateStatus={hints.reasonsStatus}>
                                            <DictSelect name="reasons" id="reasons" value={this.state.recruit.reasons} appName='招聘管理' optName='招聘原因' onSelect={this.handleOnSelected.bind(this, "reasons")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='需求人数' required={true} colon={true} help={hints.applyCountHint} validateStatus={hints.applyCountStatus}>
                                            <Input type='text' name='applyCount' id='applyCount' value={this.state.recruit.applyCount} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='到岗日期' required={true} colon={true} help={hints.deadDateHint} validateStatus={hints.deadDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="deadDate" id="deadDate" format={Common.dateFormat} value={this.formatDate(this.state.recruit.deadDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "deadDate", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='城市' required={true} colon={true} help={hints.jobCityHint} validateStatus={hints.jobCityStatus}>
                                            <AutoInput name='jobCity' id='jobCity' paramName='城市' value={this.state.recruit.jobCity} onChange={this.handleOnSelected.bind(this, "jobCity")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem {...formItemLayout} className={layoutItem} label='工作地址' required={false} colon={true} help={hints.jobAddressHint} validateStatus={hints.jobAddressStatus}>
                                            <Input type='text' name='jobAddress' id='jobAddress' value={this.state.recruit.jobAddress} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='工作性质' colon={true} help={hints.jobNatureHint} validateStatus={hints.jobNatureStatus}>
                                            <DictRadio name="jobNature" id="jobNature" value={this.state.recruit.jobNature} appName='招聘管理' optName='工作性质' onChange={this.onRadioChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='最低学历' colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                                            <DictSelect type='text' name='eduDegree' id='eduDegree' value={this.state.recruit.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='工作经验' colon={true} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                                            <InputGroup compact>
                                                <AutoComplete style={{ width: '80%' }} name="induYears" id="induYears" value={this.state.recruit.induYears} onChange={this.handleOnSelected.bind(this, "induYears")}
                                                    dataSource={induYearList}
                                                    filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1}
                                                />
                                                <Input style={{ width: '20%', textAlign: 'center' }} defaultValue="年" readOnly={true} />
                                            </InputGroup>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='出差要求' colon={true} help={hints.outJobHint} validateStatus={hints.outJobStatus}>
                                            <DictSelect name="outJob" id="outJob" value={this.state.recruit.outJob} appName='招聘管理' optName='出差要求' onSelect={this.handleOnSelected.bind(this, "outJob")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='人员类型' colon={true} help={hints.personTypeHint} validateStatus={hints.personTypeStatus}>
                                            <DictSelect name="personType" id="personType" value={this.state.recruit.personType} appName='招聘管理' optName='招聘人员类型' onSelect={this.handleOnSelected.bind(this, "personType")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='薪资范围' colon={true} help={hints.jobSalaryHint} validateStatus={hints.jobSalaryStatus}>
                                            <Input type='text' name='jobSalary' id='jobSalary' value={this.state.recruit.jobSalary} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <FormItem {...formItemLayout} className={layoutItem} label='行业类型' colon={true} help={hints.induTypeHint} validateStatus={hints.induTypeStatus}>
                                        <DictSelect mode="multiple" name="induType" id="induType" value={this.state.recruit.induType} appName='招聘管理' optName='行业类型' onSelect={this.handleOnSelected.bind(this, "induType")} />
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem {...formItemLayout} className={layoutItem} label='岗位职责' required={true} colon={true} help={hints.jobDescHint} validateStatus={hints.jobDescStatus}>
                                        <Input type='textarea' name='jobDesc' id='jobDesc' value={this.state.recruit.jobDesc} onChange={this.handleOnChange} style={{ height: '140px' }} />
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem {...formItemLayout} className={layoutItem} label='岗位要求' required={true} colon={true} help={hints.jobRequireHint} validateStatus={hints.jobRequireStatus}>
                                        <Input type='textarea' name='jobRequire' id='jobRequire' value={this.state.recruit.jobRequire} onChange={this.handleOnChange} style={{ height: '140px' }} />
                                    </FormItem>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='申请部门' colon={true} help={hints.applyDeptHint} validateStatus={hints.applyDeptStatus}>
                                            <Input type='text' name='applyDept' id='applyDept' value={this.state.recruit.applyDept} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='申请人' colon={true} help={hints.applyNameHint} validateStatus={hints.applyNameStatus}>
                                            <Input type='text' name='applyName' id='applyName' value={this.state.recruit.applyName} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='面试官' colon={true} help={hints.interviewerHint} validateStatus={hints.interviewerStatus}>
                                            <Input type='text' name='interviewer' id='interviewer' value={this.state.recruit.interviewer} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='面试题' colon={true} help={hints.writeQuestHint} validateStatus={hints.writeQuestStatus}>
                                            <TestQuestSelect ref="writeQuest" name="writeQuest" id="writeQuest" value={this.state.recruit.writeQuest} onSelect={this.handleOnSelected.bind(this, "writeQuest")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                    <TabPane tab="补充信息" key="3" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <Form layout={layout} style={{ width: '600px' }}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位名称' required={true} colon={true} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
                                            <Input type='text' name='jobName' id='jobName' value={this.state.recruit.jobName} onChange={this.handleOnChange} readOnly={true}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位代码' colon={true} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
                                            <Input type='text' name='jobCode' id='jobCode' value={this.state.recruit.jobCode} onChange={this.handleOnChange} readOnly={true}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位类别' required={true} colon={true} help={hints.categoryHint} validateStatus={hints.categoryStatus}>
                                            <Input type='text' name='category' id='category' value={this.state.recruit.category} onChange={this.handleOnChange} readOnly={true} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='岗位级别' colon={true} help={hints.jobLevelHint} validateStatus={hints.jobLevelStatus}>
                                            <Input type='text' name='jobLevel' id='jobLevel' value={this.state.recruit.jobLevel} onChange={this.handleOnChange} readOnly={true} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row style={{ padding: '16px 0 0 0' }}>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='人力专员' colon={true} help={hints.hrPersonHint} validateStatus={hints.hrPersonStatus}>
                                            <HrPersonSelect ref="hrPerson" name="hrPerson" id="hrPerson" value={this.state.recruit.hrPerson} onSelect={this.handleOnSelected.bind(this, "hrPerson")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='优先级' colon={true} help={hints.priorityHint} validateStatus={hints.priorityStatus}>
                                            <DictSelect name="priority" id="priority" value={this.state.recruit.priority} appName='招聘管理' optName='招聘优先级' onSelect={this.handleOnSelected.bind(this, "priority")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='投放渠道' colon={true} help={hints.delivChannelHint} validateStatus={hints.delivChannelStatus}>
                                            <Input type='text' name='delivChannel' id='delivChannel' value={this.state.recruit.delivChannel} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='投放日期' colon={true} help={hints.delivDateHint} validateStatus={hints.delivDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="delivDate" id="delivDate" format={Common.dateFormat} value={this.formatDate(this.state.recruit.delivDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "delivDate", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='申请单编号' colon={true} help={hints.applyCodeHint} validateStatus={hints.applyCodeStatus}>
                                            <Input type='text' name='applyCode' id='applyCode' value={this.state.recruit.applyCode} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='状态' colon={true} help={hints.statusHint} validateStatus={hints.statusStatus}>
                                            <DictSelect name="status" id="status" value={this.state.recruit.status} appName='招聘管理' optName='招聘需求状态' onSelect={this.handleOnSelected.bind(this, "status")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                    <TabPane tab="执行情况" key="4" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "8px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <PerformLogPage uuid={this.state.recruit.uuid} />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default UpdateRecruitPage;