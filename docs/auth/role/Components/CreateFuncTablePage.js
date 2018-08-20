'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin, Modal, Button, Form, Input} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Context = require('../../AuthContext');
var Common = require('../../../public/script/common');

var FuncTableStore = require('../data/FuncTableStore');
var FuncTableActions = require('../action/FuncTableActions');

import FuncSelectTree from './FuncSelectTree';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

var CreateFuncTablePage = React.createClass({
    getInitialState : function() {
        return {
            funcTbleSet: {
                recordSet:[],
                operation : '',
                errMsg : ''
            },
            loading: false,
            modal: false,
            roleUuid: '',
            funcTable: {},
            checkedKeys: [],
        }
    },
    
    mixins: [Reflux.listenTo(FuncTableStore, "onServiceComplete"), ModalForm('funcTble')],
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
                    funcTbleSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function() {
        this.state.funcTbleSet.operation = '';
        this.setState({loading: true});
    },
    clear: function(roleUuid){
    	this.state.roleUuid = roleUuid;
    },
  
    //保存  确定
    onClickSave : function() {
    	var funcTree = this.refs.funcTree;
    	if(funcTree === null || typeof(funcTree) === 'undefined'){
    		return;
    	}
    	
    	var list = [];
    	var len = this.state.checkedKeys.length;
    	for(var i=0; i<len; i++){
    		var uuid = this.state.checkedKeys[i];
    		var func = funcTree.state.funcMap[uuid];
    		if(func !== null && typeof(func) !== 'undefined'){
    			var node={
    				roleUuid: this.state.roleUuid,
    				funcUuid: func.uuid,
    				funcCode: func.funcCode,
    				funcName: func.funcName
    			};
    			
    			list.push(node);
    		}
    	}
    	
        FuncTableActions.createFuncTableInfo( list );
    },
    onSelects: function(checkedKeys,modUuids){
    	this.setState({checkedKeys: checkedKeys});
    },
    render : function() {
	    return (
	        <Modal visible={this.state.modal} width='540px' title="增加功能参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	            footer={[
	            <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
	                <ServiceMsg ref='mxgBox' svcList={['auth-role-func/create', 'auth-app-module/retrieve', 'auth-app-func/retrieve']}/>
	                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>确定</Button>{' '}
	                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	            </div>
	            ]}>
	            <div style={{maxHeight: '400px', overflow: 'auto'}}>
	            	<FuncSelectTree ref='funcTree' onSelect={this.onSelects}/>
	            </div>
	        </Modal>
	      );
    }
});

export default CreateFuncTablePage;