import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import DictSelect from '../../../lib/Components/DictSelect';

var SuperUserStore = require('../data/SuperUserStore.js');
var SuperUserActions = require('../action/SuperUserActions');

var UpdateSuperUserPage = React.createClass({
  getInitialState : function() {
    return {
      superUserSet: {
        operation : '',
        errMsg : ''
      },
      loading: false,
      modal: false,
      superUser: {},
      hints: {},
      validRules: []
    }
  },

  mixins: [Reflux.listenTo(SuperUserStore, "onServiceComplete"), ModalForm('superUser')],
  onServiceComplete: function(data) {
    if(this.state.modal && data.operation === 'update'){
      if( data.errMsg === ''){
        // 成功，关闭窗口
        //为status赋值
        data.recordSet.map((v,k)=>{
          if(v.uuid === this.state.superUser.uuid){
            v.status = this.state.superUser.status
          }
        })
        this.setState({
          modal: false,
          superUserSet: data
        });
      }
      else{
        // 失败
        this.setState({
          loading: false,
          superUserSet: data
        });
      }
    }
  },

  // 第一次加载
  componentDidMount : function(){
    this.state.validRules = [
      {id: 'passwd', desc:'证书密码', required: true, max: '0'},
    ];
  },

  initPage: function(superUser)
  {
    this.state.superUser.passwd = '';
    this.state.hints = {};
    Utils.copyValue(superUser, this.state.superUser);

    this.state.loading = false;
    this.state.superUserSet.operation='';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },

  onClickSave : function(){
    if(Common.formValidator(this, this.state.superUser)){
      this.state.superUserSet.operation = '';
      this.setState({loading: true});
      (this.state.superUser.status === '1') ? this.state.superUser.status = '0' : this.state.superUser.status = '1';
      SuperUserActions.updateSuperUser( this.state.superUser );
    }
  },

  render : function() {
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 6}),
      wrapperCol: ((layout=='vertical') ? null : {span: 16}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="【启用/禁用】用户" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
             footer={[
               <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                 <ServiceMsg ref='mxgBox' svcList={['super-user/update']}/>
                 <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                 <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
               </div>
             ]}
      >
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="用户名" required={false} colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
            <Input type="text" name="userName" id="userName" value={this.state.superUser.userName} onChange={this.handleOnChange} disabled={true}/>
          </FormItem>
          <FormItem {...formItemLayout} label="访问类型" required={false} colon={true} className={layoutItem} help={hints.userTypeHint} validateStatus={hints.userTypeStatus}>
            <DictSelect name="userType" id="userType" value={this.state.superUser.userType} appName='用户管理' optName='访问类型' onSelect={this.handleOnSelected.bind(this, "userType")} disabled={true}/>
          </FormItem>
          <FormItem {...formItemLayout} label="企业证书密码" required={true} colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus} >
            <Input type="password" name="passwd" id="passwd" value={this.state.superUser.passwd} onChange={this.handleOnChange} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default UpdateSuperUserPage;

