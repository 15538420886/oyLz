import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col ,Checkbox} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var HotelRoomStore = require('../data/HotelRoomStore.js');
var HotelRoomActions = require('../action/HotelRoomActions');

var UpdateHotelRoomPage = React.createClass({
	getInitialState : function() {
		return {
			hotelRoomSet: {},
			loading: false,
			modal: false,
			hotelRoom: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(HotelRoomStore, "onServiceComplete"), ModalForm('hotelRoom')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
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
				  hotelRoomSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'roomType', desc: '房型', required: true, max: 64,},
			{ id: 'breakfast', desc: '早餐', max: 12,},
			{ id: 'priceLow', desc: '最低价格', max: 16,},
			{ id: 'priceHigh', desc: '最高价格', max: 16,},
			{ id: 'memo2', desc: '备注', max: 512,},
		];
	},

	initPage: function(hotelRoom)
	{
		this.state.hints = {};
		Utils.copyValue(hotelRoom, this.state.hotelRoom);

		this.setState({
			loading : false
		});
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.hotelRoom)){
			this.setState({loading: true});
			this.state.hotelRoom.corpUuid = window.loginData.compUser.corpUuid;
			HotelRoomActions.updateHotelRoom( this.state.hotelRoom );
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
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改房间类型信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hotel_room/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} className={layoutItem} label='房型' required={true} colon={true} help={hints.roomTypeHint} validateStatus={hints.roomTypeStatus}>
									<Input type='text' name='roomType' id='roomType' value={this.state.hotelRoom.roomType} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} className={layoutItem} label='早餐' colon={true} help={hints.breakfastHint} validateStatus={hints.breakfastStatus}>
								<Checkbox name='breakfast' id='breakfast' checked={(this.state.hotelRoom.breakfast !== '0') ? true : false} onChange={this.handleCheckBox}>
								</Checkbox>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} className={layoutItem} label='最低价格' colon={true} help={hints.priceLowHint} validateStatus={hints.priceLowStatus}>
									<Input type='text' name='priceLow' id='priceLow' value={this.state.hotelRoom.priceLow} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} className={layoutItem} label='最高价格' colon={true} help={hints.priceHighHint} validateStatus={hints.priceHighStatus}>
									<Input type='text' name='priceHigh' id='priceHigh' value={this.state.hotelRoom.priceHigh} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>
							<FormItem {...formItemLayout} className={layoutItem} label='备注' colon={true} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
									<Input type="textarea" style={{height:'80px'}} name='memo2' id='memo2' value={this.state.hotelRoom.memo2} onChange={this.handleOnChange} />
							</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateHotelRoomPage;
