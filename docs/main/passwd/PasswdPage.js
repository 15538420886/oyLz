'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';

import {Button, Table, Icon, Modal, Spin, Form, Input} from 'antd';
import ErrorMsg from '../../lib/Components/ErrorMsg';
const FormItem = Form.Item;
var Validator = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var PasswdPage = React.createClass({
    getInitialState : function() {
         return {
            passwd: {
                oldPasswd: "",
		    	newPasswd: "",
                confirmPad:"",
			},
			loading: false,
			hints: {},
            errMsg: '',
		    validRules: []
        }       
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'oldPasswd', desc:'原密码', required: true, max: '16'},
            {id: 'newPasswd', desc:'新密码', required: true, max: '16'},
        ];
    },

    handleOnChange : function(e) {
  		var passwd = this.state.passwd;
  		passwd[e.target.id] = e.target.value;
  		Validator.validator(this, passwd, e.target.id);
  		this.setState({
  			passwd: passwd
  		});
  	},

    clickUpdatePwd:function(event){
        this.state.errMsg = '';
        if(!Validator.formValidator(this, this.state.passwd)){
			return;
		}

		var url = Utils.authUrl+'auth-user/update-pwd';
		var loginData = {};
               
        //旧密码
        var passwd1 = this.state.passwd.oldPasswd;
        //新密码
        var passwd2 = this.state.passwd.newPasswd;
        //确认密码
        var passwd3 = this.state.passwd.confirmPad;
        
        if(passwd2 != passwd3){
            Validator.warnMsg("两次输入需要一致！");
        }
        else{
            loginData.oldPasswd = passwd1;
            loginData.newPasswd = passwd2;
        }

        var self = this;
		Utils.doUpdateService(url, loginData).then(function(userData,status,xhr) {
			if(userData.errCode==null || userData.errCode=='' || userData.errCode=='000000'){
                Validator.succMsg("密码修改成功！");      
			}
			else{
				self.showError("处理错误["+userData.errCode+"]["+userData.errDesc+"]");
			}
		}, function(xhr,errorText,errorType) {
			self.showError('未知错误');
		});
    },
    
    showError: function(msg){
		this.setState({
			errMsg: msg
		});
	},
    onDismiss : function(){
		this.setState({
			errMsg: ''
		});
	},
    render : function() {
        var errMsg = this.state.errMsg;

        var hints=this.state.hints;
        var layout='vertical';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 0}),
            wrapperCol: ((layout=='vertical') ? null : {span: 24}),
        };
       
        return (
            <div style={{width:'100%'}}>
                <div style={{width:'300px', paddingTop:'100px', margin:'0 auto'}}>
                    <div style={{width:'100%',height:'40px',lineHeight:'40px',fontSize:'16px',textAlign:'center',marginBottom:'10px'}}>修改密码</div>
                    <Form layout={layout}>
                        <FormItem {...formItemLayout} label="" colon={true} style={{marginBottom: '20px'}} help={hints.oldPasswdHint} validateStatus={hints.oldPasswdStatus}>
                            <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} placeholder="原密码"  type="text" name="oldPasswd" id="oldPasswd" value={this.state.passwd.oldPasswd} onChange={this.handleOnChange}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.newPasswdHint} validateStatus={hints.newPasswdStatus} >
                            <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} placeholder="新密码" type="text" name="newPasswd" id="newPasswd" value={this.state.passwd.newPasswd} onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.confirmPadHint} validateStatus={hints.confirmPadStatus} >
                            <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} placeholder="确认密码" type="text" name="confirmPad" id="confirmPad" value={this.state.passwd.confirmPad} onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem>
                            <ErrorMsg message={errMsg} toggle={this.onDismiss}/>
                            <Button key="btnOK" onClick={this.clickUpdatePwd} size="large" type="primary" loading={this.state.loading} style={{width:'100%'}}>确认修改</Button>
                    </FormItem>
                    </Form>
            </div>
        </div>);
    }
});

module.exports = PasswdPage;
