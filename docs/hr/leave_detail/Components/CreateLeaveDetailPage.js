import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var LeaveUtil = require('../../leave/LeaveUtil');

import { Form, Modal, Button, Input, Select, DatePicker, Col} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var LeaveDetailStore = require('../data/LeaveDetailStore.js');
var LeaveDetailActions = require('../action/LeaveDetailActions');
var LeaveActions = require('../../leave/action/LeaveActions');

var CreateLeaveDetailPage = React.createClass({
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
	  if(this.state.modal && data.operation === 'create'){
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
			{id: 'accrued', desc:'应计天数', required: true, max: '16'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'expiryDate', desc:'失效日期', required: false, max: '24'},
			{id: 'remnant', desc:'剩余天数', required: false, max: '16'},
		];
	},
	
    clear: function (userUuid, leave) {
        var d = new Date();
		this.state.hints = {};
		this.state.detail.uuid='';
		this.state.detail.userUuid = userUuid;
        this.state.detail.leaveType ='dayoff';
		this.state.detail.accrued='';
        this.state.detail.effectDate = ''+(d.getFullYear() * 100 + (d.getMonth() + 1));
        this.state.detail.expiryDate = ''+((1+d.getFullYear()) * 100 + (d.getMonth() + 1));
		this.state.detail.remnant='';
		this.state.detail.spend='0';
		this.state.detail.replacement='0';
		this.state.detail.repAmount='0';
		
		this.state.leave = leave;
		Utils.copyValue(leave, this.state.leave2);

        this.state.leaveType = 'dayoff';
	    this.state.detailSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
        }

        this.setState({ loading: false });
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.detail)){
			this.state.detailSet.operation = '';
			this.setState({loading: true});

			this.state.detail.remnant = this.state.detail.accrued;
			var obj = {
				"leave":this.state.leave2,
				"detail":this.state.detail,
			};

			LeaveDetailActions.createHrLeaveDetailWithLeave( obj );
		}
	},

    getRemnant: function (oldValue){
        var accrued = this.state.detail.accrued;
        return LeaveUtil.getRemnant(oldValue, accrued);
	},
	handleOnSelected2 : function(id, value) {
		var oldLeaveType = this.state.leaveType;
		if(oldLeaveType!==""){
			this.state.leave2[oldLeaveType] = this.state.leave[oldLeaveType];
		}

		var remnant1 = this.state.leave[value];
		this.state.leave2[value] = this.getRemnant(remnant1);

		var obj = this.state.detail;
		obj[id] = value;
		Common.validator(this, obj, id);
		this.setState({
			modal: this.state.modal,
			leaveType:value,
		});
	},
    handleOnChange3: function (e) {
        // 明细
        var obj = this.state.detail;
        var msg = LeaveUtil.changeRemnantValue(obj, e.target.id, e.target.value);
        this.state.hints[e.target.id + 'Hint'] = msg;
        
		var leaveType = this.state.leaveType;
		var remnant1 = this.state.leave[leaveType];
        this.state.leave2[leaveType] = this.getRemnant(remnant1);

        this.setState({
            modal: this.state.modal
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

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
        };

        var leaveType = this.state.leaveType;
        var remnant1 = this.state.leave[leaveType];
        var remnant2 = this.state.leave2[leaveType]; 
        var fields = LeaveUtil.getRemnantFields(this);
        var accruedFields = LeaveUtil.getAccruedFields(this);
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加假日明细" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-leave-detail/create']}/>
					<Button key="btnOK" type="primary" size="large" disabled={leaveType==='' || remnant1===remnant2 || remnant2===''} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
						<DictSelect name="leaveType" id="leaveType" value={this.state.detail.leaveType} appName='HR系统' optName='假期类型' onSelect={this.handleOnSelected2.bind(this, "leaveType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="应计天数" required={true} colon={true} className={layoutItem} help={hints.accruedHint} validateStatus={hints.accruedStatus}>
                        {accruedFields.accruedFields}
					</FormItem>
					<FormItem {...formItemLayout} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
						<MonthPicker  style={{width:'100%'}}  name="effectDate" id="effectDate" value={this.formatMonth(this.state.detail.effectDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.monthFormat)} />
					</FormItem>
					<FormItem {...formItemLayout} label="失效日期" required={false} colon={true} className={layoutItem} help={hints.expiryDateHint} validateStatus={hints.expiryDateStatus}>
						<MonthPicker  style={{width:'100%'}}  name="expiryDate" id="expiryDate" value={this.formatMonth(this.state.detail.expiryDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"expiryDate", Common.monthFormat)} />
					</FormItem>
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

export default CreateLeaveDetailPage;