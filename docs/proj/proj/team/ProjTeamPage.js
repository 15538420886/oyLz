﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjTeamStore = require('./data/ProjTeamStore.js');
var ProjTeamActions = require('./action/ProjTeamActions');
var ProjContext = require('../../ProjContext');
import CreateProjTeamPage from './Components/CreateProjTeamPage';
import UpdateProjTeamPage from './Components/UpdateProjTeamPage';

var filterValue = '';
var ProjTeamPage = React.createClass({
	getInitialState : function() {
		return {
			projTeamSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(ProjTeamStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projTeamSet: data
        });
    },

    
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.status = '1';
        this.state.filter.projUuid = ProjContext.selectedProj.uuid;
		ProjTeamActions.retrieveProjTeamPage(this.state.filter);
	},

	// 第一次加载
	componentDidMount : function(){
		var projUuid = ProjContext.selectedProj.uuid;
		this.setState({loading: true});
		ProjTeamActions.initProjTeam(projUuid);
	},


	onClickUpdate : function(projTeam, event)
	{
		if(projTeam != null){
			this.refs.updateWindow.initPage(projTeam);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(projTeam, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的小组 【'+projTeam.teamName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, projTeam)
		});
	},

	onClickDelete2 : function(projTeam)
	{
		this.setState({loading: true});
		this.state.projTeamSet.operation = '';
		ProjTeamActions.deleteProjTeam( projTeam.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(projTeam, event){
        this.setState({projTeam: projTeam, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function() {
		var recordSet = Common.filter(this.state.projTeamSet.recordSet, filterValue);

		const columns = [
					{
            		    title: '小组编号',
            		    dataIndex: 'teamCode',
            		    key: 'teamCode',
            		    width: 140,
      		        },
      		       {
            		    title: '小组名称',
            		    dataIndex: 'teamName',
            		    key: 'teamName',
            		    width: 140,
      		        },
      		       {
            		    title: '组长',
            		    dataIndex: 'tmName',
            		    key: 'tmName',
            		    width: 140,
      		        },
      		       {
            		    title: '实施范围',
            		    dataIndex: 'projScope',
            		    key: 'projScope',
            		    width: 140,
      		        },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改小组'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除小组'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var visible = (this.state.action === 'query') ? '' : 'none';
		var contactTable =
			<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
					<ServiceMsg ref='mxgBox' svcList={['proj_team/retrieve', 'proj_team/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加小组" onClick={this.handleCreate}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查询" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>;
			  var page = null;
	          if(this.state.action === 'create'){
	              page = <CreateProjTeamPage onBack={this.onGoBack}/>;
	          }
	          else if (this.state.action === 'update') {
	              var projTeam = {};
	              Utils.copyValue(this.state.projTeam, projTeam);
	              page = <UpdateProjTeamPage onBack={this.onGoBack} projTeam={projTeam}/>
	          }

	          return (
	              <div style={{width: '100%',height:'100%'}}>
	                   {contactTable}
	                   {page}
	               </div>
	          );
		
	}
});

module.exports = ProjTeamPage;



