﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Upload} from 'antd';
import XlsTempFile from '../../lib/Components/XlsTempFile';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var SalaryItemStore = require('./data/SalaryItemStore.js');
var SalaryItemActions = require('./action/SalaryItemActions');
import CreateSalaryItemPage from './Components/CreateSalaryItemPage';
import UpdateSalaryItemPage from './Components/UpdateSalaryItemPage';
import BatchSalaryItemPage from './Components/BatchSalaryItemPage';

var SalaryItemFields = [
    { id: 'A', name: 'groupName', title: '分类名称' },
    { id: 'B', name: 'itemIndex', title: '序号' },
    { id: 'C', name: 'itemCode', title: '代码' },
    { id: 'D', name: 'itemName', title: '名称' },
];
var SalaryItemPage = React.createClass({
	getInitialState : function() {
		return {
			salaryItemSet: {
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

    mixins: [Reflux.listenTo(SalaryItemStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function (data) {
        data.recordSet = Common.sortTable(data.recordSet, 'itemIndex');
        this.setState({
            loading: false,
            salaryItemSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function() {
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.salaryItemSet.operation = '';
		SalaryItemActions.retrieveHrSalaryItem(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		SalaryItemActions.initHrSalaryItem(corpUuid);
	},

	handleOpenCreateWindow : function() {
		var corp = window.loginData.compUser;
		var corpUuid = (corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(salaryItem, event)
	{
		if(salaryItem != null){
			this.refs.updateWindow.initPage(salaryItem);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(salaryItem, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的工资单参数 【'+salaryItem.itemCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, salaryItem)
		});
	},

	onClickDelete2 : function(salaryItem)
	{
		this.setState({loading: true});
		this.state.salaryItemSet.operation = '';
		SalaryItemActions.deleteHrSalaryItem( salaryItem.uuid );
	},

	 handleTempDown: function (e) {
        this.downXlsTempFile(SalaryItemFields);
    },

	beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, SalaryItemFields, file, this.uploadComplete);
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
		var recordSet = this.state.salaryItemSet.recordSet;

		const columns = [
			{
            	title: '分类名称',
            	dataIndex: 'groupName',
            	key: 'groupName',
            	width: 140,
      		},
      		{
            	title: '序号',
            	dataIndex: 'itemIndex',
            	key: 'itemIndex',
            	width: 140,
      		},
			{
                title: '代码',
                dataIndex: 'itemCode',
                key: 'itemCode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'itemName',
                key: 'itemName',
                width: 140,
            },
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
			    	      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工资参数'><Icon type={Common.iconUpdate}/></a>
			    	      <span className="ant-divider" />
			    	      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工资参数'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

        var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-salary-item/retrieve', 'hr-salary-item/remove']}/>
                    <div className='toolbar-table'>
                        <Button icon={Common.iconAdd} title="增加工资单参数" type="primary" onClick={this.handleOpenCreateWindow}/>
                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						<Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='批量增加数据' />
                            </Upload>

                    </div>
                </div>
                <div className='grid-body'>
				    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

				<CreateSalaryItemPage ref="createWindow"/>
				<UpdateSalaryItemPage ref="updateWindow"/>
				<BatchSalaryItemPage ref="batchWindow" />
			</div>
		);
	}
});

module.exports = SalaryItemPage;

