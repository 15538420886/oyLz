"use strict";

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');

import ModalForm from '../../../lib/Components/ModalForm';
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var RoleStore = require('../data/RoleStore.js');
var RoleActions = require('../action/RoleActions');

var CreateRolePage = React.createClass({
    getInitialState : function() {
        return {
            roleSet: {
                recordSet:[],
  		    	operation : '',
  		    	errMsg : ''
            },
    	    modal: false,
    	    role: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(RoleStore, "onServiceComplete"), ModalForm('role')],

    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'create'){
            if( data.errMsg === ''){
                // 成功
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    roleSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function() {
        this.state.validRules = [
            {id: 'roleName', desc:'角色名称', max: 32},
            {id: 'roleDesc', desc:'角色描述', required: true, max: 256}
        ];
    },
 
    clear : function(appUuid) {
        this.state.hints = {};
        this.state.role.appUuid = appUuid;
    
        this.state.role.roleName='';
        this.state.role.roleDesc='';
        this.state.roleSet.operation = '';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
          	this.refs.mxgBox.clear();
        }
    },
  
    //保存  确定
    onClickSave : function() {
    	if(Validator.formValidator( this, this.state.role )){
            this.setState({loading: true});
            this.state.roleSet.operation = '';
            RoleActions.createRoleInfo( this.state.role );
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
        <Modal visible={this.state.modal} width='540px' title="增加功能参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={[
            <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                <ServiceMsg ref='mxgBox' svcList={['auth-app-role/create']}/>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
            </div>
            ]}>
            <Form layout={layout}>
                <FormItem {...formItemLayout} label="角色名称" required={true} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                  <Input type="text" name="roleName" id="roleName" value={this.state.role.roleName} onChange={this.handleOnChange} />
                </FormItem>
                <FormItem {...formItemLayout} label="角色描述" colon={true} className={layoutItem} help={hints.indexDescHint} validateStatus={hints.roleDescStatus}>
                  <Input type="textarea" name="roleDesc" id="roleDesc" value={this.state.role.roleDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
                </FormItem>
            </Form>
        </Modal>
      );
    }
});

export default CreateRolePage;
