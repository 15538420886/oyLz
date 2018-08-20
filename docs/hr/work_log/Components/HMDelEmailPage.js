import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';
import CompUserSelect from '../../../auth/user/Components/CompUserSelect'

var HMDelEmailPage = React.createClass({
	getInitialState : function() {
		return {
			authUserSet: {
				operation : '',
				errMsg : ''
			},
			hints: {},
			validRules: []
		}
	},
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
		];
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
		
		var hints=this.state.hints;
		return (
	   		<Form layout={layout}>
	   			<p style={{marginLeft:'25px',fontSize:'16px',color:'red',height:'34px'}}>请即时手工删除企业邮箱</p>
				<FormItem {...formItemLayout} label="企业邮箱" colon={true} className={layoutItem} help={hints.emailHint} validateStatus={hints.emailStatus}>
					<Input type="text" name="email" id="email" readOnly='true' value={this.props.email}/>
				</FormItem>
				
			</Form>
		);
	}
});

export default HMDelEmailPage;
