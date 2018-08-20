import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import Context from '../../resumeContext';
import DictSelect from '../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Spin, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Option1 = AutoComplete.Option;

var QueryStore = require('../data/QueryStore');
var QueryActions = require('../action/QueryActions');

var ResumeActions = require('../../resume/action/ResumeActions');

var CreateQueryPage = React.createClass({
    getInitialState: function () {
        return {
            personSet: {
                employee: {},
                operation: '',
                errMsg: ''
            },
            disabled: false,
            loading: false,
            employeeLoading: false,
            modal: false,
            person: {},
            hints: {},
            validRules: [],
            result: []
        }
    },

    mixins: [Reflux.listenTo(QueryStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
                ResumeActions.getResumeByIdCode(data.recordSet[0].idCode);

            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    personSet: data
                });
            }
        } else if (this.state.modal && data.operation === 'retrieveEmployee') {
            if (data.employee.length === 1) {
                this.state.person.idType = data.employee[0].idType;
                this.state.person.idData1 = data.employee[0].idCode;
                this.state.disabled = true;
            } else {
                this.state.disabled = false;
            }
            this.setState({
                employeeLoading: false,
                personSet: data
            });

        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'peName', desc: '姓名', required: true, max: 24 },
            { id: 'passwd', desc: '访问密码', required: true, max: 84 },
            { id: 'idData1', desc: '证件号码', required: true, max: 84 },
            { id: 'email', desc: '电子邮箱', required: true, dataType: 'email', max: 24 },
            { id: 'phoneNo', desc: '电话', required: true, dataType: 'mobile', max: 84 }
        ];
    },

    clear: function (staffCode) {
        this.state.hints = {};
        this.state.person.id = '';
        this.state.person.peName = '';
        this.state.person.passwd = '';
        this.state.person.idData1 = '';
        this.state.person.email = '';
        this.state.person.phoneNo = '';
        this.state.person.idType = 'id';
        this.state.loading = false;
        this.state.personSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        if (staffCode) {
            var filter = {};
            filter.staffCode = staffCode;
            filter.corpUuid = window.loginData.compUser.corpUuid;
            QueryActions.retrieveHrEmployee(filter);
        }
    },

    handleOnChange: function (e) {
        var person = this.state.person;
        person[e.target.id] = e.target.value;
        Validator.validator(this, person, e.target.id);
        this.setState({
            person: person
        });
    },

    onClickSave: function () {
        if (Validator.validator(this, this.state.person)) {
            this.state.personSet.operation = '';
            this.setState({ loading: true });
            QueryActions.createResPerson(this.state.person);
        }
        else {
            this.setState({
                hint: this.state.hint
            });
        }
    },
    handleOnSelected: function (id, value) {
        console.log(id)
        var person = this.state.person;
        person[id] = value;
        Validator.validator(this, person, id);
        this.setState({
            person: person
        });
    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
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
        var obj = this.state.person;
        obj.email = value;
        Validator.validator(this, obj, 'email');
        this.setState({
            loading: this.state.loading
        });
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        let result = this.state.result;
        const children = result.map((email) => {
            return <Option1 key={email}>{email}</Option1>;
        });

        var hints = this.state.hints;
        var form =
            <Form layout={layout}>
                <FormItem {...formItemLayout} label="姓名" colon={true} required={true} className={layoutItem} help={hints.peNameHint} validateStatus={hints.peNameStatus}>
                    <Input type="text" name="peName" id="peName" value={this.state.person.peName} onChange={this.handleOnChange} />
                </FormItem>
                <FormItem {...formItemLayout} label="证件类型" colon={true} required={true} className={layoutItem} help={hints.idTypeHint} validateStatus={hints.idTypeStatus}>
                    {
                        this.state.disabled ?
                            <Input type="text" name="idType" id="idType" value={Utils.getOptionName('简历系统', '证件类型', this.state.person.idType, true, this)} onChange={this.handleOnChange} disabled={this.state.disabled} />
                            : <DictSelect name="idType" id="idType" value={this.state.person.idType} appName='简历系统' optName='证件类型' onSelect={this.handleOnSelected.bind(this, "idType")} />
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="证件号码" colon={true} required={true} className={layoutItem} help={hints.idData1Hint} validateStatus={hints.idData1Status}>
                    <Input type="text" name="idData1" id="idData1" value={this.state.person.idData1} onChange={this.handleOnChange} disabled={this.state.disabled} />
                </FormItem>
                <FormItem {...formItemLayout} label="电子邮箱" colon={true} required={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
                    <AutoComplete name="email" id="email" value={this.state.person.email} onSearch={this.handleSearch} placeholder="请输入电子邮箱" onChange={this.emailOnChange} >
                        {children}
                    </AutoComplete>
                </FormItem>
                <FormItem {...formItemLayout} label="电话" colon={true} required={true} className={layoutItem} help={hints.phoneNoHint} validateStatus={hints.phoneNoStatus}>
                    <Input type="text" name="phoneNo" id="phoneNo" value={this.state.person.phoneNo} onChange={this.handleOnChange} />
                </FormItem>
                <FormItem {...formItemLayout} label="访问密码" colon={true} required={true} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                    <Input type="text" name="passwd" id="passwd" value={this.state.person.passwd} onChange={this.handleOnChange} />
                </FormItem>
            </Form>;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加个人信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['resPerson/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                {this.state.employeeLoading ? <Spin>{form}</Spin> : form}
            </Modal>



        );
    }
});

export default CreateQueryPage;