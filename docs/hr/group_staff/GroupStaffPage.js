'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Input, Modal} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var GroupStaffStore = require('./data/GroupStaffStore.js');
var GroupStaffActions = require('./action/GroupStaffActions');
import CreateGroupStaffPage from './Components/CreateGroupStaffPage';
import UpdateGroupStaffPage from './Components/UpdateGroupStaffPage';

var filterValue = '';
var GroupStaffPage = React.createClass({
	getInitialState : function() {
		return {
			staffSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			groupUuid: '',
			corpUuid:window.loginData.compUser.corpUuid,
		}
	},

    mixins: [Reflux.listenTo(GroupStaffStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            staffSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.staffSet.operation = '';
		this.state.groupUuid = this.props.group.uuid;
		GroupStaffActions.retrieveHrGroupStaff(this.props.group.uuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		GroupStaffActions.initHrGroupStaff(this.props.group.uuid);
	},

	//接受新的props
	componentWillReceiveProps:function(nextProps){
		if(nextProps.group.uuid == this.props.group.uuid){
			return;
		}
		this.state.groupUuid = nextProps.group.uuid;
		this.setState({loading: true});
		this.state.staffSet.operation = '';
		GroupStaffActions.retrieveHrGroupStaff(nextProps.group.uuid);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear(this.state.corpUuid, this.state.groupUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(staff, event)
	{
		if(staff != null){
			this.refs.updateWindow.initPage(staff);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(staff, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的人员 【'+staff.perName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, staff)
		});
	},

	onClickDelete2 : function(staff)
	{
		this.setState({loading: true});
		this.state.staffSet.operation = '';
		GroupStaffActions.deleteHrGroupStaff( staff.uuid );
	},

	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		var recordSet = Common.filter(this.state.staffSet.recordSet, filterValue);

		const columns = [
			{
				title: '用户姓名',
				dataIndex: 'perName',
				key: 'perName',
				width: 120,
			},
			{
				title: '职位',
				dataIndex: 'jobTitle',
				key: 'jobTitle',
				width: 140,
			},
			{
				title: '电话',
				dataIndex: 'phoneno',
				key: 'phoneno',
				width: 140,
			},
			{
				title: '电子邮箱',
				dataIndex: 'email',
				key: 'email',
				width: 140,
			},
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员信息'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
				
				<div style={{margin: '-58px 0 0 0'}}>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加人员" onClick={this.handleOpenCreateWindow}/>
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
				<CreateGroupStaffPage ref="createWindow"/>
				<UpdateGroupStaffPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = GroupStaffPage;