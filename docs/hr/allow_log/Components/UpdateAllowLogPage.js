import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import SearchEmployee from '../../lib/Components/SearchEmployee';
import DictSelect from '../../../lib/Components/DictSelect';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var AllowLogStore = require('../data/AllowLogStore.js');
var AllowLogActions = require('../action/AllowLogActions');

var UpdateAllowLogPage = React.createClass({
	getInitialState : function() {
		return {
			allowLogSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			allowLog: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(AllowLogStore, "onServiceComplete"), ModalForm('allowLog')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			 this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  allowLogSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'deptName', desc:'部门名称', required: false, max: '128'},
			{id: 'allowType', desc:'报销类型', required: true, max: '32'},
			{id: 'applyDate', desc:'填表日期', required: false, max: '16'},
			{id: 'projCode', desc:'项目编号', required: false, max: '128'},
			{id: 'projName', desc:'项目名称', required: false, max: '256'},
			{id: 'allowDesc', desc:'报销事项', required: false, max: '1024'},
			{id: 'beginDate', desc:'费用开始日期', required: false, max: '24'},
			{id: 'endDate', desc:'费用结束日期', required: false, max: '24'},
			{id: 'payAmount', desc:'报销金额', required: true, max: '24'},
			{id: 'payMemo', desc:'报销说明', required: false, max: '2000'},
			{id: 'approve', desc:'审批人', required: false, max: '16'},
			{id: 'approveDay', desc:'审批日期', required: false, max: '16'},
			{id: 'payDate', desc:'发放日期', required: true, max: '24'},
			{id: 'bankCard', desc:'银行卡号', required: false, max: '32'},
			{id: 'memo2', desc:'备注', required: false, max: '512'},
		];
		this.initPage( this.props.allowLog );
	},
	componentWillReceiveProps:function(newProps){
		// this.initPage( newProps.allowLog );
	},
	
	initPage: function(allowLog)
	{	
		Utils.copyValue(allowLog, this.state.allowLog);
		
		this.setState( {loading: false, hints: {}} );
		this.state.allowLogSet.operation='';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.allowLog)){
			this.state.allowLogSet.operation = '';
			this.setState({loading: true});
			AllowLogActions.updateHrAllowLog( this.state.allowLog );
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
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改报销单" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['hr-allow-log/update']}/>
                            
                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.allowLog.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.allowLog.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="deptName" id="deptName" value={this.state.allowLog.deptName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="报销类型" required={true} colon={true} className={layoutItem} help={hints.allowTypeHint} validateStatus={hints.allowTypeStatus}>
											<DictSelect name="allowType" id="allowType" value={this.state.allowLog.allowType} appName='HR系统' optName='报销类型' onSelect={this.handleOnSelected.bind(this, "allowType")}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="填表日期" required={false} colon={true} className={layoutItem} help={hints.applyDateHint} validateStatus={hints.applyDateStatus}>
											<DatePicker  style={{width:'100%'}}  name="applyDate" id="applyDate"  format={Common.dateFormat} value={this.formatDate(this.state.allowLog.applyDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"applyDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col>
										<FormItem {...formItemLayout} label="项目编号" required={false} colon={true} className={layoutItem} help={hints.projCodeHint} validateStatus={hints.projCodeStatus} >
											<Input type="text" name="projCode" id="projCode" value={this.state.allowLog.projCode} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col>
										<FormItem {...formItemLayout} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus} >
											<Input type="text" name="projName" id="projName" value={this.state.allowLog.projName} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col>
										<FormItem {...formItemLayout} label="报销事项" required={false} colon={true} className={layoutItem} help={hints.allowDescHint} validateStatus={hints.allowDescStatus} >
											<Input type="text" name="allowDesc" id="allowDesc" value={this.state.allowLog.allowDesc} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col>
		                                <FormItem {...formItemLayout} label="费用日期" required={false} colon={true} className={layoutItem}>
		                                    <Col span="6">
		                                        <FormItem  help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
		                                            <MonthPicker  style={{width:'100%'}}  name="beginDate" id="beginDate" value={this.formatMonth(this.state.allowLog.beginDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.monthFormat)} />
		                                        </FormItem>
		                                    </Col>
		                                    <Col span="2" style={{textAlign: 'center'}}>
		                                        到
		                                    </Col>
		                                    <Col span="6">
		                                        <FormItem  help={hints.endDateHint} validateStatus={hints.endDateStatus}>
		                                            <MonthPicker  style={{width:'100%'}}  name="endDate" id="endDate"  value={this.formatMonth(this.state.allowLog.endDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.monthFormat)} />
		                                        </FormItem>
		                                    </Col>
		                                </FormItem>
		                            </Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="报销金额" required={true} colon={true} className={layoutItem} help={hints.payAmountHint} validateStatus={hints.payAmountStatus}>
											<Input type="text"  name="payAmount" id="payAmount"   value={this.state.allowLog.payAmount} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="发票张数" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
											<Input type="text" name="memo2" id="memo2"  value={this.state.allowLog.memo2} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="报销说明" required={false} colon={true} className={layoutItem} help={hints.payMemoHint} validateStatus={hints.payMemoStatus} >
									<Input type="textarea" name="payMemo" id="payMemo" value={this.state.allowLog.payMemo} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approveHint} validateStatus={hints.approveStatus}>
											<Input type="text" name="approve" id="approve"  value={this.state.allowLog.approve} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批日期" required={false} colon={true} className={layoutItem} help={hints.approveDayHint} validateStatus={hints.approveDayStatus}>
		                                    <MonthPicker  style={{width:'100%'}}  name="approveDay" id="approveDay"  format={Common.monthFormat} value={this.formatMonth(this.state.allowLog.approveDay, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"approveDay", Common.monthFormat)}/>
		                                </FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="发放日期" required={true} colon={true} className={layoutItem} help={hints.payDateHint} validateStatus={hints.payDateStatus}>
		                                    <MonthPicker  style={{width:'100%'}}  name="payDate" id="payDate"  format={Common.monthFormat} value={this.formatMonth(this.state.allowLog.payDate, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"payDate", Common.monthFormat)}/>
		                                </FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="银行卡号" required={false} colon={true} className={layoutItem} help={hints.bankCardHint} validateStatus={hints.bankCardStatus}>
											<Input type="text" name="bankCard" id="bankCard"  value={this.state.allowLog.bankCard} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

export default UpdateAllowLogPage;

