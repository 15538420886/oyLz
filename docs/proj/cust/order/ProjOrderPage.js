'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Tabs, Input, Radio } from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjOrderStore = require('./data/ProjOrderStore');
var ProjOrderActions = require('./action/ProjOrderActions');

import CreateProjOrderPage from './Components/CreateProjOrderPage';
import UpdateProjOrderPage from './Components/UpdateProjOrderPage';
import OrderFilter from './Components/OrderFilter';
import OrderDiscPage from '../discount/OrderDiscPage';
import OrderItemPage from '../item/OrderItemPage';

var pageRows = 10;
var ProjOrderPage = React.createClass({
    getInitialState: function () {
        return {
            orderSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            action: 'query',
            order: null,
            viewType: '1',
            loading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(ProjOrderStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            var ff = data.filter.ordCode;
            if (ff === null || typeof (ff) === 'undefined' || ff === '') {
                ff = data.filter.ordName;
                if (ff === null || typeof (ff) === 'undefined') {
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if (this.state.moreFilter) {
                var mp = this.refs.OrderFilter;
                if (mp !== null && typeof (mp) !== 'undefined') {
                    mp.state.order = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            orderSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        ProjOrderActions.getCacheData();
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        ProjOrderActions.retrieveProjOrderPage(this.state.filter, this.state.orderSet.startPage, pageRows);
    },

    showMoreFilter: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },

    onChangePage: function (pageNumber) {
        this.state.orderSet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },

    onChangeFilter: function (e) {
        this.setState({ filterValue: e.target.value });
    },

    onSearch: function (e) {
        this.state.filter = {};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)) {
            this.state.filter.ordCode = filterValue;
        }
        else {
            this.state.filter.ordName = filterValue;
        }

        this.handleQueryClick();
    },

    onMoreSearch: function () {
        var filter = this.refs.OrderFilter.state.order;
        if (filter.beginDate !== null && filter.beginDate !== '') {
            filter.beginDate = filter.beginDate;
            filter.endDate = filter.endDate;
        } else {
            filter.beginDate = '';
            filter.endDate = '';
        }
        this.state.filter = filter;
        this.handleQueryClick();
    },

    onClickDelete: function (order, event) {
        console.log()
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的订单 【' + order.ordCode + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, order)
        });
    },

    onClickDelete2: function (order) {
        this.setState({ loading: true });
        this.state.orderSet.operation = '';
        ProjOrderActions.deleteProjOrder(order.uuid);
    },

    handleCreate: function (e) {
        this.setState({ action: 'create' });
    },
    onClickUpdate: function (order, event) {
        this.setState({ order: order, action: 'update' });
    },
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.onGoBack();
        }
    },

    onChangeView: function (e) {
        this.setState({ viewType: e.target.value });
    },

    render: function () {
        var columns = [];
        if (this.state.viewType === '1') {
            columns = [
                {
                    title: '编号',
                    dataIndex: 'ordCode',
                    key: 'ordCode',
                    width: 140,
                },
                {
                    title: '名称',
                    dataIndex: 'ordName',
                    key: 'ordName',
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
                    title: '客户',
                    dataIndex: 'custName',
                    key: 'custName',
                    width: 140,
                },
                {
                    title: '订单金额',
                    dataIndex: 'ordAmount',
                    key: 'ordAmount',
                    width: 140,
                },
                {
                    title: '签订日期',
                    dataIndex: 'signDate',
                    key: 'signDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '状态',
                    dataIndex: 'ordStatus',
                    key: 'ordStatus',
                    width: 140,
                    render: (text, record) => (Utils.getOptionName('项目管理', '订单状态', text, true, this)),
                },
                {
                    title: '更多操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目'><Icon type={Common.iconDetail} /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目'><Icon type={Common.iconRemove} /></a>
                        </span>
                    ),
                }
            ];
        } else {
            columns = [
                {
                    title: '编号',
                    dataIndex: 'ordCode',
                    key: 'ordCode',
                    width: 140,
                },
                {
                    title: '名称',
                    dataIndex: 'ordName',
                    key: 'ordName',
                    width: 140,
                },
                {
                    title: '最终用户',
                    dataIndex: 'realCust',
                    key: 'realCust',
                    width: 140,
                },
                {
                    title: '交付城市',
                    dataIndex: 'delivCity',
                    key: 'delivCity',
                    width: 140,
                },
                {
                    title: '订单类型',
                    dataIndex: 'ordType',
                    key: 'ordType',
                    width: 140,
                },
                {
                    title: '开始日期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '结束日期',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '业务类型',
                    dataIndex: 'biziType',
                    key: 'biziType',
                    width: 140,
                },
                {
                    title: '更多操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目'><Icon type={Common.iconDetail} /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目'><Icon type={Common.iconRemove} /></a>
                        </span>
                    ),
                }
            ]
        };

        var recordSet = this.state.orderSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.orderSet.totalRow, pageSize: this.state.orderSet.pageRow,
            current: this.state.orderSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        var orderTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['proj-order/retrieve', 'proj-order/remove']} />
                <OrderFilter ref="OrderFilter" moreFilter={moreFilter} />

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加合同" onClick={this.handleCreate} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            <RadioGroup value={this.state.viewType} style={{ marginLeft: '16px' }} onChange={this.onChangeView}>
                                <RadioButton value="1">基本信息</RadioButton>
                                <RadioButton value="2">订单类型</RadioButton>
                            </RadioGroup>
                        </div>
                        {
                            moreFilter ?
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                    <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                </div> :
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Search placeholder="查询(订单编号/订单名称)" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />
                                    <Button title="更多条件" onClick={this.showMoreFilter} style={{ marginLeft: '8px' }}>更多条件</Button>
                                </div>
                        }
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>;

        var page = null;
        if (this.state.action === 'create') {
            page = <CreateProjOrderPage onBack={this.onGoBack} />;
        }
        else if (this.state.action === 'update') {
            page =
                <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                    <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                        <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                        </TabPane>
                        <TabPane tab="修改订单" key="2" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            <UpdateProjOrderPage onBack={this.onGoBack} order={this.state.order} />
                        </TabPane>
                        <TabPane tab="订单项" key="3" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            <OrderItemPage onBack={this.onGoBack} order={this.state.order} />
                        </TabPane>
                        <TabPane tab="折让" key="4" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            <OrderDiscPage onBack={this.onGoBack} order={this.state.order} />
                        </TabPane>
                    </Tabs>
                </div>;
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {orderTable}
                {page}
            </div>
        );
    }
});

module.exports = ProjOrderPage;




