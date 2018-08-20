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
var ResActions = require('../../res/action/ResActions');
var ResStore = require('../../res/data/ResStore');

var expandedKeys2= [];
var selectedKeys2= [];
var TxnTree = React.createClass({
    getInitialState : function() {
        return {
            moduleSet: {
                recordSet: [],
                operation : ''
            },
            resSet: {
                recordSet: [],
                operation : ''
            },
            modLoading: false,
            resLoading: false,
            txnMap: {},
            rootNodes: [],
            isOpen:false
        }
    },
	mixins: [Reflux.listenTo(ModuleStore, "onModComplete"), Reflux.listenTo(ResStore, "onResComplete")],
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
	onResComplete: function(data) {
		this.state.rootNodes = [];
		this.state.resSet = data;
		if(data.errMsg === ''){
			this.prepareTreeNodes();
	    }
	    
	    this.state.txnMap = {};
	    data.recordSet.map((node, i) => {
	    	this.state.txnMap[node.uuid] = node;
	    });
		
		this.setState({
			resLoading: false,
		});
	},
    
    
    // 第一次加载
    componentDidMount: function () {
        this.refresh();
    },
    initTree: function(){
        selectedKeys2 = [];
    },
    refresh: function () {
        expandedKeys2 = [];
        selectedKeys2 = [];

        this.state.moduleSet.operation = '';
        this.state.resSet.operation = '';

        this.setState({
            modLoading: true,
            resLoading: true,
        });

        var appUuid = Context.authApp.uuid;
        ModuleActions.initModuleInfo(appUuid);
        ResActions.initResInfo(appUuid);
    },

    onSelect:function(selectedKeys, e)
    {
        var resUuid = '';
        if( e.node != null ){
            var modUuid = e.node.props.eventKey;
            selectedKeys2 = [modUuid];
            
            var resNode = this.state.txnMap[modUuid];
            if( resNode === null || typeof(resNode) === 'undefined' ){
            	// 展开节点 expandedKeys2
            	expandedKeys2.push( modUuid );
            	resNode = null;
            }
            else{
            	resUuid = modUuid;
            }
        }

        this.props.onSelect( resUuid );
    },
    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;  
    },

    preModNode: function(data)
    {
        var node = {};
        node.key = data.uuid;
        node.title = data.modName;
        return node;
    },

    //子节点
    preResNode: function(data)
    {
        var node = {};
        node.key = data.uuid;
        node.pid = data.modUuid;
        node.title = data.resName;
        return node;
    },
    prepareTreeNodes: function()
    {
        var moduleSet = this.state.moduleSet.recordSet;
        var resSet = this.state.resSet.recordSet;
        this.state.rootNodes = Common.initTreeNodes2(moduleSet, this.preModNode, resSet, this.preResNode);
    },

    render : function() {
    	var loading = (this.state.modLoading || this.state.resLoading);
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
                defaultExpandAll={this.state.isOpen}
                defaultExpandedKeys={expandedKeys2}
                defaultSelectedKeys={selectedKeys2}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
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


module.exports = TxnTree;
