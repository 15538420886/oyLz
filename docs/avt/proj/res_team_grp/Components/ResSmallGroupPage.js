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
var ResSmallGroupStore = require('../data/ResSmallGroupStore');
var ResSmallGroupActions = require('../action/ResSmallGroupActions');
import CreateResSmallGroupPage from '../Components/CreateResSmallGroupPage';

var ResSmallGroupPage = React.createClass({
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

    mixins: [Reflux.listenTo(ResSmallGroupStore, "onServiceComplete")],
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
        filter.groupUuid = this.props.uuid;
		ResSmallGroupActions.retrieveResTeamGrp(filter);
	},
	
	componentDidMount : function(){
		this.setState({loading: true});
		this.state.groupUuid = '';
		var filter = {};
		var groupUuid = this.props.uuid;
		if(groupUuid !== null){
			this.state.groupUuid = groupUuid;
		}
		filter.groupUuid = groupUuid;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		ResSmallGroupActions.retrieveResTeamGrp(filter);
	},

	componentWillReceiveProps:function(nextProps){
		this.setState({loading: true});
		this.state.groupUuid = '';
		var filter = {};
		var groupUuid = nextProps.uuid;
		if(groupUuid !== null){
			this.state.groupUuid = groupUuid;
		}
		filter.groupUuid = groupUuid;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		ResSmallGroupActions.retrieveResTeamGrp(filter);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},

	render : function() {
		var recordSet =this.state.teamGrpSet.recordSet;

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
			title: '电话',
			dataIndex: 'phoneno',
			key: 'phoneno',
			width: 140,
		},
		{
			title: '状态',
			dataIndex: 'resStatus',
			key: 'resStatus',
			width: 140,
		},
		{
			title: '项目名称',
			dataIndex: 'resName',
			key: 'resName',
			width: 140,
		}		
		];

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['res-team-grp/retrieve']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加小组成员" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
				<CreateResSmallGroupPage ref="createWindow" uuid={this.props.uuid} poolUuid={this.props.poolUuid} />
			</div>
		);
	}
});

module.exports = ResSmallGroupPage;

