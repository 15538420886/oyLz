'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

var Common = require('../../../public/script/common');
var ChkProjGrpTreeStore = require('../data/ChkProjGrpTreeStore');
var ChkProjGrpTreeActions = require('../action/ChkProjGrpTreeActions');

var expandedKeys2= [];
var selectedKeys2= [];
var ChkProjGrpTree = React.createClass({
    getInitialState : function() {
        return {
    		ProjGrpSet: {
    			recordSet: [],
    			operation : '',
    			errMsg : ''
    		},
            loading: false,
            rootNodes: [],
            ProjGrpMap: {},
            timer: null,
        }
    },

	mixins: [Reflux.listenTo(ChkProjGrpTreeStore, "onServiceComplete")],
	onServiceComplete: function(data) {
        if(data.operation === 'retrieve'){
            var rootNodes=[];
            var ProjGrpMap={};
            if(data.errMsg === ''){
                rootNodes = Common.initTreeNodes(data.recordSet, this.preCrtNode);
                data.recordSet.map((node, i) => {
                    ProjGrpMap[node.uuid] = node;
                });
            }

    	      this.setState({
    	          loading: false,
    	          ProjGrpSet: data,
                  rootNodes: rootNodes,
                  ProjGrpMap: ProjGrpMap
    	      });

              // 初始化，加载用户
              if(selectedKeys2.length === 1){
                  this.state.timer = setTimeout(
                      () => {
                          this.onSelect2();
                          clearInterval(this.state.timer);
                      },
                      100
                  );
              }

          }
	  },

    // 第一次加载
    componentDidMount : function(){
        this.state.ProjGrpSet.operation = '';
        this.setState({loading: true});

        var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
    	ChkProjGrpTreeActions.initChkProjGrp( corpUuid );
    },

    preCrtNode: function(data, recordSet)
    {
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if( data.grpCode === '' || data.grpCode == data.grpName ){
            node.title = data.grpName;
        }
        else{
            node.title = data.grpName+'('+data.grpCode+')';
        }

        return node;

    },

    onSelect: function(selectedKeys, info){
        var po = info.node.props;
        if( !po.expanded && typeof(po.children) !== 'undefined' ){
            expandedKeys2.push( po.eventKey );
        }

        selectedKeys2 = selectedKeys;
        this.onSelect2();
    },
    
    onSelect2: function(){
        var ProjGrp = null;
        if(selectedKeys2.length === 1){
            ProjGrp = this.state.ProjGrpMap[selectedKeys2[0]];
        }
          this.props.onSelectProjGrp(ProjGrp);
    },

    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;
    },

    render : function() {
	    if( this.state.loading ){
            return(
                <Spin tip="正在努力加载数据...">
                    <div style={{height:'200px'}}/>
                </Spin>
            );
	    }

    	return (
            <Tree
                className='left-tree2'
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
            </Tree>);
        }
});

module.exports = ChkProjGrpTree;
