import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select,DatePicker, Table, Tabs, Row, Col, Spin} from 'antd';
import DictSelect from '../../../lib/Components/DictSelect';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var ContactTablePage = require('./Components/ContactTablePage');
var ContractStore = require('./data/ContractStore');
var ContractActions = require('./action/ContractActions');


var ContactPage = React.createClass({
	getInitialState : function() {
		return {
			contractSet: {
            	hc: {},
            	hcList: [],
                operation : '',
                errMsg : ''
            },
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(ContractStore, "onServiceComplete"), ModalForm('contract')],
	onServiceComplete: function(data) {
		if(data.operation === 'retrieve_p'){
				 this.setState({
	            loading: false,
	            contractSet: data
	        });
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.initPage();
	},

	initPage: function()
	{
		if(window.loginData.compUser){
			this.setState({loading: true});
			var filter = {};
			filter.corpUuid = window.loginData.compUser.corpUuid;
			filter.staffCode = window.loginData.compUser.userCode;
			ContractActions.initHrContract( filter );
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
		var form=(
			<Form layout={layout} style={{width:'600px'}}>
				<FormItem {...formItemLayout} className={layoutItem} label="合同编号" >
					<Input type="text" name="contCode" id="contCode" value={this.state.contractSet.hc.contCode } readOnly={true} />
				</FormItem>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="合同版本" >
							<Input type="text" name="contVer" id="contVer" value={this.state.contractSet.hc.contVer } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="岗位" >
							<Input type="text" name="jobName" id="jobName" value={this.state.contractSet.hc.jobName } readOnly={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="签订日期" >
							<Input type="text" name="signDate" id="signDate"   value={Common.formatDate(this.state.contractSet.hc.signDate, Common.dateFormat) } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="HR人员">
							<Input type="text" name="hrName" id="hrName" value={this.state.contractSet.hc.hrName } readOnly={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="生效日期" >
							<Input type="text" name="effectDate" id="effectDate"   value={Common.formatDate(this.state.contractSet.hc.effectDate, Common.dateFormat) } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="失效日期">
							<Input type="text" name="expiryDate" id="expiryDate"   value={Common.formatDate(this.state.contractSet.hc.expiryDate, Common.dateFormat) } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="签订地点" >
							<Input type="text" name="signLoc" id="signLoc" value={this.state.contractSet.hc.signLoc } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} className={layoutItem} label="签订方式" >
							<Input type="text"  name="signType" id="signType" value={Utils.getOptionName('简历系统', '签订方式',this.state.contractSet.hc.signType, true, this)} readOnly={true}/>
						</FormItem>
					</Col>
				</Row>
			</Form>
		);

		return (
			<div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
	        	<ServiceMsg ref='mxgBox' svcList={['hr_contract/retrieve_p', 'hr_contract/retrieveDetail']}/>
	        	{this.state.loading ? <Spin>{form}</Spin> : form}
	        	<ContactTablePage hcList={this.state.contractSet.hcList}  />
	        </div>
		);
	}
});

module.exports=ContactPage;
