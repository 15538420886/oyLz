import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router';
var Common = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';
import ModalForm from '../../../lib/Components/ModalForm';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import SearchEmployee from '../../lib/Components/SearchEmployee';
var EmpSalaryStore = require('../data/EmpSalaryStore.js');
var EmpSalaryActions = require('../action/EmpSalaryActions');

var CreateEmpSalaryPage = React.createClass({
	getInitialState : function() {
		return {
			loading: false,
			empSalary:{},
			user:{},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(EmpSalaryStore, "onServiceComplete"), ModalForm('empSalary')],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false
	          });
	      }
	  }
	},

	// 第一次加载
    componentDidMount : function(){
		this.state.validRules = [
			{id: 'deptName', desc:'部门名称', required: false, max: '128'},
			{id: 'applyName', desc:'申请人', required: false, max: '24'},
			{id: 'applyDate', desc:'申请日期', required: false, max: '16'},
			{id: 'chgType', desc:'调整类型', required: false, max: '24'},
			{id: 'empType', desc:'员工类型', required: false, max: '32'},
			{id: 'befSalary', desc:'调前薪水', required: false, max: '24'},
			{id: 'aftSalary', desc:'调后薪水', required: false, max: '24'},
			{id: 'chgReason', desc:'调整原因', required: false, max: '1024'},
			{id: 'manager', desc:'直接主管', required: false, max: '24'},
			{id: 'approver', desc:'审批人', required: false, max: '24'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'chgMonth', desc:'执行月份', required: false, max: '24'},
			{id: 'staffCode', desc:'员工编号', required: false, max: '128'},
		];

       this.clear();
    },
	componentWillReceiveProps:function(newProps){
		// this.clear();
	},

	clear : function(corpUuid){
		this.state.hints = {};
		this.state.empSalary.uuid='';
		this.state.empSalary.corpUuid = window.loginData.compUser.corpUuid;
		this.state.empSalary.userUuid = '';
		this.state.empSalary.staffCode = '';
		this.state.empSalary.applyName='';
		this.state.empSalary.chgType='';
		this.state.empSalary.applyDate='';
		this.state.empSalary.befSalary='';
		this.state.empSalary.aftSalary='';
		this.state.empSalary.manager='';
		this.state.empSalary.empType='';
		this.state.empSalary.approver='';
		this.state.empSalary.effectDate='';
		this.state.empSalary.chgReason='';
		//this.state.empSalary.status='1';

		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},
    onSelectEmpSalary:function(data){
        this.state.empSalary.userUuid = data.uuid;
		this.state.empSalary.staffCode = data.staffCode;
		this.state.empSalary.perName = data.perName;
		this.state.empSalary.deptName = data.deptName;

        this.setState({
           user:data,
        })
    },
	showError:function(data){
        console.log(data)
    },
	onClickSave : function(){
		this.setState({ loading: true });
		EmpSalaryActions.createHrEmpSalary( this.state.empSalary );
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function() {
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
        var boo = this.state.empSalary.userUuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;

	    return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="增加调薪记录" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['hr-emp-salary/create']}/>
                            <SearchEmployee style={{padding:'10px 0 16px 32px', width:'600px'}} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpSalary}/>

                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.user.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="deptName" id="deptName" value={this.state.user.deptName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="申请人" required={false} colon={true} className={layoutItem} help={hints.applyNameHint} validateStatus={hints.applyNameStatus}>
											<Input type="text"  name="applyName" id="applyName"   value={this.state.empSalary.applyName} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="申请日期" required={false} colon={true} className={layoutItem} help={hints.applyDateHint} validateStatus={hints.applyDateStatus}>
											<DatePicker  style={{width:'100%'}}  name="applyDate" id="applyDate"  format={Common.dateFormat} value={this.formatDate(this.state.empSalary.applyDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"applyDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="调整类型" required={false} colon={true} className={layoutItem} help={hints.chgTypeHint} validateStatus={hints.chgTypeStatus}>
											<DictSelect name="chgType" id="chgType"  appName='HR系统' optName='薪资调整类型'  value={this.state.empSalary.chgType} onSelect={this.handleOnSelected.bind(this, "chgType")}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工类型" required={false} colon={true} className={layoutItem} help={hints.empTypeHint} validateStatus={hints.empTypeStatus}>
											<DictSelect name="empType" id="empType" value={this.state.empSalary.empType} appName='HR系统' optName='员工类型' onSelect={this.handleOnSelected.bind(this, "empType")}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col>
										<FormItem {...formItemLayout} label="调前薪水" required={false} colon={true} className={layoutItem} help={hints.befSalaryHint} validateStatus={hints.befSalaryStatus} >
											<Input type="text" name="befSalary" id="befSalary" value={this.state.empSalary.befSalary} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col>
										<FormItem {...formItemLayout} label="调后薪水" required={false} colon={true} className={layoutItem} help={hints.aftSalaryHint} validateStatus={hints.aftSalaryStatus} >
											<Input type="text" name="aftSalary" id="aftSalary" value={this.state.empSalary.aftSalary} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="调整原因" required={false} colon={true} className={layoutItem} help={hints.chgReasonHint} validateStatus={hints.chgReasonStatus} >
									<Input type="textarea" name="chgReason" id="chgReason" value={this.state.empSalary.chgReason} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="直接主管" required={false} colon={true} className={layoutItem} help={hints.managerHint} validateStatus={hints.managerStatus}>
											<Input type="text"  name="manager" id="manager"   value={this.state.empSalary.manager} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approverHint} validateStatus={hints.approverStatus}>
											<Input type="text" name="approver" id="approver"  value={this.state.empSalary.approver} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
											<DatePicker  style={{width:'100%'}}  name="effectDate" id="effectDate"  format={Common.dateFormat} value={this.formatDate(this.state.empSalary.effectDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="执行月份" required={false} colon={true} className={layoutItem} help={hints.chgMonthHint} validateStatus={hints.chgMonthStatus}>
		                                    <MonthPicker  style={{width:'100%'}}  name="chgMonth" id="chgMonth"  format={Common.monthFormat} value={this.formatMonth(this.state.empSalary.chgMonth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"chgMonth", Common.monthFormat)}/>
		                                </FormItem>
									</Col>
								</Row>
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

module.exports = CreateEmpSalaryPage;
