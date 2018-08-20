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
var StorLocStore = require('./data/StorLocStore');
var StorLocActions = require('./action/StorLocActions');
import CreateStorLocPage from './Components/CreateStorLocPage';
import UpdateStorLocPage from './Components/UpdateStorLocPage';

var filterValue = '';
var StorLocPage = React.createClass({
	getInitialState : function() {
		return {
			storLocSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
            action: 'query',
            storLoc: null,
		}
	},

    mixins: [Reflux.listenTo(StorLocStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            storLocSet: data
        });
    },
    
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.storLocSet.operation = '';
        var corpUuid = window.loginData.compUser.corpUuid;
		StorLocActions.retrieveStorLoc(corpUuid);
	},

	componentDidMount : function(){
		this.setState({loading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
		StorLocActions.initStorLoc(corpUuid);
	},

    handleCreate: function(e){
        this.setState({action: 'create'});
    },

    onClickUpdate : function(storLoc, event){
        this.setState({storLoc: storLoc, action: 'update'});
    },

	onClickDelete : function(storLoc, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的库管地 【'+storLoc.storName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, storLoc)
		});
	},

	onClickDelete2 : function(storLoc)
	{
		this.setState({loading: true});
		this.state.storLocSet.operation = '';
		StorLocActions.deleteStorLoc( storLoc.uuid );
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
                title: '地址',
                dataIndex: 'locName',
                key: 'locName',
                width: 140,
            },
            {
                title: '城市',
                dataIndex: 'storCity',
                key: 'storCity',
                width: 140,
            },
            {
                title: '管理员',
                dataIndex: 'storName',
                key: 'storName',
                width: 140,
            },
            {
                title: '说明',
                dataIndex: 'memo2',
                key: 'memo2',
                width: 140,
            },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改库管地'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除库管地'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

        var recordSet = Common.filter(this.state.storLocSet.recordSet, filterValue);
        var visible = (this.state.action === 'query') ? '' : 'none';
		var cs = Common.getGridMargin(this);

        var storLocTable=
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['stor-keeper/retrieve', 'stor-keeper/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加库管地" onClick={this.handleCreate}/>
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
            page = <CreateStorLocPage onBack={this.onGoBack}/>;
        }
        else if(this.state.action === 'update'){
            page = <UpdateStorLocPage onBack={this.onGoBack} storLoc={this.state.storLoc}/>
        }


		return (
            <div style={{width: '100%', height: '100%'}}>
                {storLocTable}
                {page}
            </div>
		);
	}
});

module.exports = StorLocPage;

