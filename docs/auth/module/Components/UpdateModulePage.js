"use strict";

﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var Validator = require('../../../public/script/common');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var ModuleStore = require('../data/ModuleStore.js');
var ModuleActions = require('../action/ModuleActions');

var UpdateModulePage = React.createClass({
  getInitialState : function() {
      return {
          moduleSet: {
      			operation : '',
      			errMsg : ''
          },
          loading: false,
  	      modal: false,
  	      module: {},
          hints: {},
          validRules: []
      }
  },

  mixins: [Reflux.listenTo(ModuleStore, "onServiceComplete"), ModalForm('module')],

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
                  moduleSet: data
              });
          }
      }
  },

  componentDidMount : function() {
      this.state.validRules = [
          {id: 'modName', desc:'分组名称', required: true, max: 64},
          {id: 'modDesc', desc:'分组描述', max: 1024}
      ];
  },

  initPage: function ( module ) {
	this.state.hints = {};
	Utils.copyValue( module, this.state.module );
	
	this.state.loading = false;
	this.state.moduleSet.operation='';
	if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
		this.refs.mxgBox.clear();
	}
  },

  onClickSave : function() {
  	  if(Validator.formValidator( this, this.state.module )){
  	  	this.setState({loading: true});
          ModuleActions.updateModuleInfo( this.state.module );
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
        	<Modal visible={this.state.modal} width='540px' title="修改分组参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        	    footer={[
        	    <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
        	        <ServiceMsg ref='mxgBox' svcList={['auth-app-module/update']}/>
        	        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
        	        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
        	    </div>
        	    ]}>
        	    <Form layout={layout}>
        	        <FormItem {...formItemLayout} label="分组名称" required={true} colon={true} className={layoutItem} help={hints.modNameHint} validateStatus={hints.modNameStatus}>
        	            <Input type="text" name="modName" id="modName" value={this.state.module.modName} onChange={this.handleOnChange} />
        	        </FormItem>
        	        <FormItem {...formItemLayout} label="分组描述" colon={true} className={layoutItem} help={hints.indexDescHint} validateStatus={hints.modDescStatus}>
        	            <Input type="textarea" name="modDesc" id="modDesc" value={this.state.module.modDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
        	        </FormItem>
        	    </Form>
        	</Modal>
      );
    }
});

export default UpdateModulePage;
