'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import CodeMap from '../../../hr/lib/CodeMap';
var Common = require('../../../public/script/common');
import { Form, Row, Col, Button, Input, Spin} from 'antd';
const FormItem = Form.Item;

var DeviceStore = require('./data/DeviceStore.js');
var DeviceActions = require('./action/DeviceActions');


var DevicePage = React.createClass({
	getInitialState : function() {
		return {
			deviceSet: {
				device: {},
				operation : '',
				errMsg : ''
			},

			loading: false,
		}
	},
	mixins: [Reflux.listenTo(DeviceStore, "onServiceComplete"),CodeMap()],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve_p'){
			this.setState({
				loading: false,
				deviceSet: data,
			});
		}
	},

		// 第一次加载
	componentDidMount : function(){
		if(window.loginData.compUser){
			var filter = {};
			filter.staffCode=window.loginData.compUser.userCode;
			filter.corpUuid=window.loginData.compUser.corpUuid;
			this.setState({loading: true});
			DeviceActions.initHrDevice(filter);
		}
		
	},

	render : function() {
		var corpUuid= window.loginData.compUser.corpUuid;
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		const form = <Form layout={layout} style={{width:'640px'}}>
						<Row>
							<Col span="12">
								<FormItem {...formItemLayout2} label="员工编号" className={layoutItem} >
									<Input type="text" name="staffCode" id="staffCode" value={this.state.deviceSet.device.staffCode } readOnly={true}/>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem {...formItemLayout2} label="任职部门" className={layoutItem} >
									<Input type="text" name="deptName" id="deptName" value={this.state.deviceSet.device.deptName } readOnly={true}/>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<FormItem {...formItemLayout2} label="设备名称" className={layoutItem} >
									<Input type="text" name="devName" id="devName" value={this.state.deviceSet.device.devName} readOnly={true}/>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem {...formItemLayout2} label="采购价格" className={layoutItem} >
									<Input type="text" name="devPrice" id="devPrice" value={this.state.deviceSet.device.devPrice} readOnly={true}/>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<FormItem {...formItemLayout2} label="补贴金额" className={layoutItem} >
									<Input type="text" name="devAllow" id="devAllow" value={this.state.deviceSet.device.devAllow} readOnly={true}/>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<FormItem {...formItemLayout2} label="开始月份" className={layoutItem} >
									<Input type="text"  name="effectDate" id="effectDate" value={Common.formatMonth(this.state.deviceSet.device.effectDate, Common.monthFormat)} readOnly={true}/>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem {...formItemLayout2} label="结束月份" className={layoutItem} >
									<Input type="text"  name="expiryDate" id="expiryDate" value={Common.formatMonth(this.state.deviceSet.device.expiryDate, Common.monthFormat)} readOnly={true}/>
								</FormItem>
							</Col>
						</Row>
						<FormItem {...formItemLayout} label="备注" className={layoutItem} >
							<Input type="textarea" name="appMemo" id="appMemo" value={this.state.deviceSet.device.appMemo} readOnly={true}/>
						</FormItem>
					</Form>
		return (
			<div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr_device/retrieve_p']}/>
				{
					this.state.loading? <Spin>{form}</Spin>:form
				}
			</div>			
		);
	}
});

module.exports = DevicePage;

/*
<Row>
	<Col span="12">
		<FormItem {...formItemLayout2} label="审批人" className={layoutItem} >
			<Input type="text" name="approver" id="approver" value={this.state.deviceSet.device.approver} readOnly={true}/>
		</FormItem>
	</Col>
	<Col span="12">
		<FormItem {...formItemLayout2} label="审批日期" className={layoutItem} >
				<Input type="text"  name="appDate" id="appDate"  value={Common.formatDate(this.state.deviceSet.device.appDate, Common.dateFormat)} readOnly={true}/>
		</FormItem>
	</Col>
</Row>
*/