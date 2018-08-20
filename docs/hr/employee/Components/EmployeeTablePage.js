'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var EmployeeStore = require('../data/EmployeeStore');
var EmployeeActions = require('../action/EmployeeActions');
import UpdateEmployeePage from './UpdateEmployeePage';
import EmployeeFilter from './EmployeeFilter';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';

var pageRows = 10;
var EmployeeTablePage = React.createClass({
	getInitialState : function() {
		return {
			employeeSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
            },
			loading: false,
			dept: {},

			moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(EmployeeStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            employeeSet: data
        });
    },
	loadData: function(dept){
		var filter = {};
		if(dept === null || typeof(dept) === 'undefined'){
			dept = {};
			filter.deptUuid = '#';
		}
		else{
			filter.deptUuid = dept.uuid;
		}

		this.state.employeeSet.startPage = 1;
		this.setState({loading: true, dept: dept});
		EmployeeActions.retrieveHrEmployeePage(filter, 1, this.state.employeeSet.pageRow );
	},

	handleQueryClick : function() {
		var dept=this.state.dept;
		this.state.employeeSet.operation = '';
		var filter = this.state.filter;
		if(dept === null || typeof(dept) === 'undefined'){
			dept = {};
			filter.deptUuid = '#';
		}
		else{
			filter.deptUuid = dept.uuid;
		}
		this.state.employeeSet.startPage = 1;
		this.setState({loading: true});
		filter.more = (this.state.moreFilter ? '1' : '0');
		EmployeeActions.retrieveHrEmployeePage(this.state.filter,1 , this.state.employeeSet.pageRow);
	},

	// 第一次加载
	componentDidMount : function(){
	},

	handleOpenCreateWindow : function(event) {
		var dept=this.state.dept;
		if(typeof(dept.uuid) === 'undefined'){
			return;
		}

        var onCreateStaff = this.props.onCreateStaff;
        if (onCreateStaff !== null && typeof (onCreateStaff) !== 'undefined') {
            onCreateStaff(dept);
        }
    },
	onClickUpdate : function(employee, event)
	{
		if(employee != null){
			this.refs.updateWindow.initPage(employee);
			this.refs.updateWindow.toggle();
		}
    },
	onClickEmployee : function(employee, event)
    {
        var onViewEmployee = this.props.onViewEmployee;
		if(employee && onViewEmployee){
			onViewEmployee(employee);
        }

        /*if (this.props.funcCreateUser && employee) {
            this.props.funcCreateUser(employee, {});
        }*/
	},
	onClickDelete : function(employee, event)
	{
		Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的员工 【' + employee.staffCode + ' - ' + employee.perName + '】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, employee)
		});
	},

	onClickDelete2 : function(employee)
	{
		this.setState({loading: true});
		this.state.employeeSet.operation = '';
		EmployeeActions.deleteHrEmployee( employee.uuid );
	},
	onChangePage: function(pageNumber){
        this.state.employeeSet.operation = '';
		this.state.employeeSet.startPage = pageNumber;
		this.state.employeeSet.pageRow = pageRows;
        this.setState({loading: true});

		var filter = {};
		filter.deptUuid = this.state.dept.uuid;
		EmployeeActions.retrieveHrEmployeePage(filter, pageNumber, pageRows);
	},
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
	onSearch:function(value){
    	this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }
        this.handleQueryClick();
    },
	handleTempDown: function(e){
		this.downXlsTempFile(XlsConfig.empFields);
    },
	uploadComplete: function(errMsg){
		this.setState({loading: false});
		if(errMsg !== ''){
			Common.errMsg(errMsg);
		}
	},
	beforeUpload: function(file) {
		var dept=this.state.dept;
		if(typeof(dept.uuid) === 'undefined'){
			return;
		}

		this.setState({loading: true});
		var url = Utils.hrUrl+'hr-employee/upload-xls';
		var data={corpUuid: dept.corpUuid, deptUuid: dept.uuid, deptName: dept.deptName};
		this.uploadXlsFile(url, data, XlsConfig.empFields, file, this.uploadComplete);
		return false;
	},

	render : function() {
		var recordSet = this.state.employeeSet.recordSet;
		var moreFilter = this.state.moreFilter;

		const columns = [
            {
            	title: '员工编号',
            	dataIndex: 'staffCode',
            	key: 'staffCode',
            	width: 120,
            },
            {
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 100,
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
            	width: 120,
            },
            {
            	title: '电子邮箱',
            	dataIndex: 'email',
            	key: 'email',
            	width: 180,
            },
            {
            	title: '归属地',
            	dataIndex: 'baseCity',
            	key: 'baseCity',
            	width: 100,
            },
            {
            	title: '状态',
            	dataIndex: 'status',
            	key: 'status',
            	width: 80,
				render: (text, record) => (Utils.getOptionName('HR系统', '员工状态', record.status, true, this)),
            },
			{
				title: '',
				key: 'action',
				width: 90,
				render: (text, record) => (
					<span>
				    	<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新'><Icon type={Common.iconUpdate}/></a>
						<span className="ant-divider" />
						<a href="#" onClick={this.onClickEmployee.bind(this, record)} title='员工信息'><Icon type={Common.iconDetail}/></a>
					</span>
				),
			}
        ];
        /*
			<span className="ant-divider" />
			<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
        */

		var disabled = (this.state.dept.uuid === undefined);
		var pag = {showQuickJumper: true, total:this.state.employeeSet.totalRow, pageSize:this.state.employeeSet.pageRow, current:this.state.employeeSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		return (
			<div className='grid-page'>
				<div>
				    <div className='toolbar-table'>
				    	<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} title="增加员工" type="primary" disabled={disabled} onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" disabled={disabled} onClick={this.loadData.bind(this, this.state.dept)} style={{marginLeft: '4px'}}/>
							<Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{marginLeft: '4px'}}/>
							<Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} disabled={disabled} style={{marginLeft: '4px'}}>
								<Button icon="upload"/>
							</Upload>
						</div>
						<div style={{textAlign:'right', width:'100%'}}>
                            <Search placeholder="查询（员工编号/员工姓名）" onSearch={this.onSearch} value={this.state.filterValue} onChange={this.onChangeFilter} disabled={disabled} style={{width:'220px'}}/>
						</div>
                    </div>
                    <div className='grid-body'>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                    </div>
				</div>

                <UpdateEmployeePage ref="updateWindow" />
			</div>
		);
	}
});

module.exports = EmployeeTablePage;
