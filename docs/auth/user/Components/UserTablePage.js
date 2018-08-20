'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import {Button, Table, Icon, Input, Upload, Modal} from 'antd';
const Search = Input.Search;

var MsgActions = require('../../../lib/action/MsgActions');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var CompUserStore = require('../data/CompUserStore');
var CompUserActions = require('../action/CompUserActions');
import CreateCompUserPage from './CreateCompUserPage';
import UpdateCompUserPage from './UpdateCompUserPage';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';

var filterValue = '';
var pageRows = 10;
var UserTablePage = React.createClass({
	getInitialState : function() {
		return {
			compUserSet: {
                deptUuid: '',
                filter: {},
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				errMsg : ''
			},
            loading: false,
            isSysUser: false,
            deptName: '',
		}
	},

	  mixins: [Reflux.listenTo(CompUserStore, "onServiceComplete"), XlsTempFile()],
      onServiceComplete: function (data) {
      	console.log(data)
          if (data.operation !== 'find') {
              this.setState({
                  loading: false,
                  compUserSet: data
              });
          }
	  },

	// 刷新
	handleQueryClick : function(event) {
        this.onChangePage( this.state.compUserSet.startPage );
	},
	loadData: function(deptUuid, deptName, isSysUser){
		var startPage = (isSysUser ? 0 : 1);
		var rows = (isSysUser ? 0 : pageRows);

		this.state.compUserSet.startPage = startPage;
		this.state.compUserSet.pageRow = rows;
        this.state.deptName = deptName;
        this.state.isSysUser = isSysUser;
        this.setState({ loading: true });

        var filter = { deptUuid: deptUuid };
        if (filterValue !== null && filterValue !== '') {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        CompUserActions.initCompUser(filter, startPage, rows);
    },
    getCorpUuid: function () {
        if (this.props.type === 'sys') {
            return this.props.corpUuid;
        }
        else {
            return window.loginData.compUser.corpUuid;
        }
    },

	// 第一次加载
    componentDidMount: function () {
        this.onSearch('');
	},

	handleOpenCreateWindow : function(event) {
		if(this.state.compUserSet.deptUuid === ''){
			MsgActions.showError('comp-user', 'retrieve','请先选择部门');
			return;
		}

        this.refs.createWindow.clear(this.getCorpUuid(), this.state.compUserSet.deptUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(compUser, event)
	{
		if(compUser != null){
			this.refs.updateWindow.initPage(compUser);
			this.refs.updateWindow.toggle();
		}
    },
    onClickPriv: function (compUser, event) {
        if (compUser === null) {
            return;
        }

        var func = this.props.onSetPriv;
        if (func === undefined || func === null) {
            return;
        }

        func(compUser);
    },
	onClickDelete : function(compUser, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的用户 【'+compUser.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, compUser)
		});
	},

	onClickDelete2 : function(compUser)
	{
        this.setState({loading: true});
		CompUserActions.deleteCompUser( compUser.uuid );
	},
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    onSearch: function (value) {
        filterValue = value;
        this.setState({ loading: true });
        this.state.compUserSet.startPage = 1;

        // var filter = { deptUuid: this.state.compUserSet.deptUuid };
        var filter = { corpUuid: this.getCorpUuid() };
        if (filterValue !== null && filterValue !== '') {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        CompUserActions.initCompUser(filter, 1, this.state.compUserSet.pageRow);
    },
	handleGoBack: function(){
		var func = this.props.funcBack;
		if(func !== null && typeof(func) !== 'undefined'){
			func();
		}
	},
	onChangePage: function(pageNumber){
		this.state.compUserSet.startPage = pageNumber;
		this.state.compUserSet.pageRow = pageRows;
        this.setState({ loading: true });

        // var filter = { deptUuid: this.state.compUserSet.deptUuid };
        var filter = { corpUuid: this.getCorpUuid() };
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
	handleTempDown: function(e){
		this.downXlsTempFile(XlsConfig.userFields);
    },
	uploadComplete: function(errMsg){
		this.setState({loading: false});
		if(errMsg !== ''){
			Common.infoMsg(errMsg);
		}
	},
	beforeUpload: function(file) {
		if(this.state.compUserSet.deptUuid === ''){
			MsgActions.showError('comp-user', 'retrieve','请先选择部门');
			return false;
		}

		this.setState({loading: true});
		var url = Utils.authUrl+'auth-user/upload-xls';
        var data = {corpUuid: this.getCorpUuid(), deptUuid: this.state.compUserSet.deptUuid};
		this.uploadXlsFile(url, data, XlsConfig.userFields, file, this.uploadComplete);
		return false;
    },
	
	render : function() {
        var recordSet;
        var searchBox;
        if (this.state.isSysUser) {
            recordSet = Common.filter(this.state.compUserSet.recordSet, filterValue);
            searchBox = <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />;
		}
        else {
            recordSet = this.state.compUserSet.recordSet;
            searchBox = <Search placeholder="用户名或工号" style={{ width: Common.searchWidth }} value={filterValue} onSearch={this.onSearch} onChange={this.onFilterRecord}/>;
		}

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
			},
			{
				title: '',
				key: 'action',
				width: 90,
				render: (text, record) => (
					<span>
				      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新'><Icon type={Common.iconUpdate}/></a>
			          <span className="ant-divider" />
                      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove} /></a>
                      <span className="ant-divider" />
                      <a href="#" onClick={this.onClickPriv.bind(this, record)} title='权限管理'><Icon type='safety' /></a>
					</span>
				),
			}
		];

		// 返回
		var func = this.props.funcBack;
		var back = (func !== null && typeof(func) !== 'undefined');

		var pag = (this.props.type === 'sys') ? false : {showQuickJumper: true, total:this.state.compUserSet.totalRow, pageSize:this.state.compUserSet.pageRow, current:this.state.compUserSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		var title = (this.props.type === 'sys')
			? this.state.compUserSet.totalRow+' 个系统管理员'
			: this.state.compUserSet.totalRow+' 个用户'

		var disabled = (this.state.compUserSet.deptUuid === '');
		var btnTemp = [];
		if(this.props.type !== 'sys'){
			btnTemp.push(<Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{marginLeft: '4px'}}/>);
			btnTemp.push(
				<Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} disabled={disabled} style={{marginLeft: '4px'}}>
					<Button icon="upload"/>
				</Upload>
			);
		}

		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
				<div style={{margin: '-58px 0 0 0'}}>
				    <div className='toolbar-table'>
				    	<div style={{float:'left'}}>
						    <div style={{paddingTop:'8px', paddingRight:'8px', display: 'inline'}}>{title}</div>
		        			<Button icon={Common.iconAdd} type="primary" title="增加用户" disabled={disabled} onClick={this.handleOpenCreateWindow}/>
		        			<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							{btnTemp}
							{back ? <Button icon={Common.iconBack} title="返回公司管理" onClick={this.handleGoBack} style={{marginLeft: '4px'}}/> : null}
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'2px'}}>
                            {searchBox}
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.userName} loading={this.state.loading} size="middle" pagination={pag} bordered={Common.tableBorder} />
				</div>

				<CreateCompUserPage ref="createWindow"/>
				<UpdateCompUserPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = UserTablePage;
