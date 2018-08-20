import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Validator = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Spin, AutoComplete,Row, Col,message,Table,Popconfirm ,Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Option1 = AutoComplete.Option;
var BmUserStore = require('../data/BmUserStore');
var BmUserActions = require('../action/BmUserActions');
var DetailUserPage = React.createClass({
    getInitialState: function () {
        return {
            userListSet: {
                employee: {},
                operation: '',
                errMsg: ''
            },
            disabled: false,
            loading: false,
            employeeLoading: false,
            modal: false,
            userListSet: {},
            hints: {},
            validRules: [],
            result: [],
		    }
    },

    mixins: [Reflux.listenTo(BmUserStore, "onServiceComplete")],
    onServiceComplete: function (data) {	
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
//              ResumeActions.getResumeByIdCode(data.recordSet[0].idCode);

            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    userListSet: data
                });
            }
        } else if (this.state.modal && data.operation === 'retrieveEmployee') {
            if (data.employee.length === 1) {
                this.state.userListSet.caseRisk = data.employee[0].caseRisk;
                this.state.userListSet.idData1 = data.employee[0].idCode;
                this.state.disabled = true;
            } else {
                this.state.disabled = false;
            }
            this.setState({
                employeeLoading: false,
                userListSet: data
            });

        }
    },

    // 第一次加载
    componentDidMount: function () {
       this.state.validRules = [
			{id: 'userCode', desc:'用户代码', required: true, max: '32'},
			{id: 'userName', desc:'用户名称', required: true, max: '80'},
			{id: 'nikeName', desc:'用户昵称', required: false, max: '80'},
			{id: 'empCode', desc:'员工工号', required: false, max: '32'},
			{id: 'userRole', desc:'用户角色', required: false, max: '0'},
			{id: 'mobileNo', desc:'手机号码', required: false, max: '80'},
			{id: 'idNumber', desc:'身份证号', required: false, max: '64'},
			{id: 'eMail', desc:'电子邮件', required: false, max: '80'},
			{id: 'disUse', desc:'是否启用', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '0'},
		];
    },
     initPage: function (userListSet) {
     	console.log(userListSet)
        this.state.hints = {};
        Utils.copyValue(userListSet, this.state.userListSet);
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    clear: function (staffCode) {
        this.state.hints = {};
		this.state.userListSet.userCode='';
		this.state.userListSet.userName='';
		this.state.userListSet.nikeName='';
		this.state.userListSet.empCode='';
		this.state.userListSet.userRole='';
		this.state.userListSet.mobileNo='';
		this.state.userListSet.idNumber='';
		this.state.userListSet.eMail='';
		this.state.userListSet.disUse='';
		this.state.userListSet.remark='';


        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        if (staffCode) {
            var filter = {};
            filter.staffCode = staffCode;
            filter.corpUuid = window.loginData.compUser.corpUuid;
//          BmUserActions.retrieveTmCase(filter);
        }
    },

    handleOnChange: function (e) {
        var userListSet = this.state.userListSet;
        userListSet[e.target.id] = e.target.value;
        Validator.validator(this, userListSet, e.target.id);
        this.setState({
            userListSet: userListSet
        });
    },

    onClickSave: function () {
        if (Validator.validator(this, this.state.userListSet)) {
            this.state.userListSet.operation = '';
//          BmUserActions.updateBmUser(this.state.userListSet);
             this.setState({
               modal: !this.state.modal
             });
//            message.success('修改数据成功！');
        }
        else {
            this.setState({
                hint: this.state.hint
            });
             message.error('发生了错误！');
        }
    },
    handleOnSelected: function (id, value) {
        
        var userListSet = this.state.userListSet;
        userListSet[id] = value;
        Validator.validator(this, userListSet, id);
        this.setState({
            userListSet: userListSet
        });
    },
     handleOnChange: function (e) {
        var userListSet = this.state.userListSet;
        userListSet[e.target.id] = e.target.value;
        Validator.validator(this, userListSet, e.target.id);
        this.setState({
            userListSet: userListSet
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
    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 3 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 21 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };
        var hints = this.state.hints;
        var form =
            <Form layout={layout}>
                <Row>
                    <Col span={12}>                
		                <FormItem {...formItemLayout2} label="用户代码" required={true} colon={true} className={layoutItem} help={hints.userCodeHint} validateStatus={hints.userCodeStatus}>
							<Input readOnly={true} type="text" name="userCode" id="userCode" value={this.state.userListSet.userCode } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
					<Col span={12}>   
						<FormItem {...formItemLayout2} label="用户名称" required={true} colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
							<Input readOnly={true} type="text" name="userName" id="userName" value={this.state.userListSet.userName } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				</Row>
				 <Row>
                    <Col span={12}> 
						<FormItem {...formItemLayout2} label="用户昵称" required={false} colon={true} className={layoutItem} help={hints.nikeNameHint} validateStatus={hints.nikeNameStatus}>
							<Input readOnly={true} type="text" name="nikeName" id="nikeName" value={this.state.userListSet.nikeName } onChange={this.handleOnChange} />
						</FormItem>
				    </Col>
					<Col span={12}>
						<FormItem {...formItemLayout2} label="员工工号" required={false} colon={true} className={layoutItem} help={hints.empCodeHint} validateStatus={hints.empCodeStatus}>
							<Input readOnly={true} type="text" name="empCode" id="empCode" value={this.state.userListSet.empCode } onChange={this.handleOnChange} />
						</FormItem>
					 </Col>
				</Row>
				<FormItem {...formItemLayout} label="所属角色" required={false} colon={true} className={layoutItem} help={hints.userRoleHint} validateStatus={hints.userRoleStatus}>
					<Input readOnly={true} type="text"  name="userRole" id="userRole" value={this.state.userListSet.userRole} onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="手机号码" required={false} colon={true} className={layoutItem} help={hints.mobileNoHint} validateStatus={hints.mobileNoStatus}>
					<Input readOnly={true} type="text" name="mobileNo" id="mobileNo" value={this.state.userListSet.mobileNo } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="身份证号" required={false} colon={true} className={layoutItem} help={hints.idNumberHint} validateStatus={hints.idNumberStatus}>
					<Input readOnly={true} type="text" name="idNumber" id="idNumber" value={this.state.userListSet.idNumber } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="电子邮件" required={false} colon={true} className={layoutItem} help={hints.eMailHint} validateStatus={hints.eMailStatus}>
					<Input readOnly={true} type="text" name="eMail" id="eMail" value={this.state.userListSet.eMail } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="账户状态" required={false} colon={true} className={layoutItem} help={hints.disUseHint} validateStatus={hints.disUseStatus}>
					<Input readOnly={true} type='text' name="disUse" id="disUse" value={this.state.userListSet.disUse} onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.remarkHint} validateStatus={hints.remarkStatus}>
					<Input readOnly={true} type="text" name="remark" id="remark" value={this.state.userListSet.remark } onChange={this.handleOnChange} />
				</FormItem>
			</Form>
        return (
            <Modal visible={this.state.modal} width='700px' title="查看用户信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确认</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                {this.state.employeeLoading ? <Spin>{form}</Spin> : form}
            </Modal>
        );
    }
});

export default DetailUserPage;