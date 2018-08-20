import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import CitySelect from '../../lib/Components/CitySelect';

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var TripParamStore = require('../data/TripParamStore.js');
var TripParamActions = require('../action/TripParamActions');

var UpdateTripParamPage = React.createClass({
	getInitialState : function() {
		return {
			tripParamSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			tripParam: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(TripParamStore, "onServiceComplete"), ModalForm('tripParam')],
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
				  tripParamSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'cityType', desc:'城市类型', required: false, max: '16'},
			{id: 'allowance', desc:'出差补贴', required: true, max: '16'},
			{id: 'traffic', desc:'交通补贴', required: false, max: '256'},
			{id: 'taxiPort', desc:'机场打车说明', required: false, max: '256'},
			{id: 'taxiCity', desc:'市内打车说明', required: false, max: '256'},
			{id: 'hotelMemo', desc:'酒店说明', required: false, max: '256'},
			{id: 'foodMemo', desc:'餐补说明', required: false, max: '256'},
		];
	},

	onCitySelectChange : function(cityType, option){
		this.state.tripParam['cityType'] = cityType;
		this.setState({
			loading: this.state.loading
		});
  },

	initPage: function(tripParam)
	{
		this.state.hints = {};
		Utils.copyValue(tripParam, this.state.tripParam);

		this.state.loading = false;
		this.state.tripParamSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.tripParam)){
			this.state.tripParamSet.operation = '';
			this.setState({loading: true});
			TripParamActions.updateHrBizTripParam( this.state.tripParam );
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
			<Modal visible={this.state.modal} width='540px' title="修改额度信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-biz-trip-param/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="城市类型" colon={true} className={layoutItem} help={hints.cityTypeHint} validateStatus={hints.cityTypeStatus}>
						<CitySelect style={{marginBottom:'10px',width: 200}} value={this.state.tripParam.cityType} onSelect={this.handleOnSelected.bind(this, "cityType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="出差补贴" colon={true} className={layoutItem} help={hints.allowanceHint} validateStatus={hints.allowanceStatus}>
						<Input type="text" name="allowance" id="allowance" value={this.state.tripParam.allowance} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="交通补贴" colon={true} className={layoutItem} help={hints.trafficHint} validateStatus={hints.trafficStatus}>
						<Input type="textarea" name="traffic" id="traffic" value={this.state.tripParam.traffic} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="机场打车说明" colon={true} className={layoutItem} help={hints.taxiPortHint} validateStatus={hints.taxiPortStatus}>
						<Input type="textarea" name="taxiPort" id="taxiPort" value={this.state.tripParam.taxiPort} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="市内打车说明" colon={true} className={layoutItem} help={hints.taxiCityHint} validateStatus={hints.taxiCityStatus}>
						<Input type="textarea" name="taxiCity" id="taxiCity" value={this.state.tripParam.taxiCity} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="酒店说明" colon={true} className={layoutItem} help={hints.hotelMemoHint} validateStatus={hints.hotelMemoStatus}>
						<Input type="textarea" name="hotelMemo" id="hotelMemo" value={this.state.tripParam.hotelMemo} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="餐补说明" colon={true} className={layoutItem} help={hints.foodMemoHint} validateStatus={hints.foodMemoStatus}>
						<Input type="textarea" name="foodMemo" id="foodMemo" value={this.state.tripParam.foodMemo} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateTripParamPage;
