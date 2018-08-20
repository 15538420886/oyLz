'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import {Button, Table, Icon, Modal} from 'antd';
import CreateDictPage from './CreateDictPage';
import UpdateDictPage from './UpdateDictPage';
import SourcePage from '../../../dev/searchDict/Components/SourcePage';
var Context = require('../../ParamContext');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var DictStore = require('../data/DictStore');
var DictActions = require('../action/DictActions');


var expandedRows=[];
var DictarrTable = React.createClass({
	getInitialState : function() {
		return {
			dictSet: {
				codeUuid: '',
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
            selectedRowKeys: [],
			rootNodes: [],
			paraStatus:'',
			code:'',
			hiberarchy: this.props.hiberarchy,
		}
	},

	mixins: [Reflux.listenTo(DictStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		this.setState({
			loading: false,
			dictSet: data,
		});
	},

    // 第一次加载
    componentDidMount : function(){
    	if(this.props.indexCode != null && typeof(this.props.indexCode) != 'undefined'){
    		this.loadData( this.props.indexCode );
    	}
    },
	// ---		参数要改
	loadData : function(codeUuid){
		this.state.dictSet.codeUuid = codeUuid;
		DictActions.initSysCodeData(codeUuid);
	},

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		DictActions.retrieveSysCodeData(this.state.dictSet.codeUuid,this.state.dictSet.recordSet.groupUuid);
	},
	
	componentWillReceiveProps: function(nextProps){
      this.setState({
        hiberarchy: nextProps.hiberarchy,
      });
    },

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear(this.state.dictSet.codeUuid,'');
		this.refs.createWindow.toggle();
	},

	onClickAddChild : function(code, event){
		if(code != null){
			this.refs.createWindow.clear( this.state.dictSet.codeUuid, code.uuid );
			this.refs.createWindow.toggle();
		}
	},

	onClickUpdate : function(dict, event){
		if(dict != null){
			this.refs.updateWindow.initPage(dict);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(dict, event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的 【'+dict.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, dict)
		});
	},

	onClickDelete2 : function(dict){
		this.setState({loading:true});
		DictActions.deleteSysCodeData( dict.uuid );
	},

	onExpandedRowsChange: function(expandedRows2){
      expandedRows = expandedRows2;
    },

	preCrtNode: function(data, recordSet){
      var node = {};
      node.key = data.uuid;
      node.pid = data.groupUuid;
     if( data.codeDesc === '' || data.codeDesc == data.codeValue ){
          node.title = data.codeValue;
      }
      else{
          node.title = data.codeValue+'('+data.codeDesc+')';
      }
      	node.codeDesc = data.codeDesc;
        node.codeValue = data.codeValue;
        node.paraStatus = data.paraStatus;
        return node;
  },

  	onClickCoding:function(){
    	let appName = Context.paramApp.appName;
    	let optName = this.props.indexName;
		this.refs.sourceWindow.handleOpen();
		var code = `import DictSelect from '../lib/Components/DictSelect';
import DictRadio from '../lib/Components/DictRadio';
<FormItem labelCol={{span: 0}} wrapperCol={{span: 24}} colon={true} style={{marginBottom: '20px'}}>
	<DictSelect name="idType" id="idType" value={this.props.authUser.idType} appName='${appName}' optName='${optName}' onSelect={this.handleOnSelected.bind(this, "idType")}/>
</FormItem>
<FormItem >
	<DictRadio name="hiberarchy" id="hiberarchy" value={this.state.dictdef.hiberarchy} appName='${appName}' optName='${optName}' onChange={this.onRadioChange}/>
</FormItem >

============================表格 columns===============================

render: (text, record) => (Utils.getOptionName('${appName}', '${optName}', record.corpType, true, this)),
`;
		this.setState({code : code});
    },


	render : function() {

		if(this.state.hiberarchy != 2){
            return null;
        }

		var codeUuid=this.state.dictSet.codeUuid;
		var isSelected = (codeUuid !== '');
		var recordSet = this.state.dictSet.recordSet;
		var code = this.state.code;
		recordSet.map((data,index) => {
			this.state.paraStatus=data.paraStatus
		})

		this.state.rootNodes = Common.initTreeNodes(recordSet, this.preCrtNode);
	    this.state.rootNodes.map((item, i) => {
	        if( item.key === '__unknow' ){
	            item.codeValue = '未分类';
	        }
	    });

		const columns = [
			{
				title: '代码值',
				dataIndex: 'codeValue',
				key: 'codeValue',
				width: 240,
			},
			{
				title: '代码名称',
				dataIndex: 'codeDesc',
				key: 'codeDesc',
				width: 240,
			},
			{
				title: '状态',
				dataIndex: 'paraStatus',
				key: 'paraStatus',
				width: 80,
			},
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
				(record.key != '__unknow') ?
		    	      <span>
		    	      <a href="#" onClick={this.onClickAddChild.bind(this, record.object)} title='增加下级部门'><Icon type={Common.iconAddChild}/></a>
			      <span className="ant-divider" />
		    	      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
		    	      <span className="ant-divider" />
		    	      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
		    	      </span>
	    	   	 :null
				),
			}
		];

		return (
			<div className='full-page'>
                <div className='toolbar-table'>
                 {
		            isSelected ?
		            <Button icon={Common.iconAdd} type="primary" title="增加字典项" onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}/>
		            : '请选择模块'
      			}
          		{
          			isSelected ?
		          	<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft:'4px', cursor:'pointer'}}/>
		          	 : null
          		}
          		{
          			isSelected ?
		          	<Button icon="code-o"  onClick={this.onClickCoding} title='生成代码' style={{marginLeft:'4px', cursor:'pointer'}}/>
		          	 : null
          		}

         	 </div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={this.state.rootNodes} rowKey={record => record.key} loading={this.state.loading} pagination={false} defaultExpandedRowKeys={expandedRows} onExpandedRowsChange={this.onExpandedRowsChange}  size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateDictPage ref="createWindow" />
				<UpdateDictPage ref="updateWindow" />
				<SourcePage ref="sourceWindow" codeText={code} />
			</div>
		);
	}
});

// ReactMixin.onClass(DictarrTable, Reflux.connect(DictStore, 'dictSet'));
module.exports = DictarrTable;
