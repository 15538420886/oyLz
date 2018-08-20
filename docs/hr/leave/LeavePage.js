'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import ModalForm from '../../lib/Components/ModalForm';
import LeaveFilter from './Components/LeaveFilter';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import CreateLeavePage from './Components/CreateLeavePage';
import UpdateLeavePage from './Components/UpdateLeavePage';
var LeaveStore = require('./data/LeaveStore.js');
var LeaveActions = require('./action/LeaveActions');

var pageRows = 10;
var LeavePage = React.createClass({
	getInitialState : function() {
		return {
			leaveSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			leave:null,

			loading: false,
            moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(LeaveStore, "onServiceComplete")],
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
                var mp = this.refs.LeaveFilterForm;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.leave = this.state.filter;
                }
            }
        }

        this.setState({
            loading: false,
            leaveSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.leaveSet.operation = '';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		LeaveActions.retrieveHrLeavePage(this.state.filter, this.state.leaveSet.startPage, pageRows);
	},

	// 第一次加载
	componentDidMount : function(){
		LeaveActions.getCacheData();
	},


    onClickDelete : function(leave, event)
    {
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的假日 【'+leave.perName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, leave)
		});
    },
    onClickDelete2 : function(leave)
    {
		this.setState({loading: true});
		this.state.leaveSet.operation = '';
		LeaveActions.deleteHrLeave( leave.uuid );
    },

    toggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

    onSearch3:function(){
		var filter = this.refs.LeaveFilterForm.state.leave;
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
    onChangePage: function(pageNumber){
        this.state.leaveSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	onClickUpdate : function(leave, event){
		this.setState({leave: leave, action: 'update'});
	},
    handleCreate: function(e){
		this.setState({action: 'create'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function() {
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
                width: 120,
            },
            {
                title: '部门名称',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 140,
            },
            {
                title: '年假',
                dataIndex: 'annual',
                key: 'annual',
                width: 120,
            },
            {
                title: '调休',
                dataIndex: 'dayoff',
                key: 'dayoff',
                width: 120,
            },
			{
				title: '',
				key: 'action',
				width: 60,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='详情'><Icon type={Common.iconDetail}/></a>
					</span>
				),
			}
		];

		var recordSet = this.state.leaveSet.recordSet;
		var moreFilter = this.state.moreFilter;
		var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.leaveSet.totalRow, pageSize:this.state.leaveSet.pageRow, current:this.state.leaveSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		var cs = Common.getGridMargin(this);
		var leaveTable =
			<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-leave/retrieve', 'hr-leave/remove']}/>
				<LeaveFilter  ref="LeaveFilterForm" moreFilter={moreFilter} />

				<div style={{margin: '8px 0 0 0'}}>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加假日" onClick={this.handleCreate}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
			            {
						moreFilter ?
							<div style={{textAlign:'right', width:'100%'}}>
								<Button title="查询" onClick={this.onSearch3} loading={this.state.loading}>查询</Button>
				 				<Button title="快速条件" onClick={this.toggle} style={{marginLeft:'8px'}}>快速条件</Button>
							</div>
							:
							<div style={{textAlign:'right', width:'100%'}}>
								<Search placeholder="查询（员工编号/员工姓名）" onSearch={this.onSearch} value={this.state.filterValue}  onChange={this.onChangeFilter} style={{width:'220px'}}/>
								<Button title="更多条件" onClick={this.toggle} style={{marginLeft:'8px'}}>更多条件</Button>
							</div>
			            }
					</div>
				</div>
				<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={pag}  bordered={Common.tableBorder}/>
				</div>
			</div>;

		var page = null;
		if(this.state.action === 'create'){
			page = <CreateLeavePage onBack={this.onGoBack}/>;
		}
		else if(this.state.action === 'update'){
			page = <UpdateLeavePage onBack={this.onGoBack} leave={this.state.leave}/>
		}

		return (
			<div style={{width: '100%'}}>
				{leaveTable}
				{page}
			</div>
		);
	}
});

module.exports = LeavePage;
