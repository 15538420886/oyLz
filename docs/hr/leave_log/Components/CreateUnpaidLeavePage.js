import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Col, Row, DatePicker} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;

var LeaveLogStore = require('../data/LeaveLogStore.js');
var LeaveLogActions = require('../action/LeaveLogActions');

var CreateUnpaidLeavePage = React.createClass({
	getInitialState : function() {
		return {
			leaveLogSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			leave: this.props.leave,
			leaveLog: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(LeaveLogStore, "onServiceComplete"), ModalForm('leaveLog')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	              modal: false
	          });
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

	clear : function(userUuid, corpUuid){
		this.state.hints = {};
		this.state.leaveLog.uuid='';
		this.state.leaveLog.userUuid = userUuid;
		this.state.leaveLog.perName = this.state.leave.perName;
        this.state.leaveLog.staffCode = this.state.leave.staffCode;
		this.state.leaveLog.deptUuid = this.state.leave.deptUuid;
        this.state.leaveLog.deptName = this.state.leave.deptName;
		this.state.leaveLog.corpUuid = corpUuid;
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

	onClickSave : function(){
		if(Common.formValidator(this, this.state.leaveLog)){
			this.state.leaveLogSet.operation = '';
			this.setState({loading: true});
			LeaveLogActions.createHrLeaveLog( this.state.leaveLog );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
        };
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

		var hints=this.state.hints;
        const dateFormat = Common.dateFormat;
		return (
			<Modal visible={this.state.modal} width='720px' title="增加无薪休假" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-leaveLog/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <Row gutter={10}>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
								<DictSelect name="leaveType" id="leaveType" value={this.state.leaveLog.leaveType } appName='HR系统' optName='假期类型2' onSelect={this.handleOnSelected.bind(this, "leaveType")}/>
							</FormItem>
                        </Col>
                    </Row>
                   <FormItem {...formItemLayout2} label="开始日期" required={true} colon={true} className={layoutItem}>
                        <Col className="gutter-row" span={5}>
                            <FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<DatePicker  style={{width:'100%'}}  name="beginDate" id="beginDate" value={this.formatDate(this.state.leaveLog.beginDate, dateFormat)}  format={dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", dateFormat)} />
							</FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ margin: '0 0 0 10px' }}>日</div>
                        </Col>
                        <Col span={3}>
                            <FormItem help={hints.beginHourHint} validateStatus={hints.beginHourStatus}>
                                <Input type="text" name="beginHour" id="beginHour" value={this.state.leaveLog.beginHour} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ margin: '0 0 0 10px' }}>时</div>
                        </Col>
                   </FormItem>
                   <FormItem {...formItemLayout2} label="结束日期" required={true} colon={true} className={layoutItem}>
                        <Col className="gutter-row" span={5}>
                            <FormItem help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="endDate" id="endDate" value={this.formatDate(this.state.leaveLog.endDate, dateFormat)} format={dateFormat} onChange={this.handleOnSelDate.bind(this, "endDate", dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ margin: '0 0 0 10px' }}>日</div>
                        </Col>
                        <Col span={3}>
                            <FormItem className={layoutItem} help={hints.endHourHint} validateStatus={hints.endHourStatus}>
                                <Input type="text" name="endHour" id="endHour" value={this.state.leaveLog.endHour} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ margin: '0 0 0 10px' }}>时</div>
                        </Col>
                   </FormItem>
                   <FormItem {...formItemLayout2} label="休假天数" required={true} colon={true} className={layoutItem}>
                       <Col className="gutter-row" span={5}>
                            <FormItem help={hints.spendHint} validateStatus={hints.spendStatus}>
                                <Input type="text" name="spend" id="spend" value={this.state.leaveLog.spend} onChange={this.handleOnChange} />
                            </FormItem>
                       </Col>
                       <Col span={2}>
                           <div style={{ margin: '0 0 0 10px' }}>天</div>
                       </Col>
                       <Col span={3}>
                            <FormItem className={layoutItem} help={hints.accruedHint} validateStatus={hints.accruedStatus}>
                                <Input type="text" name="accrued" id="accrued" value={this.state.leaveLog.accrued } onChange={this.handleOnChange} />
							</FormItem>
                       </Col>
                       <Col span={2}>
                           <div style={{ margin: '0 0 0 10px' }}>小时</div>
                       </Col>
                    </FormItem>
                   <Row gutter={10}>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="申请人" required={false} colon={true} className={layoutItem} help={hints.proposerHint} validateStatus={hints.proposerStatus}>
								<Input type="text" name="proposer" id="proposer" value={this.state.leaveLog.proposer } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
						<Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="申请日期" required={false} colon={true} className={layoutItem} help={hints.applyDayHint} validateStatus={hints.applyDayStatus}>
								<DatePicker  style={{width:'100%'}}  name="applyDay" id="applyDay" value={this.formatDate(this.state.leaveLog.applyDay, dateFormat)}  format={dateFormat} onChange={this.handleOnSelDate.bind(this,"applyDay", dateFormat)} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approveHint} validateStatus={hints.approveStatus}>
								<Input type="text" name="approve" id="approve" value={this.state.leaveLog.approve } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
						<Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="审批日期" required={false} colon={true} className={layoutItem} help={hints.approveDayHint} validateStatus={hints.approveDayStatus}>
								<DatePicker  style={{width:'100%'}}  name="approveDay" id="approveDay" value={this.formatDate(this.state.leaveLog.approveDay, dateFormat)}  format={dateFormat} onChange={this.handleOnSelDate.bind(this,"approveDay", dateFormat)} />
							</FormItem>
                        </Col>
                    </Row>
					<FormItem {...formItemLayout2} label="休假原因" required={false} colon={true} className={layoutItem} help={hints.reasonHint} validateStatus={hints.reasonStatus}>
						<Input type="textarea" name="reason" id="reason" value={this.state.leaveLog.reason } onChange={this.handleOnChange} />
					</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default CreateUnpaidLeavePage;
