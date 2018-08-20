'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Context = require('../../AuthContext');
var Common = require('../../../public/script/common');
import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var RoleStore = require('../data/RoleStore');
var RoleActions = require('../action/RoleActions');

import CreateRolePage from './CreateRolePage';
import UpdataRolePage from './UpdateRolePage';

var filterValue = '';
var RoleTablePage = React.createClass({
    getInitialState : function() {
        return {
            roleSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading: false,
        }
    },
	mixins: [Reflux.listenTo(RoleStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		this.setState({
			loading: false,
			roleSet: data
		});
	},

    componentDidMount : function(){
        this.setState({loading: true});
        RoleActions.initRoleInfo(Context.authApp.uuid);
    },
	// 刷新
	handleQueryClick : function(event) {
        this.setState({loading: true});
        RoleActions.retrieveRoleInfo(Context.authApp.uuid);
	},
	
    //增加
    handleOpenCreateWindow: function(){
        this.refs.createWindow.clear(Context.authApp.uuid);
        this.refs.createWindow.toggle();
    },
    // 修改
    handleUpdateClick: function(role,e){
        if(role != null) {
            this.refs.updateWindow.initPage( role );
            this.refs.updateWindow.toggle();
        }

        e.stopPropagation();
    },
    //删除
    handleRemoveClick : function(role) {
        Modal.confirm({
          title: Common.removeTitle,
          content: '是否删除选中的角色 【'+role.roleName+'】' ,
          okText: Common.removeOkText,
          cancelText: Common.removeCancelText,
          onOk: this.handleRemoveWindow2.bind( this, role )
        });
        event.stopPropagation();
    },
    handleRemoveWindow2: function(role){
    	this.setState({loading: true});
        RoleActions.deleteRoleInfo( role.uuid );
    },
    //选择角色功能
    handleSelectClick: function(role){
        Context.role = role;
        this.props.selectsRole(role.uuid);
    },
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    render : function() {
	  	var recordSet = Common.filter(this.state.roleSet.recordSet, filterValue);
	    
	    const columns = [
	    {
	        title: '业务角色',
	        dataIndex: 'roleName',
	        key: 'roleName',
	        width: 180,
	    },
	    {
	        title: '角色描述',
	        dataIndex: 'roleDesc',
	        key: 'roleDesc',
	        width: 220,
	    },
	    {
	        title: '',
	        key: 'action',
	        width: 80,
	        render: (text, role) => (
	            <span>
	                <a href="#" onClick={this.handleUpdateClick.bind(this, role)} title='修改'><Icon type={Common.iconUpdate}/></a>
	                <span className="ant-divider" />
	                <a href="#" onClick={this.handleRemoveClick.bind(this, role)} title='删除'><Icon type={Common.iconRemove}/></a>
	                <span className="ant-divider" />
	                <a href="#" onClick={this.handleSelectClick.bind(this, role)} title='功能绑定'><Icon type='link'/></a>
	            </span>
	        )
	    }
	    ];
	    
	    return (
	        <div className='grid-page' style={{padding: '58px 0 0 0'}}>
				<div style={{margin: '-58px 0 0 0'}}>
		            <div className='toolbar-table'>
				    	<div style={{float:'left'}}>
			                <Button icon={Common.iconAdd} type="primary" title="增加角色" onClick={this.handleOpenCreateWindow}/>
			        		<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
		            </div>
				</div>
	            <div className='grid-body'>
	                <Table columns={columns} dataSource={recordSet} size='middle' rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder} />
	            </div>

	            <CreateRolePage ref="createWindow"/>
	            <UpdataRolePage ref="updateWindow"/>

	        </div>
	    );
    }
});

module.exports = RoleTablePage;


