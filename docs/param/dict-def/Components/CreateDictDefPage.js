"use strict";

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var DictDefStore = require('../data/DictDefStore');
var DictDefActions = require('../action/DictDefActions');

var CreateDictDefPage = React.createClass({
  getInitialState : function() {
    return {
        dictdefSet: {
          recordSet:[],
            operation : '',
            errMsg : ''
        },
        loading: false,
        modal: false,
        dictdef: {},
        hints: {},
        validRules: []
      }
  },

  mixins: [Reflux.listenTo(DictDefStore, "onServiceComplete"), ModalForm('dictdef')],
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
                  dictdefSet: data
              });
          }
      }
  },
  // 第一次加载
  componentDidMount : function() {
      this.state.validRules = [
          {id: 'indexName', desc:'字典名称', required: true, max: 64},
          {id: 'indexDesc', desc:'字典说明', max: 1024}
      ];
  },

  clear : function(groupUuid,appUuid) {
    this.state.hints = {};
    this.state.dictdef.groupUuid = groupUuid;
    this.state.dictdef.appUuid = appUuid;
    this.state.dictdef.indexName='';
    this.state.dictdef.indexDesc='';
    this.state.dictdef.hiberarchy='1';
    this.state.dictdef.paraStatus='1';

    this.state.loading = false;
    this.state.dictdefSet.operation = '';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
      this.refs.mxgBox.clear();
    }
  },

  onClickSave : function() {
  	if(Validator.formValidator( this, this.state.dictdef )){
        this.setState({loading: true});
        DictDefActions.createParamDictDef(  this.state.dictdef );
    }
  },

  render : function() {
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="增加数据字典" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['SysCodeIndex/create']} />
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
      ]}>
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="字典名称" required={true} colon={true} className={layoutItem} help={hints.indexNameHint} validateStatus={hints.indexNameStatus}>
            <Input type="text" name="indexName" id="indexName" value={this.state.dictdef.indexName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="层次结构" colon={true} className={layoutItem} help={hints.hiberarchyHint} validateStatus={hints.campusLocStatus}>
            <DictRadio name="hiberarchy" id="hiberarchy" appName='参数管理' optName='字典层次结构' onChange={this.onRadioChange} value={this.state.dictdef.hiberarchy}/>
          </FormItem>
          <FormItem {...formItemLayout} label="状态" colon={true} className={layoutItem} help={hints.paraStatusHint} validateStatus={hints.campusLocStatus}>
            <DictRadio name="paraStatus" id="paraStatus" appName='common' optName='启用状态' onChange={this.onRadioChange} value={this.state.dictdef.paraStatus}/>
          </FormItem>
          <FormItem {...formItemLayout} label="字典说明" colon={true} className={layoutItem} help={hints.indexDescHint} validateStatus={hints.indexDescStatus}>
            <Input type="textarea" name="indexDesc" id="indexDesc" value={this.state.dictdef.indexDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default CreateDictDefPage;
