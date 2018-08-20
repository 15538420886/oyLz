'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var TripAgentStore = require('./data/TripAgentStore.js');
var TripAgentActions = require('./action/TripAgentActions');
import CreateTripAgentPage from './Components/CreateTripAgentPage';
import UpdateTripAgentPage from './Components/UpdateTripAgentPage';

var filterValue='';
var TripAgentPage = React.createClass({
    getInitialState : function() {
        return {
            tripAgentSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            filter:{},

        }
    },

    mixins: [Reflux.listenTo(TripAgentStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            tripAgentSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        TripAgentActions.retrieveTripAgent(filter);
    },

    // 第一次加载
    componentDidMount : function(){
        TripAgentActions.getCacheData();
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onSearch:function(objList, filterValue){
			if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
					return objList;
			}
			var rs=[];
			objList.map(function(node) {
				if(node.city.indexOf(filterValue)>=0){
						rs.push( node );
				}
			});
			return rs;
		},

    onClickUpdate : function(tripAgent, event)
    {
        if(tripAgent != null){
            this.refs.updateWindow.initPage(tripAgent);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(tripAgent, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的机票代理点 【'+tripAgent.agentName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, tripAgent)
        });
    },

    onClickDelete2 : function(tripAgent)
    {
        this.setState({loading: true});
        TripAgentActions.deleteTripAgent( tripAgent.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState( {filterValue: e.target.value} );
    },

    render : function() {
      var recordSet = this.onSearch(this.state.tripAgentSet.recordSet, filterValue);

        const columns = [
            {
                title: '名称',
                dataIndex: 'agentName',
                key: 'agentName',
                width: 140,
            },
            {
                title: '城市',
                dataIndex: 'city',
                key: 'city',
                width: 140,
            },
            {
                title: '代办点电话',
                dataIndex: 'phone',
                key: 'phone',
                width: 140,
            },
            {
                title: '客户经理',
                dataIndex: 'account',
                key: 'account',
                width: 140,
            },
            {
                title: '联系电话',
                dataIndex: 'mobile',
                key: 'mobile',
                width: 140,
            },
            {
                title: '地址',
                dataIndex: 'location',
                key: 'location',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
					<span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改机票代理点'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除机票代理点'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['trip-agent/retrieve', 'trip-agent/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加机票代理点" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
							<Search placeholder="查询(城市)" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord} />
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateTripAgentPage ref="createWindow"/>
				<UpdateTripAgentPage ref="updateWindow"/>
			</div>
        );
    }
});

module.exports = TripAgentPage;
