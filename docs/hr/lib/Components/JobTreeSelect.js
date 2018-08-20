import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { TreeSelect, Spin } from 'antd';

var WorkTypeStore = require('../../work_type/data/WorkTypeStore.js');
var WorkTypeActions = require('../../work_type/action/WorkTypeActions');
var JobStore = require('../../job/data/JobStore.js');
var JobActions = require('../../job/action/JobActions');

var isLoading=false;
var JobTreeSelect = React.createClass({
	getInitialState : function() {
		return {
			jobSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			workTypeSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			nodeList: [],
			workLoading: false,
			jobLoading: false
		}
	},

	mixins: [Reflux.listenTo(JobStore, "onJobComplete"), Reflux.listenTo(WorkTypeStore, "onWorkTypeComplete")],
	onJobComplete: function(data) {
		if(data.operation === 'retrieve'){
			var jobSet=data.recordSet;
			var workSet=this.state.workTypeSet.recordSet;
			var nodeList=this.preTreeNodes(workSet, jobSet);

			this.state.jobSet = data;
			this.setState({jobLoading: false, nodeList:nodeList});
		}

		isLoading = (this.state.workLoading || this.state.jobLoading);
	},
	onWorkTypeComplete: function(data) {
		if(data.operation === 'retrieve'){
			var jobSet=this.state.jobSet.recordSet;
			var workSet=data.recordSet;
			var nodeList=this.preTreeNodes(workSet, jobSet);

			this.state.workTypeSet = data;
			this.setState({workLoading: false, nodeList:nodeList});
		}

		isLoading = (this.state.workLoading || this.state.jobLoading);
	},
	preTreeNodes: function(workSet, jobSet){
		if(workSet.length === 0 || jobSet.length === 0){
			return [];
		}

		var nodeList = [];
		var workTypeMap = {};
		var workNameMap = {};

		workSet.map((wt, i) => {
			var typeName = wt.workType;
			var typeNode = workTypeMap[typeName];
			if(typeNode === null || typeof(typeNode) === 'undefined'){
				typeNode = {};
				typeNode.label = <span style={{cursor:'pointer'}}>{typeName}</span>;
				typeNode.value = typeName;
				typeNode.key = typeName;
				typeNode.selectable = false;
				typeNode.children = [];

				nodeList.push(typeNode);
				workTypeMap[typeName] = typeNode;
			}

			var nameNode = {};
			nameNode.label = <span style={{cursor:'pointer'}}>{wt.workName}</span>;
			nameNode.value = wt.uuid;
			nameNode.key = wt.uuid;
			nameNode.selectable = false;
			nameNode.children = [];

			typeNode.children.push(nameNode);
			workNameMap[nameNode.key] = nameNode;
		});

		jobSet.map((job, i) => {
			var nameNode = workNameMap[job.workUuid];
			if(nameNode !== null && typeof(nameNode) !== 'undefined'){
				var jobNode = {};
				if(job.jobName === null || job.jobName === '' || job.jobName === job.jobCode){
					jobNode.label = <span style={{cursor:'pointer'}}>{job.jobCode}</span>;
				}
				else{
					jobNode.label = <span style={{cursor:'pointer'}}>{job.jobCode+'('+job.jobName+')'}</span>;
				}

				jobNode.value = job.uuid;
				jobNode.key = job.uuid;
				nameNode.children.push(jobNode);
			}
		});

		return nodeList;
	},
	getJobNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.jobSet.recordSet;
		var len = nodes.length;
		for(var i=0; i<len; i++){
			if(nodes[i].uuid === value){
				return nodes[i];
			}
		}

		return {};
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.workTypeSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};
		this.state.jobSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		if(!isLoading){
			isLoading = true;
			this.setState({workLoading: true, jobLoading: true});

			var corp = window.loginData.compUser;
			var corpUuid=(corp === null) ? '' : corp.corpUuid;
			WorkTypeActions.initHrWorkType(corpUuid);
			JobActions.initHrJob( corpUuid );
		}
	},
	render : function(){
        const {
            onSelect,
            ...attributes,
        } = this.props;

		var box = <TreeSelect {...attributes} allowClear={true} onChange={onSelect}
			showSearch dropdownStyle={{maxHeight: 400, overflow: 'auto'}} treeNodeFilterProp='title'
			treeData={this.state.nodeList}/>

		var loading = (this.state.workLoading || this.state.jobLoading);
		return loading ? <Spin>{box}</Spin> : box;
	}
});

export default JobTreeSelect;
