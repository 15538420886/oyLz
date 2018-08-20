'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

var Context = require('../../ParamContext');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ModStore = require('../../mod/data/ModStore');
var ModActions = require('../../mod/action/ModActions');
var DictDefStore = require('../../dict-def/data/DictDefStore');
var DictDefActions = require('../../dict-def/action/DictDefActions');

var expandedKeys2= [];
var selectedKeys2= [];
var DictIndexTree = React.createClass({
    getInitialState : function() {
        return {
    		modSet: {
    			recordSet: [],
				operation : '',
				errMsg : ''
    		},
            dictdefSet: {
                groupUuid: '',
                recordSet: [],
				operation : '',
				errMsg : ''
            },
            loading: false,
            dictMap: {},
            nodeMap: {},
            appUuid: '',
            rootNodes: [],
        }
    },
    setLoading: function(){
        this.state.loading = true;
        this.state.modSet.operation = '';
        this.state.dictdefSet.operation = '';
    },

    // 第一次加载
    componentDidMount : function(){
        expandedKeys2= [];
        selectedKeys2= [];
        this.setLoading();

        var app=Context.paramApp;
        this.state.appUuid = app.uuid;
    	ModActions.initAppGroup(app.uuid);
    },
	refresh: function(appUuid){
        if( this.state.appUuid != appUuid ){
            expandedKeys2= [];
            selectedKeys2= [];
            this.setLoading();

            this.state.modSet.recordSet = [];
            this.state.rootNodes = [];
            this.state.dictMap = {};
            this.state.nodeMap = {};
            this.state.appUuid = appUuid;
    		ModActions.initAppGroup(appUuid);
            this.props.onSelectNode( '', '1', '' );
        }
	},

    preModNode: function(data, recordSet)
    {
        var node = {};
        node.key = data.uuid;
        node.title = data.groupName;
        return node;
    },
    preResNode: function(data)
    {
        var node = {};
        node.key = data.uuid;
        node.groupUuid = data.groupUuid;
        if( data.indexDesc === '' || data.indexDesc == data.indexName ){
            node.title = data.indexName;
        }
        else{
            node.title = data.indexName+'('+data.indexDesc+')';
        }
        this.state.nodeMap[data.uuid] = data;

        return node;
    },

    onSelect:function(selectedKeys, e)
    {
        selectedKeys2 = selectedKeys;

        var isRefresh = true;
        var groupUuid = '';
        var indexName = '';
        var selectedMod = null;
        if( e.node != null ){
            groupUuid = e.node.props.eventKey;
            var modSet = this.state.modSet.recordSet;
            var modSize = modSet.length;
            for(var i=0; i<modSize; i++){
                if(modSet[i].uuid === groupUuid){
                    selectedMod = modSet[i];
                    break;
                }
            }

            // 展开节点 expandedKeys2
            if( selectedMod !== null ){
                var dictSet = this.state.dictMap[groupUuid]
                if( dictSet === null || typeof(dictSet)==="undefined" ){
                    this.setLoading();
                    expandedKeys2.push( groupUuid );
                    DictDefActions.initParamDictDef(groupUuid);

                    isRefresh = false;
                }
                else{
                    if( !e.node.props.expanded ){
                        expandedKeys2.push( groupUuid );
                    }
                }

                groupUuid = '';
            }
        }
        var modUuid = '';
        if(groupUuid === ''){
            modUuid = e.node.props.eventKey;
        }


        if( isRefresh ){
            this.setState({
                appUuid: this.state.appUuid
            });
        }

        var hiberarchy = '0';
        if( groupUuid !== '' ){
            var dictNode = this.state.nodeMap[groupUuid];
            indexName = dictNode.indexName;
            if(dictNode !== null && typeof(dictNode) !== 'undefined'){
                hiberarchy=dictNode.hiberarchy;
            }
        }
        
        this.props.onSelectNode( groupUuid ,hiberarchy ,indexName ,modUuid, selectedMod);
    },
    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;
        if( info.expanded ){
            var groupUuid = info.node.props.eventKey;
            var dictSet = this.state.dictMap[groupUuid]
            if( dictSet === null || typeof(dictSet)==="undefined" ){
                this.setLoading();
                DictDefActions.initParamDictDef(groupUuid);
            }
        }
    },

    prepareTreeNodes: function()
    {
        this.state.rootNodes = [];

        var modSet = this.state.modSet.recordSet;
        if(modSet.length === 0){
            return;
        }

        modSet.map((data, i) => {
            var node = this.preModNode(data);
            this.state.rootNodes.push(node);

            node.object = data;
            node.pNode = null;
            node.children = [];

            var dictSet = this.state.dictMap[data.uuid]
            if( dictSet !== null && typeof(dictSet)!=="undefined" ){
                dictSet.map((dict, i2) => {
                    var dictNode = this.preResNode(dict);
                    dictNode.pNode = node;
                    dictNode.pNode.children.push(dictNode);
                    dictNode.object = dict;
                    dictNode.children = null;
                });
            }
        });
    },

    render : function() {
        var isRefresh = (this.state.rootNodes.length === 0);

        // 赖加载
        var dictSet = this.state.dictdefSet;
        // console.log(dictSet)
        if( dictSet.groupUuid !== '' ){

            this.state.dictMap[dictSet.groupUuid] = dictSet.recordSet;
            dictSet.groupUuid = '';
            isRefresh = true;
        }

        // 生成目录
        if(isRefresh){
            this.prepareTreeNodes();
        }
        if( this.state.loading ){
            if(this.state.modSet.operation === 'retrieve' || this.state.dictdefSet.operation === 'retrieve'){
                this.state.loading = false;
            }
        }
        if( this.state.rootNodes.length === 0 ){
            if( this.state.loading ){
                return (<Spin tip="正在努力加载数据...">加载数据</Spin>);
            }
            else{
                return (<div>暂时没有数据</div>);
            }
        }

        var tree =
            <Tree
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
            (this.state.loading) ?
                <Spin tip="正在努力加载数据...">{tree}</Spin> :
                tree
        );
  }
});

ReactMixin.onClass(DictIndexTree, Reflux.connect(DictDefStore, 'dictdefSet'));
ReactMixin.onClass(DictIndexTree, Reflux.connect(ModStore, 'modSet'));
module.exports = DictIndexTree;
