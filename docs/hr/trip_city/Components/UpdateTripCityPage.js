import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var TripCityStore = require('../data/TripCityStore.js');
var TripCityActions = require('../action/TripCityActions');

var UpdateTripCityPage = React.createClass({
	getInitialState : function() {
		return {
			tripCitySet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			tripCity: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(TripCityStore, "onServiceComplete"), ModalForm('tripCity')],
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
				  tripCitySet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'cityType', desc:'城市类型', required: true, max: '32'},
			{id: 'cityList', desc:'城市列表', required: true, max: '512'},
			{id: 'cityDesc', desc:'说明', required: false, max: '256'},
		];
	},
	
	initPage: function(tripCity)
	{
		this.state.hints = {};
		Utils.copyValue(tripCity, this.state.tripCity);
		
		this.state.loading = false;
		this.state.tripCitySet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.tripCity)){
			this.state.tripCitySet.operation = '';
			this.setState({loading: true});
			TripCityActions.updateHrTripCity( this.state.tripCity );
		}
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改城市信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_trip_city/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="城市类型" required={true} colon={true} className={layoutItem} help={hints.cityTypeHint} validateStatus={hints.cityTypeStatus}>
						<Input type="text" name="cityType" id="cityType" value={this.state.tripCity.cityType} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="城市列表" required={true} colon={true} className={layoutItem} help={hints.cityListHint} validateStatus={hints.cityListStatus}>
						<Input type="text" name="cityList" id="cityList" value={this.state.tripCity.cityList} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="城市说明" colon={true} className={layoutItem} help={hints.cityDescHint} validateStatus={hints.cityDescStatus}>
						<Input type="text" name="cityDesc" id="cityDesc" value={this.state.tripCity.cityDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateTripCityPage;

