import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select,DatePicker, Row, Col} from 'antd';
import DictSelect from '../../../lib/Components/DictSelect';
const FormItem = Form.Item;

var DetailsFromPage = React.createClass({
	getInitialState : function() {
		return{
			contract: {},
		};
	},
	// 第一次加载
	componentDidMount : function(){
	},
	initPage: function(contract)
	{
		this.setState({contract: contract});
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

		return (
			<div style={{width:'600px'}}>
			   	<Form layout={layout}>
					<FormItem {...formItemLayout} label="合同编号" required={false} colon={true} className={layoutItem}>
						<Input type="text" name="contCode" id="contCode" value={this.state.contract.contCode }   />
					</FormItem>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="合同版本" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="contVer" id="contVer" value={this.state.contract.contVer } />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="岗位" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="jobName" id="jobName" value={this.state.contract.jobName }  />
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="签订地点" required={false} colon={true} className={layoutItem}>
								<Input type="text" name="signLoc" id="signLoc" value={this.state.contract.signLoc }  />
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="签订方式" required={false} colon={true} className={layoutItem}>
								<DictSelect name="signType" id="signType" value={this.state.contract.signType}  appName='HR系统' optName='签订方式' />
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
});

export default DetailsFromPage;
