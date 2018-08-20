import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Validator = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Spin, AutoComplete,Row,Upload, Col,message,Table,Popconfirm ,Icon} from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const Option = Select.Option;
const Option1 = AutoComplete.Option;
var BmCompanyStore = require('../data/BmCompanyStore');
var BmCompanyActions = require('../action/BmCompanyActions');
var DetailPage = React.createClass({
    getInitialState: function () {
        return {
            companyListSet: {
                employee: {},
                operation: '',
                errMsg: ''
            },
            disabled: false,
            loading: false,
            employeeLoading: false,
            modal: false,
            companyListSet: {},
            hints: {},
            validRules: [],
            result: [],
		    }
    },

    mixins: [Reflux.listenTo(BmCompanyStore, "onServiceComplete")],
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
                    companyListSet: data
                });
            }
        } else if (this.state.modal && data.operation === 'retrieveEmployee') {
            if (data.employee.length === 1) {
                this.state.companyListSet.caseRisk = data.employee[0].caseRisk;
                this.state.companyListSet.idData1 = data.employee[0].idCode;
                this.state.disabled = true;
            } else {
                this.state.disabled = false;
            }
            this.setState({
                employeeLoading: false,
                companyListSet: data
            });

        }
    },

    // 第一次加载
    componentDidMount: function () {
       this.state.validRules = [
			{id: 'cmpCode', desc:'公司编码', required: true, max: '32'},
			{id: 'cmpAbbr', desc:'公司简称', required: true, max: '255'},
			{id: 'cmpDomain', desc:'行业', required: false, max: '80'},
			{id: 'cmpContacts', desc:'联系人', required: false, max: '255'},
			{id: 'cmpName', desc:'公司名称', required: true, max: '255'},
			{id: 'cmpEnname', desc:'英文名称', required: false, max: '255'},
			{id: 'cmpAddr', desc:'公司地址', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '512'},
		];
    },
     initPage: function (companyListSet) {
     	console.log(companyListSet)
        this.state.hints = {};
        Utils.copyValue(companyListSet, this.state.companyListSet);
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        
    },

    clear: function (staffCode) {
        this.state.hints = {};
		this.state.companyListSet.userCode='';
		this.state.companyListSet.userName='';
		this.state.companyListSet.nikeName='';
		this.state.companyListSet.empCode='';
		this.state.companyListSet.userRole='';
		this.state.companyListSet.mobileNo='';
		this.state.companyListSet.idNumber='';
		this.state.companyListSet.eMail='';
		this.state.companyListSet.disUse='';
		this.state.companyListSet.remark='';


        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        if (staffCode) {
            var filter = {};
            filter.staffCode = staffCode;
            filter.corpUuid = window.loginData.compUser.corpUuid;
//          BmCompanyActions.retrieveTmCase(filter);
        }
    },

    handleOnChange: function (e) {
        var companyListSet = this.state.companyListSet;
        companyListSet[e.target.id] = e.target.value;
        Validator.validator(this, companyListSet, e.target.id);
        this.setState({
            companyListSet: companyListSet
        });
    },

    onClickSave: function () {
        if (Validator.validator(this, this.state.companyListSet)) {
            this.state.companyListSet.operation = '';
            console.log(this.state.companyListSet)
//          BmCompanyActions.updateBmCompany(this.state.companyListSet);
             this.setState({
               modal: !this.state.modal
             });
              message.success('修改数据成功！');
        }
        else {
            this.setState({
                hint: this.state.hint
            });
             message.error('发生了错误！');
        }
    },
    handleOnSelected: function (id, value) {
        
        var companyListSet = this.state.companyListSet;
        companyListSet[id] = value;
        Validator.validator(this, companyListSet, id);
        this.setState({
            companyListSet: companyListSet
        });
    },
     handleOnChange: function (e) {
        var companyListSet = this.state.companyListSet;
        companyListSet[e.target.id] = e.target.value;
        Validator.validator(this, companyListSet, e.target.id);
        this.setState({
            companyListSet: companyListSet
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
            labelCol: ((layout == 'vertical') ? null : { span: 6}),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18}),
        };
         const props = {
			name: 'file',
			multiple: true,
			action: 'http://10.10.10.201:8082/defect_s/bug-attach-upload/upload?uuid='+this.state.companyListSet.uuid,
			onChange(info) {
			  const status = info.file.status;
			  if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			  }
			  if (status === 'done') {
				message.success(`${info.file.name} 文件上传成功!.`);
			  } else if (status === 'error') {
				message.error(`${info.file.name} 文件上传失败!.`);
			  }
			},
		};
        var hints = this.state.hints;
        var form =
            <Form layout={layout}>
                <Row>
                    <Col span={12}>
		                <FormItem {...formItemLayout2} label="公司编码" required={true} colon={true} className={layoutItem} help={hints.cmpCodeHint} validateStatus={hints.cmpCodeStatus}>
							<Input readOnly={true} type="text" name="cmpCode" id="cmpCode" value={this.state.companyListSet.cmpCode } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout2} label="公司简称" required={true} colon={true} className={layoutItem} help={hints.cmpAbbrHint} validateStatus={hints.cmpAbbrStatus}>
							<Input readOnly={true} type="text" name="cmpAbbr" id="cmpAbbr" value={this.state.companyListSet.cmpAbbr } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout2} label="行业" required={false} colon={true} className={layoutItem} help={hints.cmpDomainHint} validateStatus={hints.cmpDomainStatus}>
							<Input  readOnly={true} type="text" name="cmpDomain" id="cmpDomain" value={this.state.companyListSet.cmpDomain } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout2} label="联系人" required={false} colon={true} className={layoutItem} help={hints.cmpContactsHint} validateStatus={hints.cmpContactsStatus}>
							<Input type="text" readOnly={true} name="cmpContacts" id="cmpContacts" value={this.state.companyListSet.cmpContacts } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				</Row>
				<FormItem {...formItemLayout} label="公司名称" required={true} colon={true} className={layoutItem} help={hints.cmpNameHint} validateStatus={hints.cmpNameStatus}>
					<Input type="text" name="cmpName" readOnly={true}  id="cmpName" value={this.state.companyListSet.cmpName } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="英文名称" required={false} colon={true} className={layoutItem} help={hints.cmpEnnameHint} validateStatus={hints.cmpEnnameStatus}>
					<Input type="text" name="cmpEnname" readOnly={true} id="cmpEnname" value={this.state.companyListSet.cmpEnname } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="公司地址" required={false} colon={true} className={layoutItem} help={hints.cmpAddrHint} validateStatus={hints.cmpAddrStatus}>
					<Input type="text" name="cmpAddr"  readOnly={true} id="cmpAddr" value={this.state.companyListSet.cmpAddr } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.remarkHint} validateStatus={hints.remarkStatus}>
					<Input type="text" name="remark" readOnly={true} id="remark" value={this.state.companyListSet.remark } onChange={this.handleOnChange} />
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

export default DetailPage;