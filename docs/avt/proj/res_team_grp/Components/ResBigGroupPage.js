'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var ResBigGroupStore = require('../data/ResBigGroupStore');
var ResBigGroupActions = require('../action/ResBigGroupActions');
import CreateResBigGroupPage from '../Components/CreateResBigGroupPage';
import UpdateResBigGroupPage  from '../Components/UpdateResBigGroupPage';

var ResBigGroupPage = React.createClass({
	getInitialState : function() {
		return {
			teamGrpSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(ResBigGroupStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            teamGrpSet: data
        });
    },
    
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.teamGrpSet.operation = '';
		var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.grpCode = this.props.grpCode;
		ResBigGroupActions.retrieveResTeamGrp(filter);
	},

	componentDidMount : function(){
		this.setState({loading: true});
		this.state.grpCode = '';
		var filter = {};
		var grpCode = this.props.grpCode;
		if(grpCode !== null){
			this.state.grpCode = grpCode;
		}
		filter.grpCode = grpCode;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		ResBigGroupActions.retrieveResTeamGrp(filter);
	},

	componentWillReceiveProps:function(nextProps){
		this.setState({loading: true});
		this.state.grpCode = '';
		var filter = {};
		var grpCode = nextProps.grpCode;
		if(grpCode !== null){
			this.state.grpCode = grpCode;
		}
		filter.grpCode = grpCode;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		ResBigGroupActions.retrieveResTeamGrp(filter);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},

	handleUpdateClick : function(teamGrp, event)
	{
		if(teamGrp != null){
			this.refs.updateWindow.initPage(teamGrp);
			this.refs.updateWindow.toggle();
		}
	},

	handleRemoveClick : function(teamGrp, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的组员维护 【'+teamGrp.grpName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.handleRemoveClick2.bind(this, teamGrp)
		});
	},

	handleRemoveClick2 : function(teamGrp)
	{
		this.setState({loading: true});
		this.state.teamGrpSet.operation = '';
		ResBigGroupActions.deleteResTeamGrp( teamGrp.uuid );
	},

	render : function() {
		var recordSet = this.state.teamGrpSet.recordSet;

		const columns = [
			{
				title: '小组编号',
				dataIndex: 'grpCode',
				key: 'grpCode',
				width: 140,
			},
			{
				title: '小组名称',
				dataIndex: 'grpName',
				key: 'grpName',
				width: 140,
			},
			{
				title: '组长姓名',
				dataIndex: 'pmName',
				key: 'pmName',
				width: 140,
			},
			{
				title: '归属地',
				dataIndex: 'baseCity',
				key: 'baseCity',
				width: 140,
			},
			{
				title: '小组级别',
				dataIndex: 'grpLevel',
				key: 'grpLevel',
				width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (teamGrp, record) => (
                    <span>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, teamGrp)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleRemoveClick.bind(this, teamGrp)} title='删除任务'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

		var cs = Common.getGridMargin(this);
		var puuid = this.props.uuid;
		var grpCode = this.props.grpCode;
		var poolUuid = this.props.poolUuid;
		var teamUuid = this.props.teamUuid;

		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['res-team-grp/retrieve', 'res-team-grp/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加小组" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateResBigGroupPage ref="createWindow" puuid={puuid} grpCode={grpCode} poolUuid={poolUuid} teamUuid={teamUuid}/>
				<UpdateResBigGroupPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = ResBigGroupPage;

