'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

var Context = require('../../CampContext');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var WifiStore = require('../data/WifiStore.js');
var WifiActions = require('../action/WifiActions');
import CreateWifiPage from './CreateWifiPage';
import UpdateWifiPage from './UpdateWifiPage';

var filterValue = '';
var WifiPage = React.createClass({
	getInitialState : function() {
		return {
			wifiSet: {
				recordSet: [],
				errMsg : ''
			},
			loading: false,
			room:{}
		}
    },
    mixins: [Reflux.listenTo(WifiStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            wifiSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		WifiActions.retrieveHrWifi(this.state.room.uuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});

		this.state.room = Context.selectedRoom;
		WifiActions.initHrWifi(this.state.room.uuid);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear(this.state.room.uuid);
		this.refs.createWindow.toggle();
	},
	onClickUpdate : function(wifi, event)
	{
		if(wifi != null){
			this.refs.updateWindow.initPage(wifi);
			this.refs.updateWindow.toggle();
		}
	},
	onClickDelete : function(wifi, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的WIFI 【'+wifi.wifiName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, wifi)
		});
	},
	onClickDelete2 : function(wifi)
	{
		this.setState({loading: true});
		WifiActions.deleteHrWifi( wifi.uuid );
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

	render : function() {
        var recordSet = Common.filter(this.state.wifiSet.recordSet, filterValue);

		const columns = [
		{
			title: 'WIFI名称',
			dataIndex: 'wifiName',
			key: 'wifiName',
			width: 140,
		},
		{
			title: 'WIFI编号',
			dataIndex: 'wifiId',
			key: 'wifiId',
			width: 140,
		},
		{
			title: '登记人',
			dataIndex: 'regName',
			key: 'regName',
			width: 140,
		},
		{
			title: '登记时间',
			dataIndex: 'regTime',
			key: 'regTime',
			width: 140,
		},
		{
			title: '',
			key: 'action',
			width: 60,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)}>更新</a>
				<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)}>删除</a>
				</span>
			),
		}
	];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-wifi/retrieve', 'hr-wifi/remove']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type='primary' title="增加WIFI" onClick={this.handleOpenCreateWindow} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} scroll={{ y: 600 }} bordered />
                </div>

                <CreateWifiPage ref="createWindow" />
                <UpdateWifiPage ref="updateWindow" />
            </div>
        );
	}
});

module.exports = WifiPage;
