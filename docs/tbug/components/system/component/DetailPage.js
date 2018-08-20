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
var BmSystemActions = require('../action/BmSystemActions');
var BmSystemStore = require('../data/BmSystemStore');
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

    mixins: [Reflux.listenTo(BmSystemStore, "onServiceComplete")],
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
			{id: 'sysCode', desc:'系统编码', required: true, max: '255'},
			{id: 'rsvStr1', desc:'系统简称', required: true, max: '255'},
			{id: 'sysDevmanager', desc:'开发负责人', required: false, max: '32'},
			{id: 'sysTestmanager', desc:'测试负责人', required: false, max: '32'},
			{id: 'sysName', desc:'系统名称', required: true, max: '255'},
			{id: 'orgId', desc:'所属部门UUID', required: false, max: '255'},
			{id: 'sysVersion', desc:'最新版本号', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '512'},
		];
    },
   

    clear: function (staffCode) {
        this.state.hints = {};
		this.state.companyListSet.sysCode='';
		this.state.companyListSet.rsvStr1='';
		this.state.companyListSet.sysDevmanager='';
		this.state.companyListSet.sysTestmanager='';
		this.state.companyListSet.sysName='';
		this.state.companyListSet.orgId='';
		this.state.companyListSet.sysVersion='';
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
    initPage: function (companyListSet) {
     	console.log(companyListSet)
        this.state.hints = {};
        Utils.copyValue(companyListSet, this.state.companyListSet);
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
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
           
             this.setState({
               modal: !this.state.modal
             });
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
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
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
					    <FormItem {...formItemLayout2} label="系统编码" required={true} colon={true} className={layoutItem} help={hints.sysCodeHint} validateStatus={hints.sysCodeStatus}>
							<Input readOnly={true} type="text" name="sysCode" id="sysCode" value={this.state.companyListSet.sysCode } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				    <Col span={12}>
						<FormItem {...formItemLayout2} label="公司简称" required={true} colon={true} className={layoutItem} help={hints.rsvStr1Hint} validateStatus={hints.rsvStr1Status}>
							<Input readOnly={true} type="text" name="rsvStr1" id="rsvStr1" value={this.state.companyListSet.rsvStr1 } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				</Row>
				<Row>
                    <Col span={12}>
						<FormItem {...formItemLayout2} label="开发负责人" required={false} colon={true} className={layoutItem} help={hints.sysDevmanagerHint} validateStatus={hints.sysDevmanagerStatus}>
							<Input readOnly={true} type="text" name="sysDevmanager" id="sysDevmanager" value={this.state.companyListSet.sysDevmanager } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				    <Col span={12}>
						<FormItem {...formItemLayout2} label="测试负责人" required={false} colon={true} className={layoutItem} help={hints.sysTestmanagerHint} validateStatus={hints.sysTestmanagerStatus}>
							<Input readOnly={true} type="text" name="sysTestmanager" id="sysTestmanager" value={this.state.companyListSet.sysTestmanager } onChange={this.handleOnChange} />
				    	</FormItem>
					</Col>
				</Row>
						
				<FormItem {...formItemLayout} label="系统名称" required={true} colon={true} className={layoutItem} help={hints.sysNameHint} validateStatus={hints.sysNameStatus}>
					<Input  readOnly={true} type="text" name="sysName" id="sysName" value={this.state.companyListSet.sysName } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="所属部门" required={false} colon={true} className={layoutItem} help={hints.orgIdHint} validateStatus={hints.orgIdStatus}>
					<Input  readOnly={true} type="text" name="orgId" id="orgId" value={this.state.companyListSet.orgId } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="最新版本号" required={false} colon={true} className={layoutItem} help={hints.sysVersionHint} validateStatus={hints.sysVersionStatus}>
					<Input readOnly={true}  type="text" name="sysVersion" id="sysVersion" value={this.state.companyListSet.sysVersion } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.remarkHint} validateStatus={hints.remarkStatus}>
					<Input  readOnly={true} type="text" name="remark" id="remark" value={this.state.companyListSet.remark } onChange={this.handleOnChange} />
				</FormItem>
				
			</Form>
        return (
            <Modal visible={this.state.modal} width='700px' title="查看系统信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
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