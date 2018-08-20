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
var ResRoleStore = require('./data/ResRoleStore.js');
var ResRoleActions = require('./action/ResRoleActions');
var ProjContext = require('../../ProjContext');
import CreateResRolePage from './Components/CreateRolePage';
import UpdateResRolePage from './Components/UpdateRolePage';

var filterValue = '';
var ResRolePage = React.createClass({
	getInitialState : function() {
		return {
			resRoleSet: {
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

    mixins: [Reflux.listenTo(ResRoleStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            resRoleSet: data
        });
		if(data.operation === 'retrieve'){
			var len = data.recordSet.length;
			for(var i = 0 ; i < len ; i++){
				if(data.recordSet[i].roleName !== '组长' && data.recordSet[i].chkRole == '1' ){
					this.setState({oldIndex: i});
					return;
				}
			}
		}
    },
    
	// 刷新
	handleQueryClick : function(event) {
		var poolUuid = ProjContext.selectedPool.uuid;
		console.log(ProjContext.selectedPool)
		this.setState({loading: true});
		this.state.resRoleSet.operation = '';
		ResRoleActions.retrieveResRole(poolUuid);
	},

	// 第一次加载
	componentDidMount : function(resRoleSet){
		var poolUuid = ProjContext.selectedPool.uuid;
		this.setState({loading: true});
		ResRoleActions.initResRole(poolUuid);
	},

	onClickDelete : function(resRole, event)
	{
		if(resRole.roleName === "助理" || resRole.roleName === "副经理"){
			Modal.confirm({
				title: '删除确认',
				content: '是否删除选中的管理员 【'+resRole.perName+'】',
				okText: '确定',
				cancelText: '取消',
				onOk: this.onClickDelete2.bind(this, resRole)
			});
			
		}
	},

	onClickDelete2 : function(resRole)
	{
		this.setState({loading: true});
		this.state.resRoleSet.operation = '';
		ResRoleActions.deleteResRole( resRole.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(resRole, event){
    	if(resRole.roleName === "助理" || resRole.roleName ==="副经理"){
        	this.setState({resRole: resRole, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	onRoleCheck: function(resRole, index){
		var resRole2 = {};
		Utils.copyValue(resRole, resRole2);

		if(resRole.roleName === '组长'){
			resRole2.chkRole = resRole2.chkRole == '1' ? '0' : '1';
			this.setState({loading: true})						
			ResRoleActions.updateResRole(resRole2);
			return;
		}

		if(resRole2.chkRole == '1'){
			resRole2.chkRole = '0';
			this.setState({loading: true, oldIndex: -1})
			ResRoleActions.updateResRole(resRole2);
			return;
		}

		if(this.state.oldIndex !== -1 && this.state.oldIndex !== index){
			Modal.warning({
				title: '非法操作',
				content: '已存在考勤员，请先取消原考勤员',
				okText: '确定',
			});
		}else{
			this.onRoleCheck2(resRole2, index);
		}
	},

	onRoleCheck2 : function(resRole, index)
	{
		resRole.chkRole = '1';
		this.setState({loading: true, oldIndex: index});
		ResRoleActions.updateResRole(resRole);
	},

	render : function(resRole) {
		var recordSet = Common.filter(this.state.resRoleSet.recordSet, filterValue);
		const columns = [
				{
            		    title: '角色',
            		    dataIndex: 'roleName',
            		    key: 'roleName',
            		    width: 140,
            		    render: (text, record) => (Utils.getOptionName('项目管理', '角色', record.roleName, true, this)),
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
							<input type="checkbox" name="chkRole" checked={text=='1'} onClick={this.onRoleCheck.bind(this, record, index)}  />
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
					<ServiceMsg ref='mxgBox' svcList={['res-role/retrieve', 'res-role/remove', 'res-role/update']}/>

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
	              page = <CreateResRolePage onBack={this.onGoBack}/>;
	          }
	          else if (this.state.action === 'update') {
	              var resRole = {};
	              Utils.copyValue(this.state.resRole, resRole);
	              page = <UpdateResRolePage onBack={this.onGoBack} resRole={resRole}/>
	          }

	          return (
	              <div style={{width: '100%',height:'100%'}}>
	                   {contactTable}
	                   {page}
	               </div>
	          );
	}
});

module.exports = ResRolePage;


