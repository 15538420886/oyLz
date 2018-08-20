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
var BizTripStore = require('../data/BizTripStore.js');
var BizTripActions = require('../action/BizTripActions');
import CreateBizTripPage from './CreateBizTripPage';
import UpdateBizTripPage from './UpdateBizTripPage';

var filterValue = '';
var BizTripPage = React.createClass({
	getInitialState : function() {
		return {
			bizTripSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(BizTripStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            bizTripSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.bizTripSet.operation = '';
		BizTripActions.retrieveHrBizTrip(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		BizTripActions.initHrBizTrip(corpUuid);
	},

	handleOpenCreateWindow : function(event) {
		var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(bizTrip, event)
	{
		if(bizTrip != null){
			this.refs.updateWindow.initPage(bizTrip);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(bizTrip, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的差旅级别 【'+bizTrip.tripName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, bizTrip)
		});
	},

	onClickDelete2 : function(bizTrip)
	{
		this.setState({loading: true});
		this.state.bizTripSet.operation = '';
		BizTripActions.deleteHrBizTrip( bizTrip.uuid );
	},

	handleSelectClick: function(bizTrip){
        this.props.selectsRole(bizTrip);
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	render : function() {
		var recordSet = Common.filter(this.state.bizTripSet.recordSet, filterValue);

		const columns = [
				{
            		    title: '差旅级别',
            		    dataIndex: 'tripName',
            		    key: 'tripName',
            		    width: 140,
      		        },
      		       {
            		    title: '差旅说明',
            		    dataIndex: 'tripDesc',
            		    key: 'tripDesc',
            		    width: 240,
      		        },
			{
				title: '',
				key: 'action',
				width: 70,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改差旅级别'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除差旅级别'><Icon type={Common.iconRemove}/></a>
					<span className="ant-divider" />
                    <a href="#" onClick={this.handleSelectClick.bind(this, record)} title='报销额度'><Icon type={Common.iconDetail}/></a>
					</span>
				),
			}
		];

		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
                <div style={{margin: '-58px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="差旅级别" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="额度管理" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateBizTripPage ref="createWindow"/>
                <UpdateBizTripPage ref="updateWindow"/>
            </div>
		);
	}
});

module.exports = BizTripPage;
