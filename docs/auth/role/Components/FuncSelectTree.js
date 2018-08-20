'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin} from 'antd';
const TreeNode = Tree.TreeNode;

var Context = require('../../AuthContext');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ModuleActions = require('../../module/action/ModuleActions');
var ModuleStore = require('../../module/data/ModuleStore');

var FuncActions = require('../../func/action/FuncActions');
var FuncStore = require('../../func/data/FuncStore');

var expandedKeys2= [];
var selectedKeys2= [];
var checkedKeys2= [];
var FuncSelectTree = React.createClass({
    getInitialState : function() {
        return {
            moduleSet: {
                recordSet: [],
                operation : ''
            },
            funcSet: {
                recordSet: [],
                operation : ''
            },
            modLoading: false,
            funcLoading: false,
            funcMap: {},
            rootNodes: [],
        }
    },
    
	mixins: [Reflux.listenTo(ModuleStore, "onModComplete"), Reflux.listenTo(FuncStore, "onFuncComplete")],
	onModComplete: function(data) {
		this.state.rootNodes = [];
		this.state.moduleSet = data;
		if(data.errMsg === ''){
			this.prepareTreeNodes();
	    }
		
		this.setState({
			modLoading: false,
		});
	},
	onFuncComplete: function(data) {
		this.state.rootNodes = [];
		this.state.funcSet = data;
		if(data.errMsg === ''){
			this.prepareTreeNodes();
	    }
	    
	    this.state.funcMap = {};
	    data.recordSet.map((node, i) => {
	    	this.state.funcMap[node.uuid] = node;
	    });
		
		this.setState({
			funcLoading: false,
		});
	},
    
    // 第一次加载
    componentDidMount : function(){
        expandedKeys2= [];
        selectedKeys2= [];
		checkedKeys2= [];

        this.state.moduleSet.operation = '';
        this.state.funcSet.operation = '';

		this.setState({
			modLoading: true,
			funcLoading: true,
		});
		
        var appUuid = Context.authApp.uuid;
        ModuleActions.initModuleInfo(appUuid);
        FuncActions.initFuncInfo(appUuid);
    },

    onSelect:function(selectedKeys, e)
    {   
        selectedKeys2 = selectedKeys;
        
        if( e.node != null ){
            var modUuid = e.node.props.eventKey;
            var funcNode = this.state.funcMap[modUuid];
            
            // 展开节点 expandedKeys2  
            if( funcNode === null || typeof(funcNode) === 'undefined' ){
            	funcNode = null;
                expandedKeys2.push( modUuid );
        	}
        }
    },
    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;  
    },

    onCheck: function(checkedKeys, info){
    	checkedKeys2 = checkedKeys;
    	
    	//list  选中的数据
    	var list = []
    	this.state.funcSet.recordSet.map((data,i)=>{
    		for(var i = 0; i < checkedKeys.length; i++){
    			if(data.uuid === checkedKeys[i]){
    				data.roleUuid = Context.role.uuid;
    				list.push(data);
    			}
    		}
    	});
    	
    	this.props.onSelect(checkedKeys,this.state.modUuids);
    },

    preModNode: function(data){
        var node = {};
        node.key = data.uuid;
        node.title = data.modName;
        return node;
    },

    //子节点
    preFuncNode: function(data){
        var node = {};
        node.key = data.uuid;
        node.pid = data.modUuid;
        node.title = data.funcName;
        return node;
    },
    prepareTreeNodes: function()
    {
        var moduleSet = this.state.moduleSet.recordSet;
        var funcSet = this.state.funcSet.recordSet;
        this.state.rootNodes = Common.initTreeNodes2(moduleSet, this.preModNode, funcSet, this.preFuncNode);
    },

    render : function() {
        var loading = (this.state.modLoading || this.state.funcLoading);
        if( this.state.rootNodes.length === 0 ){
            if( loading ){
                return (<Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>加载数据</Spin>);
            }
            else{
                return (<div>暂时没有数据</div>);
            }
        }
        
        var tree =
            <Tree
            	checkable
                defaultExpandedKeys={expandedKeys2}
                defaultSelectedKeys={selectedKeys2}
                defaultCheckedKeys={checkedKeys2}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                onCheck={this.onCheck}
            >
            {
                this.state.rootNodes.map((data, i) => {
                    return Common.prepareTreeNodes(data);
                })
            }
            </Tree>;

        return (
            (loading) ?
                <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{tree}</Spin> :
                tree
            );
        }

});


module.exports = FuncSelectTree;
