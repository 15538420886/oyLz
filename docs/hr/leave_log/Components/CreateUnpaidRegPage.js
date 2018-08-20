import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');

import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../lib/Components/SearchEmployee';
var LeaveLogRegStore = require('../data/LeaveLogRegStore.js');
var LeaveLogActions = require('../action/LeaveLogActions');

var CreateUnpaidRegPage = React.createClass({
	getInitialState : function() {
		return {
			leaveLogSet: {
				operation : '',
				errMsg : ''
			},
            user:{},
			loading: false,
			modal: false,
			leaveLog: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(LeaveLogRegStore, "onServiceComplete"), ModalForm('leaveLog')],
	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
                  leaveLogSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'leaveType', desc:'假期类型', required: true, max: '32'},
			{id: 'beginDate', desc:'开始日期', required: true, max: '24'},
            { id: 'endDate', desc: '结束日期', required: true, max: '24' },
            { id: 'beginHour', desc: '开始时', required: true, dataType: 'number', validator: this.checkValue, max: '12' },
            { id: 'endHour', desc: '结束时', required: true, dataType: 'number', validator: this.checkValue, max: '12' },
            { id: 'accrued', desc: '休假小时', required: false, dataType: 'number', validator: this.checkValue, max: '16'},
            { id: 'spend', desc: '休假天数', required: true, dataType: 'number', validator: this.checkValue, max: '16'},
			{id: 'proposer', desc:'申请人', required: false, max: '16'},
			{id: 'applyDay', desc:'申请日期', required: false, max: '16'},
			{id: 'approve', desc:'审批人', required: false, max: '16'},
			{id: 'approveDay', desc:'审批日期', required: false, max: '16'},
			{id: 'reason', desc:'休假原因', required: false, max: '2048'},
		];

		this.clear();
	},
    checkValue: function (value, rule, page) {
        if (rule.id === 'beginHour' || rule.id === 'endHour') {
            var num = parseInt(value);
            if (num > 18 || num < 9) {
                return '[请输入9~18]';
            }
        }
        else if (rule.id === 'spend') {
            if (parseInt(value) > 365) {
                return '[请输入0~365]';
            }
        }
        else if (rule.id === 'accrued') {
            if (parseInt(value) > 7) {
                return '[请输入0~7]';
            }
        }
    },

	componentWillReceiveProps:function(newProps){
		this.clear();
	},

	clear : function(){
		this.state.hints = {};
		this.state.leaveLog.uuid='';
		this.state.leaveLog.userUuid = '';
        this.state.leaveLog.userUuid = '';
		this.state.leaveLog.staffCode = '';
		this.state.leaveLog.perName = '';
		this.state.leaveLog.deptName = '';
		this.state.leaveLog.corpUuid =  window.loginData.compUser.corpUuid;
		this.state.leaveLog.leaveType='事假';
		this.state.leaveLog.beginDate='';
        this.state.leaveLog.endDate = '';
        this.state.leaveLog.beginHour='9';
        this.state.leaveLog.endHour='18';
		this.state.leaveLog.accrued='0';
		this.state.leaveLog.spend='';
        this.state.leaveLog.proposer = window.loginData.authUser.perName;
		this.state.leaveLog.applyDay='';
        this.state.leaveLog.approve = '';
		this.state.leaveLog.approveDay='';
		this.state.leaveLog.reason='';

		this.state.loading = false;
	    this.state.leaveLogSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},
	onSelectAllowLog:function(data){
        this.state.leaveLog.userUuid = data.uuid;
		this.state.leaveLog.staffCode = data.staffCode;
		this.state.leaveLog.perName = data.perName;
		this.state.leaveLog.deptUuid = data.deptUuid;
		this.state.leaveLog.deptName = data.deptName;

        this.setState({
           user:data,
        })
    },
	showError:function(data){
        console.log(data)
    },

	onClickSave : function(){
        if(Common.formValidator(this, this.state.leaveLog)){
			this.state.leaveLogSet.operation = '';
			this.setState({loading: true});
			LeaveLogActions.createHrLeaveLogReg( this.state.leaveLog );
		}
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function(){
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
        const dateFormat = Common.dateFormat;

        var boo = this.state.user.uuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="1" defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="增加无薪休假" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['hr-leaveLog/create']}/>
                            <SearchEmployee style={{padding:'10px 0 16px 32px', width:'600px'}} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectAllowLog}/>

                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
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
                                    <Col span={12}>
                                        <FormItem {...formItemLayout2} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                                            <DictSelect name="leaveType" id="leaveType" value={this.state.leaveLog.leaveType } appName='HR系统' optName='假期类型2' onSelect={this.handleOnSelected.bind(this, "leaveType")}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
									<Col>
		                                <FormItem {...formItemLayout} label="开始日期" required={true} colon={true} className={layoutItem}>
		                                    <Col span="5">
		                                        <FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                                    <DatePicker  style={{width:'100%'}}  name="beginDate" id="beginDate" value={this.formatDate(this.state.leaveLog.beginDate, dateFormat)}  format={dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", dateFormat)} />
                                                </FormItem>
		                                    </Col>
		                                    <Col span="2" style={{textAlign: 'center'}}>
		                                        日
		                                    </Col>
		                                    <Col span="5">
		                                        <FormItem help={hints.beginHourHint} validateStatus={hints.beginHourStatus}>
                                                    <Input type="text" name="beginHour" id="beginHour" value={this.state.leaveLog.beginHour} onChange={this.handleOnChange} />
                                                </FormItem>
		                                    </Col>
                                            <Col span="2" style={{textAlign: 'center'}}>
		                                        时
		                                    </Col>
		                                </FormItem>
		                            </Col>
								</Row>
                                <Row>
									<Col>
		                                <FormItem {...formItemLayout} label="结束日期" required={true} colon={true} className={layoutItem}>
		                                    <Col span="5">
		                                        <FormItem help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                                    <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" value={this.formatDate(this.state.leaveLog.endDate, dateFormat)} format={dateFormat} onChange={this.handleOnSelDate.bind(this, "endDate", dateFormat)} />
                                                </FormItem>
		                                    </Col>
		                                    <Col span="2" style={{textAlign: 'center'}}>
		                                        日
		                                    </Col>
		                                    <Col span="5">
		                                        <FormItem className={layoutItem} help={hints.endHourHint} validateStatus={hints.endHourStatus}>
                                                    <Input type="text" name="endHour" id="endHour" value={this.state.leaveLog.endHour} onChange={this.handleOnChange} />
                                                </FormItem>
		                                    </Col>
                                            <Col span="2" style={{textAlign: 'center'}}>
		                                        时
		                                    </Col>
		                                </FormItem>
		                            </Col>
								</Row>
                                <Row>
									<Col>
		                                <FormItem {...formItemLayout} label="休假天数" required={true} colon={true} className={layoutItem}>
		                                    <Col span="5">
		                                        <FormItem help={hints.spendHint} validateStatus={hints.spendStatus}>
                                                    <Input type="text" name="spend" id="spend" value={this.state.leaveLog.spend} onChange={this.handleOnChange} />
                                                </FormItem>
		                                    </Col>
		                                    <Col span="2" style={{textAlign: 'center'}}>
		                                        天
		                                    </Col>
		                                    <Col span="5">
		                                        <FormItem className={layoutItem} help={hints.accruedHint} validateStatus={hints.accruedStatus}>
                                                    <Input type="text" name="accrued" id="accrued" value={this.state.leaveLog.accrued } onChange={this.handleOnChange} />
                                                </FormItem>
		                                    </Col>
                                            <Col span="2" style={{textAlign: 'center'}}>
		                                        小时
		                                    </Col>
		                                </FormItem>
		                            </Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="申请人" required={false} colon={true} className={layoutItem} help={hints.proposerHint} validateStatus={hints.proposerStatus}>
                                            <Input type="text" name="proposer" id="proposer" value={this.state.leaveLog.proposer } onChange={this.handleOnChange} />
                                        </FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="申请日期" required={false} colon={true} className={layoutItem} help={hints.applyDayHint} validateStatus={hints.applyDayStatus}>
                                            <DatePicker  style={{width:'100%'}}  name="applyDay" id="applyDay" value={this.formatDate(this.state.leaveLog.applyDay, dateFormat)}  format={dateFormat} onChange={this.handleOnSelDate.bind(this,"applyDay", dateFormat)} />
                                        </FormItem>
									</Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approveHint} validateStatus={hints.approveStatus}>
                                            <Input type="text" name="approve" id="approve" value={this.state.leaveLog.approve } onChange={this.handleOnChange} />
                                        </FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批日期" required={false} colon={true} className={layoutItem} help={hints.approveDayHint} validateStatus={hints.approveDayStatus}>
                                            <DatePicker  style={{width:'100%'}}  name="approveDay" id="approveDay" value={this.formatDate(this.state.leaveLog.approveDay, dateFormat)}  format={dateFormat} onChange={this.handleOnSelDate.bind(this,"approveDay", dateFormat)} />
                                        </FormItem>
									</Col>
								</Row>
                                <FormItem {...formItemLayout} label="休假原因" required={false} colon={true} className={layoutItem} help={hints.payMemoHint} validateStatus={hints.payMemoStatus} >
                                    <Input type="textarea" name="reason" id="reason" value={this.state.leaveLog.reason } onChange={this.handleOnChange} />
								</FormItem>
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

module.exports = CreateUnpaidRegPage;
