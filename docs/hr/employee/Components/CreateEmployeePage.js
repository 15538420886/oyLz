import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, DatePicker, Row, Col, AutoComplete, Tabs, Icon } from 'antd';
const FormItem = Form.Item;
const Option = AutoComplete.Option;
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;

import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio';
import AutoInput from '../../../lib/Components/AutoInput';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import QuickFill from '../../../lib/Components/QuickFill';

import EmpJobPage from './EmpJobPage';
var EmployeeStore = require('../data/EmployeeStore.js');
var EmployeeActions = require('../action/EmployeeActions');
import SearchStaffCodePage from './SearchStaffCodePage';

var CreateEmployeePage = React.createClass({
    getInitialState: function () {
        return {
            afterChange: this.afterChange,
            employeeSet: {
                errMsg: ''
            },
            loading: false,
            employee: {},
            hints: {},
            validRules: [],
            result: []
        }
    },

    mixins: [Reflux.listenTo(EmployeeStore, "onServiceComplete"), ModalForm('employee')],
    onServiceComplete: function (data) {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                var job = this.refs.jobPage.state.empJob;

                // 成功，关闭窗口
                this.goBack();

                // 下一步，创建用户
                var nextFunc = this.props.funcCreateUser;
                if (nextFunc !== null && nextFunc !== undefined) {
                    var user = null;
                    var staffCode = this.state.employee.staffCode;

                    var len = data.recordSet.length;
                    for (var i = 0; i < len; i++) {
                        var u = data.recordSet[i];
                        if (u.staffCode == staffCode) {
                            user = u;
                            break;
                        }
                    }

                    if (user !== null) {
                        nextFunc(user, job);
                    }
                }
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    employeeSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'idType', desc: '证件类型', required: true, max: '32' },
            { id: 'idCode', desc: '证件编号', required: true, validator: this.checkIcCode, max: '64' },
            { id: 'gender', desc: '性别', required: false, max: '32' },
            { id: 'birthDate', desc: '出生日期', required: false, max: '32' },
            { id: 'perName', desc: '姓名', required: true, max: '32' },
            { id: 'staffCode', desc: '员工编号', required: true, max: '64' },
            { id: 'jobTitle', desc: '职位', required: false, max: '64' },
            { id: 'entryDate', desc: '入职时间', required: true, max: '24' },
            { id: 'phoneno', desc: '电话', required: true, dataType: 'mobile', max: '32' },
            { id: 'email', desc: '电子邮箱', required: true, dataType: 'email', max: '64' },
            { id: 'household', desc: '户口城市', required: false, max: '32' },
            { id: 'eduCollege', desc: '毕业院校', required: false, max: '128' },
            { id: 'eduDegree', desc: '最高学历', required: false, max: '64' },
            { id: 'profession', desc: '专业', required: false, max: '32' },
            { id: 'gradDate', desc: '毕业日期', required: false, max: '32' },
            { id: 'diplomaId', desc: '证书编号', required: false, max: '32' },
            { id: 'workYears', desc: '工作年限', required: false, max: '32' },
            { id: 'induYears', desc: '行业经验', required: false, max: '32' },
            { id: 'baseCity', desc: '归属地', required: false, max: '32' },
            { id: 'status', desc: '状态', required: false, max: '10' },
        ];

        this.clear(this.props.dept);
    },

    handleKeyDown: function (e) {
        if (73 == e.keyCode && e.ctrlKey && e.altKey) {
            var w = this.refs.QuickFillWindow;
            if (w) {
                w.initPage(this.state.validRules);
                w.toggle();
            }
        }
    },

    checkIcCode: function (value, rule, page) {
        var emp = this.state.employee;
        if (emp.idType === '身份证') {
            return Validator.checkDataType(value, 'idcard18');
        }
    },

    clear: function (dept) {
        window.addEventListener('keydown', this.handleKeyDown);

        this.state.hints = {};
        this.state.employee.eduDegree = '';
        this.state.employee.eduCollege = '';
        this.state.employee.workYears = '';
        this.state.employee.induYears = '';
        this.state.employee.idType = '';
        this.state.employee.idCode = '';
        this.state.employee.perName = '';
        this.state.employee.staffCode = '';
        this.state.employee.jobTitle = '';
        this.state.employee.phoneno = '';
        this.state.employee.email = '';
        this.state.employee.baseCity = '';
        this.state.employee.entryDate = '';
        this.state.employee.status = '2';
        this.state.employee.deptUuid = dept.uuid;
        this.state.employee.deptName = dept.deptName
        this.state.employee.corpUuid = dept.corpUuid;

        if (this.refs.jobPage !== undefined) {
            this.refs.jobPage.clear();
        }

        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }

        this.setState({ loading: false });
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

        var obj = this.state.employee;
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
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.goBack();
        }
    },
    goBack: function () {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.props.onBack();
    },
    afterChange: function (id, value) {
        if (id === 'idCode') {
            if (this.state.employee.idType === '身份证' && value.length === 18) {
                var birth = value.substr(6, 8);
                var flag = value.substr(16, 1);
                this.state.employee.birthDate = birth;
                this.state.employee.gender = (flag % 2 == 0) ? 'woman' : 'man';
            }
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.employee) && this.refs.jobPage.checkValue()) {
            var employee = this.state.employee;

            this.refs.jobPage.fun();
            var empJob = this.refs.jobPage.state.empJob;
            empJob.uuid = '';
            empJob.userUuid = '';
            empJob.corpUuid = employee.corpUuid;
            empJob.staffCode = employee.staffCode;
            empJob.perName = employee.perName;
            empJob.deptName = employee.deptName;
            empJob.approver = '';
            empJob.effectDate = employee.entryDate;
            empJob.chgReason = '入职';

            var obj = { os: employee, oj: empJob };
            this.setState({ loading: true });
            EmployeeActions.createHrEmployee(obj);
        }
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
        var obj = this.state.employee;
        obj.email = value;
        Validator.validator(this, obj, 'email');
        this.setState({
            loading: this.state.loading
        });
    },
    onSearchCode: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
		this.refs.codePage.initStaff(corpUuid);
		this.refs.codePage.toggle();
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout_0 = {
            labelCol: ((layout == 'vertical') ? null : { span: 5 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 19 }),
        };
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 7 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 17 }),
        };

        let result = this.state.result;
        const children = result.map((email) => {
            return <Option key={email}>{email}</Option>;
        });

        var obj = this.state.employee;
        var workYears = this.getDisplayValue(obj.workYears);
        var induYears = this.getDisplayValue(obj.induYears);

        var hints = this.state.hints;
        var form = (
            <Form layout={layout}>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="证件类型" required={true} colon={true} className={layoutItem} help={hints.idTypeHint} validateStatus={hints.idTypeStatus}>
                            <DictSelect name="idType" id="idType" value={this.state.employee.idType} appName='简历系统' optName='证件类型' onSelect={this.handleOnSelected.bind(this, "idType")} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="证件编号" required={true} colon={true} className={layoutItem} help={hints.idCodeHint} validateStatus={hints.idCodeStatus}>
                            <Input type="text" name="idCode" id="idCode" value={this.state.employee.idCode} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                            <Input type="text" name="perName" id="perName" value={this.state.employee.perName} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="员工编号" required={true} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                            <Input type="text" name="staffCode" id="staffCode" value={this.state.employee.staffCode} onChange={this.handleOnChange} addonAfter={<Icon type="search" onClick={this.onSearchCode} />}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="性别" required={false} colon={true} className={layoutItem} help={hints.genderHint} validateStatus={hints.genderStatus}>
                            <DictRadio name="gender" id="gender" value={this.state.employee.gender} appName='简历系统' optName='性别' onChange={this.onRadioChange} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="出生日期" required={false} colon={true} className={layoutItem} help={hints.birthDateHint} validateStatus={hints.birthDateStatus}>
                            <DatePicker style={{ width: '100%' }} name="birthDate" id="birthDate" value={this.formatDate(this.state.employee.birthDate, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "birthDate", Validator.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="职位" required={false} colon={true} className={layoutItem} help={hints.jobTitleHint} validateStatus={hints.jobTitleStatus}>
                            <Input type="text" name="jobTitle" id="jobTitle" value={this.state.employee.jobTitle} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="入职时间" required={true} colon={true} className={layoutItem} help={hints.entryDateHint} validateStatus={hints.entryDateStatus}>
                            <DatePicker style={{ width: '100%' }} name="entryDate" id="entryDate" value={this.formatDate(this.state.employee.entryDate, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "entryDate", Validator.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="电话" required={true} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
                            <Input type="text" name="phoneno" id="phoneno" value={this.state.employee.phoneno} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="电子邮箱" required={true} colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
                            <AutoComplete name="email" id="email" value={this.state.employee.email} onSearch={this.handleSearch} placeholder="请输入电子邮箱" onChange={this.emailOnChange} >
                                {children}
                            </AutoComplete>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="户口城市" required={false} colon={true} className={layoutItem} help={hints.householdHint} validateStatus={hints.householdStatus}>
                            <Input type="text" name="household" id="household" value={this.state.employee.household} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="毕业院校" required={false} colon={true} className={layoutItem} help={hints.eduCollegeHint} validateStatus={hints.eduCollegeStatus}>
                            <Input type="text" name="eduCollege" id="eduCollege" value={this.state.employee.eduCollege} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="最高学历" required={true} colon={true} className={layoutItem} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                            <DictSelect name="eduDegree" id="eduDegree" value={this.state.employee.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="专业" required={false} colon={true} className={layoutItem} help={hints.professionHint} validateStatus={hints.professionStatus}>
                            <AutoInput name='profession' id='profession' paramName='专业' value={this.state.employee.profession} onChange={this.handleOnSelected.bind(this, "profession")} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="毕业日期" required={true} colon={true} className={layoutItem} help={hints.gradDateHint} validateStatus={hints.gradDateStatus}>
                            <DatePicker style={{ width: '100%' }} name="gradDate" id="gradDate" value={this.formatDate(this.state.employee.gradDate, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this, "gradDate", Validator.dateFormat)} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="证书编号" required={false} colon={true} className={layoutItem} help={hints.diplomaIdHint} validateStatus={hints.diplomaIdStatus}>
                            <Input type="text" name="diplomaId" id="diplomaId" value={this.state.employee.diplomaId} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="工作年限" required={true} colon={true} className={layoutItem} help={hints.workYearsHint} validateStatus={hints.workYearsStatus}>
                            <Col span='11'>
                                <InputGroup compact>
                                    <Input style={{ width: '70%' }} type="text" name="workYears_1" id="workYears_1" value={workYears.y} onChange={this.handleOnChange2} />
                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="年" readOnly={true} />
                                </InputGroup>
                            </Col>
                            <Col span='2'>
                            </Col>
                            <Col span='11'>
                                <InputGroup compact>
                                    <Input style={{ width: '70%' }} type="text" name="workYears_2" id="workYears_2" value={workYears.m} onChange={this.handleOnChange2} />
                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="月" readOnly={true} />
                                </InputGroup>
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="行业经验" required={false} colon={true} className={layoutItem} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                            <Col span='11'>
                                <InputGroup compact>
                                    <Input style={{ width: '70%' }} type="text" name="induYears_1" id="induYears_1" value={induYears.y} onChange={this.handleOnChange2} />
                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="年" readOnly={true} />
                                </InputGroup>
                            </Col>
                            <Col span='2'>
                            </Col>
                            <Col span='11'>
                                <InputGroup compact>
                                    <Input style={{ width: '70%' }} type="text" name="induYears_2" id="induYears_2" value={induYears.m} onChange={this.handleOnChange2} />
                                    <Input style={{ width: '30%', textAlign: 'center' }} defaultValue="月" readOnly={true} />
                                </InputGroup>
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem {...formItemLayout_0} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                            <AutoInput name='baseCity' id='baseCity' paramName='城市' value={this.state.employee.baseCity} onChange={this.handleOnSelected.bind(this, "baseCity")} />
                        </FormItem>
                    </Col>
                    <Col span="13">
                        <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.statusHint} validateStatus={hints.statusStatus}>
                            <DictRadio name="status" id="status" value={this.state.employee.status} appName='HR系统' optName='员工状态' onChange={this.onRadioChange} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}></TabPane>
                    <TabPane tab="增加员工#" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "16px 0 16px 8px", height: '100%', width: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['hr-employee/create']} />
                            <div style={{ width: '100%', maxWidth: '740px', margin: '12px 0 0 24px' }}>
                                {form}
                                <EmpJobPage ref='jobPage' />
                                <SearchStaffCodePage ref='codePage' />

                                <Form layout={layout}>
                                    <FormItem style={{ textAlign: 'right', padding: '4px 0' }} required={false} colon={true} className={layoutItem}>
                                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                        <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                    </FormItem>
                                </Form>
                                <QuickFill ref='QuickFillWindow' self={this} object='employee' />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default CreateEmployeePage;
