import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { TreeSelect, Spin } from 'antd';

var JsModelStore = require('../../js-model/data/JsModelStore');
var JsModelActions = require('../../js-model/action/JsModelActions');
var Common = require('../../../public/script/common');

var JsModelTreeSelect = React.createClass({
	getInitialState : function() {
		return {
            jsModelSet:{
                recordSet: [],
				errMsg:'',
            },
            nodeList: [],
            modelMap: {},
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(JsModelStore, "onDeptComplete")],
	onDeptComplete: function(data){
        if (data.operation === 'retrieve') {
            this.state.modelMap = {};
            var jsModelSet = data.recordSet;
            this.state.nodeList = Common.initTreeNodes(jsModelSet, this.preCrtNode);

            this.state.jsModelSet = data;
			this.setState({loading: false});
		}

    },

    preCrtNode: function(data, recordSet)
	{
		var node = {};
		node.value = data.uuid;
		node.key = data.uuid;
		node.pid = data.puuid;
		node.selectable = true;
		if( data.pathDesc === '' || data.pathDesc == data.pathName ){
			node.title = data.pathName;
		}
		else{
			node.title = data.pathName+'('+data.pathDesc+')';
        }

		node.label = <span style={{cursor:'pointer'}} title={node.title} >{data.pathName}</span>;
        this.state.modelMap[data.uuid] = data.pathName;
        return node;
	},

	// 第一次加载
	componentDidMount : function(){
        this.state.jsModelSet = {
			recordSet: [],
			errMsg:'',
		};

		this.setState({loading: true});
		JsModelActions.initPageJsModel();
	},
	render : function(){
        const {
            onSelect,
            ...attributes,
        } = this.props;

		var box =<TreeSelect {...attributes} allowClear={true} onChange={onSelect}
                showSearch dropdownStyle={{maxHeight: 400, overflow: 'auto'}} treeNodeFilterProp='title'
                treeData={this.state.nodeList}/>
		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default JsModelTreeSelect;
