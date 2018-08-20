import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col, DatePicker, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Option1 = AutoComplete.Option;
const TabPane = Tabs.TabPane;


import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio';
import AutoInput from '../../../lib/Components/AutoInput';
import EmailInput from '../../../lib/Components/EmailInput';
import RecruitSelect from '../../lib/Components/RecruitSelect';
import HrPersonSelect from '../../lib/Components/HrPersonSelect';


var ProsStaffStore = require('../../pros_staff/data/ProsStaffStore');
var ProsStaffActions = require('../../pros_staff/action/ProsStaffActions');

var WaitEmployPage = React.createClass({
    getInitialState: function () {
        return {
            prosStaffSet: {},
            loading: false,
            prosStaff: {},
            hints: {},
            validRules: [],
            result: [],
        }
    },

    mixins: [Reflux.listenTo(ProsStaffStore, "onServiceComplete"), ModalForm('prosStaff')],
    onServiceComplete: function (data) {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    prosStaffSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'perName', desc: '姓名', required: true, max: 32, },
            { id: 'idType', desc: '证件类型', max: 32, },
            { id: 'idCode', desc: '证件编号', required: true, validator: this.checkIcCode, max: 64 },
            { id: 'gender', desc: '性别', max: 32, },
            { id: 'birthDate', desc: '出生日期', max: 32, },
            { id: 'phone', desc: '电话', required: true, dataType: 'mobile', max: 32, },
            { id: 'email', desc: '电子邮箱', required: true, dataType: 'email', max: 64, },
            { id: 'address', desc: '现居地址', max: 128, },
            { id: 'household', desc: '户口城市', max: 32, },
            { id: 'eduDegree', desc: '最高学历', max: 64, },
            { id: 'eduCollege', desc: '毕业院校', max: 128, },
            { id: 'profession', desc: '专业', max: 32, },
            { id: 'workYears', desc: '工龄', max: 32, },
            { id: 'induYears', desc: '行业经验', max: 32, },
            { id: 'recruitUuid', desc: '招聘需求', max: 24, },
            { id: 'jobName', desc: '入职岗位', max: 64, },
            { id: 'baseCity', desc: '属地', max: 32, },
            { id: 'deptName', desc: '入职部门', max: 64, },
            { id: 'staffType', desc: '人员类型', max: 32, },
            { id: 'enterPay', desc: '入职薪水', max: 32, },
            { id: 'hrPerson', desc: '人力专员', max: 32, },
            { id: 'noticeTime', desc: '入职通知时间', max: 32, },
            { id: 'expectDate', desc: '预计入职日期', max: 32, },
            { id: 'interPerson', desc: '面试人', max: 32, },
            { id: 'interDate', desc: '面试日期', max: 32, },
        ];
        this.clear();
    },
     clear: function (filter) {
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.prosStaff.uuid = '';
        this.state.prosStaff.filter = filter;
        this.state.prosStaff.perName = '';
        this.state.prosStaff.idType = '';
        this.state.prosStaff.idCode = '';
        this.state.prosStaff.gender = '';
        this.state.prosStaff.birthDate = '';
        this.state.prosStaff.phone = '';
        this.state.prosStaff.email = '';
        this.state.prosStaff.address = '';
        this.state.prosStaff.household = '';
        this.state.prosStaff.eduDegree = '';
        this.state.prosStaff.eduCollege = '';
        this.state.prosStaff.profession = '';
        this.state.prosStaff.workYears = '';
        this.state.prosStaff.induYears = '';
        this.state.prosStaff.recruitUuid = '';
        this.state.prosStaff.jobName = '';
        this.state.prosStaff.baseCity = '';
        this.state.prosStaff.deptName = '';
        this.state.prosStaff.deptUuid = '';
        this.state.prosStaff.staffType = '';
        this.state.prosStaff.enterPay = '';
        this.state.prosStaff.hrPerson = '';
        this.state.prosStaff.noticeTime = '';
        this.state.prosStaff.expectDate = '';
        this.state.prosStaff.interPerson = '';
        this.state.prosStaff.interDate = '';

        this.setState({
            loading: false
        });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.prosStaff)) {
            this.setState({ loading: true });
            this.state.prosStaff.corpUuid = window.loginData.compUser.corpUuid;
            ProsStaffActions.createProsStaff(this.state.prosStaff);
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
    getDisplayValue: function (value) {
        var value1 = value;
        var value2 = '';
        if (value1 !== undefined && value1 !== null) {
            var pos = value1.indexOf('.');
            if (pos > 0) {
                value2 = value1.substr(pos + 1);
                value1 = value1.substr(0, pos);
                value2 = '' + parseInt(value2);
                value1 = '' + parseInt(value1);

                if (value2 === '0') {
                    value2 = '';
                }

                if (value1 === '0') {
                    value1 = '';
                }
            }
        }

        return { y: value1, m: value2 };
    },
    handleOnChange2: function (e) {
        var idx = 1;
        var name = e.target.id;
        var pos = name.indexOf('_');
        var t = name.substr(pos + 1);
        if (t === '2') {
            idx = 2;
        }
        name = name.substr(0, pos);

        var obj = this.state.prosStaff;
        var value1 = obj[name];
        var value2 = '0';
        pos = value1.indexOf('.');
        if (pos > 0) {
            value2 = value1.substr(pos + 1);
            value1 = value1.substr(0, pos);
        }

        if (idx === 1) {
            value1 = e.target.value;
            if (value1 === '') {
                value1 = '0';
            }
        }
        else {
            value2 = e.target.value;
            if (value2 === '') {
                value2 = '0';
            }
            if (value1 === '') {
                value1 = '0';
            }
        }

        obj[name] = value1 + '.' + value2;
        Validator.validator(this, obj, name);
        this.setState({
            loading: this.state.loading
        });
    },
    handleSearch: function (value) {
        let result;
        if (!value || value.indexOf('@') >= 0) {
            result = [];
        } else {
            result = Validator.eMailList.map(domain => `${value}@${domain}`);
        }
        this.setState({ result });
    },
    emailOnChange: function (value) {
        var obj = this.state.prosStaff;
        obj.email = value;
        Validator.validator(this, obj, 'email');
        this.setState({
            loading: this.state.loading
        });
    },
    //身份证检查
    checkIcCode: function (value, rule, page) {
        var prosStaff = this.state.prosStaff;
        if (prosStaff.idType === '身份证') {
            return Validator.checkDataType(value, 'idcard18');
        }
    },

    render: function () {
        var obj = this.state.prosStaff;
        var workYears = this.getDisplayValue(obj.workYears);
        var induYears = this.getDisplayValue(obj.induYears);
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
        let result = this.state.result;
        const children = result.map((email) => {
            return <Option1 key={email}>{email}</Option1>;
        });

        var hints = this.state.hints;
        if (this.state.prosStaff.idType === '身份证' && (hints.idCodeStatus === '' || JSON.stringify(hints) !== '{}')) {
            this.state.prosStaff.birthDate = this.state.prosStaff.idCode.substring(6, 14);
            if (this.state.prosStaff.idCode.substr(16, 1) % 2 == 0) {
                this.state.prosStaff.gender = 'woman';
            } else {
                this.state.prosStaff.gender = 'man';
            }
        }
        if (this.state.prosStaff.recruitUuid) {
            if (this.refs.recruitUuid.state.recruitSet.recordSet) {
                var recruitArr = {};
                this.refs.recruitUuid.state.recruitSet.recordSet.map((data, i) => {
                    if (data.uuid === this.state.prosStaff.recruitUuid) {
                        return recruitArr = data;
                    }
                })
                if (JSON.stringify(recruitArr) !== '{}') {
                    this.state.prosStaff.jobName = recruitArr.jobCode;
                    this.state.prosStaff.jobLevel = recruitArr.jobLevel;
                    this.state.prosStaff.baseCity = recruitArr.jobCity;
                    this.state.prosStaff.deptName = recruitArr.applyDept;
                    this.state.prosStaff.staffType = recruitArr.personType;
                    this.state.prosStaff.hrPerson = recruitArr.hrPerson;
                }
            }
        }
        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="增加待入职人员" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['pros-staff/update']} />
                            <Form layout={layout} style={{ width: '660px' }}>
                                <FormItem {...formItemLayout} className={layoutItem} label='姓名' required={true} colon={true} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input style={{ width: '40%' }} type='text' name='perName' id='perName' value={this.state.prosStaff.perName} onChange={this.handleOnChange} />
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='证件类型' required={true} colon={true} help={hints.idTypeHint} validateStatus={hints.idTypeStatus}>
                                            <DictSelect name="idType" id="idType" value={this.state.prosStaff.idType} appName='简历系统' optName='证件类型' onSelect={this.handleOnSelected.bind(this, "idType")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='证件编号' required={true} colon={true} help={hints.idCodeHint} validateStatus={hints.idCodeStatus}>
                                            <Input type='text' name='idCode' id='idCode' value={this.state.prosStaff.idCode} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='性别' colon={true} help={hints.genderHint} validateStatus={hints.genderStatus}>
                                            <DictRadio name="gender" id="gender" value={this.state.prosStaff.gender} appName='简历系统' optName='性别' onChange={this.onRadioChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='出生日期' colon={true} help={hints.birthDateHint} validateStatus={hints.birthDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="birthDate" id="birthDate" value={this.formatDate(this.state.prosStaff.birthDate, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "birthDate", Validator.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='电话' colon={true} required={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                                            <Input type='text' name='phone' id='phone' value={this.state.prosStaff.phone} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='电子邮箱' colon={true} required={true} help={hints.emailHint} validateStatus={hints.emailStatus}>
                                            <EmailInput name="email" id="email" value={this.state.prosStaff.email} onChange={this.emailOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='现居城市' colon={true} help={hints.addressHint} validateStatus={hints.addressStatus}>
                                            <AutoInput name='address' id='address' paramName='城市' value={this.state.prosStaff.address} onChange={this.handleOnSelected.bind(this, "address")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='户口城市' colon={true} help={hints.householdHint} validateStatus={hints.householdStatus}>
                                            <Input type='text' name='household' id='household' value={this.state.prosStaff.household} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} className={layoutItem} label='最高学历' colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                                    <DictSelect style={{ width: '40%' }} name="eduDegree" id="eduDegree" value={this.state.prosStaff.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")} />
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='毕业院校' colon={true} help={hints.eduCollegeHint} validateStatus={hints.eduCollegeStatus}>
                                            <Input type='text' name='eduCollege' id='eduCollege' value={this.state.prosStaff.eduCollege} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='专业' colon={true} help={hints.professionHint} validateStatus={hints.professionStatus}>
                                            <Input type='text' name='profession' id='profession' value={this.state.prosStaff.profession} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='工龄' colon={true} help={hints.workYearsHint} validateStatus={hints.workYearsStatus}>
                                            <Col span='11'>
                                                <Input.Group compact>
                                                    <Input style={{ width: '70%' }} type="text" name="workYears_1" id="workYears_1" value={workYears.y} onChange={this.handleOnChange2} />
                                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="年" readOnly={true} />
                                                </Input.Group>
                                            </Col>
                                            <Col span='2'>
                                            </Col>
                                            <Col span='11'>
                                                <Input.Group compact>
                                                    <Input style={{ width: '70%' }} type="text" name="workYears_2" id="workYears_2" value={workYears.m} onChange={this.handleOnChange2} />
                                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="月" readOnly={true} />
                                                </Input.Group>
                                            </Col>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='行业经验' colon={true} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                                            <Col span='11'>
                                                <Input.Group compact>
                                                    <Input style={{ width: '70%' }} type="text" name="induYears_1" id="induYears_1" value={induYears.y} onChange={this.handleOnChange2} />
                                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="年" readOnly={true} />
                                                </Input.Group>
                                            </Col>
                                            <Col span='2'>
                                            </Col>
                                            <Col span='11'>
                                                <Input.Group compact>
                                                    <Input style={{ width: '70%' }} type="text" name="induYears_2" id="induYears_2" value={induYears.m} onChange={this.handleOnChange2} />
                                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="月" readOnly={true} />
                                                </Input.Group>
                                            </Col>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='招聘需求' colon={true} help={hints.recruitUuidHint} validateStatus={hints.recruitUuidStatus}>
                                            <RecruitSelect ref="recruitUuid" name="recruitUuid" id="recruitUuid" value={this.state.prosStaff.recruitUuid} onSelect={this.handleOnSelected.bind(this, "recruitUuid")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='入职岗位' colon={true} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
                                            <Input type='text' name='jobName' id='jobName' value={this.state.prosStaff.jobName} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='属地' colon={true} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                            <Input type='text' name='baseCity' id='baseCity' value={this.state.prosStaff.baseCity} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='入职部门' colon={true} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                                            <Input type='text' name='deptName' id='deptName' value={this.state.prosStaff.deptName} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='人员类型' colon={true} help={hints.staffTypeHint} validateStatus={hints.staffTypeStatus}>
                                            <DictSelect name="staffType" id="staffType" value={this.state.prosStaff.staffType} appName='招聘管理' optName='招聘人员类型' onSelect={this.handleOnSelected.bind(this, "staffType")} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='入职薪水' colon={true} help={hints.enterPayHint} validateStatus={hints.enterPayStatus}>
                                            <Input type='text' name='enterPay' id='enterPay' value={this.state.prosStaff.enterPay} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} className={layoutItem} label='人力专员' colon={true} help={hints.hrPersonHint} validateStatus={hints.hrPersonStatus}>
                                    <HrPersonSelect style={{ width: '40%' }} ref="hrPerson" name="hrPerson" id="hrPerson" value={this.state.prosStaff.hrPerson} onSelect={this.handleOnSelected.bind(this, "hrPerson")} />
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='入职通知时间' colon={true} help={hints.noticeTimeHint} validateStatus={hints.noticeTimeStatus}>
                                            <DatePicker style={{ width: '100%' }} name="noticeTime" id="noticeTime" value={this.formatDate(this.state.prosStaff.noticeTime, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "noticeTime", Validator.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='预计入职日期' colon={true} help={hints.expectDateHint} validateStatus={hints.expectDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="expectDate" id="expectDate" value={this.formatDate(this.state.prosStaff.expectDate, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "expectDate", Validator.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='面试人' colon={true} help={hints.interPersonHint} validateStatus={hints.interPersonStatus}>
                                            <Input type='text' name='interPerson' id='interPerson' value={this.state.prosStaff.interPerson} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='面试日期' colon={true} help={hints.interDateHint} validateStatus={hints.interDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="interDate" id="interDate" value={this.formatDate(this.state.prosStaff.interDate, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "interDate", Validator.dateFormat)} />
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
                </Tabs>
            </div>
        );
    }
});
module.exports = WaitEmployPage;
