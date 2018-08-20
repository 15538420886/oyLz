import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var WifiStore = require('../data/WifiStore.js');
var WifiActions = require('../action/WifiActions');

var UpdateWifiPage = React.createClass({
	getInitialState : function() {
		return {
			wifiSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			wifi: {},
			hints: {},
			validRules: []
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'wifiName', desc:'WIFI名称', required: true, max: 256},
          	{id: 'wifiId', desc:'WIFI编号', required: true, max: 256}
		];
	},

	initPage: function(wifi)
	{
		this.state.hints = {};
		Utils.copyValue(wifi, this.state.wifi);

		this.state.loading = false;
		this.state.wifiSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	handleOnChange : function(e) {
		var wifi = this.state.wifi;
		wifi[e.target.id] = e.target.value;
		Validator.validator(this, wifi, e.target.id);
		this.setState({
			wifi: wifi
		});
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.wifi)){
			this.state.wifiSet.operation = '';
			this.setState({loading: true});
			WifiActions.updateHrWifi( this.state.wifi );
		}
	},

	toggle : function() {
		this.setState({
			modal: !this.state.modal
		});
	},

	render : function() {
		if(this.state.modal && this.state.wifiSet.operation === 'update'){
			if(this.state.wifiSet.errMsg === ''){
				this.state.modal = false;
				return null;
			}
		}

		if( this.state.loading ){
		    if(this.state.wifiSet.operation === 'update'){
		        this.state.loading = false;
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
	        <Modal visible={this.state.modal} width='540px' title="修改WIFI信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	          footer={[
	          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			        <ServiceMsg ref='mxgBox' svcList={['hr-wifi/update']}/>
	           		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
	           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	           </div>
	          ]}
	        >
	       		<Form layout={layout}>
				    <FormItem {...formItemLayout} label="WIFI名称" colon={true} className={layoutItem} help={hints.wifiNameHint} validateStatus={hints.wifiNameStatus}>
						<Input type="text" name="wifiName" id="wifiName" value={this.state.wifi.wifiName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="WIFI编号" colon={true} className={layoutItem} help={hints.wifiIdHint} validateStatus={hints.wifiIdStatus}>
						<Input type="text" name="wifiId" id="wifiId" value={this.state.wifi.wifiId} onChange={this.handleOnChange}/>
					</FormItem>
	        	</Form>
	        </Modal>
	    );
	}
});

ReactMixin.onClass(UpdateWifiPage, Reflux.connect(WifiStore, 'wifiSet'));
export default UpdateWifiPage;
