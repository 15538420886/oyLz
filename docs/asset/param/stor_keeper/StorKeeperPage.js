'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var StorKeeperStore = require('./data/StorKeeperStore');
var StorKeeperActions = require('./action/StorKeeperActions');
import CreateStorKeeperPage from './Components/CreateStorKeeperPage';
import UpdateStorKeeperPage from './Components/UpdateStorKeeperPage';

var filterValue = '';
var StorKeeperPage = React.createClass({
	getInitialState : function() {
		return {
			storKeeperSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
            action: 'query',
            storKeeper: null,
		}
	},

    mixins: [Reflux.listenTo(StorKeeperStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            storKeeperSet: data
        });
    },
    
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.storKeeperSet.operation = '';
        var corpUuid = window.loginData.compUser.corpUuid;
		StorKeeperActions.retrieveStorKeeper(corpUuid);
	},

	componentDidMount : function(){
		this.setState({loading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
		StorKeeperActions.initStorKeeper(corpUuid);
	},

    handleCreate: function(e){
        this.setState({action: 'create'});
    },

    onClickUpdate : function(storKeeper, event){
        this.setState({storKeeper: storKeeper, action: 'update'});
    },

	onClickDelete : function(storKeeper, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的库管员 【'+storKeeper.storName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, storKeeper)
		});
	},

	onClickDelete2 : function(storKeeper)
	{
		this.setState({loading: true});
		this.state.storKeeperSet.operation = '';
		StorKeeperActions.deleteStorKeeper( storKeeper.uuid );
	},

    onGoBack: function(){
        this.setState({action: 'query'});
    },

	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		const columns = [
			{
                title: '姓名',
                dataIndex: 'storName',
                key: 'storName',
                width: 140,
            },
            {
                title: '工号',
                dataIndex: 'storCode',
                key: 'storCode',
                width: 140,
            },
            {
                title: '城市',
                dataIndex: 'workCity',
                key: 'workCity',
                width: 140,
            },
            {
                title: '部门',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 140,
            },
            {
                title: '工作地点',
                dataIndex: 'workLoc',
                key: 'workLoc',
                width: 140,
            },
            {
                title: '电话',
                dataIndex: 'storPhone',
                key: 'storPhone',
                width: 140,
            },
            {
                title: '邮箱',
                dataIndex: 'storEmail',
                key: 'storEmail',
                width: 140,
            },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改库管员'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除库管员'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

        var recordSet = Common.filter(this.state.storKeeperSet.recordSet, filterValue);
        var visible = (this.state.action === 'query') ? '' : 'none';
		var cs = Common.getGridMargin(this);

        var StorKeeperTable=
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['stor-keeper/retrieve', 'stor-keeper/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加库管员" onClick={this.handleCreate}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>;



        var page = null;
        if(this.state.action === 'create'){
            page = <CreateStorKeeperPage onBack={this.onGoBack}/>;
        }
        else if(this.state.action === 'update'){
            page = <UpdateStorKeeperPage onBack={this.onGoBack} storKeeper={this.state.storKeeper}/>
        }


		return (
            <div style={{width: '100%', height: '100%'}}>
                {StorKeeperTable}
                {page}
            </div>
		);
	}
});

module.exports = StorKeeperPage;

