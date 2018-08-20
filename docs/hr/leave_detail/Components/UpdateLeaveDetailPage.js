import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var LeaveUtil = require('../../leave/LeaveUtil');

import {Input, Form, Modal, Col, Row, DatePicker, Select, Button} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var LeaveDetailStore = require('../data/LeaveDetailStore.js');
var LeaveDetailActions = require('../action/LeaveDetailActions');
var LeaveActions = require('../../leave/action/LeaveActions');

var UpdateLeaveDetailPage = React.createClass({
	getInitialState : function() {
		return {
			detailSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			leaveType:'',
			leave:{},
			leave2:{},
			detail: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(LeaveDetailStore, "onServiceComplete"), ModalForm('detail')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.setState({
				  modal: false
			  });
			  //调用第一个表的actions的方法进行渲染页面
			  LeaveActions.refreshPage(this.state.leave2);
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  detailSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'leaveType', desc:'假期类型', required: true, max: '32'},
			{id: 'accrued', desc:'应计天数', required: false, max: '16'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'expiryDate', desc:'失效日期', required: false, max: '24'},
			{id: 'remnant', desc:'剩余天数', required: true, max: '16'},
			{id: 'spend', desc:'已修天数', required: false, max: '16'},
			{id: 'replacement', desc:'补偿天数', required: false, max: '16'},
			{id: 'repAmount', desc:'补偿金额', required: false, max: '16'},
		];
	},
	
	initPage: function(detail, leave)
	{
		this.state.hints = {};
		Utils.copyValue(detail, this.state.detail);
		Utils.copyValue(leave, this.state.leave2);
		this.state.loading = false;
		this.state.leave = leave;
		this.state.leaveType = detail.leaveType;
		this.state.detailSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.detail)){
			this.state.detailSet.operation = '';
			this.setState({loading: true});
			var obj = {
				"leave":this.state.leave2,
				"detail":this.state.detail,
			};
			LeaveDetailActions.updateHrLeaveDetailWithLeave( obj );
		}
	},

	handleOnSelected2 : function(id, value) {
		var oldLeaveType = this.state.leaveType;
        this.state.leave2[oldLeaveType] = this.state.leave[oldLeaveType];

		var obj = this.state.detail;
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
        var obj = this.state.detail;
        var msg = LeaveUtil.changeRemnantValue(obj, e.target.id, e.target.value);
        this.state.hints[e.target.id + 'Hint'] = msg;
        this.setState({
            modal: this.state.modal
        });
    },

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
        };
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
		
        var leaveType = this.state.leaveType;
        var remnant2 = this.state.leave2[leaveType];
        var fields = LeaveUtil.getRemnantFields(this);
        var detailFields = LeaveUtil.getAccruedFields2(this);

        var hints = this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改假日明细信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-leave-detail/update']}/>
			   		<Button key="btnOK" type="primary" size="large" disabled={leaveType==='' || remnant2===''}  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
                <Form layout={layout}>
                    <FormItem {...formItemLayout3} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                        <DictSelect name="leaveType" id="leaveType" value={this.state.detail.leaveType} appName='HR系统' optName='假期类型' onSelect={this.handleOnSelected2.bind(this, "leaveType")} />
                    </FormItem>
					<Row  gutter={20}>                    
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="effectDate" id="effectDate" value={this.formatMonth(this.state.detail.effectDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.monthFormat)} />
							</FormItem>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="失效日期" required={false} colon={true} className={layoutItem} help={hints.expiryDateHint} validateStatus={hints.expiryDateStatus}>
								<MonthPicker  style={{width:'100%'}}  name="expiryDate" id="expiryDate" value={this.formatMonth(this.state.detail.expiryDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"expiryDate", Common.monthFormat)} />
							</FormItem>
                        </Col>                             
                    </Row>
                    <FormItem {...formItemLayout3} label="应计天数" required={false} colon={true} className={layoutItem} help={hints.accruedHint} validateStatus={hints.accruedStatus}>
                        {detailFields.accruedFields}
                    </FormItem>
                    <FormItem {...formItemLayout3} label="已修天数" required={false} colon={true} className={layoutItem} help={hints.spendHint} validateStatus={hints.spendStatus}>
                        {detailFields.spendFields}
                    </FormItem>
                    <FormItem {...formItemLayout3} label="剩余天数" required={true} colon={true} className={layoutItem} help={hints.remnantHint} validateStatus={hints.remnantStatus}>
                        {detailFields.remnantFields}
                    </FormItem>
					<Row  gutter={20}>                    
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="补偿天数" required={false} colon={true} className={layoutItem} help={hints.replacementHint} validateStatus={hints.replacementStatus}>
								<Input type="number" name="replacement" id="replacement" value={this.state.detail.replacement } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} label="补偿金额" required={false} colon={true} className={layoutItem} help={hints.repAmountHint} validateStatus={hints.repAmountStatus}>
								<Input type="text" name="repAmount" id="repAmount" value={this.state.detail.repAmount } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>                             
                    </Row>
					
					<FormItem {...formItemLayout2} style={{margin:'40px 0 10px 0'}} label="调整前假日数量" required={false} colon={true} className={layoutItem}>
                        {fields.bfFields}
					</FormItem>
					<FormItem {...formItemLayout2} label="调整后假日数量" required={true} colon={true} className={layoutItem} help={hints.remnantHint} validateStatus={hints.remnantStatus}>
                        {fields.afFields}
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateLeaveDetailPage;
