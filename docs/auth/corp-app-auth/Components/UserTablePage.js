'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import {Button, Table, Icon, Input, Upload, Modal} from 'antd';
const Search = Input.Search;

var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var CompUserStore = require('../../../auth/user/data/CompUserStore');
var CompUserActions = require('../../../auth/user/action/CompUserActions');

var filterValue = '';
var pageRows = 10;
var UserTablePage = React.createClass({
	getInitialState : function() {
		return {
			compUserSet: {
				deptUuid: '',
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
            loading: false,
            deptName: '',
			oldIndex: -1,
		}
	},

	  mixins: [Reflux.listenTo(CompUserStore, "onServiceComplete")],
	  onServiceComplete: function(data) {
	      this.setState({
	          loading: false,
	          compUserSet: data
	      });
	  },

	// 刷新
	handleQueryClick : function(event) {
        this.onChangePage( this.state.compUserSet.startPage );
	},

	// 第一次加载
    componentDidMount: function () {
        this.onSearch('');
	},

	componentWillUnmount: function(){
		//离场清除选中
		if(this.state.oldIndex !== -1)this.state.compUserSet.recordSet[this.state.oldIndex].isSelect = false;
	},

    loadData: function(deptUuid, deptName, isSysUser){
		var startPage = (isSysUser ? 0 : 1);
		var rows = (isSysUser ? 0 : pageRows);

        this.state.compUserSet.operation = '';
		this.state.compUserSet.startPage = startPage;
		this.state.compUserSet.pageRow = rows;
        this.setState({ loading: true, oldIndex: -1, deptName: deptName });

        // var filter = { deptUuid: deptUuid };
        var filter = { corpUuid: window.loginData.compUser.corpUuid };
        if (filterValue !== null && filterValue !== '') {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        CompUserActions.initCompUser(filter, startPage, rows);
	},

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    onSearch: function (value) {
        filterValue = value;
        this.setState({ loading: true });
        this.state.compUserSet.startPage = 1;

        // var filter = { deptUuid: this.state.compUserSet.deptUuid };
        var filter = { corpUuid: window.loginData.compUser.corpUuid };
        if (filterValue !== null && filterValue !== '') {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        CompUserActions.initCompUser(filter, 1, this.state.compUserSet.pageRow);
    },
	onChangePage: function(pageNumber){
        this.state.compUserSet.operation = '';
		this.state.compUserSet.startPage = pageNumber;
		this.state.compUserSet.pageRow = pageRows;
        this.setState({ loading: true });
        
        // var filter = { deptUuid: this.state.compUserSet.deptUuid };
        var filter = { corpUuid: window.loginData.compUser.corpUuid };
        if (filterValue !== null && filterValue !== '') {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        CompUserActions.retrieveCompUserPage(filter, pageNumber, pageRows);
	},
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	getRowClassName: function(record, index){
        return record.isSelect ? 'selected' : '';
    },

	onRowClick: function(record, index, event){
		this.props.onSelectUser(record);
		var oldIndex = this.state.oldIndex;
		if(oldIndex>-1)(this.state.compUserSet.recordSet[oldIndex].isSelect = false);
		this.state.compUserSet.recordSet[index].isSelect = true;		
		this.setState({oldIndex:index});
	},
	
	render : function() {
        var recordSet = this.state.compUserSet.recordSet;

		const columns = [
			{
				title: '用户名',
				dataIndex: 'userName',
				key: 'userName',
				width: 100,
			},
			{
				title: '用户姓名',
				dataIndex: 'perName',
				key: 'perName',
				width: 100,
			},
			{
				title: '员工编号',
				dataIndex: 'userCode',
				key: 'userCode',
				width: 100,
			},
			{
				title: '职务',
				dataIndex: 'userTitle',
				key: 'userTitle',
				width: 100,
            },
            {
                title: '用户组',
                dataIndex: 'userGroup',
                key: 'userGroup',
                width: 200,
            },
			{
				title: '用户类型',
				dataIndex: 'userType',
				key: 'userType',
				width: 90,
				render: (text, record) => (Utils.getOptionName('用户管理', '用户类型', record.userType, true, this)),
			}
		];

		var pag = (this.props.type === 'sys') ? false : {showQuickJumper: true, total:this.state.compUserSet.totalRow, pageSize:this.state.compUserSet.pageRow, current:this.state.compUserSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
                <div style={{margin: '-58px 0 0 0'}}>
				    <div className='toolbar-table'>
						<div style={{textAlign:'right', width:'100%', paddingRight:'2px'}}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onSearch={this.onSearch} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.userName} loading={this.state.loading} size="middle" pagination={pag} bordered={Common.tableBorder} onRowClick={this.onRowClick} rowClassName={this.getRowClassName}/>
				</div>
			</div>
		);
	}
});

module.exports = UserTablePage;