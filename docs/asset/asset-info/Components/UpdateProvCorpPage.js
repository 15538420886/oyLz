import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Tabs, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import DictSelect from '../../../lib/Components/DictSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ProvCorpStore = require('../data/ProvCorpStore.js');
var ProvCorpActions = require('../action/ProvCorpActions');

var ProvCorpStore = require('../data/ProvCorpStore.js');
var ProvCorpActions = require('../action/ProvCorpActions');

var UpdateProvCorpPage = React.createClass({
	getInitialState : function() {
		return {
			provCorpSet: {},
			loading: false,
			modal: false,
			provCorp: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProvCorpStore, "onServiceComplete"), ModalForm('provCorp')],
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
				  provCorpSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'cityName', desc: '城市',  max: 24,},
			{ id: 'provName', desc: '名称', required: true, max: 24,},
			{ id: 'provLevel', desc: '合作级别',  max: 24,},
			{ id: 'provType', desc: '类别',  max: 24,},
			{ id: 'merchType', desc: '商户类型',  max: 24,},
			{ id: 'provScope', desc: '经营范围', max: 2048,},
			{ id: 'address', desc: '地址', max: 256,},
			{ id: 'phoneno', desc: '电话', max: 24,},
		];
	},

	initPage: function(provCorp)
	{
		this.state.hints = {};
		Utils.copyValue(provCorp, this.state.provCorp);

		this.state.loading = false;
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.provCorp)){
			this.setState({loading: true});
			this.state.provCorp.corpUuid = window.loginData.compUser.corpUuid;
			ProvCorpActions.updateProvCorp( this.state.provCorp ,this.props.provCorp);
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
			<Modal visible={this.state.modal} width='540px' title="修改供应商信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['prov-corp/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
						<FormItem {...formItemLayout} className={layoutItem} label='名称' required={true} colon={true} help={hints.provNameHint} validateStatus={hints.provNameStatus}>
								<Input type='text' name='provName' id='provName' value={this.state.provCorp.provName} onChange={this.handleOnChange} />
						</FormItem>
						<Row>
							<Col span="12">
									<FormItem {...formItemLayout2} className={layoutItem} label='商户类型'  colon={true} help={hints.merchTypeHint} validateStatus={hints.merchTypeStatus}>
											<DictSelect name="merchType" id="merchType" value={this.state.provCorp.merchType} appName='固定资产' optName='商户类型' onSelect={this.handleOnSelected.bind(this, "merchType")}/>
									</FormItem>
							</Col>
							<Col span="12">
									<FormItem {...formItemLayout2} className={layoutItem} label='城市'  colon={true} help={hints.cityNameHint} validateStatus={hints.cityNameStatus}>
											<Input type='text' name='cityName' id='cityName' value={this.state.provCorp.cityName} onChange={this.handleOnChange} />
									</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
									<FormItem {...formItemLayout2} className={layoutItem} label='地址' colon={true} help={hints.addressHint} validateStatus={hints.addressStatus}>
											<Input type='text' name='address' id='address' value={this.state.provCorp.address} onChange={this.handleOnChange} />
									</FormItem>
							</Col>
							<Col span="12">
									<FormItem {...formItemLayout2} className={layoutItem} label='电话' colon={true} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
											<Input type='text' name='phoneno' id='phoneno' value={this.state.provCorp.phoneno} onChange={this.handleOnChange} />
									</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
									<FormItem {...formItemLayout2} className={layoutItem} label='类别'  colon={true} help={hints.provTypeHint} validateStatus={hints.provTypeStatus}>
											<DictSelect name="provType" id="provType" value={this.state.provCorp.provType} appName='固定资产' optName='供应商类别' onSelect={this.handleOnSelected.bind(this, "provType")}/>
									</FormItem>
							</Col>
							<Col span="12">
									<FormItem {...formItemLayout2} className={layoutItem} label='合作级别'  colon={true} help={hints.provLevelHint} validateStatus={hints.provLevelStatus}>
											<DictSelect name="provLevel" id="provLevel" value={this.state.provCorp.provLevel} appName='固定资产' optName='合作级别' onSelect={this.handleOnSelected.bind(this, "provLevel")}/>
									</FormItem>
							</Col>
						</Row>
						<FormItem {...formItemLayout} className={layoutItem} label='经营范围' colon={true} help={hints.provScopeHint} validateStatus={hints.provScopeStatus}>
								<Input type='textarea' style={{height:'120px'}} name='provScope' id='provScope' value={this.state.provCorp.provScope} onChange={this.handleOnChange} />
						</FormItem>

				</Form>
			</Modal>
		);
	}
});

export default UpdateProvCorpPage;
