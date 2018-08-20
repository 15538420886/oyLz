import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import SearchEmployee from '../../lib/Components/SearchEmployee';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker;
var DeviceStore = require('../data/DeviceStore.js');
var DeviceActions = require('../action/DeviceActions');

var UpdateDevicePage = React.createClass({
	getInitialState : function() {
		return {
			deviceSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			device: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(DeviceStore, "onServiceComplete"), ModalForm('device')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  deviceSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'deptName', desc:'部门名称', required: false, max: '128'},
			{id: 'devName', desc:'设备名称', required: false, max: '64'},
			{id: 'devAllow', desc:'设备补贴', required: false, max: '16'},
			{id: 'devPrice', desc:'采购价格', required: false, max: '16'},
			{id: 'effectDate', desc:'开始月份', required: false, max: '24'},
			{id: 'expiryDate', desc:'结束月份', required: false, max: '24'},
			{id: 'approver', desc:'审批人', required: false, max: '24'},
			{id: 'appDate', desc:'审批日期', required: false, max: '24'},
			{id: 'appMemo', desc:'审批备注', required: false, max: '1024'},
		];
		this.initPage( this.props.device );
	},
    componentWillReceiveProps: function (newProps) {
        /*if (newProps.device.uuid !== this.state.device.uuid) {
            this.initPage(newProps.device);
        }*/
	},
	initPage: function(device)
	{
		Utils.copyValue(device, this.state.device);

		this.setState( {loading: false, hints: {}} );
		this.state.deviceSet.operation='';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.device)){
			this.state.deviceSet.operation = '';
			this.setState({loading: true});
			DeviceActions.updateHrDevice( this.state.device );
		}
	},

	goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改设备补贴" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
					 <div style={{padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
						 <ServiceMsg ref='mxgBox' svcList={['hr_device/update']}/>

					 	<Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.device.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.device.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="deptName" id="deptName" value={this.state.device.deptName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>

								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="设备名称" required={false} colon={true} className={layoutItem} help={hints.devNameHint} validateStatus={hints.devNameStatus}>
											<Input type="text" name="devName" id="devName" value={this.state.device.devName} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="采购价格" required={false} colon={true} className={layoutItem} help={hints.devPriceHint} validateStatus={hints.devPriceStatus}>
											<Input type="text" name="devPrice" id="devPrice" value={this.state.device.devPrice} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="补贴金额" required={false} colon={true} className={layoutItem} help={hints.devAllowHint} validateStatus={hints.devAllowStatus}>
											<Input type="text" name="devAllow" id="devAllow" value={this.state.device.devAllow} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="开始月份" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
											 <MonthPicker  style={{width:'100%'}}  name="effectDate" id="effectDate" value={this.formatMonth(this.state.device.effectDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.monthFormat)} />
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结束月份" required={false} colon={true} className={layoutItem} help={hints.expiryDateHint} validateStatus={hints.expiryDateStatus}>
											  <MonthPicker  style={{width:'100%'}}  name="expiryDate" id="expiryDate" value={this.formatMonth(this.state.device.expiryDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"expiryDate", Common.monthFormat)} />
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approverHint} validateStatus={hints.approverStatus}>
											<Input type="text" name="approver" id="approver" value={this.state.device.approver} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="审批日期" required={false} colon={true} className={layoutItem} help={hints.appDateHint} validateStatus={hints.appDateStatus}>
											 <DatePicker  style={{width:'100%'}}  name="appDate" id="appDate"  value={this.formatDate(this.state.device.appDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"appDate", Common.dateFormat)} />
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="备注" colon={true} className={layoutItem} help={hints.appMemoHint} validateStatus={hints.appMemoStatus}>
									<Input type="textarea" name="appMemo" id="appMemo" value={this.state.device.appMemo} onChange={this.handleOnChange}/>
								</FormItem>
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
									<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
								</FormItem>
							</Form>
                        </div>
                    </TabPane>
                </Tabs>
			</div>
		);
	}
});

export default UpdateDevicePage;
