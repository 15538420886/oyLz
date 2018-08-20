﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;
import XlsTempFile from '../../lib/Components/XlsTempFile';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var SalaryFileStore = require('./data/SalaryFileStore.js');
var SalaryFileActions = require('./action/SalaryFileActions');
import CreateSalaryFilePage from './Components/CreateSalaryFilePage';
import UpdateSalaryFilePage from './Components/UpdateSalaryFilePage';
import BatchSalaryFilePage from './Components/BatchSalaryFilePage';

var SalaryFileFields = [
    { id: 'A', name: 'colIndex', title: '列编号' },
    { id: 'B', name: 'colName', title: '列名称' },
    { id: 'C', name: 'itemCode', title: '工资代码' },
    { id: 'D', name: 'salaryItem', title: '工资项' },
];
var filterValue = '';
var SalaryFilePage = React.createClass({
	getInitialState : function() {
		return {
			salaryFileSet: {
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

    mixins: [Reflux.listenTo(SalaryFileStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function (data) {
        data.recordSet = Common.sortTable(data.recordSet, 'colIndex');
        this.setState({
            loading: false,
            salaryFileSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.salaryFileSet.operation = '';
		SalaryFileActions.retrieveHrSalaryFileItem(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		SalaryFileActions.initHrSalaryFileItem(corpUuid);
	},

	handleOpenCreateWindow : function(event) {
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(salaryFile, event)
	{
		if(salaryFile != null){
			this.refs.updateWindow.initPage(salaryFile);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(salaryFile, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的工资单 【'+salaryFile.colIndex+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, salaryFile)
		});
	},

	onClickDelete2 : function(salaryFile)
	{
		this.setState({loading: true});
		this.state.salaryFileSet.operation = '';
		SalaryFileActions.deleteHrSalaryFileItem( salaryFile.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	 handleTempDown: function (e) {
        this.downXlsTempFile(SalaryFileFields);
    },

	beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, SalaryFileFields, file, this.uploadComplete);
        return false;
    },

	uploadComplete: function (errMsg, result) {
        this.setState({ loading: false });
        if (errMsg !== '') {
            Common.errMsg(errMsg);
        }
        else {
            result = result.replace(/}{/g, '},{');
            var list = eval('(' + result + ')');
            if (list) {
                this.refs.batchWindow.clear(list);
                this.refs.batchWindow.toggle();
            }
        }
    },

	render : function() {
		var recordSet = Common.filter(this.state.salaryFileSet.recordSet, filterValue);

		const columns = [
				{
            		    title: '列编号',
            		    dataIndex: 'colIndex',
            		    key: 'colIndex',
            		    width: 140,
      		        },
      		       {
            		    title: '列名称',
            		    dataIndex: 'colName',
            		    key: 'colName',
            		    width: 140,
      		        },
      		       {
            		    title: '工资代码',
            		    dataIndex: 'itemCode',
            		    key: 'itemCode',
            		    width: 140,
      		        },
      		       {
            		    title: '工资项',
            		    dataIndex: 'salaryItem',
            		    key: 'salaryItem',
            		    width: 140,
            		    render: (text, record) => (Utils.getOptionName('HR系统', '是否', record.salaryItem, false, this)),
      		        },
					{
						title: '更多操作',
						key: 'action',
						width: 100,
						render: (text, record) => (
							<span>
							<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工资单'><Icon type={Common.iconUpdate}/></a>
							<span className="ant-divider" />
							<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工资单'><Icon type={Common.iconRemove}/></a>
							</span>
						),
					}
		];

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_salary_file_item/retrieve', 'hr_salary_file_item/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加工资单" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							<Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='批量增加数据' />
                            </Upload>

						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateSalaryFilePage ref="createWindow"/>
				<UpdateSalaryFilePage ref="updateWindow"/>
				<BatchSalaryFilePage ref="batchWindow" />
			</div>
		);
	}
});

module.exports = SalaryFilePage;

