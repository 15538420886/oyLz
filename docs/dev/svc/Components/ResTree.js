'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Common = require('../../../public/script/common');
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

var Utils = require('../../../public/script/utils');
var ResStore = require('../data/ResStore.js');
var ResActions = require('../action/ResActions');
var ModuleStore = require('../data/ModuleStore.js');
var ModuleActions = require('../action/ModuleActions');

var expandedKeys2= [];
var selectedKeys2= [];
var ResTree = React.createClass({
	getInitialState : function() {
		return {
			resSet: {
				recordSet: [],
				errMsg : ''
			},
			moduleSet: {
				recordSet: [],
				errMsg : ''
			},
            loading: false,
            isLoaded: false,
			appUuid: '',
            rootNodes: [],
            timer: null,
		}
	},

	// 第一次加载
	componentDidMount : function(){
        this.refresh();
    },
    refresh: function () {
        this.state.resSet.operation = '';
        this.state.moduleSet.operation = '';
        this.state.loading = true;

        var app = window.devApp;
        this.state.appUuid = app.uuid;
        ModuleActions.initAppModule(app.uuid);
        ResActions.initAppRes(app.uuid);
    },

    onSelect: function(selectedKeys, info){
        selectedKeys2 = selectedKeys;
		this.onSelect2();
	},
	onSelect2: function(){
		var appRes = null;
		if(selectedKeys2.length === 1){
			var resUuid = selectedKeys2[0];

			var resSet = this.state.resSet.recordSet;
			var len = resSet.length;
			for( var i=0; i<len; i++ ){
				var data = resSet[i];
				if(data.uuid === resUuid){
					appRes = data;
					break;
				}
			}
		}

		this.props.onSelectRes(appRes);
    },
    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;
    },

    preModuleNode: function(data)
    {
        var node = {};
        node.key = data.uuid;
        node.pid = '';
        if( data.modDesc === '' || data.modDesc === data.modName ){
            node.title = data.modName;
        }
        else{
            node.title = data.modName+'('+data.modDesc+')';
        }

        return node;
    },

	preResNode: function(data)
	{
		var node = {};
		node.key = data.uuid;
		node.pid = data.modUuid;
		if( data.resDesc === '' || data.resDesc == data.resName ){
			node.title = data.resName;
		}
		else{
			node.title = data.resName+'('+data.resDesc+')';
		}

		return node;
	},

	prepareTreeNodes: function(){
		this.state.rootNodes = [];

		var resSet = this.state.resSet.recordSet;
		var moduleSet = this.state.moduleSet.recordSet;
		if(resSet.length === 0 || moduleSet.length === 0){
			return;
		}

		var moduleMap = {};
		moduleSet.map((data, i) => {
            var node = this.preModuleNode(data);
            this.state.rootNodes.push(node);
            moduleMap[node.key] = node;

            node.object = data;
            node.pNode = null;
            node.children = [];
            //console.log(this.state.rootNodes)
        });

		resSet.map((data, i) => {
            var node = this.preResNode(data);
			node.pNode = moduleMap[node.pid];
			if( node.pNode !== null && typeof(node.pNode)!=="undefined" ){
				node.pNode.children.push(node);
	            node.object = data;
	            node.children = null;
			}
        });
	},

	render : function() {
        var flag = false;
	    if( this.state.loading ){
	        if(this.state.resSet.operation === 'retrieve' && this.state.moduleSet.operation === 'retrieve'){
                flag = true;
	            this.state.loading = false;
	        }
            else{
                return(
                    <Spin tip="正在努力加载数据...">
                        <div style={{height:'200px'}}/>
                    </Spin>
                );
            }
	    }

        // 初始化
        if(flag && selectedKeys2.length === 1){
            this.state.timer = setTimeout(
                () => {
                    this.onSelect2();
                    clearInterval(this.state.timer);
                },
                100
            );
        }

		// 生成目录
        if( !this.state.isLoaded ){
            this.prepareTreeNodes();
        }
        else{
            this.state.isLoaded = true;
        }

		return (
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
            </Tree>
		);
	}
});

ReactMixin.onClass(ResTree, Reflux.connect(ResStore, 'resSet'));
ReactMixin.onClass(ResTree, Reflux.connect(ModuleStore, 'moduleSet'));
module.exports = ResTree;
