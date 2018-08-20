import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var PerformLogStore = require('../data/PerformLogStore.js');
var PerformLogActions = require('../action/PerformLogActions');

var CreatePerformLogPage = React.createClass({
	getInitialState : function() {
		return {
			performLogSet: {
                operation: '',
                errMsg: ''
            },
			loading: false,
			modal: false,
			performLog: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(PerformLogStore, "onServiceComplete"), ModalForm('performLog')],
	onServiceComplete: function(data) {
		if(this.state.modal){
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
					performLogSet: data
				});
			}
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'logDate', desc: '日期', max: 128,},
			{ id: 'channel', desc: '渠道', max: 256,},
			{ id: 'resumeCount', desc: '简历数量', max: 24,},
			{ id: 'interCount', desc: '面试数量', max: 24,},
			{ id: 'recruCount', desc: '录用数量', max: 24,},
		];
     
	},
	
	clear : function(filter){
		// FIXME 输入参数，对象初始化
		this.state.hints = {};
	//	this.state.performLog.uuid='';
		this.state.performLog.filter = filter;
		this.state.performLogSet.operation = '';
		this.state.performLog.logDate='';
		this.state.performLog.channel='';
		this.state.performLog.resumeCount='';
		this.state.performLog.interCount='';
		this.state.performLog.recruCount='';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.performLog)){
			this.state.performLogSet.operation = '';
			this.setState({loading: true});
            var filterObj = {};
            filterObj.filter = this.props.uuid;
            filterObj.object = this.state.performLog;
			PerformLogActions.createPerformLog(filterObj);
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
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加执行情况" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['perform-Log/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} className={layoutItem} label='日期' colon={true} help={hints.logDateHint} validateStatus={hints.logDateStatus}>
							<DatePicker  style={{width:'100%'}}  name="logDate" id="logDate"  format={Common.dateFormat} value={this.formatDate(this.state.performLog.logDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"logDate", Common.dateFormat)}/>
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='渠道' colon={true} help={hints.channelHint} validateStatus={hints.channelStatus}>
							<Input type='text' name='channel' id='channel' value={this.state.performLog.channel} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='简历数量' colon={true} help={hints.resumeCountHint} validateStatus={hints.resumeCountStatus}>
							<Input type='text' name='resumeCount' id='resumeCount' value={this.state.performLog.resumeCount} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='面试数量' colon={true} help={hints.interCountHint} validateStatus={hints.interCountStatus}>
							<Input type='text' name='interCount' id='interCount' value={this.state.performLog.interCount} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='录用数量' colon={true} help={hints.recruCountHint} validateStatus={hints.recruCountStatus}>
							<Input type='text' name='recruCount' id='recruCount' value={this.state.performLog.recruCount} onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreatePerformLogPage;