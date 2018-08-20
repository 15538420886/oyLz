'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var LeaveDetailRegStore = require('./data/LeaveDetailRegStore.js');
var LeaveDetailActions = require('./action/LeaveDetailActions');
import LeaveDetailRegFilter from './Components/LeaveDetailRegFilter';
import CreateLeaveDetailRegPage from './Components/CreateLeaveDetailRegPage';
import UpdateLeaveDetailRegPage from './Components/UpdateLeaveDetailRegPage';
import XlsTempFile from '../../lib/Components/XlsTempFile';
import XlsConfig from '../lib/XlsConfig';

var pageRows = 10;
var LeaveDetailRegPage = React.createClass({
	getInitialState : function() {
		return {
			leaveDetailRegSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : '',
			},
			action: 'query',
			loading: false,
			leaveDetailReg: {},
            batch:{},

			moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(LeaveDetailRegStore, "onServiceComplete")],
    onServiceComplete: function(data) {
    	if(data.operation === 'cache'){
            var ff = data.filter.staffCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.perName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.LeaveDetailRegFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.leaveDetailReg = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            leaveDetailRegSet: data,

        });
    },

    // 第一次加载
	componentDidMount : function(){
		LeaveDetailActions.getCacheData();
	},

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.more = (this.state.moreFilter ? '1' : '0');
		LeaveDetailActions.retrieveHrLeaveDetailRegPage(filter, this.state.leaveDetailRegSet.startPage, pageRows);
	},

	handleOpenCreateWindow: function(e){
        this.setState({action: 'create'});
	},
	onClickUpdate : function(leaveDetailReg, event)
	{
		if(leaveDetailReg != null){
			this.refs.updateWindow.initPage(leaveDetailReg);
			this.refs.updateWindow.toggle();
		}
	},
	onGoBack: function(){
        this.setState({action: 'query'});
    },

	onClickDelete : function(leaveDetailReg, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的假日 【'+leaveDetailReg.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, leaveDetailReg)
		});
	},

	onClickDelete2 : function(leaveDetailReg)
	{
		this.setState({loading: true});
		this.state.leaveDetailRegSet.operation = '';
		LeaveDetailActions.deleteHrLeaveDetailReg( leaveDetailReg.uuid );
	},

	onChangePage: function(pageNumber){
		this.state.leaveDetailRegSet.startPage = pageNumber;
		this.handleQueryClick();
	},
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

	onSearch3:function(){
		this.state.filter = this.refs.LeaveDetailRegFilter.state.leaveDetailReg;
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
  

	render : function() {
		var recordSet = this.state.leaveDetailRegSet.recordSet;
		var moreFilter = this.state.moreFilter;

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
                title: '部门名称',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 140,
             },
			{
                title: '假期类型',
                dataIndex: 'leaveType',
                key: 'leaveType',
                width: 120,
                render: (text, record) => (Utils.getOptionName('HR系统', '假期类型', record.leaveType, false, this)),
            },
            {
                title: '应计天数',
                dataIndex: 'accrued',
                key: 'accrued',
                width: 120,
            },
            {
                title: '已修天数',
                dataIndex: 'spend',
                key: 'spend',
                width: 120,
            },
            {
                title: '剩余天数',
                dataIndex: 'remnant',
                key: 'remnant',
                width: 120,
            },
            {
                title: '补偿天数',
                dataIndex: 'replacement',
                key: 'replacement',
                width: 120,
            },
            {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 160,
				render:  (text, record) => (Common.formatMonth(text, Common.monthFormat)),
            },
            {
                title: '失效日期',
                dataIndex: 'expiryDate',
                key: 'expiryDate',
                width: 160,
				render:  (text, record) => (Common.formatMonth(text, Common.monthFormat)),
            },
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='调整'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var visible = (this.state.action === 'query') ? '' : 'none';
		var pag = {showQuickJumper: true, total:this.state.leaveDetailRegSet.totalRow, pageSize:this.state.leaveDetailRegSet.pageRow, current:this.state.leaveDetailRegSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		var detailTable =
            <div className='grid-page' style={{overflow: 'auto', display:visible}}>
                <div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-leave-detail/retrieve', 'hr-leave-detail/remove']}/>
					<LeaveDetailRegFilter  ref="LeaveDetailRegFilter" moreFilter={moreFilter} />

                    <div style={{margin: '8px 0 0 0'}}>
                        <div className='toolbar-table'>
                            <div style={{float:'left'}}>
					    		<Button icon={Common.iconAdd} type="primary" title="增加假日明细" onClick={this.handleOpenCreateWindow}/>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
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
                    <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
                    </div>
                </div>
             </div>;

		var page = null;
		if(this.state.action === 'create'){
			page = <CreateLeaveDetailRegPage onBack={this.onGoBack}/>;
		}
        

		return (
			<div style={{width: '100%', height: '100%'}}>
				{detailTable}
				{page}

				<UpdateLeaveDetailRegPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = LeaveDetailRegPage;
