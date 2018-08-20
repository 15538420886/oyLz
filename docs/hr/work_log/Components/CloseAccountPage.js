import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';
import CompUserSelect from '../../../auth/user/Components/CompUserSelect'

var CloseAccountPage = React.createClass({
	getInitialState : function() {
		return {
			hints: {},
			validRules: []
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
		];
	},
	clear : function(corpUuid, deptUuid){
		this.state.hints = {};
	},

	onClickSave : function(){
		return true;
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

        var hints = this.state.hints;
        var corpUuid = window.loginData.compUser.corpUuid;
        var compUser = this.props.compUser;
        var compUserArr = compUser.userGroup ? compUser.userGroup.split(',') : [];

		return (
	   		<Form layout={layout}>
				<FormItem {...formItemLayout} label="用户名" colon={true} className={layoutItem}>
					<Input type="text" name="userName" id="userName" readOnly='true' value={compUser.userName}/>
				</FormItem>
				<FormItem {...formItemLayout} label="用户姓名" colon={true} className={layoutItem}>
					<Input type="text" name="perName" id="perName" readOnly='true' value={compUser.perName}/>
				</FormItem>
				<FormItem {...formItemLayout} label="用户类型" colon={true} className={layoutItem}>
					<DictSelect name="userType" id="userType" appName='用户管理' optName='用户类型' value={compUser.userType}/>
				</FormItem>
				<FormItem {...formItemLayout} label="员工编号" colon={true} className={layoutItem}>
					<Input type="text" name="userCode" id="userCode" value={compUser.userCode}/>
				</FormItem>
				<FormItem {...formItemLayout} label="职务" colon={true} className={layoutItem}>
					<Input type="text" name="userTitle" id="userTitle" value={compUser.userTitle}/>
				</FormItem>
				<FormItem {...formItemLayout} label="用户组" colon={true} className={layoutItem}>
	                <CompUserSelect corpUuid={corpUuid} name="userGroup" id="userGroup" value={compUserArr}/>
	            </FormItem>
			</Form>
		);
	}
});

export default CloseAccountPage;
