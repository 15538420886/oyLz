import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ErrorMsg from '../../../lib/Components/ErrorMsg';
import { Form, Button, Input } from 'antd';

const FormItem = Form.Item;

var Common = require('../../../public/script/common');
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var UpdateCertPage = React.createClass({
  getInitialState : function() {
    return {
      certSet: {
        operation : '',
        errMsg : ''
      },
      loading: false,
      errMsg: '',
      cert: {},
      hints: {},
      validRules: []
    }
  },

  // 第一次加载
  componentDidMount : function(){
    this.state.validRules = [
     {id: 'oldPasswd', desc:'原密码', required: true, max: '0'},
     {id: 'newPasswd', desc:'新密码', required: true, max: '0'},
    ];
  },

  handleOnChange : function(e) {
    var cert = this.state.cert;
    cert[e.target.id] = e.target.value;
    Validator.validator(this, cert, e.target.id);
    this.setState({
      cert: cert
    });
  },

  clickUpdatePwd:function(event){
    this.state.errMsg = '';
    if(!Validator.formValidator(this, this.state.cert)){
      return;
    }

    var url = Utils.paramUrl+'corp-key/update';
    var loginData = {};

    loginData.corpUuid = window.loginData.compUser.corpUuid;

    //旧密码
    var passwd1 = this.state.cert.oldPasswd;
    //新密码
    var passwd2 = this.state.cert.newPasswd;
    //确认密码
    var passwd3 = this.state.cert.confirmPad;

    if(passwd2 != passwd3){
        Common.warnMsg("两次输入需要一致！");
        return;
    }
    else{
      loginData.oldPasswd = passwd1;
      loginData.newPasswd = passwd2;
    }
    var self = this;
    Utils.doUpdateService(url, loginData).then(function(userData,status,xhr) {
        if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
            self.showError('');
        Common.succMsg("密码修改成功！");
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
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 6}),
      wrapperCol: ((layout=='vertical') ? null : {span: 18}),
    };

    var hints=this.state.hints;
    return (
      <div className='grid-page'>
        <div style={{width:'400px', paddingLeft:"100px"}}>
          <ServiceMsg ref='mxgBox' svcList={['corp-key/update']}/>
          <Form layout={layout}>
                    <FormItem {...formItemLayout} label="原密码" required={true} colon={true} style={{marginBottom: '20px'}} help={hints.oldPasswdHint} validateStatus={hints.oldPasswdStatus}>
                        <Input type="password" name="oldPasswd" id="oldPasswd" value={this.state.cert.oldPasswd} onChange={this.handleOnChange}/>
            </FormItem>
                    <FormItem {...formItemLayout} label="新密码" required={true} colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.newPasswdHint} validateStatus={hints.newPasswdStatus} >
                        <Input type="password" name="newPasswd" id="newPasswd" value={this.state.cert.newPasswd} onChange={this.handleOnChange} />
            </FormItem>
                    <FormItem {...formItemLayout} label="确认密码" required={true} colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.confirmPadHint} validateStatus={hints.confirmPadStatus} >
                        <Input type="password" name="confirmPad" id="confirmPad" value={this.state.cert.confirmPad} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem style={{textAlign:'right'}}>
              <ErrorMsg message={errMsg} toggle={this.onDismiss}/>
              <Button key="btnOK" onClick={this.clickUpdatePwd} size="large" type="primary" >提交</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
});

export default UpdateCertPage;

