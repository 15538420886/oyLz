﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjRoleStore = require('./data/ProjRoleStore.js');
var ProjRoleActions = require('./action/ProjRoleActions');
var ProjContext = require('../../ProjContext');
import CreateProjRolePage from './Components/CreateProjRolePage';
import UpdateProjRolePage from './Components/UpdateProjRolePage';

var filterValue = '';
var ProjRolePage = React.createClass({
	getInitialState : function() {
		return {
			projRoleSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			oldIndex: -1,
		}
	},

    mixins: [Reflux.listenTo(ProjRoleStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projRoleSet: data
        });
		if(data.operation === 'retrieve'){
			var len = data.recordSet.length;
			for(var i = 0 ; i < len ; i++){
				if(data.recordSet[i].roleName !== '组长' && data.recordSet[i].chkRole === '1' ){
					this.setState({oldIndex: i});
					return;
				}
			}
		}
    },
    
	// 刷新
	handleQueryClick : function(event) {
		var projUuid = ProjContext.selectedProj.uuid;
		this.setState({loading: true});
		ProjRoleActions.retrieveProjRole(projUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var projUuid = ProjContext.selectedProj.uuid;
		this.setState({loading: true});
		ProjRoleActions.initProjRole(projUuid);
	},

	onClickDelete : function(projRole, event)
	{
		if(projRole.roleName === "助理" || projRole.roleName ==="副经理"){
			Modal.confirm({
				title: '删除确认',
				content: '是否删除选中的管理员 【'+projRole.perName+'】',
				okText: '确定',
				cancelText: '取消',
				onOk: this.onClickDelete2.bind(this, projRole)
			});
		}
	},

	onClickDelete2 : function(projRole)
	{
		this.setState({loading: true});
		ProjRoleActions.deleteProjRole( projRole.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(projRole, event){
    	if(projRole.roleName === "助理" || projRole.roleName ==="副经理"){
        	this.setState({projRole: projRole, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	onRoleCheck: function(projRole, index){
		var projRole2 = {};
		Utils.copyValue(projRole, projRole2);

		if(projRole.roleName === '组长'){
			projRole2.chkRole = projRole2.chkRole === '1' ? '0' : '1';
			this.setState({loading: true})						
			ProjRoleActions.updateProjRole(projRole2);
			return;
		}

		if(projRole2.chkRole === '1'){
			projRole2.chkRole = '0';
			this.setState({loading: true, oldIndex: -1})
			ProjRoleActions.updateProjRole(projRole2);
			return;
		}

		if(this.state.oldIndex !== -1 && this.state.oldIndex !== index){
			Modal.warning({
				title: '非法操作',
				content: '已存在考勤员，请先取消原考勤员',
				okText: '确定',
			});
		}else{
			this.onRoleCheck2(projRole2, index);
		}
	},

	onRoleCheck2 : function(projRole, index)
	{
		projRole.chkRole = '1';
		this.setState({loading: true, oldIndex: index});
		ProjRoleActions.updateProjRole(projRole);
	},

	render : function() {
		var recordSet = Common.filter(this.state.projRoleSet.recordSet, filterValue);

		const columns = [
				{
            		    title: '角色',
            		    dataIndex: 'roleName',
            		    key: 'roleName',
            		    width: 140,
            		    render: (text, record) => (Utils.getOptionName('项目管理', '角色', record.roleName, false, this)),
      		        },
      		       {
            		    title: '员工编号',
            		    dataIndex: 'staffCode',
            		    key: 'staffCode',
            		    width: 140,
      		        },
      		       {
            		    title: '姓名',
            		    dataIndex: 'perName',
            		    key: 'perName',
            		    width: 140,
      		        },
      		       {
            		    title: '小组',
            		    dataIndex: 'memo2',
            		    key: 'memo2',
            		    width: 140,
      		        },
					{
            		    title: '考勤员',
            		    dataIndex: 'chkRole',
            		    key: 'chkRole',
            		    width: 140,
            		    render: (text, record, index) => (
							<input type="checkbox" name="chkRole" checked={text==='1'} onClick={this.onRoleCheck.bind(this, record, index)}  />
						)
      		        },
      		       {
            		    title: '开始日期',
            		    dataIndex: 'beginDate',
            		    key: 'beginDate',
            		    width: 140,
            		    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
      		        },
      		       {
            		    title: '结束日期',
            		    dataIndex: 'endDate',
            		    key: 'endDate',
            		    width: 140,
            		    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
      		        },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span style={{display:(record.roleName === "助理" || record.roleName === "副经理" ) ? "block":"none" }}>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改管理员'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除管理员'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var visible = (this.state.action === 'query') ? '' : 'none';
		var contactTable =
			<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-role/retrieve', 'proj-role/remove', 'proj-role/update']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加小组" onClick={this.handleCreate}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查询" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>;
			  var page = null;
	          if(this.state.action === 'create'){
	              page = <CreateProjRolePage onBack={this.onGoBack}/>;
	          }
	          else if (this.state.action === 'update') {
	              var projRole = {};
	              Utils.copyValue(this.state.projRole, projRole);
	              page = <UpdateProjRolePage onBack={this.onGoBack} projRole={projRole}/>
	          }

	          return (
	              <div style={{width: '100%',height:'100%'}}>
	                   {contactTable}
	                   {page}
	               </div>
	          );
	}
});

module.exports = ProjRolePage;
