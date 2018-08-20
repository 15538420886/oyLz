"use strict";

﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var Validator = require('../../../public/script/common');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var DictDefStore = require('../data/DictDefStore.js');
var DictDefActions = require('../action/DictDefActions');

var UpdateDictDefPage = React.createClass({
  getInitialState : function() {
      return {
          dictdefSet: {
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
      if(this.state.modal && data.operation === 'update'){
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
  componentDidMount : function() {
    this.state.validRules = [
        {id: 'indexName', desc:'字典名称', required: true, max: 64},
        {id: 'indexDesc', desc:'字典说明', max: 1024}
    ];
  },

  initPage: function ( dictdef ) {
    this.state.dictdefSet.operation = '';
    this.state.loading = false;
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
          this.refs.mxgBox.clear();
    }

    this.state.hints = {};
    Utils.copyValue( dictdef, this.state.dictdef );
  },

  onClickSave : function() {
  	if(Validator.formValidator( this, this.state.dictdef )){
      this.setState({loading: true});
      DictDefActions.updateParamDictDef( this.state.dictdef );
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
      <Modal visible={this.state.modal} width='540px' title="修改数据字典" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['SysCodeIndex/update']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
      ]}>
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="字典名称" required={true} colon={true} className={layoutItem} help={hints.indexNameHint} validateStatus={hints.campusNameStatus}>
            <Input type="text" name="indexName" id="indexName" value={this.state.dictdef.indexName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="层次结构" colon={true} className={layoutItem} help={hints.hiberarchyHint} validateStatus={hints.campusLocStatus}>
            <DictRadio name="hiberarchy" id="hiberarchy" appName='参数管理' optName='字典层次结构' onChange={this.onRadioChange} value={this.state.dictdef.hiberarchy}/>
          </FormItem>
          <FormItem {...formItemLayout} label="状态" colon={true} className={layoutItem} help={hints.paraStatusHint} validateStatus={hints.campusLocStatus}>
            <DictRadio name="paraStatus" id="paraStatus" appName='common' optName='启用状态' onChange={this.onRadioChange} value={this.state.dictdef.paraStatus}/>
          </FormItem>
          <FormItem {...formItemLayout} label="字典说明" colon={true} className={layoutItem} help={hints.indexDescHint} validateStatus={hints.campusDescStatus}>
            <Input type="textarea" name="indexDesc" id="indexDesc" value={this.state.dictdef.indexDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default UpdateDictDefPage;
