﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
import LeaveDetailTable from './LeaveDetailTable';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var LeaveUtil = require('../../leave/LeaveUtil');

import { Form, Modal, Button, Input, Select, Col, Row, DatePicker, Spin , Tabs} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
var LeaveLogStore = require('../data/LeaveLogStore.js');
var LeaveLogActions = require('../action/LeaveLogActions');
var LeaveActions = require('../../leave/action/LeaveActions');
var LeaveDetailActions = require('../../leave_detail/action/LeaveDetailActions');

var CreatePaidLeavePage = React.createClass({
	getInitialState : function() {
		return {
			leaveLogSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			leaveLog: {},
			hints: {},
			validRules: [],
			isSelect: true,
            selectKey: '1',
			leave: this.props.leave,
			leave2:{},
			leaveType:'',
            detail: [],
            modifyList: [],     // 被修改的明细列表
		}
	},

	mixins: [Reflux.listenTo(LeaveLogStore, "onServiceComplete"),ModalForm('leaveLog')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
				// 成功，关闭窗口
				this.setState({
					modal: false
				});
				//成功后改变另外两个表
				//leave
				LeaveActions.refreshPage(this.state.leave2);
				//detail
                LeaveDetailActions.refreshPage(this.state.modifyList);


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
            { id: 'accrued', desc: '休假小时', required: false, dataType: 'number', validator: this.checkValue, max: '16' },
            { id: 'spend', desc: '休假天数', required: true, dataType: 'number', validator: this.checkValue, max: '16' },
			{id: 'proposer', desc:'申请人', required: false, max: '16'},
			{id: 'applyDay', desc:'申请日期', required: false, max: '16'},
			{id: 'approve', desc:'审批人', required: false, max: '16'},
			{id: 'approveDay', desc:'审批日期', required: false, max: '16'},
			{id: 'reason', desc:'休假原因', required: false, max: '2048'},
		];
    },

	componentWillReceiveProps: function(newProps){
		if(Utils.compareTo(this.state.leave, newProps.leave) && newProps.leaveLoading === this.state.leaveLoading){
			return;
		}
		this.setState({leave:newProps.leave,leaveLoading:newProps.leaveLoading});
		Utils.copyValue(newProps.leave, this.state.leave2);
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

    onClickNext: function () {
        if (Common.formValidator(this, this.state.leaveLog)) {
            if (this.refs.detailTable !== undefined) {
                this.refs.detailTable.clear();
            }

            // 检查剩余假期
            var leaveType = this.state.leaveType;
            var remnant = this.state.leave[leaveType];
            var spendDay = this.state.leaveLog.spend;
            var spendHour = this.state.leaveLog.accrued;
            if (LeaveUtil.remnantCompare(leaveType, remnant, spendDay, spendHour) < 0){
                Common.infoMsg('可以使用的假日不足');
                return;
            }

            this.setState({
                isSelect: false,
                selectKey: '2',
            })
        }
    },
    //点击Tab后回调
    onTabClick: function () {
        this.setState({
            isSelect: true,
            selectKey: '1'
        });
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
        this.state.leaveLog.leaveType ='dayoff';
		this.state.leaveLog.beginDate='';
        this.state.leaveLog.endDate = '';
        this.state.leaveLog.beginHour = '9';
        this.state.leaveLog.endHour = '18';
		this.state.leaveLog.accrued='0';
		this.state.leaveLog.spend='';
        this.state.leaveLog.proposer = window.loginData.authUser.perName;
		this.state.leaveLog.applyDay='';
		this.state.leaveLog.approve='';
		this.state.leaveLog.approveDay='';
		this.state.leaveLog.reason='';

        this.state.leaveType = 'dayoff';
		this.state.isSelect=true;
		this.state.selectKey='1';
		Utils.copyValue(this.state.leave, this.state.leave2);
		this.state.loading = false;
	    this.state.leaveLogSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onDetailSave: function(detail){
		this.setState({detail: detail});
	},

    onClickSave: function () {
        if (Common.formValidator(this, this.state.leaveLog)) {
            // 已经变更的记录
            var leaveType = this.state.leaveType;
            var modifyList = LeaveUtil.getModifyDetails(this.state.detail, leaveType);
            if (modifyList === null || modifyList.length === 0) {
                return;
            }

            var detLog = '';
            modifyList.map((record, i) => {
                detLog = detLog + record.spendDay + ';';
            });

			this.state.leaveLogSet.operation = '';
            this.setState({ loading: true });

            this.state.modifyList = modifyList;
            this.state.leaveLog.memo2 = detLog;
			var obj = {
				'leave':this.state.leave2,
				'log':this.state.leaveLog,
                'detail': modifyList
            };

			// console.log('obj', obj);
			LeaveLogActions.createHrLeaveLogWithLeave( obj );
		}
    },

    getRemnant: function (oldValue) {
        var spend = this.state.leaveLog.spend;
        var accrued = this.state.leaveLog.accrued;
        if (accrued !== '') {
            accrued = ((spend === '') ? '0' : spend) + '.' + accrued;
        }

        return LeaveUtil.getRemnant(oldValue, accrued, true);
    },
	handleOnSelected2 : function(id, value) {
		var oldLeaveType = this.state.leaveType;
		if(oldLeaveType!==""){
			this.state.leave2[oldLeaveType] = this.state.leave[oldLeaveType];
        }

        var remnant1 = this.state.leave[value];
        this.state.leave2[value] = this.getRemnant(remnant1);

		var obj = this.state.leaveLog;
		obj[id] = value;
		Common.validator(this, obj, id);
		this.setState({
			modal: this.state.modal,
			leaveType:value,
		});
	},
    handleOnChange2: function (e) {
        // 汇总
        var obj = this.state.leave2;
        var msg = LeaveUtil.changeRemnantValue(obj, e.target.id, e.target.value);

        this.state.hints[e.target.id + 'Hint'] = msg;
        this.setState({
            modal: this.state.modal
        });
    },
    handleOnChange3: function (e) {
        // 明细
        this.handleOnChange(e);

        var obj = this.state.leaveLog;
        var leaveType = this.state.leaveType;
        var remnant1 = this.state.leave[leaveType];
        this.state.leave2[leaveType] = this.getRemnant(remnant1);

        this.setState({
            modal: this.state.modal
        });
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 3 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 21 }),
        };
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const formItemLayout4 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 14 }),
        };

		var leaveType = this.state.leaveType;
		var remnant1 = this.state.leave[leaveType];
        var remnant2 = this.state.leave2[leaveType];
        var fields = LeaveUtil.getRemnantFields(this);
        var fields2 = LeaveUtil.getRemnantFields2(this);

        // 休假天数和小时
        var spendDay = this.state.leaveLog.spend;
        var spendHour = this.state.leaveLog.accrued;

		var hints=this.state.hints;
        const dateFormat = Common.dateFormat;
		return (
			<Modal visible={this.state.modal} width='760px' title="增加有薪休假" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-leaveLog/create']}/>
					{
						this.state.isSelect ?
                            <Button key="btnNext" type="primary" size="large" disabled={leaveType === ''} onClick={this.onClickNext} loading={this.state.loading}>下一步</Button>:
			   			    <Button key="btnOK" type="primary" size="large" disabled={remnant1===remnant2||remnant2===''} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>
					}
			   		{' '}<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>

				<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	                <Tabs defaultActiveKey="1" activeKey={this.state.selectKey} onTabClick={this.onTabClick} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                    <TabPane tab="休假信息" key="1" style={{width: '100%', height: '100%'}}>
							<Form layout={layout} style={{padding:'30px 0 0 0'}}>
								<Row  gutter={10}>
									<Col className="gutter-row" span={12}>
										<FormItem {...formItemLayout} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
											<DictSelect name="leaveType" id="leaveType" value={this.state.leaveLog.leaveType } appName='HR系统' optName='假期类型' onSelect={this.handleOnSelected2.bind(this, "leaveType")}/>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <FormItem {...formItemLayout} label="剩余天数" required={false} colon={true} className={layoutItem}>
                                            {fields2.bfFields}
                                        </FormItem>
									</Col>
                                </Row>
                                <FormItem {...formItemLayout2} label="开始日期" required={true} colon={true} className={layoutItem}>
                                    <Col className="gutter-row" span={5}>
                                        <FormItem help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" value={this.formatDate(this.state.leaveLog.beginDate, dateFormat)} format={dateFormat} onChange={this.handleOnSelDate.bind(this, "beginDate", dateFormat)} />
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
                                    {fields2.spendFields}
                                </FormItem>
								<Row  gutter={10}>
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
								<Row  gutter={10}>
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
	                    </TabPane>
	                    <TabPane tab="抵扣信息" key="2" disabled={this.state.isSelect} style={{width: '100%', height: '100%'}}>
	                        <Form layout={layout} style={{padding:'24px 0 0 0'}}>
                                <FormItem {...formItemLayout4} label="调整前假日数量" required={false} colon={true} className={layoutItem}>
                                    {fields.bfFields}
								</FormItem>
                                <FormItem {...formItemLayout4} label="调整后假日数量" required={true} colon={true} className={layoutItem}>
                                    {fields.afFields}
								</FormItem>
                            </Form>

                            <LeaveDetailTable ref='detailTable' leave={this.state.leave} leaveType={leaveType} type='create' spendDay={spendDay} spendHour={spendHour} onDetailSave={this.onDetailSave}/>
	                    </TabPane>
	                </Tabs>
	            </div>
			</Modal>
		);
	}
});

export default CreatePaidLeavePage;
