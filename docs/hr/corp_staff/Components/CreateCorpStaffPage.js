import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;

import EmailInput from '../../../lib/Components/EmailInput';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import AutoInput from '../../../lib/Components/AutoInput';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import QuickFill from '../../../lib/Components/QuickFill';
import SearchEmployee from '../../lib/Components/SearchEmployee';

var CorpStaffStore = require('../data/CorpStaffStore.js');
var CorpStaffActions = require('../action/CorpStaffActions');

var CreateCorpStaffPage = React.createClass({
    getInitialState: function () {
        return {
            CorpStaffSet: {
                operation: '',
                errMsg: ''
            },
            loading: true,
            modal: false,
            CorpStaff: {},
            hints: {},
            validRules: [],
            result: []
        }
    },

    mixins: [Reflux.listenTo(CorpStaffStore, "onServiceComplete"), ModalForm('CorpStaff')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.close();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    CorpStaffSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'perName', desc: '用户姓名', required: true, max: 32 },
            { id: 'jobTitle', desc: '职位', required: true, max: '64' },
            { id: 'phoneno', desc: '电话', required: true, dataType: 'mobile', max: '64' },
            { id: 'email', desc: '电子邮箱', required: false, dataType: 'email', max: '64' },
            { id: 'jobDesc', desc: '职务说明', required: false, max: '1024' },
            { id: 'officeLoc', desc: '办公地址', required: false, max: '256' },
        ];
    },

    handleKeyDown: function (e) {
        if (73 == e.keyCode && e.ctrlKey && e.altKey) {
            this.refs.QuickFillWindow.initPage(this.state.validRules);
            this.refs.QuickFillWindow.toggle();
        }
    },

    close: function () {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.setState({
            modal: false
        });
    },

    clear: function (corpUuid) {

        window.addEventListener('keydown', this.handleKeyDown);

        this.state.hints = {};
        this.state.CorpStaff.uuid = '';
        this.state.CorpStaff.corpUuid = corpUuid;
        this.state.CorpStaff.perName = '';
        this.state.CorpStaff.jobTitle = '';
        this.state.CorpStaff.phoneno = '';
        this.state.CorpStaff.email = '';
        this.state.CorpStaff.jobDesc = '';

        this.state.loading = false;
        this.state.CorpStaffSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.CorpStaff)) {
            this.state.CorpStaffSet.operation = '';
            this.setState({ loading: true });
            CorpStaffActions.createCorpStaff(this.state.CorpStaff);
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
        var obj = this.state.CorpStaff;
        obj.email = value;
        Validator.validator(this, obj, 'email');
        this.setState({
            loading: this.state.loading
        });
    },
    onSelectEmpLoyee: function (data) {
        this.state.CorpStaff.jobTitle = data.jobTitle;
        this.state.CorpStaff.perName = data.perName;
        this.state.CorpStaff.phoneno = data.phoneno;
        this.state.CorpStaff.email = data.email;
        
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
            return <Option key={email}>{email}</Option>;
        });

        var corpUuid = window.loginData.compUser.corpUuid;
        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加关系人#" maskClosable={false} onOk={this.onClickSave} onCancel={this.close}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['hr_corp_staff/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.close}>取消</Button>
                    </div>
                ]}
            >
                <SearchEmployee style={{ padding: '10px 0 16px 32px', width: '508px' }} corpUuid={corpUuid} onSelectEmpLoyee={this.onSelectEmpLoyee} />
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="用户姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                        <Input type="text" name="perName" id="perName" value={this.state.CorpStaff.perName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="职位" required={true} colon={true} className={layoutItem} help={hints.jobTitleHint} validateStatus={hints.jobTitleStatus}>
                        <Input type="text" name="jobTitle" id="jobTitle" value={this.state.CorpStaff.jobTitle} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="电话" required={true} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
                        <Input type="text" name="phoneno" id="phoneno" value={this.state.CorpStaff.phoneno} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="电子邮箱" colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
                        <EmailInput name="email" id="email" value={this.state.CorpStaff.email} onChange={this.emailOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="办公地址" required={false} colon={true} className={layoutItem} help={hints.officeLocHint} validateStatus={hints.officeLocStatus}>
                        <AutoInput name='officeLoc' id='officeLoc' paramName='办公场地' value={this.state.CorpStaff.officeLoc} onChange={this.handleOnSelected.bind(this, "officeLoc")} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="职务说明" colon={true} className={layoutItem} help={hints.jobDescHint} validateStatus={hints.jobDescStatus}>
                        <Input type="textarea" name="jobDesc" id="jobDesc" value={this.state.CorpStaff.jobDesc} onChange={this.handleOnChange} style={{ height: '60px' }}/>
                    </FormItem>
                </Form>
                <QuickFill ref='QuickFillWindow' self={this} object='CorpStaff' />
            </Modal>
        );
    }
});

export default CreateCorpStaffPage;

