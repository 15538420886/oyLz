﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ModStore = require('../data/ModStore');
var ModActions = require('../action/ModActions');

var CreateModPage = React.createClass({
  getInitialState : function() {
    return {
      modSet: {
        operation : '',
        errMsg : ''
      },
      loading: false,
      modal: false,
      mod: {},
      hints: {},
      validRules: []
    }
  },

  mixins: [Reflux.listenTo(ModStore, "onServiceComplete"), ModalForm('mod')],
  onServiceComplete: function(data) {
      if(this.state.modal && data.operation === 'create'){
          if( data.errMsg === ''){
              // 成功
              this.setState({
                  modal: false
              });
          }
          else{
              // 失败
              this.setState({
                  loading: false,
                  modSet: data
              });
          }
      }
  },

  // 第一次加载
  componentDidMount : function(){
    this.state.validRules = [
      {id: 'groupName', desc:'模块名称', required: true, max: 24},
      {id: 'groupDesc', desc:'模块说明',required: true, max: 84}
    ];
  },
  
  clear : function(appUuid){
    this.state.hints = {};
    this.state.mod.uuid='';
    this.state.mod.appUuid = appUuid;
    this.state.mod.groupName="";
    this.state.mod.groupDesc="";

    this.state.loading = false;
    this.state.modSet.operation='';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
      this.refs.mxgBox.clear();
    }
  },

  onClickSave : function(){
    if(Validator.formValidator(this, this.state.mod)){
        this.setState({loading: true});
        ModActions.createAppGroup( this.state.mod );
    }
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
      <Modal visible={this.state.modal} width='540px' title="增加模块" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
           <ServiceMsg ref='mxgBox' svcList={['app-group/create']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
         </div>
        ]}
      >
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="模块名称："  required={true} colon={true} className={layoutItem} help={hints.groupNameHint}
          validateStatus={hints.groupNameStatus} >
            <Input type="text" name="groupName" id="groupName" value={this.state.mod.groupName} onChange={this.handleOnChange}   />
          </FormItem>
          <FormItem {...formItemLayout} label="模块说明："  required={true} colon={true} className={layoutItem} help={hints.groupDescHint} validateStatus={hints.groupDescStatus} >
            <Input type="textarea" name="groupDesc" id="groupDesc" value={this.state.mod.groupDesc} onChange={this.handleOnChange}  style={{height:'80px'}} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default CreateModPage;
