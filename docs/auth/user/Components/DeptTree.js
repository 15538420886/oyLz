'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

var Common = require('../../../public/script/common');
var DeptStore = require('../../dept/data/DeptStore');
var DeptActions = require('../../dept/action/DeptActions');

var expandedKeys2= [];
var selectedKeys2= [];
var DeptTree = React.createClass({
    getInitialState : function() {
        return {
    		deptSet: {
    			corpUuid: '',
    			recordSet: [],
    			startPage : 0,
    			pageRow : 0,
    			totalRow : 0,
    			operation : '',
    			errMsg : ''
    		},
            loading: false,
            rootNodes: [],
            timer: null,
        }
    },

	  mixins: [Reflux.listenTo(DeptStore, "onServiceComplete")],
	  onServiceComplete: function(data) {
          if(data.operation === 'retrieve'){
    	      this.setState({
    	          loading: false,
    	          deptSet: data
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
        this.state.deptSet.operation = '';
        this.setState({loading: true});
    	DeptActions.initAuthDept( this.props.corpUuid );
    },

    preCrtNode: function(data, recordSet)
    {
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if( data.deptCode === '' || data.deptCode == data.deptName ){
            node.title = data.deptName;
        }
        else{
            node.title = data.deptName+'('+data.deptCode+')';
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
        var dept = null;
        if(selectedKeys2.length === 1){
        	var dataSet = this.state.deptSet.recordSet;
        	var len = dataSet.length;
        	for( var i=0; i<len; i++ ){
        		if( dataSet[i].uuid === selectedKeys2[0] ){
        			dept = dataSet[i];
        			break;
        		}
        	}
        }

        this.props.onSelectDept(dept);
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

        this.state.rootNodes = Common.initTreeNodes(this.state.deptSet.recordSet, this.preCrtNode);

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

module.exports = DeptTree;
