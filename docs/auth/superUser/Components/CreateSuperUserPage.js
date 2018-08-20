import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import DictSelect from '../../../lib/Components/DictSelect';

var SuperUserStore = require('../data/SuperUserStore.js');
var SuperUserActions = require('../action/SuperUserActions');

var CreateSuperUserPage = React.createClass({
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
    if(this.state.modal && data.operation === 'create'){
      if( data.errMsg === ''){
        // 成功，关闭窗口
        this.setState({
          modal: false
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
      {id: 'userName', desc:'用户名', required: true, max: '32'},
      {id: 'userType', desc:'访问类型', required: true, max: '32'},
      {id: 'passwd', desc:'证书密码', required: true, max: '0'},
    ];
  },

  clear : function(corpUuid){
    this.state.hints = {};
    this.state.superUser.uuid='';
    this.state.superUser.corpUuid = corpUuid;
    this.state.superUser.userName = '';
    this.state.superUser.userType = '';
    this.state.superUser.passwd = '';


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
      SuperUserActions.createSuperUser( this.state.superUser );
    }
  },

  render : function(){
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 6}),
      wrapperCol: ((layout=='vertical') ? null : {span: 16}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="增加超级用户" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
             footer={[
               <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                 <ServiceMsg ref='mxgBox' svcList={['super-user/create']}/>
                 <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                 <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
               </div>
             ]}
      >
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="用户名" required={true} colon={true} className={layoutItem} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
            <Input type="text" name="userName" id="userName" value={this.state.superUser.userName} onChange={this.handleOnChange}/>
          </FormItem>
          <FormItem {...formItemLayout} label="访问类型" required={true} colon={true} className={layoutItem} help={hints.userTypeHint} validateStatus={hints.userTypeStatus}>
          <DictSelect name="userType" id="userType" value={this.state.superUser.userType} appName='用户管理' optName='访问类型' onSelect={this.handleOnSelected.bind(this, "userType")}/>
          </FormItem>

          <FormItem {...formItemLayout} label="企业证书密码" required={true} colon={true} style={{marginBottom: '20px'}} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus} >
            <Input type="password" name="passwd" id="passwd" value={this.state.superUser.passwd} onChange={this.handleOnChange} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default CreateSuperUserPage;

