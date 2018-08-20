import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import DictSelect from '../../../lib/Components/DictSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import CompUserSelect from './CompUserSelect'
var CompUserStore = require('../data/CompUserStore.js');
var CompUserActions = require('../action/CompUserActions');

var UpdateCompUserPage = React.createClass({
	getInitialState : function() {
		return {
			compUserSet: {
				operation : '',
				errMsg : ''
			},

			modal: false,
			compUser: {},
			hints: {},
			validRules: []
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
		];
	},

	initPage: function(compUser)
	{
		this.state.hints = {};
		Utils.copyValue(compUser, this.state.compUser);

		this.state.compUserSet.operation='';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
        	this.refs.mxgBox.clear();
        }
	},

	handleOnChange : function(e) {
		var compUser = this.state.compUser;
		compUser[e.target.id] = e.target.value;
		Validator.validator(this, compUser, e.target.id);
		this.setState({
			compUser: compUser
		});
	},

	handleOnSelected : function(id, value, option) {
		var compUser = this.state.compUser;
		compUser[id] = value;
		Validator.validator(this, compUser, id);
		this.setState({
			compUser: compUser
		});
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.compUser)){
			CompUserActions.updateCompUser( this.state.compUser );
		}
	},

	toggle : function() {
		this.setState({
			modal: !this.state.modal
		});
    },
    selectCompUser: function (value) {
        var compUser = this.state.compUser;
        var arr = compUser.userGroup ? compUser.userGroup.split(',') : [];
        arr.push(value);
        compUser.userGroup = arr.join(',');
        this.setState({
            loading: this.state.loading,
        });
    },

    deSelectCompUser: function (value) {
        var compUser = this.state.compUser;
        var arr = compUser.userGroup.split(',');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                arr.splice(i, 1);
                break;
            }
        }
        compUser.userGroup = arr.join(',');
        this.setState({
            loading: this.state.loading
        });
    },


	render : function() {
    	if(this.state.modal && this.state.compUserSet.operation === 'update'){
  	  	if(this.state.compUserSet.errMsg === ''){
    			this.state.modal = false;
    		}
    	}

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

        var corpUuid = this.state.compUser.corpUuid;
        var compUserArr = this.state.compUser.userGroup ? this.state.compUser.userGroup.split(',') : [];
    	var hints=this.state.hints;
	    return (
	        <Modal visible={this.state.modal} width='540px' title="修改用户信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	          footer={[
	          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['comp-user/update']}/>
	           		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>保存</Button>{' '}
	           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	           </div>
	          ]}
	        >
	       		<Form layout={layout}>
					<FormItem {...formItemLayout} label="用户名" colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
						<Input type="text" name="userName" id="userName" readOnly='true' value={this.state.compUser.userName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="用户姓名" colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
						<Input type="text" name="perName" id="perName" readOnly='true' value={this.state.compUser.perName} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="用户类型" colon={true} className={layoutItem} help={hints.userTypeHint} validateStatus={hints.userTypeStatus}>
						<DictSelect name="userType" id="userType" appName='用户管理' optName='用户类型' value={this.state.compUser.userType} onSelect={this.handleOnSelected.bind(this, "userType")}/>
					</FormItem>
					<FormItem {...formItemLayout} label="员工编号" colon={true} className={layoutItem} help={hints.userCodeHint} validateStatus={hints.userCodeStatus}>
						<Input type="text" name="userCode" id="userCode" value={this.state.compUser.userCode} onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="职务" colon={true} className={layoutItem} help={hints.userTitleHint} validateStatus={hints.userTitleStatus}>
						<Input type="text" name="userTitle" id="userTitle" value={this.state.compUser.userTitle} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户组" colon={true} className={layoutItem} help={hints.userGroupHint} validateStatus={hints.userGroupStatus} >
                        <CompUserSelect corpUuid={corpUuid} name="userGroup" id="userGroup" value={compUserArr} onSelect={this.selectCompUser} onDeselect={this.deSelectCompUser} />
                    </FormItem>
	        	</Form>
	        </Modal>
	    );
	}
});

ReactMixin.onClass(UpdateCompUserPage, Reflux.connect(CompUserStore, 'compUserSet'));
export default UpdateCompUserPage;
