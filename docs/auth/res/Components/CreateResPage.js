"use strict";

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');

import ModalForm from '../../../lib/Components/ModalForm';
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var ResStore = require('../data/ResStore.js');
var ResActions = require('../action/ResActions');

var CreateResPage = React.createClass({
    getInitialState : function() {
        return {
            resSet: {
                recordSet:[],
  		    	operation : '',
  		    	errMsg : ''
            },
        	loading: false,
    	    modal: false,
    	    res: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(ResStore, "onServiceComplete"), ModalForm('res')],

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
                    resSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function() {
        this.state.validRules = [
            {id: 'resName', desc:'功能名称', required: true, max: 64},
            {id: 'resDesc', desc:'功能描述', max: 1024}
        ];
    },
 
    clear : function(modUuid,appUuid) {
        this.state.hints = {};
        this.state.res.modUuid = modUuid;
        this.state.res.appUuid = appUuid;
    
        this.state.res.resName='';
        this.state.res.resDesc='';
        
        this.state.loading = false;
        this.state.resSet.operation = '';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
          	this.refs.mxgBox.clear();
        }
    },
  
    //保存  确定
    onClickSave : function() {
    	if(Validator.formValidator( this, this.state.res )){
    		this.setState({loading: true});
            ResActions.createResInfo( this.state.res );
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
                <ServiceMsg ref='mxgBox' svcList={['auth_app_res/create']}/>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
            </div>
            ]}>
            <Form layout={layout}>
                <FormItem {...formItemLayout} label="功能名称" required={true} colon={true} className={layoutItem} help={hints.resNameHint} validateStatus={hints.resNameStatus}>
                  <Input type="text" name="resName" id="resName" value={this.state.res.resName} onChange={this.handleOnChange} />
                </FormItem>
                <FormItem {...formItemLayout} label="功能描述" colon={true} className={layoutItem} help={hints.indexDescHint} validateStatus={hints.resDescStatus}>
                  <Input type="textarea" name="resDesc" id="resDesc" value={this.state.res.resDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
                </FormItem>
            </Form>
        </Modal>
      );
    }
});

export default CreateResPage;
