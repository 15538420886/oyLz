'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Modal, Icon, Button, Tree, Input, Form, Spin } from 'antd';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import ModalForm from '../../lib/Components/ModalForm';
var Validator = require('../../public/script/common');

var ModelStore = require('./data/ModelStore.js');
var ModelActions = require('./action/ModelActions');

var ModelInfoStore = require('./data/ModelInfoStore.js');
var ModelInfoActions = require('./action/ModelInfoActions');

import CreateModelPage from './Components/CreateModelPage';
import UpdateModelPage from './Components/UpdateModelPage';

var expandedKeys2= [];
var selectedKeys2= [];
var ModelPage = React.createClass({
	getInitialState : function() {
		return {
			pathSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			modelSet:{
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			validRules:[],
			model:{},
			isRefresh: false,
            rootNodes: [],
            isPath:'',
            isModel:'',
            isEditor:'',
            loading:false,
            loading2:false,
            hints:{}
		}
	},

	mixins: [Reflux.listenTo(ModelStore, "onServiceComplete"),Reflux.listenTo(ModelInfoStore, "onServiceComplete2"),ModalForm('model')],
    onServiceComplete: function(data) {
    	if(data.operation === 'retrieve'){
    		this.setState({
    			loading: false,
	            pathSet: data
	        });
    	}else{
            // 失败
            this.setState({
                loading: false,
                pathSet: data
            });
	    }
    },
	
    onServiceComplete2: function(data){
    	if(data.operation === 'create' && data.errMsg === ''){
    		Common.succMsg('保存成功');
    	}else if(data.operation === 'update' && data.errMsg === ''){
    		Common.succMsg('修改成功');
    	}
    	if(data.operation === 'retrieve' || data.operation === 'update' || data.operation === 'create'){
    		this.setState({
    			loading2: false, 
	            modelSet: data,
	        });
	        this.setState({
	        	model:{
	            	fmtBody:this.state.modelSet.recordSet[0].fmtBody
	            }
	        })      	       
    	}
    },
	// 刷新
    handleQueryClick: function (event){
    	this.setState({loading: true});
		this.state.pathSet.operation = '';
        ModelActions.retrievePageModel();
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'fmtBody', desc:'模板内容', required: false, max:'2147483647'}
		];
		this.setState({loading: true});
		ModelActions.retrievePageModel();
	},
 
	showError: function(msg){
		var pathSet = this.state.pathSet;
		pathSet.errMsg = msg;
		pathSet.operation = 'retrieve';
		this.setState({
			pathSet: pathSet
		});
	},

    onSelect: function(selectedKeys, info){
        selectedKeys2 = selectedKeys;
		this.setState({
			isRefresh: true,
			isPath:info.node.props.children == undefined ? 1 : 0
		});

		if(selectedKeys.length !== 0){
			var selNode = this.getSelectedNode();
			this.state.isModel = selNode.isModel
			this.state.isEditor = selNode.isModel
			this.state.model.fmtBody = ''
			if(this.state.isModel == '1'){
				//模板数据请求
				this.setState({loading2: true});
				ModelInfoActions.retrieveModelInfo(selNode.uuid,'#')
				
			}else{
				//目录	
				if(this.state.modelSet.recordSet.length){
					this.state.model.fmtBody = ''
				}
				
			}
		}
    },

    onExpand: function(expandedKeys, info){
        expandedKeys2 = expandedKeys;
    },

    getSelectedNode: function(){
		if(selectedKeys2.length !== 1){
			return null;
		}
		var recordSet=this.state.pathSet.recordSet;
		var len = recordSet.length;
		for(var i=0; i<len; i++){
        	if(recordSet[i].uuid === selectedKeys2[0] ){
        		return recordSet[i];
        	}
		}
		
        return null;
    },

	handleOpenCreateWindow : function(event){
		var selNode = this.getSelectedNode();
		var puuid = '';
		var groupUuid = '';
		if(selNode){
			puuid = selNode.puuid
			groupUuid = selNode.uuid
		}
		this.refs.createWindow.clear(groupUuid, '#', this.state.isModel,puuid);
		this.refs.createWindow.toggle(); 
	},
 
	handleAddChild: function(event){
		var selNode = this.getSelectedNode();
		if(selNode === null){
			this.showError( '请选择一个父目录' );
			return;
		}
		this.refs.createWindow.clear( '', '#',this.state.isModel,selectedKeys2[0] );
		this.refs.createWindow.toggle();
	},
	//保存  
	handleSavePath: function(){
		var model = this.state.model;
		var selNode = this.getSelectedNode();
		var modelSet = this.state.modelSet;
		if(selNode === null){
			this.showError( '请选择一个模板' );
			return;
		}
		if(model.fmtBody === ''){
			Common.warnMsg('请在模板内输入数据后保存');
			return;
		}
		if(modelSet.recordSet.length !== 0 && model.fmtBody === modelSet.recordSet[0].fmtBody){ 
			Common.warnMsg('请确认是否已对模板进行了修改');
			return;
		}
		if(typeof modelSet.recordSet[0] == 'undefined'){
			//新增
			this.setState({loading2: true});
			model.groupUuid = selNode.uuid; 
			model.corpUuid = '#'; 
			ModelInfoActions.createModelInfo(model);
		}else{
			//修改
			this.setState({loading2: true});
			model.groupUuid = selNode.uuid;
			model.corpUuid = '#';
			model.uuid = modelSet.recordSet[0].uuid
			ModelInfoActions.updateModelInfo(model);
		}
	},
	
	onClickUpdate : function(event){
		var selNode = this.getSelectedNode();
		if(selNode === null){
			this.showError( '请选择一个目录' );
			return;
		}
		this.refs.updateWindow.initPage(selNode);
		this.refs.updateWindow.toggle();
	},
	
	onCreateCallback : function(path){
		if(path.puuid !== null && path.puuid !== ''){
			expandedKeys2.push(path.puuid);
		}
			
		ModelActions.createPageModel( path );
	},

	onClickDelete : function(event){
		var selNode = this.getSelectedNode();
		if(selNode === null){
			this.showError( '请选择一个目录' );
			return;
		}
		
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的 【'+selNode.pathName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, selNode)
		});
	},

	onClickDelete2 : function(path){
		this.setState({loading: true});
		this.state.pathSet.operation = '';
		ModelActions.deletePageModel( path.uuid );
	},
	onSaveCallback: function(path){
		ModelActions.updatePageModel(path);
	},
  	
    preCrtNode: function(data, recordSet){
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if( data.pathDesc === '' || data.pathDesc == data.pathName ){
            node.title = data.pathName;         
        }
        else{
            node.title = data.pathName+'('+data.pathDesc+')';
        }
        return node;
    },
    
	render : function() {
		var isEditor = !Number(this.state.isEditor);
		var isDisabled2 = !this.state.isPath;
		var isModel = Number(this.state.isModel);

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		var loading = this.state.loading; 	

		if(this.state.isRefresh){
			this.state.isRefresh = false;
		}
		else{
			this.state.rootNodes = Common.initTreeNodes(this.state.pathSet.recordSet, this.preCrtNode);
		}

		if(this.state.modelSet.recordSet.length === 0){
			
		}

		var tree = <Tree
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
		
		return (
			<div className='grid-page'>
        		<div style={{display: 'flex', height:'100%'}}>
                    <div className='left-tree' style={{flex: '0 0 230px', width: '230px', overflowY:'auto', overflowX:'hidden'}}>
						<ServiceMsg ref='mxgBox' svcList={['model-path/retrieve','model-path/remove']} />
						<div style={{margin: '8px 8px 0'}}>
							<Button icon="plus" title="增加目录/模板" type="primary"  onClick={this.handleOpenCreateWindow}/>
							<Button icon="folder-add" title="增加子目录/模板" onClick={this.handleAddChild} disabled={isModel} style={{marginLeft: '4px'}}/>
							<Button icon="edit" title="修改目录/模板" onClick={this.onClickUpdate} style={{marginLeft: '4px'}}/>
							<Button icon="delete" title="删除目录/模板" onClick={this.onClickDelete} disabled={isDisabled2} style={{marginLeft: '4px'}}/>
							<Button icon="sync" title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					    {loading ?
		                <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{tree}</Spin> :
		                tree}
		            	
                    </div>
                    <div style={{overflow:'hidden',width:'100%'}}>
						<div className='grid-body' style={{paddingTop:'10px'}}>
							<ServiceMsg ref='mxgBox' svcList={['model-info/create','model-info/update']} />
							<div style={{marginBottom: '12px'}}> 
	                    		<Button icon="folder" title="保存" onClick={this.handleSavePath} disabled={isEditor}/>
							</div>
							<FormItem {...formItemLayout} className={layoutItem} help={hints.modelNameHint} colon={true} validateStatus={hints.fmtBodyStatus}>
								{this.state.loading2 ? 
								<Spin>
									<Input style={{height:'500px'}} type="textarea" name='fmtBody' id='fmtBody' disabled={isEditor} value={this.state.model.fmtBody} onChange={this.handleOnChange}/>
		                       	</Spin>
		                       	: <Input style={{height:'500px',fontFamily:'monospace',color:'#930000'}} type="textarea" name='fmtBody' id='fmtBody' disabled={isEditor} value={this.state.model.fmtBody} onChange={this.handleOnChange}/>}
	                        </FormItem>
                        </div>
                    </div>
                </div>   
				<CreateModelPage ref="createWindow" onCreateCallback={this.onCreateCallback}/>
				<UpdateModelPage ref="updateWindow" onSaveCallback={this.onSaveCallback}/>
			</div>
		);
	}
});

module.exports = ModelPage;

