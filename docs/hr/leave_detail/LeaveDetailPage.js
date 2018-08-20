'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var LeaveDetailStore = require('./data/LeaveDetailStore.js');
var LeaveDetailActions = require('./action/LeaveDetailActions');
import CreateLeaveDetailPage from './Components/CreateLeaveDetailPage';
import UpdateLeaveDetailPage from './Components/UpdateLeaveDetailPage';

const propTypes = {
  leave: React.PropTypes.object,
};
var LeaveDetailPage = React.createClass({
	getInitialState : function() {
		return {
			detailSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
            leave:this.props.leave,
		}
	},

    mixins: [Reflux.listenTo(LeaveDetailStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            detailSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
        var userUuid = this.state.leave.uuid;
		this.setState({loading: true});
		this.state.detailSet.operation = '';
		LeaveDetailActions.retrieveHrLeaveDetail(userUuid);
	},

	// 第一次加载
	componentDidMount : function(){
        var userUuid = this.state.leave.uuid;
		this.setState({loading: true});
		LeaveDetailActions.initHrLeaveDetail(userUuid);
	},

	handleOpenCreateWindow : function(event) {
        var userUuid = this.state.leave.uuid;
        var leave = this.state.leave;
		this.refs.createWindow.clear(userUuid,leave);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(detail, event)
	{
        var leave = this.state.leave;
		if(detail != null){
			this.refs.updateWindow.initPage(detail,leave);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(detail, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的假日明细 【'+detail.leaveType+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, detail)
		});
	},

	onClickDelete2 : function(detail)
	{
		this.setState({loading: true});
		this.state.detailSet.operation = '';
		LeaveDetailActions.deleteHrLeaveDetail( detail.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		var recordSet = this.state.detailSet.recordSet;

		const columns = [
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
				render: (text, record) => (Common.formatMonth(text, Common.monthFormat)),
            },
            {
                title: '失效日期',
                dataIndex: 'expiryDate',
                key: 'expiryDate',
                width: 160,
				render: (text, record) => (Common.formatMonth(text, Common.monthFormat)),
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
					<ServiceMsg ref='mxgBox' svcList={['hr-leave-detail/retrieve', 'hr-leave-detail/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加假日明细" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateLeaveDetailPage ref="createWindow"/>
				<UpdateLeaveDetailPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = LeaveDetailPage;