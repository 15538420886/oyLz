'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Spin, Input, Pagination, Form, Tabs } from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var EmpWorkLogStore = require('../data/EmpWorkLogStore');
var WorkLogActions = require('../action/WorkLogActions');
import DetailPage from './DetailPage';

var DetailsWorkLogPage = React.createClass({
    getInitialState: function () {
        return {
            workLogSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },

            loading: false,
        }
    },

    mixins: [Reflux.listenTo(EmpWorkLogStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            workLogSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        var filter = { userUuid: this.props.userUuid }
        WorkLogActions.retrieveEmpWorkLog(filter);
    },
    onClickDetails: function (workLog, event) {
        if (workLog != null) {
            this.refs.DetailPage.initPage(workLog);
        }
    },
    goBack: function () {
        this.props.onBack();
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    render: function (corpUuid) {
        const columns = [
            {
                title: '变更类型',
                dataIndex: 'chgType',
                key: 'chgType',
                width: 100,
                render: (text, record) => (Utils.getOptionName('HR系统', '薪资调整类型', record.chgType, false, this)),
            },
            {
                title: '申请日期',
                dataIndex: 'applyDate',
                key: 'applyDate',
                width: 100,
            },
            {
                title: '调后说明',
                dataIndex: 'aftMemo',
                key: 'aftMemo',
                width: 300,
            },
            {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 100,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '更多操作',
                key: 'action',
                width: 70,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='查看'><Icon type='bars' /></a>
                    </span>
                ),
            }
        ];

        var recordSet = this.state.workLogSet.recordSet;
        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="工作日志详情" key="2" style={{ width: '100%', height: '100%' }}>
                        <div className='grid-page' style={{ padding: '8px 0 0 0' }}>
                            <div style={{ padding: '12px', height: '100%', overflowY: 'auto' }}>
                                <ServiceMsg ref='mxgBox' svcList={['emp_work_log/retrieve']} />
                                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                                <div style={{ width: '640px', padding: '20px 0 12px 0' }}>
                                    <DetailPage ref="DetailPage" />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = DetailsWorkLogPage;
