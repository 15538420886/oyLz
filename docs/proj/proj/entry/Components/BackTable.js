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
import ProjCodeMap from '../../../lib/ProjCodeMap';
var ProjContext = require('../../../ProjContext');
var BackTableStore = require('../data/BackTableStore');
var BackTableActions = require('../action/BackTableActions');

var filterValue = '';
var pageRows = 10 ;
var BackTable = React.createClass({
	getInitialState : function() {
		return {
			backSet: {
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

    mixins: [Reflux.listenTo(BackTableStore, "onServiceComplete"), CodeMap(), ProjCodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            backSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.backSet.operation = '';
		var projUuid = ProjContext.selectedProj.uuid;
		BackTableActions.retrieveBackTablePage(projUuid, this.state.backSet.startPage, pageRows);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		var projUuid = ProjContext.selectedProj.uuid;
		BackTableActions.initBackTable(projUuid, this.state.backSet.startPage, pageRows);
	},

	onClickUpdate : function(back, event)
	{
		var obj = {};
		obj.action = 'backSure';
		obj.back = back ;
		this.props.onChangeAction(obj);
	},

	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
        var corpUuid = window.loginData.compUser.corpUuid;
        var proj = ProjContext.selectedProj;
        var projUuid = proj.uuid;
		var recordSet = Common.filter(this.state.backSet.recordSet, filterValue);
		
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
				title: '员工级别',
				dataIndex: 'userLevel',
				key: 'userLevel',
				width: 140,
				render: (text, record) => (this.getLevelName(corpUuid, record.userLevel)),
			},
			{
				title: '客户定级',
				dataIndex: 'projLevel',
				key: 'projLevel',
				width: 140,
			},
			{
				title: '技术岗位',
				dataIndex: 'techLevel',
				key: 'techLevel',
				width: 140,
            },
            {
                title: '小组',
                dataIndex: 'teamUuid',
                key: 'teamUuid',
                width: 140,
                render: (text, record) => (this.getTeamName(projUuid, text))
            },
			{
				title: '入组日期',
				dataIndex: 'beginDate',
				key: 'beginDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},
			{
				title: '离组日期',
				dataIndex: 'endDate',
				key: 'endDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='回组'><Icon type="team" /></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		var pag = {showQuickJumper: true, total:this.state.backSet.totalRow, pageSize:this.state.backSet.pageRow, current:this.state.backSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve']}/>

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

module.exports = BackTable;