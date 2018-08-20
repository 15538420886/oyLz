'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var TripCityStore = require('./data/TripCityStore.js');
var TripCityActions = require('./action/TripCityActions');
import CreateTripCityPage from './Components/CreateTripCityPage';
import UpdateTripCityPage from './Components/UpdateTripCityPage';

var filterValue = '';
var TripCityPage = React.createClass({
    getInitialState: function () {
        return {
            tripCitySet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(TripCityStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            tripCitySet: data
        });
    },

    // 刷新
    handleQueryClick: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.setState({ loading: true });
        this.state.tripCitySet.operation = '';
        TripCityActions.retrieveHrTripCity(corpUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.setState({ loading: true });
        TripCityActions.initHrTripCity(corpUuid);
    },

    handleOpenCreateWindow: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.refs.createWindow.clear(corpUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (tripCity, event) {
        if (tripCity != null) {
            this.refs.updateWindow.initPage(tripCity);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (tripCity, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的城市 【' + tripCity.cityList + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, tripCity)
        });
    },

    onClickDelete2: function (tripCity) {
        this.setState({ loading: true });
        this.state.tripCitySet.operation = '';
        TripCityActions.deleteHrTripCity(tripCity.uuid);
    },


    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.tripCitySet.recordSet, filterValue);

        const columns = [
            {
                title: '城市类型',
                dataIndex: 'cityType',
                key: 'cityType',
                width: 140,
            },
            {
                title: '城市列表',
                dataIndex: 'cityList',
                key: 'cityList',
                width: 140,
            },
            {
                title: '',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='移除'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_trip_city/retrieve', 'hr_trip_city/remove']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加城市" onClick={this.handleOpenCreateWindow} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
                <CreateTripCityPage ref="createWindow" />
                <UpdateTripCityPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = TripCityPage;

