import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ServiceForm = React.createClass({
	getInitialState : function() {
		return {
			service: {}
		}
	},

	loadData : function(service){
		this.setState({
			service: service
		});
	},
	
	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};
    
	    return (
       		<Form layout={layout}>
			    <FormItem {...formItemLayout} label="接口编号" colon={true} className={layoutItem}>
					<Input type="text" name="txnName" id="txnName" value={this.state.service.txnName}/>
				</FormItem>
			    <FormItem {...formItemLayout} label="接口类型" colon={true} className={layoutItem}>
					<Input type="text" name="methodType" id="methodType" value={this.state.service.methodType}/>
				</FormItem>
			    <FormItem {...formItemLayout} label="授权级别" colon={true} className={layoutItem}>
					<Input type="text" name="authType" id="authType" value={this.state.service.authType}/>
				</FormItem>
			    <FormItem {...formItemLayout} label="类名称" colon={true} className={layoutItem}>
					<Input type="text" name="clazzName" id="clazzName" value={this.state.service.clazzName}/>
				</FormItem>
			    <FormItem {...formItemLayout} label="方法名称" colon={true} className={layoutItem}>
					<Input type="text" name="funcName" id="funcName" value={this.state.service.funcName}/>
				</FormItem>
			    <FormItem {...formItemLayout} label="接口说明" colon={true} className={layoutItem}>
					<Input type="text" name="funcDesc" id="funcDesc" value={this.state.service.funcDesc}/>
				</FormItem>
        	</Form>
	    );
	}
});

export default ServiceForm;

