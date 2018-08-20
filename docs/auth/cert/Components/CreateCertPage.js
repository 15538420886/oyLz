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

var CreateCertPage = React.createClass({
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
      {id: 'passwd', desc:'密码', required: true, max: '0'},
    ];
    this.clear();
  },

  clear : function(corpUuid,corpName,passwd){
    this.state.hints = {};
    this.state.cert.uuid='';
    this.state.cert.passwd = '';

    this.state.loading = false;
    this.state.certSet.operation='';
    if( typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },

  handleOnChange : function(e) {
    var cert = this.state.cert;
    cert[e.target.id] = e.target.value;
    Validator.validator(this, cert, e.target.id);
    this.setState({
      cert: cert
    });
  },

  clickCreatePwd:function(event){
    this.state.errMsg = '';
    if (!Validator.formValidator(this, this.state.cert)) {
      return;
    }

    var url = Utils.paramUrl+'corp-key/create';
    var loginData = {};

    //新密码
    var passwd = this.state.cert.passwd;
    //确认密码
    var passwd1 = this.state.cert.confirmPad;

    if(passwd != passwd1){
        Common.warnMsg("两次输入需要一致！");
        return;
    }
    else{
      loginData.passwd = passwd;
    }

    loginData.corpUuid = window.loginData.compUser.corpUuid;
    loginData.corpName = window.loginData.authUser.userName;

    var self = this;
    Utils.doCreateService(url, loginData).then(function(userData,status,xhr) {
        if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
            self.showError('');
        Common.succMsg("创建成功！");
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

  render : function(){
    var errMsg = this.state.errMsg;
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 6}),
      wrapperCol: ((layout=='vertical') ? null : {span: 18}),
    };

    var hints = this.state.hints;
    return (
      <div className='grid-page'>
        <div style={{width:'400px', paddingLeft:"100px"}}>
          <ServiceMsg ref='mxgBox' svcList={['corp-key/create']}/>
          <Form layout={layout}>
                    <FormItem {...formItemLayout} label="密码" required={true} colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus} >
                        <Input type="password" name="passwd" id="passwd" value={this.state.cert.passwd} onChange={this.handleOnChange} />
            </FormItem>
                    <FormItem {...formItemLayout} label="确认密码" required={true} colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.confirmPadHint} validateStatus={hints.confirmPadStatus} >
                        <Input style={{ zIndex: "99" }} type="password" name="confirmPad" id="confirmPad" value={this.state.cert.confirmPad} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem style={{textAlign:'right'}}>
              <ErrorMsg message={errMsg} toggle={this.onDismiss}/>
              <Button key="btnOK" onClick={this.clickCreatePwd} size="large" type="primary" >提交</Button>
            </FormItem>
          </Form>
        </div>
      </div>

    );
  }
});

export default CreateCertPage;

