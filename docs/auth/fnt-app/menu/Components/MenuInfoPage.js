'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import FntRoleSelect from './FntRoleSelect';
var Context = require('../../../AuthContext');
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import {Form, Input, Button, Table, Icon, Modal} from 'antd';
const FormItem = Form.Item;

var FntMenuStore = require('../data/FntMenuStore');
var FntMenuActions = require('../action/FntMenuActions');

var MenuInfoPage = React.createClass({
  getInitialState : function() {
    return {
      menuSet: {
        recordSet: [],
        errMsg : ''
      },
      loading: false,
      menu: {},
      hints: {},
      validRules: [],
    }
  },

    mixins: [Reflux.listenTo(FntMenuStore, "onServiceComplete"),ModalForm('menu')],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            menuSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
			{id: 'menuPath', desc:'菜单路径', required: true, max: '32'},
            {id: 'menuTitle', desc:'菜单标题', required: true, max: '128'},
			{id: 'appRoles', desc:'可用角色', required: false, max: '512'},
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

    selectRole : function(value) {
        var menu = this.state.menu;
        var arr = menu.appRoles? menu.appRoles.split(','):[];
        arr.push(value);
        menu.appRoles = arr.join(',');     
        this.setState({
            loading: this.state.loading,
        });
    },

    deSelectRole: function(value){
        var menu = this.state.menu;
        var arr = menu.appRoles.split(',');
        for(var i=0; i<arr.length; i++){
            if(arr[i] === value){
                arr.splice(i,1);
                break;
            }
        }
        menu.appRoles = arr.join(',');
        this.setState({
            loading: this.state.loading
        });
    },

  onClickSave : function(){
    if(Common.formValidator(this, this.state.menu)){
      this.setState({loading: true});
      FntMenuActions.updateFntAppMenu( this.state.menu );
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
    var appUuid = Context.fntApp.uuid;
    var roleArr = this.state.menu.appRoles ? this.state.menu.appRoles.split(','):[];

    return (
      <div style={{padding:'24px 0 0 10px'}}>
        <Form layout={layout} style={{width:'540px'}}>
			<FormItem {...formItemLayout} label="菜单路径" required={true} colon={true} className={layoutItem} help={hints.menuPathHint} validateStatus={hints.menuPathStatus}>
                <Input type="text" name="menuPath" id="menuPath" value={this.state.menu.menuPath} onChange={this.handleOnChange}/>
            </FormItem>
            <FormItem {...formItemLayout} label="菜单标题" required={true} colon={true} className={layoutItem} help={hints.menuTitleHint} validateStatus={hints.menuTitleStatus}>
                <Input type="text" name="menuTitle" id="menuTitle" value={this.state.menu.menuTitle} onChange={this.handleOnChange}/>
            </FormItem>
            <FormItem {...formItemLayout} label="可用角色" colon={true} className={layoutItem} help={hints.appRolesHint} validateStatus={hints.appRolesStatus} >
                <FntRoleSelect appUuid={appUuid} name="appRoles" id="appRoles" value={roleArr} onSelect={this.selectRole} onDeselect={this.deSelectRole}/>
            </FormItem>
        </Form>
		<div key="footerDiv" style={{display:'block', width:'540px', marginTop:'16px', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['fnt-app-menu/update']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>
	    </div>
      </div>
    );
  }
});

module.exports = MenuInfoPage;
