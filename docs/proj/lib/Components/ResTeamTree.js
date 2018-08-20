'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin} from 'antd';
const TreeNode = Tree.TreeNode;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var TreeResTeamStore = require('../data/TreeResTeamStore');
var TreeResTeamActions = require('../action/TreeResTeamActions');

var expandedKeys2= [];
var selectedKeys2= [];
var ResTeamTree = React.createClass({
    getInitialState : function() {
        return {
            dataSet: {
                poolSet: [],
                teamSet: []
            },
            
            loading: false,
            poolMap: {},
            teamMap: {},
            rootNodes: [],
        }
    },
    
    mixins: [Reflux.listenTo(TreeResTeamStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.state.rootNodes = [];
        this.state.poolMap = {};
        this.state.teamMap = {};

        // console.log('data', data)
        this.state.dataSet = data;
        if (data.errMsg === '') {
            data.teamSet.map((node, i) => {
                this.state.teamMap[node.uuid] = node;
            });

            data.poolSet.map((node, i) => {
                this.state.poolMap[node.uuid] = node;
            });

			this.prepareTreeNodes();
	    }
		
		this.setState({
            loading: false,
		});
    },
    
    // 第一次加载
    componentDidMount : function(){
        expandedKeys2= [];
        selectedKeys2= [];

		this.setState({
            loading: true,
		});
		
        var corpUuid = window.loginData.compUser.corpUuid;
        TreeResTeamActions.initResTeam(corpUuid);
    },

    onSelect:function(selectedKeys, e)
    {
        selectedKeys2 = selectedKeys;
        
        var poolUuid = '';
        var teamNode = null;
        if( e.node != null ){
            poolUuid = e.node.props.eventKey;
            teamNode = this.state.teamMap[poolUuid];
            
            // 展开节点 expandedKeys2  
            if (!teamNode ){
                expandedKeys2.push(poolUuid );
        	}
        }
		
        if (teamNode){
            this.props.onSelect(teamNode);
        }
        else {
            var poolNode = this.state.poolMap[poolUuid];
            if (poolNode) {
                this.props.onSelectPool(poolNode);
            }
        }
    },
    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;  
    },

    prepareTreeNodes: function () {
        var poolSet = this.state.dataSet.poolSet;
        var teamSet = this.state.dataSet.teamSet;
        this.state.rootNodes = Common.initTreeNodes2(poolSet, this.prePoolNode, teamSet, this.preTeamNode);
    },
    prePoolNode: function(data){
        var node = {};
        node.key = data.uuid;
        node.title = data.poolName;
        return node;
    },

    //子节点
    preTeamNode: function(data){
        var node = {};
        node.key = data.uuid;
        node.pid = data.poolUuid;
        node.title = data.teamName;
        return node;
    },

    render : function() {
        var loading = this.state.loading;
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
                defaultExpandedKeys={expandedKeys2}
                selectedKeys={selectedKeys2}
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


module.exports = ResTeamTree;
