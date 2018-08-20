import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
import QuickFill from '../../../lib/Components/QuickFill';

import { Form, Modal, Button, Input, Select, DatePicker, Tabs, Col, Row, Spin} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import SearchEmployee from '../../lib/Components/SearchEmployee';
import DictSelect from '../../../lib/Components/DictSelect';
import InsurSelect from '../../lib/Components/InsurSelect';
import TripSelect from '../../lib/Components/TripSelect';
import AllowSelect from '../../lib/Components/AllowSelect';

var EmpBenefitsStore =require('../data/EmpBenefitsStore')
var BenefitsStore = require('../data/BenefitsStore');
var BenefitsActions = require('../action/BenefitsActions');

var CreateBenefitsPage = React.createClass({
    getInitialState: function () {
        return {
            benefitsSet: {
                operation: '',
                errMsg: ''
            },
            loading: false,
            beneLoading: false,  // 查询最新数据
            benefits: {},
            user: {},
            datas: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(BenefitsStore, "onServiceComplete"),
        Reflux.listenTo(EmpBenefitsStore, "onServiceComplete2"),
        ModalForm('benefits')],
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
                    benefitsSet: data,
                });
            }
        }
    },

    onServiceComplete2: function (data) {
        if (data.recordSet !== null && data.recordSet.length > 0) {
            var bf = data.recordSet[0];

            this.state.benefits.salaryBank = bf.salaryBank;
            this.state.benefits.salaryCard = bf.salaryCard;
            this.state.benefits.reimBank = bf.reimBank;
            this.state.benefits.reimCard = bf.reimCard;
            this.state.benefits.salary = bf.salary;
            this.state.benefits.salary2 = bf.salary2;
            this.state.benefits.salary3 = bf.salary3;
            this.state.benefits.salary7 = bf.salary7;
            this.state.benefits.salary6 = bf.salary6;
            this.state.benefits.devAllow = bf.devAllow;
            this.state.benefits.insuBase = bf.insuBase;
            this.state.benefits.cpfBase = bf.cpfBase;
            this.state.benefits.insuName = bf.insuName;
            this.state.benefits.allowName = bf.allowName;
            this.state.benefits.tripName = bf.tripName;
        }

        this.setState({
            beneLoading: false,
        });
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'staffCode', desc: '员工编号', required: false, max: '0' },
            { id: 'perName', desc: '员工', required: false, max: '0' },
            { id: 'reimBank', desc: '报销卡银行', required: false, max: '64' },
            { id: 'salaryBank', desc: '工资卡银行', required: false, max: '64' },
            { id: 'salaryCard', desc: '工资卡', required: false, max: '32' },
            { id: 'reimCard', desc: '报销卡', required: false, max: '32' },
            { id: 'salary', desc: '基本工资', required: false, max: '16' },
            { id: 'salary2', desc: '绩效工资', required: false, max: '16' },
            { id: 'salary3', desc: '岗位津贴', required: false, max: '16' },
            { id: 'salary7', desc: '项目经费', required: false, max: '16' },
            { id: 'salary6', desc: '加班补偿基数', required: false, max: '16' },
            { id: 'insuBase', desc: '社保基数', required: false, max: '16' },
            { id: 'cpfBase', desc: '公积金基数', required: false, max: '16' },
            { id: 'devAllow', desc: '笔记本补贴', required: false, max: '16' },
            { id: 'allowName', desc: '补贴类型', required: false, max: '64' },
            { id: 'tripName', desc: '差旅类型', required: false, max: '64' },
            { id: 'insuName', desc: '社保类型', required: false, max: '64' },
            { id: 'effectDate', desc: '生效日期', required: false, max: '24' },
            { id: 'approver', desc: '审批人', required: false, max: '24' },
            { id: 'deptName', desc: '任职部门', required: false, max: '0' },
        ];

        this.clear();
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

    clear: function (corpUuid) {

        window.addEventListener('keydown', this.handleKeyDown);

        this.state.hints = {};
        this.state.benefits.uuid = '';
        this.state.benefits.corpUuid = window.loginData.compUser.corpUuid;

        this.state.benefits.staffCode = '';
        this.state.benefits.perName = '';
        this.state.benefits.reimBank = '';
        this.state.benefits.salaryBank = '';
        this.state.benefits.salaryCard = '';
        this.state.benefits.reimCard = '';
        this.state.benefits.salary = '';
        this.state.benefits.salary2 = '';
        this.state.benefits.salary3 = '';
        this.state.benefits.salary7 = '';
        this.state.benefits.salary6 = '';
        this.state.benefits.insuBase = '';
        this.state.benefits.cpfBase = '';
        this.state.benefits.devAllow = '';
        this.state.benefits.allowName = '';
        this.state.benefits.tripName = '';
        this.state.benefits.insuName = '';
        this.state.benefits.effectDate = '';
        this.state.benefits.approver = '';
        this.state.benefits.deptName = '';
        this.state.benefits.status = '1';
        this.state.loading = false;
        this.state.benefitsSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onSelectEmpLoyee: function (data) {
        var corpUuid = window.loginData.compUser.corpUuid;
        var filter = { corpUuid: corpUuid, staffCode: data.staffCode };
        BenefitsActions.addHrBenefits(filter);

        this.state.benefits.staffCode = data.staffCode;
        this.state.benefits.perName = data.perName;
        this.state.benefits.deptName = data.deptName;
        this.state.benefits.userUuid = data.uuid;

        this.setState({
            beneLoading: true,
            user: data,
        })
    },

    showError: function (data) {
        console.log(data)
    },
    onClickSave: function () {
        this.setState({ loading: true });
        var benefits = this.state.benefits;
        BenefitsActions.createHrBenefits(benefits);
    },
    goBack: function () {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.props.onBack();
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.goBack();
        }
    },
    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        var cs = Common.getGridMargin(this);
        var boo = this.state.benefits.userUuid ? false : true;

        var form =(
            <Form layout={layout}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                            <Input type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode} onChange={this.handleOnChange} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus} >
                            <Input type="text" name="perName" id="perName" value={this.state.user.perName} onChange={this.handleOnChange} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                            <Input type="text" name="deptName" id="deptName" value={this.state.user.deptName} onChange={this.handleOnChange} disabled={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="工资卡银行" required={false} colon={true} className={layoutItem} help={hints.salaryBankHint} validateStatus={hints.salaryBankStatus}>
                            <Input type="text" name="salaryBank" id="salaryBank" value={this.state.benefits.salaryBank} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="工资卡" required={false} colon={true} className={layoutItem} help={hints.salaryCardHint} validateStatus={hints.salaryCardStatus}>
                            <Input type="text" name="salaryCard" id="salaryCard" value={this.state.benefits.salaryCard} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="报销卡银行" required={false} colon={true} className={layoutItem} help={hints.reimBankHint} validateStatus={hints.reimBankStatus}>
                            <Input type="text" name="reimBank" id="reimBank" value={this.state.benefits.reimBank} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="报销卡" required={false} colon={true} className={layoutItem} help={hints.reimCardHint} validateStatus={hints.reimCardStatus}>
                            <Input type="text" name="reimCard" id="reimCard" value={this.state.benefits.reimCard} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="基本工资" required={false} colon={true} className={layoutItem} help={hints.salaryHint} validateStatus={hints.salaryStatus}>
                            <Input type="text" name="salary" id="salary" value={this.state.benefits.salary} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="绩效工资" required={false} colon={true} className={layoutItem} help={hints.salary2Hint} validateStatus={hints.salary2Status}>
                            <Input type="text" name="salary2" id="salary2" value={this.state.benefits.salary2} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="岗位津贴" required={false} colon={true} className={layoutItem} help={hints.salary3Hint} validateStatus={hints.salary3Status}>
                            <Input type="text" name="salary3" id="salary3" value={this.state.benefits.salary3} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="项目经费" required={false} colon={true} className={layoutItem} help={hints.salary7Hint} validateStatus={hints.salary7Status}>
                            <Input type="text" name="salary7" id="salary7" value={this.state.benefits.salary7} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="加班补偿基数" required={false} colon={true} className={layoutItem} help={hints.salary6Hint} validateStatus={hints.salary6Status}>
                            <Input type="text" name="salary6" id="salary6" value={this.state.benefits.salary6} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="笔记本补贴" required={false} colon={true} className={layoutItem} help={hints.devAllowHint} validateStatus={hints.devAllowStatus}>
                            <Input type="text" name="devAllow" id="devAllow" value={this.state.benefits.devAllow} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="社保基数" required={false} colon={true} className={layoutItem} help={hints.insuBaseHint} validateStatus={hints.insuBaseStatus}>
                            <Input type="text" name="insuBase" id="insuBase" value={this.state.benefits.insuBase} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="公积金基数" required={false} colon={true} className={layoutItem} help={hints.cpfBaseHint} validateStatus={hints.cpfBaseStatus}>
                            <Input type="text" name="cpfBase" id="cpfBase" value={this.state.benefits.cpfBase} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="社保类型" required={false} colon={true} className={layoutItem} help={hints.insuNameHint} validateStatus={hints.insuNameStatus}>
                            <InsurSelect ref="insuName" name="insuName" id="insuName" value={this.state.benefits.insuName} onSelect={this.handleOnSelected.bind(this, "insuName")} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="补贴类型" required={false} colon={true} className={layoutItem} help={hints.allowNameHint} validateStatus={hints.allowNameStatus}>
                            <AllowSelect name="allowName" id="allowName" value={this.state.benefits.allowName} onSelect={this.handleOnSelected.bind(this, "allowName")} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="差旅级别" required={false} colon={true} className={layoutItem} help={hints.tripNameHint} validateStatus={hints.tripNameStatus}>
                            <TripSelect name="tripName" id="tripName" value={this.state.benefits.tripName} onSelect={this.handleOnSelected.bind(this, "tripName")} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approverHint} validateStatus={hints.approverStatus}>
                            <Input type="text" name="approver" id="approver" value={this.state.benefits.approver} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
                            <DatePicker style={{ width: '100%', zIndex: '2' }} name="effectDate" id="effectDate" value={this.formatDate(this.state.benefits.effectDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "effectDate", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem style={{ textAlign: 'right' }} required={false} colon={true} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading} disabled={boo}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                </FormItem>
            </Form>
        );

		return (
	        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onTabClick={this.goBack}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="增加薪资信息#" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{ padding: "16px 0 16px 8px", height: '100%', width: '100%', overflowY: 'auto' }}>
                            <div style={{ width: '100%', maxWidth: '700px' }}>
                          	  <ServiceMsg ref='mxgBox' svcList={['hr-benefits/create']}/>
                              <SearchEmployee style={{ padding: '10px 0 16px 32px', width: '700px'}} corpUuid={this.state.corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee}/>
                              {this.state.beneLoading ? <Spin>{form}</Spin> : form}
						  </div>
						</div>
                    </TabPane>
                </Tabs>
                <QuickFill ref='QuickFillWindow' self={this} object='benefits' />
	        </div>
	     
		);
	}
});

module.exports = CreateBenefitsPage;
