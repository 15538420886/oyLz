import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { TreeSelect, Spin } from 'antd';

var DeptStore = require('../../dept/data/DeptStore.js');
var DeptActions = require('../../dept/action/DeptActions');
var Common = require('../../../public/script/common');

var DeptTreeSelect = React.createClass({
	getInitialState : function() {
		return {
            deptSet:{
                recordSet: [],
				errMsg:'',
				operation:''
            },
            nodeList: [],
            deptMap: {},
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(DeptStore, "onDeptComplete")],
	onDeptComplete: function(data){
        if (data.operation === 'retrieve') {
            this.state.deptMap = {};
            var deptSet = data.recordSet;
            this.state.nodeSet = Common.initTreeNodes(deptSet, this.preCrtNode);

            this.state.deptSet = data;
			this.setState({loading: false});
		}

    },
    
	getHrExeNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.deptSet.recordSet;
		var len = nodes.length;
		for(var i=0; i<len; i++){
			if(nodes[i].uuid === value){
				return nodes[i];
			}
		}

		return {};
	},
    preCrtNode: function(data, recordSet)
	{
		var node = {};
		node.label = <span style={{cursor:'pointer'}}>{data.deptName}</span>;
		node.value = data.uuid;
		node.key = data.uuid;
		node.pid = data.puuid;
		node.selectable = true;
		if( data.deptDesc === '' || data.deptDesc == data.deptName ){
			node.title = data.deptName;
		}
		else{
			node.title = data.deptName+'('+data.deptDesc+')';
        }

        this.state.deptMap[data.uuid] = data.deptName;
        return node;
	},

	// 第一次加载
	componentDidMount : function(){
        this.state.deptSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		DeptActions.initHrDept( corpUuid );
	},
	render : function(){
        const {
            onSelect,
            ...attributes,
        } = this.props;

		var box =<TreeSelect {...attributes} allowClear={true} onChange={onSelect}
                showSearch dropdownStyle={{maxHeight: 400, overflow: 'auto'}} treeNodeFilterProp='title'
                treeData={this.state.nodeSet}/>
		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default DeptTreeSelect;
