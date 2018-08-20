'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Pagination, Spin, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var LeaveLogRegStore = require('./data/LeaveLogRegStore');
var LeaveLogActions = require('./action/LeaveLogActions');
import MoreLeavelLogPage from './Components/MoreLeavelLogPage';
import UpdateUnpaidRegPage from './Components/UpdateUnpaidRegPage';
import UpdatePaidRegPage from './Components/UpdatePaidRegPage';
import CreateUnpaidRegPage from './Components/CreateUnpaidRegPage';
import CreatePaidRegPage from './Components/CreatePaidRegPage';

var pageRows = 10;
var LeaveLogRegPage = React.createClass({
	getInitialState : function() {
		return {
			leaveLogRegSet: {
				recordSet: [],
				leave: null,
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			leaveLog: null,

            loading: false,
			leaveLoading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(LeaveLogRegStore, "onServiceComplete")],

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
                var mp = this.refs.MoreLeavelLogPage;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.leaveLog = this.state.filter;
                }
            }
        }
		if(data.operation === 'retrieveLeave'){
			this.setState({
				leaveLoading: false,
				leaveLogRegSet: data
			});
			return;
		}
        this.setState({
            loading: false,
            leaveLogRegSet: data
        });

    },

	// 第一次加载
	componentDidMount : function(){
		LeaveLogActions.getCacheData();
	},

	// 刷新
	handleQueryClick : function() {
		this.setState({loading: true});
		var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.more = (this.state.moreFilter ? '1' : '0');
		LeaveLogActions.retrieveHrLeaveLogRegPage(filter, this.state.leaveLogRegSet.startPage, pageRows);
	},

	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.leaveLogRegSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
    onSearch: function(e){
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
    onMoreSearch: function(){
        this.state.filter = this.refs.MoreLeavelLogPage.state.leaveLog;
        this.handleQueryClick();
    },
    getSpendTime: function (record) {
        if (record.accrued && record.accrued !== '0') {
            return record.spend + '天 ' + record.accrued + '时';
        }
        else {
            return record.spend + '天';
        }
    },

	handleOpenCreateUnpaidWindow: function(e){
        this.setState({action: 'createUnpaid'});
    },
	handleOpenPaidCreateWindow: function(e){
        this.setState({action: 'createPaid'});
	},
	onClickUpdate : function(leaveLog, event)
	{
		this.state.leaveLog = leaveLog;
		var leaveType=leaveLog.leaveType;
        if(leaveLog != null){
			if(leaveType==='事假'||leaveType==='其他无薪假期'||leaveType==='病假'){
				this.refs.unpaidUpdateWindow.initPage(leaveLog);
				this.refs.unpaidUpdateWindow.toggle();
			}
			else{
				//发送ajax请求，获取leave
				this.setState({
					leaveLoading: true,
				});

				LeaveLogActions.retrieveLeave(leaveLog.staffCode);
				this.refs.paidUpdateWindow.initPage(leaveLog);
				this.refs.paidUpdateWindow.toggle();
			}
		}
	},
	onGoBack: function(){
        this.setState({action: 'query'});
    },

	onClickDelete2 : function(leaveLog)
	{
		this.setState({loading: true});
		this.state.leaveLogRegSet.operation = '';
		LeaveLogActions.deleteHrLeaveLog( leaveLog.uuid );
	},

	render : function(corpUuid) {
		var corpUuid = window.loginData.compUser.corpUuid;
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
				title: '部门名称',
				dataIndex: 'deptName',
				key: 'deptName',
				width: 140,
			},
			{
				title: '休假类型',
				dataIndex: 'leaveType',
				key: 'leaveType',
				width: 140,
				render: (text, record) => (Utils.getOptionName('HR系统', '假期类型', record.leaveType, false, this)),
			},
			{
				title: '开始日期',
				dataIndex: 'beginDate',
				key: 'beginDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
			},
			{
				title: '结束日期',
				dataIndex: 'endDate',
				key: 'endDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
			},
			{
				title: '天数',
				dataIndex: 'spend',
				key: 'spend',
                width: 140,
                render: (text, record) => (this.getSpendTime(record)),
			},
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
						<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='调整'><Icon type={Common.iconUpdate}/></a>
					</span>
				),
			}
		];


		var recordSet = this.state.leaveLogRegSet.recordSet;
		var moreFilter = this.state.moreFilter;
		var visible = (this.state.action === 'query') ? '' : 'none';
		var pag = {showQuickJumper: true, total:this.state.leaveLogRegSet.totalRow, pageSize:this.state.leaveLogRegSet.pageRow, current:this.state.leaveLogRegSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		var contactTable =
            <div className='grid-page' style={{overflow: 'auto', display:visible}}>
                <div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-leaveLog/retrieve', 'hr-leaveLog/remove']}/>
                    <MoreLeavelLogPage ref="MoreLeavelLogPage" moreFilter={moreFilter}/>

                    <div style={{margin: '8px 0 0 0'}}>
                        <div className='toolbar-table'>
                            <div style={{float:'left'}}>
                                <Button icon={Common.iconAdd} type="primary" title="增加无薪休假" onClick={this.handleOpenCreateUnpaidWindow}>无薪假</Button>
								<Button icon={Common.iconAdd} title="增加有薪休假" onClick={this.handleOpenPaidCreateWindow} style={{marginLeft: '4px'}}>带薪假</Button>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							</div>
						 {
                            moreFilter ?
                            <div style={{textAlign:'right', width:'100%'}}>
                               <Button  title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
                               <Button  title="快速条件" onClick={this.showMoreFilter} >快速条件</Button>
                            </div>:
                            <div style={{textAlign:'right', width:'100%'}}>
                                <Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                                <Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
                            </div>
                        }
                        </div>
                    </div>
                    <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                    </div>
                </div>
             </div>;

		var page = null;
		if(this.state.action === 'createUnpaid'){
			page = <CreateUnpaidRegPage onBack={this.onGoBack}/>;
		}
		else if(this.state.action === 'createPaid'){
			page = <CreatePaidRegPage onBack={this.onGoBack}/>;
		}

         return (
             <div style={{width: '100%', height: '100%'}}>
                 {contactTable}
				 {page}
				<UpdateUnpaidRegPage ref="unpaidUpdateWindow"/>
				<UpdatePaidRegPage ref="paidUpdateWindow" leave={this.state.leaveLogRegSet.leave} leaveLoading={this.state.leaveLoading}/>
             </div>
         );
    }
});

module.exports = LeaveLogRegPage;
