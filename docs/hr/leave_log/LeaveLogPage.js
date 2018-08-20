'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var LeaveLogStore = require('./data/LeaveLogStore.js');
var LeaveLogActions = require('./action/LeaveLogActions');
import CreateUnpaidLeavePage from './Components/CreateUnpaidLeavePage';
import CreatePaidLeavePage from './Components/CreatePaidLeavePage';
import UpdateUnpaidLeavePage from './Components/UpdateUnpaidLeavePage';
import UpdatePaidLeavePage from './Components/UpdatePaidLeavePage';

const propTypes = {
  leave: React.PropTypes.object,
};
var LeaveLogPage = React.createClass({
	getInitialState : function() {
		return {
			leaveLogSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
            leave:this.props.leave,
            corpUuid:window.loginData.compUser.corpUuid,

		}
	},

    mixins: [Reflux.listenTo(LeaveLogStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            leaveLogSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
        var userUuid = this.state.leave.uuid;
		this.setState({loading: true});
		this.state.leaveLogSet.operation = '';
		LeaveLogActions.retrieveHrLeaveLog(userUuid);
	},

	// 第一次加载
	componentDidMount : function(){
        var userUuid = this.state.leave.uuid;
		this.setState({loading: true});
		LeaveLogActions.initHrLeaveLog(userUuid);
	},

	handleOpenUnpaidCreateWindow : function(event) {
        var userUuid = this.state.leave.uuid;
        var corpUuid = this.state.corpUuid;
		this.refs.unpaidCreateWindow.clear(userUuid, corpUuid);
		this.refs.unpaidCreateWindow.toggle();
	},

    handleOpenPaidCreateWindow : function(event) {
        var userUuid = this.state.leave.uuid;
        var corpUuid = this.state.corpUuid;
		this.refs.paidCreateWindow.clear(userUuid, corpUuid);
		this.refs.paidCreateWindow.toggle();
	},

    onClickUpdate : function(leaveLog, event)
	{
		var leave=this.state.leave;
		var leaveType=leaveLog.leaveType;
        if(leaveLog != null){
			if(leave[leaveType]===undefined){
				this.refs.unpaidUpdateWindow.initPage(leaveLog);
				this.refs.unpaidUpdateWindow.toggle();
			}else{
				this.refs.paidUpdateWindow.initPage(leaveLog);
				this.refs.paidUpdateWindow.toggle();
			}
			
		}
	},

	onClickDelete : function(leaveLog, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的休假日志 【'+leaveLog.leaveType+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, leaveLog)
		});
	},

	onClickDelete2 : function(leaveLog)
	{
		this.setState({loading: true});
		this.state.leaveLogSet.operation = '';
		LeaveLogActions.deleteHrLeaveLog( leaveLog.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		var recordSet = this.state.leaveLogSet.recordSet;

		const columns = [
			{
                title: '假期类型',
                dataIndex: 'leaveType',
                key: 'leaveType',
                width: 120,
                render: (text, record) => (Utils.getOptionName('HR系统', '假期类型', record.leaveType, false, this)),
            },
            {
                title: '开始日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 120,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 120,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '休假天数',
                dataIndex: 'spend',
                key: 'spend',
                width: 120,
            },
            {
                title: '小时',
                dataIndex: 'accrued',
                key: 'accrued',
                width: 120,
            },
            {
                title: '休假原因',
                dataIndex: 'reason',
                key: 'reason',
                width: 180,
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

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-leaveLog/retrieve', 'hr-leaveLog/remove']}/>

					<div className='toolbar-table'>
						<Button icon={Common.iconAdd} type="primary" title="增加无薪休假" onClick={this.handleOpenUnpaidCreateWindow}>无薪假</Button>
						<Button icon={Common.iconAdd} title="增加有薪休假" onClick={this.handleOpenPaidCreateWindow} style={{marginLeft: '4px'}}>带薪假</Button>
						<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateUnpaidLeavePage ref="unpaidCreateWindow" leave={this.state.leave}/>
				<CreatePaidLeavePage ref="paidCreateWindow" leave={this.state.leave}/>
				<UpdateUnpaidLeavePage ref="unpaidUpdateWindow"/>
				<UpdatePaidLeavePage ref="paidUpdateWindow" leave={this.state.leave}/>
			</div>
		);
	}
});

module.exports = LeaveLogPage;