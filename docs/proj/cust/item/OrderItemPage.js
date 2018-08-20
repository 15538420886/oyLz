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

var OrderItemStore = require('./data/OrderItemStore.js');
var OrderItemActions = require('./action/OrderItemActions');
import CreateOrderItemPage from './Components/CreateOrderItemPage';
import UpdateOrderItemPage from './Components/UpdateOrderItemPage';

var filterValue = '';
var OrderItemPage = React.createClass({
    getInitialState: function () {
        return {
            orderItemSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(OrderItemStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            orderItemSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var filter = {};
        filter.orderUuid = this.props.order.uuid;
        OrderItemActions.retrieveOrderItem(filter);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        var filter = {};
        filter.orderUuid = this.props.order.uuid;
        OrderItemActions.initOrderItem(filter);
    },

    handleOpenCreateWindow: function (event) {
        this.refs.createWindow.clear(this.props.order.uuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (orderItem, event) {
        if (orderItem != null) {
            this.refs.updateWindow.initPage(orderItem);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (orderItem, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的任务信息 【' + orderItem.itemName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, orderItem)
        });
    },

    onClickDelete2: function (orderItem) {
        this.setState({ loading: true });
        OrderItemActions.deleteOrderItem(orderItem.uuid);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.orderItemSet.recordSet, filterValue);

        const columns = [
            {
                title: '编号',
                dataIndex: 'itemCode',
                key: 'itemCode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'itemName',
                key: 'itemName',
                width: 140,
            },
            {
                title: '业务群',
                dataIndex: 'deptCode',
                key: 'deptCode',
                width: 140,
            },
            {
                title: '项目组',
                dataIndex: 'grpName',
                key: 'grpName',
                width: 140,
            },
            {
                title: '业务类型',
                dataIndex: 'biziType',
                key: 'biziType',
                width: 140,
                render: (text, record) => (Utils.getOptionName('项目管理', '业务类型', text, false, this)),
            },
            {
                title: '开始日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '结束日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '执行阶段',
                dataIndex: 'itemStatus',
                key: 'itemStatus',
                width: 140,
                render: (text, record) => (Utils.getOptionName('项目管理', '订单状态', text, false, this)),
            }, 
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改任务信息'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除任务信息'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['order_item/retrieve', 'order_item/remove']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加任务信息" onClick={this.handleOpenCreateWindow} />
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

                <CreateOrderItemPage ref="createWindow" />
                <UpdateOrderItemPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = OrderItemPage;
