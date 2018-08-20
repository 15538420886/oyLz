'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import {Form, Input, Button, Table, Icon, Modal ,Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var MenuStore = require('../data/MenuStore.js');
var MenuActions = require('../action/MenuActions');

var MenuInfoPage = React.createClass({
  getInitialState : function() {
    return {
      menuSet: {
        recordSet: [],
        startPage : 0,
        pageRow : 0,
        totalRow : 0,
        operation : '',
        errMsg : ''
      },
      loading: false,
      menu: {},
      hints: {},
      validRules: [],
    }
  },

    mixins: [Reflux.listenTo(MenuStore, "onServiceComplete"),ModalForm('menu')],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            menuSet: data
        });
    },

  // 第一次加载
  componentDidMount : function(){
      this.state.validRules = [
          {id: 'menuCode', desc:'菜单编号', required: true, max: '32'},
          {id: 'menuTitle', desc:'菜单标题', required: true, max: '128'},
          {id: 'txnCodes', desc:'交易代码集', required: true, max: '512'},
      ];

      var menu = {};
      var menuNode = this.props.menuNode;
      if(menuNode !== null){
          Utils.copyValue(menuNode, menu);
      }

      this.setState({menu: menu});
  },
  componentWillReceiveProps:function(nextProps){
      var menu = {};
      var menuNode = nextProps.menuNode;
      if(menuNode !== null){
          Utils.copyValue(menuNode, menu);
      }

      if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
          this.refs.mxgBox.clear();
      }

      this.setState({loading: false, menu: menu});
  },

  onClickSave : function(){
    if(Validator.formValidator(this, this.state.menu)){
      this.state.menuSet.operation = '';
      this.setState({loading: true});
      MenuActions.updateAuthAppMenu( this.state.menu );
    }
  },

  render : function() {
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
        labelCol: ((layout=='vertical') ? null : {span: 3}),
        wrapperCol: ((layout=='vertical') ? null : {span: 21}),
    };

    var hints=this.state.hints;

    return (
      <div style={{padding:'24px 0 0 10px'}}>
        <Form layout={layout} style={{width:'540px'}}>
            <FormItem {...formItemLayout} label="菜单编号" colon={true} className={layoutItem} help={hints.menuCodeHint} validateStatus={hints.menuCodeStatus}>
                <Input type="text" name="menuCode" id="menuCode" value={this.state.menu.menuCode} onChange={this.handleOnChange}/>
            </FormItem>
            <FormItem {...formItemLayout} label="菜单标题" colon={true} className={layoutItem} help={hints.menuTitleHint} validateStatus={hints.menuTitleStatus}>
                <Input type="text" name="menuTitle" id="menuTitle" value={this.state.menu.menuTitle} onChange={this.handleOnChange}/>
            </FormItem>
            <FormItem {...formItemLayout} label="叶子节点" colon={true} className={layoutItem} help={hints.leafNodeHint} validateStatus={hints.leafNodeStatus}>
                <RadioGroup name="leafNode" id="leafNode" onChange={this.onRadioChange} value={this.state.menu.leafNode}>
                  <Radio id="leafNode" value='1'>是</Radio>
                  <Radio id="leafNode" value='0'>否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="功能代码" colon={true} className={layoutItem} help={hints.txnCodesHint} validateStatus={hints.txnCodesStatus}>
                <Input type="text" name="txnCodes" id="txnCodes" value={this.state.menu.txnCodes} onChange={this.handleOnChange}/>
            </FormItem>
        </Form>
		<div key="footerDiv" style={{display:'block', width:'540px', marginTop:'16px', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['auth-app-menu/update']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>保存</Button>
	    </div>
      </div>
    );
  }
});

module.exports = MenuInfoPage;
