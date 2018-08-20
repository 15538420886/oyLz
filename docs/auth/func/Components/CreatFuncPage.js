"use strict";

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');

import ModalForm from '../../../lib/Components/ModalForm';
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var FuncStore = require('../data/FuncStore.js');
var FuncActions = require('../action/FuncActions');

var CreateFuncPage = React.createClass({
    getInitialState : function() {
        return {
            funcSet: {
                recordSet:[],
  		    	operation : '',
  		    	errMsg : ''
            },
    	    modal: false,
    	    func: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(FuncStore, "onServiceComplete"), ModalForm('func')],

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
                    funcSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function() {
        this.state.validRules = [
            {id: 'funcName', desc:'功能描述', required: true, max: 256},
            {id: 'funcCode', desc:'功能代码', max: 36}
        ];
    },
 
    clear : function(func) {
        this.state.hints = {};
        this.state.func= func;
    	
        this.state.func.funcName='';
        this.state.func.funcCode='';
        this.state.funcSet.operation = '';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
          	this.refs.mxgBox.clear();
        }
    },
  
    //保存  确定
    onClickSave : function() {
    	if(Validator.formValidator( this, this.state.func )){
            this.setState({loading: true});
            this.state.funcSet.operation = '';
            FuncActions.createFuncInfo( this.state.func );
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
                <ServiceMsg ref='mxgBox' svcList={['auth-app-func/create']}/>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
            </div>
            ]}>
            <Form layout={layout}>
            	<FormItem {...formItemLayout} label="模块名称" required={true} colon={true} className={layoutItem} help={hints.modNameHint} validateStatus={hints.modNameStatus}>
                  <Input type="text" name="modName" id="modName" value={this.state.func.modName} onChange={this.handleOnChange} disabled={true}/>
                </FormItem>
                <FormItem {...formItemLayout} label="功能代码" required={true} colon={true} className={layoutItem} help={hints.funcCodeHint} validateStatus={hints.funcCodeStatus}>
                  <Input type="text" name="funcCode" id="funcCode" value={this.state.func.funcCode} onChange={this.handleOnChange} />
                </FormItem>
                <FormItem {...formItemLayout} label="功能名称" colon={true} className={layoutItem} help={hints.funcNameHint} validateStatus={hints.funcNameStatus}>
                  <Input type="text" name="funcName" id="funcName" value={this.state.func.funcName} onChange={this.handleOnChange} />
                </FormItem>
            </Form>
        </Modal>
      );
    }
});

export default CreateFuncPage;
