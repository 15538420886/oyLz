import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var BizTripStore = require('../data/BizTripStore.js');
var BizTripActions = require('../action/BizTripActions');

var CreateBizTripPage = React.createClass({
	getInitialState : function() {
		return {
			bizTripSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			bizTrip: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(BizTripStore, "onServiceComplete"), ModalForm('bizTrip')],
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
	              bizTripSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'tripName', desc:'差旅级别', required: true, max: '32'},
			{id: 'tripDesc', desc:'差旅说明', required: false, max: '256'},
		];
	},
	
	clear : function(corpUuid){
		this.state.hints = {};
		this.state.bizTrip.uuid='';
		this.state.bizTrip.corpUuid = corpUuid;
		this.state.bizTrip.tripName='';
		this.state.bizTrip.tripDesc='';
		
		this.state.loading = false;
	    this.state.bizTripSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.bizTrip)){
			this.state.bizTripSet.operation = '';
			this.setState({loading: true});
			BizTripActions.createHrBizTrip( this.state.bizTrip );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加差旅级别" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_biz_trip/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="差旅级别" required={true} colon={true} className={layoutItem} help={hints.tripNameHint} validateStatus={hints.tripNameStatus}>
						<Input type="text" name="tripName" id="tripName" value={this.state.bizTrip.tripName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="差旅说明" colon={true} className={layoutItem} help={hints.tripDescHint} validateStatus={hints.tripDescStatus}>
						<Input type="text" name="tripDesc" id="tripDesc" value={this.state.bizTrip.tripDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateBizTripPage;

