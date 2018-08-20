import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Context = require('../../CampContext');
var SeatStore = require('../data/SeatStore.js');
var SeatActions = require('../action/SeatActions');

var RegSeatPage = React.createClass({
	getInitialState : function() {
		return {
			modal: false,
			user: {},
			hints: {},
			validRules: [],
			errMsg: '',
			operation: '',
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
          {id: 'userName', desc:'用户名', required: true},
          {id: 'posType', desc:'签到类型', required: true},
          {id: 'roomUuid', desc:'房间号', required: true},
          {id: 'seatUuid', desc:'工位号', required: true}
		];
	},

	clear : function(seat){
		this.state.hints = {};
		this.state.user.roomUuid = seat.roomUuid;
		this.state.user.seatUuid = seat.uuid;
		this.state.user.wifiName = 'LZ_AP1';
		this.state.user.posSite = 'N/A';
		this.state.user.seatCode = Context.selectedRoom.roomCode+'@'+seat.seatCode;
		this.state.user.userName = window.loginData.authUser.userName;

		var d=new Date();
		this.state.user.posDate = ''+(d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate());
		this.state.user.posTime = ''+(d.getHours()*10000 + d.getMinutes()*100 + d.getSeconds());
	},
	handleOnChange : function(e) {
		var user = this.state.user;
		user[e.target.id] = e.target.value;
		Validator.validator(this, user, e.target.id);
		this.setState({
			user: user
		});
	},
	handleOnSelected : function(id, value, option) {
		var user = this.state.user;
		user[id] = value;
		Validator.validator(this, user, id);
		this.setState({
			user: this.state.user
		});
	},
	showError: function(msg)
	{
		this.setState({
			errMsg: msg
		});
	},

	onClickSave : function(){
		if(!Validator.formValidator(this, this.state.user)){
			return;
		}

		var self = this;
		var url = Utils.campUrl+'pos-service/register';
		Utils.doCreateService(url, this.state.user).then(function(result) {
			// console.log(result)
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.onSuccess( result.object );
			}
			else{
				self.showError("处理错误["+result.errCode+"]["+result.errDesc+"]");
			}
		}, function(xhr,errorText,errorType) {
			 self.showError('未知错误');
		});
	},
	onSuccess: function(result){
		this.setState({
			operation: 'reg'
		});
	},

	toggle : function(){
		this.setState({
			modal: !this.state.modal
		});

		if( !this.state.modal ){
			this.state.operation='';
		}
	},

	onDismiss : function(){
		this.setState({
			errMsg: ''
		});
	},

	render : function(){
		var errMsg = '';
		if(this.state.modal){
			if(this.state.errMsg != ''){
				errMsg = this.state.errMsg;
			}
			else if(this.state.operation === 'reg'){
				this.state.modal = false;
			}
		}

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="定位测试" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ErrorMsg message={errMsg} toggle={this.onDismiss}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="用户名" colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
						<Input type="text" name="userName" id="userName" value={this.state.user.userName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="定位类型" colon={true} className={layoutItem} help={hints.posTypeHint} validateStatus={hints.posTypeStatus}>
						<Select name="posType" id="posType" value={this.state.user.posType} onSelect={this.handleOnSelected.bind(this, "posType")}>
							<Option value="check_in">签到</Option>
							<Option value="check_out">签退</Option>
							<Option value="booking">预订</Option>
							<Option value="free">取消预订</Option>
						</Select>
					</FormItem>
					<FormItem {...formItemLayout} label="日期" colon={true} className={layoutItem} help={hints.posDateHint} validateStatus={hints.posDateStatus}>
						<Input type="text" name="posDate" id="posDate" value={this.state.user.posDate} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="时间" colon={true} className={layoutItem} help={hints.posTimeHint} validateStatus={hints.posTimeStatus}>
						<Input type="text" name="posTime" id="posTime" value={this.state.user.posTime} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="房间" colon={true} className={layoutItem} help={hints.roomUuidHint} validateStatus={hints.roomUuidStatus}>
						<Input type="text" name="roomUuid" id="roomUuid" value={this.state.user.roomUuid} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工位" colon={true} className={layoutItem} help={hints.seatUuidHint} validateStatus={hints.seatUuidStatus}>
						<Input type="text" name="seatUuid" id="seatUuid" value={this.state.user.seatUuid} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="工位编号" colon={true} className={layoutItem} help={hints.seatCodeHint} validateStatus={hints.seatCodeStatus}>
						<Input type="text" name="seatCode" id="seatCode" value={this.state.user.seatCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="定位信息" colon={true} className={layoutItem} help={hints.posSiteHint} validateStatus={hints.posSiteStatus}>
						<Input type="text" name="posSite" id="posSite" value={this.state.user.posSite} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="WIFI名称" colon={true} className={layoutItem} help={hints.wifiNameHint} validateStatus={hints.wifiNameStatus}>
						<Input type="text" name="wifiName" id="wifiName" value={this.state.user.wifiName} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default RegSeatPage;
