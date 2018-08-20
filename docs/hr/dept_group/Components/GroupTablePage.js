'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Input, Modal} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var GroupTableStore = require('../data/GroupTableStore.js');
var GroupTableActions = require('../action/GroupTableActions');
import CreateGroupTablePage from './CreateGroupTablePage';
import UpdateGroupTablePage from './UpdateGroupTablePage';

var filterValue = '';
var GroupTablePage = React.createClass({
	getInitialState : function() {
		return {
			groupSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			corpUuid:window.loginData.compUser.corpUuid
		}
	},

    mixins: [Reflux.listenTo(GroupTableStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            groupSet: data,
            
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.groupSet.operation = '';
		GroupTableActions.retrieveHrDeptGroup(this.state.corpUuid);
	},
    
	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		GroupTableActions.initHrDeptGroup(this.state.corpUuid);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear(this.state.corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(group, event)
	{
		if(group != null){
			this.refs.updateWindow.initPage(group);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(group, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的事业群 【'+group.groupName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, group)
		});
	},

	onClickDelete2 : function(group)
	{
		this.setState({loading: true});
		this.state.groupSet.operation = '';
		GroupTableActions.deleteHrDeptGroup( group.uuid );
	},

    //选择角色功能
    handleSelectClick: function(group){
        // Context.group = group;
        this.props.selectsRole(group);
        // FuncTableActions.retrieveFuncTableInfo(role.uuid);

    },
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		var recordSet = Common.filter(this.state.groupSet.recordSet, filterValue);
        
		const columns = [
			{
				title: '机构名称',
				dataIndex: 'groupName',
				key: 'groupName',
				width: 100,
			},
            {
				title: '机构代码',
				dataIndex: 'groupCode',
				key: 'groupCode',
				width: 100,
			},
            {
				title: '机构描述',
				dataIndex: 'groupDesc',
				key: 'groupDesc',
				width: 160,
			},
            {
				title: '办公地址',
				dataIndex: 'groupLoc',
				key: 'groupLoc',
				width: 160,
			},
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改事业群信息'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除事业群'><Icon type={Common.iconRemove}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.handleSelectClick.bind(this, record)} title='人员维护'><Icon type={Common.iconUser}/></a>
					</span>
				),
			}
		];

		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
				<div style={{margin: '-58px 0 0 0'}}>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加事业群" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
						<Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
				
				<CreateGroupTablePage ref="createWindow"/>
				<UpdateGroupTablePage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = GroupTablePage;


