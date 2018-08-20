'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';

import { Table, Icon, Button, Modal, Input } from 'antd';
const Search = Input.Search;
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var DeptStore = require('./data/DeptStore.js');
var DeptActions = require('./action/DeptActions');
import CreateDeptPage from './Components/CreateDeptPage';
import UpdateDeptPage from './Components/UpdateDeptPage';

var filterValue = '';
var expandedRows=[];
var DeptPage = React.createClass({
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
        filterValue: '',
        filterNodes: []
	}
  },

  mixins: [Reflux.listenTo(DeptStore, "onServiceComplete")],
  onServiceComplete: function(data) {
      this.setState({
          loading: false,
          deptSet: data,
          rootNodes: [],
          filterValue: '',
          filterNodes: []
      });
  },

  // 刷新
  handleQueryClick : function(event) {
      this.state.deptSet.operation = '';
      this.setState({loading: true});
      DeptActions.retrieveAuthDept( this.state.deptSet.corpUuid );
  },

  // 第一次加载
  componentDidMount : function(){
      this.setState({loading: true});
      var compUser = window.loginData.compUser;
      var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
      DeptActions.initAuthDept( corpUuid );
  },

  handleOpenCreateWindow : function(event) {
  	this.refs.createWindow.clear( this.state.deptSet.corpUuid, '' );
    this.refs.createWindow.toggle();
  },

  onClickAddChild : function(dept, event)
  {
	if(dept != null){
	  	this.refs.createWindow.clear( this.state.deptSet.corpUuid, dept.uuid );
	    this.refs.createWindow.toggle();
	}
  },

  onClickUpdate : function(dept, event)
  {
	if(dept != null){
        this.refs.updateWindow.initPage(dept);
		this.refs.updateWindow.toggle();
	}
  },

  onClickDelete : function(dept, event)
  {
  	Modal.confirm({
        title: Common.removeTitle,
  		content: '是否删除选中的部门 【'+dept.deptCode+'】',
        okText: Common.removeOkText,
        cancelText: Common.removeCancelText,
  		onOk: this.onClickDelete2.bind(this, dept)
  	});
  },

  onClickDelete2 : function(dept)
  {
      this.state.deptSet.operation = '';
      this.setState({loading: true});
  	DeptActions.deleteAuthDept( dept.uuid );
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

        node.deptCode = data.deptCode;
        node.deptName = data.deptName;
        node.deptDesc = data.deptDesc;
        return node;
  },

  onExpandedRowsChange: function(expandedRows2)
  {
      expandedRows = expandedRows2;
  },

  onFilterRecord: function(e){
      filterValue = e.target.value;
      this.setState({loading: this.state.loading});
  },

  render : function() {
  	if(this.state.rootNodes.length === 0){
	    this.state.rootNodes = Common.initTreeNodes(this.state.deptSet.recordSet, this.preCrtNode);
	    this.state.rootNodes.map((item, i) => {
	        if( item.key === '__unknow' ){
	            item.deptCode = '未分类';
	        }
	    });
	}
	
	if(filterValue !== ''){
		if(this.state.filterValue !== filterValue){
			this.state.filterNodes = Common.filter(this.state.deptSet.recordSet, filterValue);
			this.state.filterValue = filterValue;
		}
	}

  	var recordSet = (filterValue !== '') ? this.state.filterNodes : this.state.rootNodes;
  	
	const columns = [
	{
	  title: '部门代码',
	  dataIndex: 'deptCode',
	  key: 'deptCode',
	  width: '20%',
	},
	{
	  title: '部门名称',
	  dataIndex: 'deptName',
	  key: 'deptName',
	  width: '30%',
	},
	{
	  title: '部门描述',
	  dataIndex: 'deptDesc',
	  key: 'deptDesc',
	  width: '40%',
	},
	{
	  title: '',
	  key: 'action',
	  width: '10%',
      // 判断 __unknow
	  render: (text, record) => (
          (record.key != '__unknow') ?
    	    <span>
    	      {filterValue !== '' ? null : <a href="#" onClick={this.onClickAddChild.bind(this, record.object)} title='增加下级部门'><Icon type={Common.iconAddChild}/></a>}
    	      {filterValue !== '' ? null : <span className="ant-divider" />}
    	      <a href="#" onClick={this.onClickUpdate.bind(this, record.object)} title='修改部门信息'><Icon type={Common.iconUpdate}/></a>
    	      <span className="ant-divider" />
    	      <a href="#" onClick={this.onClickDelete.bind(this, record.object)} title='删除部门'><Icon type={Common.iconRemove}/></a>
    	    </span>
            : null
      )
	}];
	
	var cs = Common.getGridMargin(this);
	return (
		<div className='grid-page' style={{padding: cs.padding}}>
			<div style={{margin: cs.margin}}>
				<ServiceMsg ref='mxgBox' svcList={['auth-dept/retrieve', 'auth-dept/remove']}/>

				<div className='toolbar-table'>
					<div style={{float:'left'}}>
						<Button icon={Common.iconAdd} type="primary" title="增加部门" onClick={this.handleOpenCreateWindow}/>
						<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
					</div>
					<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
	                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
	                </div>
				</div>
			</div>
			<div className='grid-body'>
				<Table columns={columns} dataSource={recordSet} rowKey={record => record.key} defaultExpandedRowKeys={expandedRows} onExpandedRowsChange={this.onExpandedRowsChange} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
			</div>
			
			<CreateDeptPage ref="createWindow"/>
			<UpdateDeptPage ref="updateWindow"/>
      </div>);
  }
});

module.exports = DeptPage;
