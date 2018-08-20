import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Validator = require('../../../public/script/common');
import DictSelect from '../../../lib/Components/DictSelect';
import CompUserSelect from './CompUserSelect'
var CompUserStore = require('../data/CompUserStore.js');
var CompUserActions = require('../action/CompUserActions');

var CompUserPage = React.createClass({
	getInitialState : function() {
		return {
			compUserSet: {
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
	clear : function(corpUuid, deptUuid){
		this.state.hints = {};
	},

	handleOnChange : function(e) {
		var compUser = this.props.compUser;
		compUser[e.target.id] = e.target.value;
		Validator.validator(this, compUser, e.target.id);
		this.setState({
			compUserSet: this.state.compUserSet
		});
	},

	handleOnSelected : function(id, value, option) {
		var compUser = this.props.compUser;
		compUser[id] = value;
		Validator.validator(this, compUser, id);
		this.setState({
			compUserSet: this.state.compUserSet
		});
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.props.compUser)){
			CompUserActions.createCompUser( this.props.compUser );
			return true;
		}

		return false;
	},
	selectCompUser : function(value) {
        var compUser = this.props.compUser;
        var arr = compUser.userGroup? compUser.userGroup.split(','):[];
        arr.push(value);
        compUser.userGroup = arr.join(',');
        this.setState({
            loading: this.state.loading,
        });
    },

    deSelectCompUser: function(value){
        var compUser = this.props.compUser;
        var arr = compUser.userGroup.split(',');
        for(var i=0; i<arr.length; i++){
            if(arr[i] === value){
                arr.splice(i,1);
                break;
            }
        }
        compUser.userGroup = arr.join(',');
        this.setState({
            loading: this.state.loading
        });
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		var corpUuid = this.props.corpUuid;
		var compUserArr = this.props.compUser.userGroup ? this.props.compUser.userGroup.split(','):[];
		var hints=this.state.hints;
		return (
	   		<Form layout={layout}>
				<FormItem {...formItemLayout} label="用户名" colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
					<Input type="text" name="userName" id="userName" readOnly='true' value={this.props.compUser.userName} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="用户姓名" colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
					<Input type="text" name="perName" id="perName" readOnly='true' value={this.props.compUser.perName} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="用户类型" colon={true} className={layoutItem} help={hints.userTypeHint} validateStatus={hints.userTypeStatus}>
					<DictSelect name="userType" id="userType" appName='用户管理' optName='用户类型' value={this.props.compUser.userType} onSelect={this.handleOnSelected.bind(this, "userType")}/>
				</FormItem>
				<FormItem {...formItemLayout} label="员工编号" colon={true} className={layoutItem} help={hints.userCodeHint} validateStatus={hints.userCodeStatus}>
					<Input type="text" name="userCode" id="userCode" value={this.props.compUser.userCode} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="职务" colon={true} className={layoutItem} help={hints.userTitleHint} validateStatus={hints.userTitleStatus}>
					<Input type="text" name="userTitle" id="userTitle" value={this.props.compUser.userTitle} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem {...formItemLayout} label="用户组" colon={true} className={layoutItem} help={hints.userGroupHint} validateStatus={hints.userGroupStatus} >
	                <CompUserSelect corpUuid={corpUuid} name="userGroup" id="userGroup" value={compUserArr} onSelect={this.selectCompUser} onDeselect={this.deSelectCompUser}/>
	            </FormItem>
			</Form>
		);
	}
});

ReactMixin.onClass(CompUserPage, Reflux.connect(CompUserStore, 'compUserSet'));
export default CompUserPage;
