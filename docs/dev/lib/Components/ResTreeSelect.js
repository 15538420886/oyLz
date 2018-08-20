import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { TreeSelect, Spin } from 'antd';

var ResActions = require('../../svc/action/ResActions');
var ResStore = require('../../svc/data/ResStore');

var ModuleStore = require('../../svc/data/ModuleStore');
var ModuleActions = require('../../svc/action/ModuleActions');
var Common = require('../../../public/script/common');

var ResTreeSelect = React.createClass({
	getInitialState : function() {
		return {
            resSet:{
                recordSet: [],
				errMsg:'',
				operation:''
            }, 
            moduleSet:{
                recordSet: [],
				errMsg:'',
				operation:''
            }, 
            resList: [],
            resMap: {},
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(ModuleStore, "onModuleComplete"),Reflux.listenTo(ResStore, "onResComplete")],
	onModuleComplete:function(data){
    	if(data.operation === 'retrieve'){
    		this.setState({
    			moduleSet:data
    		})
    	}
    },
	onResComplete: function(data){
        if (data.operation === 'retrieve') {
        	this.state.resMap = {}
            var resSet = data.recordSet;
            resSet = resSet.concat(this.state.moduleSet.recordSet);
            this.state.resList = Common.initTreeNodes(resSet, this.preCrtNode);
            this.state.resSet = data;
			this.setState({loading: false});
		} 

    },
    

    preCrtNode: function(data, recordSet)
	{
		
		var node = {};
		node.value = data.uuid;
		node.key = data.uuid;
		node.pid = data.modUuid;
		node.selectable = true;
		if( data.modName !== undefined ){
			node.title = data.modName;
		}
		else{
			node.title = data.resName+'('+data.resDesc+')';
        }
		node.label = <span style={{cursor:'pointer'}} title={node.title} >{data.modName||data.resName}</span>;
        this.state.resMap[data.uuid] = data.resName;
        return node;
	},
 
	// 第一次加载
	componentDidMount : function(){
        this.state.resSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		}; 
		this.setState({loading: true});
		var app = window.devApp;
        this.state.appUuid = app.uuid;
        ModuleActions.initAppModule(app.uuid);
        ResActions.initAppRes(app.uuid);
	},
	render : function(){
        const {
            onSelect,
            ...attributes,
        } = this.props;

		var box =<TreeSelect {...attributes} allowClear={true} onChange={onSelect}
                showSearch dropdownStyle={{maxHeight: 400, overflow: 'auto'}} treeNodeFilterProp='title'
                treeData={this.state.resList}/>
		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
}); 

export default ResTreeSelect;
