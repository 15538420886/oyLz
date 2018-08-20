'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Radio, DatePicker} from 'antd';
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var StaffDispStore = require('./data/StaffDispStore');
var StaffDispActions = require('./action/StaffDispActions');
import SelectDate from '../../../lib/Components/SelectDate';

var pageRows = 10;
var today = ''+Common.getToday();
var StaffDispPage = React.createClass({
	getInitialState : function() {
		return {
			staffDispSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : '',
			},
			viewType:'',
			loading: false,
			changeDate:'',
		}
	},

    mixins: [Reflux.listenTo(StaffDispStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            staffDispSet: data
        });
    },
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.staffDispSet.operation = '';
		var chkDate = this.state.changeDate;
		var corpUuid = window.loginData.compUser.corpUuid;
		StaffDispActions.retrieveProjMemberPage(corpUuid,chkDate, this.state.staffDispSet.startPage, pageRows);
	},
	componentDidMount : function(){
		this.setState({
			loading: true,
			viewType:today,
		});

		var corpUuid = window.loginData.compUser.corpUuid;
		StaffDispActions.retrieveProjMember(corpUuid,today);
	},
	onChangePage: function(pageNumber){
        this.state.staffDispSet.startPage = pageNumber;
		this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
	onChangeView: function(e) {
		var corpUuid = window.loginData.compUser.corpUuid;
		var chkDate = e.target.value;
		this.state.changeDate = chkDate;
		StaffDispActions.retrieveProjMember(corpUuid,chkDate);
		this.setState({
			loading: true,
			viewType: chkDate,
		});
	},
	datePicker: function(date,dateString){
		var chkDate = dateString.split('-').join('');
        this.setState({
            loading: true,
            viewType: chkDate,
        });

		var corpUuid = window.loginData.compUser.corpUuid;
		StaffDispActions.retrieveProjMember(corpUuid,chkDate);
    },
	render : function() {
		var recordSet = this.state.staffDispSet.recordSet;
		var pag = {showQuickJumper: true, total:this.state.staffDispSet.totalRow, pageSize:this.state.staffDispSet.pageRow,
                current:this.state.staffDispSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		const columns = [
			{
				title: '员工号',
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
				title: '调动类型',
				dataIndex: 'beginDate',
				key: 'beginDate',
				width: 140,
				render:(text,record) => ((record.beginDate === record.chkDate) ? '调入' : '调出' ),
			},
			{
				title: '项目名称',
				dataIndex: 'projName',
				key: 'projName',
				width: 140,
			},
			{
				title: '项目地址',
				dataIndex: 'projLoc',
				key: 'projLoc',
				width: 140,
			},
			{
				title: '客户定级',
				dataIndex: 'projLevel',
				key: 'projLevel',
				width: 140,
			},
			{
				title: '结算价',
				dataIndex: 'userPrice',
				key: 'userPrice',
				width: 140,
			},
			{
				title: '归属地',
				dataIndex: 'baseCity',
				key: 'baseCity',
				width: 140,
			},
			{
				title: '公司/部门',
				dataIndex: 'corpName',
				key: 'corpName',
				width: 140,
				render:(text,record) => ( record.corpName ? record.corpName : record.deptName ),
			}
		];
		
		return (
			<div className='grid-page'>
				<div>
					<ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve']}/>
					<div className='toolbar-table'>
						 <SelectDate value={this.state.viewType} onChange={this.onChangeView}/>
						 <DatePicker allowClear={false} style={{marginLeft:'16px', width:'120px'}} onChange={this.datePicker} format={dateFormat} />
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>
		);
	}
});

module.exports = StaffDispPage;

