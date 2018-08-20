'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var GroupManStore = require('./data/GroupManStore.js');
var GroupManActions = require('./action/GroupManActions');
import CreateGroupManPage from './Components/CreateGroupManPage';
import UpdateGroupManPage from './Components/UpdateGroupManPage';

var filterValue = '';
var GroupManPage = React.createClass({
    getInitialState : function() {
        return {
            groupManSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            groupMan: null,
			oldIndex: -1,
        }
    },

    mixins: [Reflux.listenTo(GroupManStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            groupManSet: data
        });
		if(data.operation === 'retrieve'){
			var len = data.recordSet.length;
			for(var i = 0 ; i < len ; i++){
				if(data.recordSet[i].chkRole == '1' ){
					this.setState({oldIndex: i});
					return;
				}
			}
		}
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        GroupManActions.retrieveGroupMan();
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        GroupManActions.initGroupMan();
    },

    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },
    onClickUpdate : function(groupMan, event)
    {
        if(groupMan != null){
            this.setState({groupMan: groupMan, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    onClickDelete : function(groupMan, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的项目群管理员 【'+groupMan.perName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, groupMan)
        });
    },

    onClickDelete2 : function(groupMan)
    {
        this.setState({loading: true});
        GroupManActions.deleteGroupMan( groupMan.uuid );
    },
	
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	onRoleCheck: function(projRole, index){
		var projRole2 = {};
		Utils.copyValue(projRole, projRole2);
		if(projRole2.chkRole == '1'){
			projRole2.chkRole = '0';
			this.setState({loading: true, oldIndex: -1})
			GroupManActions.updateGroupMan(projRole2);
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
		GroupManActions.updateGroupMan(projRole);
	},

    render : function() {
        var recordSet = Common.filter(this.state.groupManSet.recordSet, filterValue);

        const columns = [
            {
            	title: '角色',
            	dataIndex: 'roleName',
            	key: 'roleName',
            	width: 140,
            	render: (text, record) => (Utils.getOptionName('项目管理', '项目群角色', text, false, this)),
            },
            {
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '开始日期',
            	dataIndex: 'beginDate',
            	key: 'beginDate',
            	width: 140,
            	render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
            	title: '员工编号',
            	dataIndex: 'staffCode',
            	key: 'staffCode',
            	width: 140,
            },
            {
            	title: '考勤员',
            	dataIndex: 'chkRole',
            	key: 'chkRole',
            	width: 140,
				render: (text, record, index) => (
					<input type="checkbox" name="chkRole" checked={text=='1'} onClick={this.onRoleCheck.bind(this, record, index)}/>
				)
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目群管理员'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目群管理员'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['group-man/retrieve', 'group-man/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加项目群管理员" onClick={this.handleOpenCreateWindow}/>
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
            </div>
        );
        
		var formPage = null;
		if(this.state.action === 'create'){
		    formPage = <CreateGroupManPage onBack={this.onGoBack}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateGroupManPage onBack={this.onGoBack} groupMan={this.state.groupMan}/>
		}
		
		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = GroupManPage;