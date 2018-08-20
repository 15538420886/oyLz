'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Radio} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var EmployeeStore = require('./data/EmployeeStore.js');
var EmployeeActions = require('./action/EmployeeActions');
import CreateEmployeePage from './Components/CreateEmployeePage';
import UpdateEmployeePage from './Components/UpdateEmployeePage';
import EmployeeFilter from './Components/EmployeeFilter';

var pageRows = 10;
var EmployeeQueryPage = React.createClass({
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
			viewType: '1',
			dept: {},

			moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(EmployeeStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            employeeSet: data
        });
    },

	handleQueryClick : function() {
		this.state.employeeSet.operation = '';
		this.state.employeeSet.startPage = 1;
		this.setState({loading: true});
		var filter = this.state.filter;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
		EmployeeActions.retrieveHrEmployeePage(filter, 1, this.state.employeeSet.pageRow);
	},

	// 第一次加载
	componentDidMount : function(){
	},
	onChangeView: function(e) {
		this.setState({viewType: e.target.value});
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
		if(employee != null && this.props.onViewEmployee !== null && typeof(this.props.onViewEmployee) !== 'undefined'){
			this.props.onViewEmployee(employee);
		}
	},
	onClickDelete : function(employee, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的员工 【'+employee.uuid+'】',
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
		this.state.employeeSet.startPage = pageNumber;
		
        this.setState({loading: true});
		EmployeeActions.retrieveHrEmployeePage(this.state.filter, pageNumber, pageRows);
	},
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

	onSearch3:function(){
		var filter = this.refs.EmployeeFilterForm.state.filter;
        if(filter.entryMonth !== null && filter.entryMonth !== ''){
        	filter.entryDate1 = filter.entryMonth + '01';
        	filter.entryDate2 = filter.entryMonth + '31';
        }
        this.state.filter = filter;
        this.handleQueryClick();
    },
	onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
	onSearch:function(value){
    	this.state.filter={
			corpUuid:window.loginData.compUser.corpUuid,
		};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }
        this.handleQueryClick();
    },
	getWorkYear: function(value){
		if(value === undefined || value === null || value === ''){
			return '';
		}

		var pos = value.indexOf('.');
		if(pos > 0){
			var y = value.substr(0, pos);
			var m = value.substr(pos+1);
			var y2 = parseInt(y);
			var m2 = parseInt(m);
			if(m2 > 0){
				return '' + y2 + '年' + m2 + '月';
			}
			else{
				return '' + y2 + '年';
			}
		}

		return value + '年';
	},

	render : function() {
		var recordSet = this.state.employeeSet.recordSet;
		var moreFilter = this.state.moreFilter;

		var opCol = {
			title: '',
			key: 'action',
			width: 60,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新'><Icon type={Common.iconUpdate}/></a>
				</span>
			),
        };
        /*
            <span className="ant-divider" />
            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove} /></a>
        */

		var columns = [];
		if(this.state.viewType === '1'){
			columns = [
	            {
	            	title: '员工编号',
	            	dataIndex: 'staffCode',
	            	key: 'staffCode',
	            	width: 100,
	            },
	            {
	            	title: '姓名',
	            	dataIndex: 'perName',
	            	key: 'perName',
	            	width: 100,
	            },
	            {
	            	title: '部门名称',
	            	dataIndex: 'deptName',
	            	key: 'deptName',
	            	width: 120,
                },
                {
                    title: '性别',
                    dataIndex: 'gender',
                    key: 'gender',
                    width: 80,
                },
                {
                    title: '年龄',
                    dataIndex: 'birthDate',
                    key: 'birthDate',
                    width: 90,
                },
	            {
	            	title: '电话',
	            	dataIndex: 'phoneno',
	            	key: 'phoneno',
	            	width: 110,
	            },
	            {
	            	title: '电子邮箱',
	            	dataIndex: 'email',
	            	key: 'email',
	            	width: 180,
	            },
				{
	            	title: '职位',
	            	dataIndex: 'jobTitle',
	            	key: 'jobTitle',
					width: 120,
	            	render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
	            },
	            {
	            	title: '归属地',
	            	dataIndex: 'baseCity',
	            	key: 'baseCity',
	            	width: 90,
	            },
				opCol
			];
		}
		else if(this.state.viewType === '2'){
			columns = [
	            {
	            	title: '员工编号',
	            	dataIndex: 'staffCode',
	            	key: 'staffCode',
	            	width: 100,
	            },
	            {
	            	title: '姓名',
	            	dataIndex: 'perName',
	            	key: 'perName',
	            	width: 100,
	            },
				{
	            	title: '入职时间',
	            	dataIndex: 'entryDate',
	            	key: 'entryDate',
					width: 90,
	            	render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
	            },
				{
	            	title: '工龄',
	            	dataIndex: 'workYears',
	            	key: 'workYears',
	            	width: 80,
	            	render: (text, record) => (this.getWorkYear(text)),
				},
				{
	            	title: '行业经验',
	            	dataIndex: 'induYears',
	            	key: 'induYears',
	            	width: 80,
	            	render: (text, record) => (this.getWorkYear(text)),
                },
                {
                    title: '最高学历',
                    dataIndex: 'eduDegree',
                    key: 'eduDegree',
                    width: 80,
                    render: (text, record) => (Utils.getOptionName('简历系统', '教育背景', record.eduDegree, true, this)),
                },
                {
                    title: '学校',
                    dataIndex: 'eduCollege',
                    key: 'eduCollege',
                    width: 120,
                },
	            {
                    title: '专业',
                    dataIndex: 'profession',
                    key: 'profession',
	            	width: 100,
                },
                {
                    title: '毕业日期',
                    dataIndex: 'gradDate',
                    key: 'gradDate',
                    width: 90,
                    render: (text, record) => (this.getWorkYear(text)),
                },
				opCol
			];
		}
		else{
			columns = [
	            {
	            	title: '员工编号',
	            	dataIndex: 'staffCode',
	            	key: 'staffCode',
	            	width: 100,
	            },
	            {
	            	title: '姓名',
	            	dataIndex: 'perName',
	            	key: 'perName',
	            	width: 120,
	            },
	            {
	            	title: '部门名称',
	            	dataIndex: 'deptName',
	            	key: 'deptName',
	            	width: 120,
	            },
				{
	            	title: '入职时间',
	            	dataIndex: 'entryDate',
	            	key: 'entryDate',
					width: 120,
	            	render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
	            },
				{
	            	title: '转正时间',
	            	dataIndex: 'formalDate',
	            	key: 'formalDate',
	            	width: 120,
	            	render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
	            },
				{
	            	title: '状态',
	            	dataIndex: 'status',
	            	key: 'status',
	            	width: 80,
					render: (text, record) => (Utils.getOptionName('HR系统', '员工状态', record.status, true, this)),
				},
				{
	            	title: '直接主管',
	            	dataIndex: 'manager',
	            	key: 'manager',
	            	width: 100,
				},
	            {
	            	title: '归属地',
	            	dataIndex: 'baseCity',
	            	key: 'baseCity',
	            	width: 100,
                },
                {
                    title: '户口城市',
                    dataIndex: 'household',
                    key: 'household',
                    width: 100,
                },
				opCol
			];
		}

		var pag = {showQuickJumper: true, total:this.state.employeeSet.totalRow, pageSize:this.state.employeeSet.pageRow, current:this.state.employeeSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		return (
			<div className='grid-page' style={{overflow: 'hidden'}}>
				<div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-employee/retrieve', 'hr-employee/remove']}/>
					<EmployeeFilter  ref="EmployeeFilterForm" moreFilter={moreFilter} />
					<div>
						<div className='toolbar-table'>
							<div style={{float:'left'}}>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
								<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
									<RadioButton value="1">通讯录</RadioButton>
									<RadioButton value="2">工作经验</RadioButton>
									<RadioButton value="3">基本信息</RadioButton>
								</RadioGroup>
							</div>
							{
							moreFilter ?
								<div style={{textAlign:'right', width:'100%'}}>
									<Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{marginRight:'8px'}}>查询</Button>
									<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
								</div>
								:
								<div style={{textAlign:'right', width:'100%'}}>
									<Search placeholder="查询（员工编号/员工姓名）" onSearch={this.onSearch} value={this.state.filterValue}  onChange={this.onChangeFilter} style={{width:'220px'}}/>
									<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
								</div>
							}
						</div>
					</div>
					<div  style={{width:'100%', padding: '0 18px 8px 20px'}}>
						<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
					</div>

					<UpdateEmployeePage ref="updateWindow"/>
				</div>
			</div>
		);
	}
});

module.exports = EmployeeQueryPage;
