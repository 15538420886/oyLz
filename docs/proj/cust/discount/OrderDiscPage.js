'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var OrderDiscStore = require('./data/OrderDiscStore.js');
var OrderDiscActions = require('./action/OrderDiscActions');
import CreateOrderDiscPage from './Components/CreateOrderDiscPage';
import UpdateOrderDiscPage from './Components/UpdateOrderDiscPage';

var filterValue = '';
var OrderDiscPage = React.createClass({
    getInitialState: function () {
        return {
            orderDiscSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(OrderDiscStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            orderDiscSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var filter = {};
        filter.orderUuid = this.props.order.uuid;
        OrderDiscActions.retrieveOrderDisc(filter);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        var filter = {};
        filter.orderUuid = this.props.order.uuid;
        OrderDiscActions.initOrderDisc(filter);
    },

    handleOpenCreateWindow: function (event) {
        this.refs.createWindow.clear(this.props.order.uuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (orderDisc, event) {
        if (orderDisc != null) {
            this.refs.updateWindow.initPage(orderDisc);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (orderDisc, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的折让信息 【' + orderDisc.discount + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, orderDisc)
        });
    },

    onClickDelete2: function (orderDisc) {
        this.setState({ loading: true });
        OrderDiscActions.deleteOrderDisc(orderDisc.uuid);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.orderDiscSet.recordSet, filterValue);

        const columns = [
            {
                title: '折让日期',
                dataIndex: 'disDate',
                key: 'disDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '折让金额',
                dataIndex: 'discount',
                key: 'discount',
                width: 140,
            },
            {
                title: '折让原因',
                dataIndex: 'discReason',
                key: 'discReason',
                width: 360,
            },
            {
                title: '审批人',
                dataIndex: 'approver',
                key: 'approver',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改折让信息'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除折让信息'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['order-disc/retrieve', 'order-disc/remove']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加折让信息" onClick={this.handleOpenCreateWindow} />
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

                <CreateOrderDiscPage ref="createWindow" />
                <UpdateOrderDiscPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = OrderDiscPage;
