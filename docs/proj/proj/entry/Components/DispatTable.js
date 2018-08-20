'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import CodeMap from '../../../../hr/lib/CodeMap';
var ProjContext = require('../../../ProjContext');
var DispatTableStore = require('../data/DispatTableStore');
var DispatTableActions = require('../action/DispatTableActions');

var filterValue = '';
var pageRows = 10;
var DispatTable = React.createClass({
	getInitialState : function() {
		return {
			dispatSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(DispatTableStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            dispatSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.dispatSet.operation = '';
		var projUuid = ProjContext.selectedProj.uuid;
		DispatTableActions.retrieveDispatTablePage(projUuid, this.state.dispatSet.startPage, pageRows);
	},

	onChangePage: function(pageNumber){
        this.state.dispatSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	// 第一次加载
	componentDidMount : function(){
        this.setState({loading: true});
		var projUuid = ProjContext.selectedProj.uuid;
		DispatTableActions.initDispatTable(projUuid, this.state.dispatSet.startPage, pageRows);
	},

	onClickUpdate : function(dispat, event)
	{
		var obj = {};
		obj.action = 'dispatSure';
		obj.dispat = dispat ;
		this.props.onChangeAction(obj);
	},

	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    render: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
		var recordSet = Common.filter(this.state.dispatSet.recordSet, filterValue);
		const columns = [
            {
                title: '员工编号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 140,
            },
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 140,
            },
            {
                title: '类型',
                dataIndex: 'manType',
                key: 'manType',
                width: 140,
            },
            {
                title: '人员级别',
                dataIndex: 'userLevel',
                key: 'userLevel',
                width: 140,
                render: (text, record) => (this.getLevelName(corpUuid, record.userLevel)),
            },
            {
                title: '调度人',
                dataIndex: 'dispatcher',
                key: 'dispatcher',
                width: 140,
            },
            {
                title: '调度日期',
                dataIndex: 'applyTime',
                key: 'applyTime',
                width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '计划入组',
                dataIndex: 'planDate',
                key: 'planDate',
                width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '客户定级',
                dataIndex: 'projLevel',
                key: 'projLevel',
                width: 140,
            },
            {
                title: '结算单价',
                dataIndex: 'userPrice',
                key: 'userPrice',
                width: 140,
            },
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='入组'><Icon type="team" /></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		var pag = {showQuickJumper: true, total:this.state.dispatSet.totalRow, pageSize:this.state.dispatSet.pageRow, current:this.state.dispatSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-disp/retrieve']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
							 <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>
		);
	}
}); 

module.exports = DispatTable;