'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var BranchStore = require('../data/BranchStore.js');
var BranchActions = require('../action/BranchActions');
import CreateBranchPage from './CreateBranchPage';
import UpdateBranchPage from './UpdateBranchPage';

var filterValue = '';
var BranchPage = React.createClass({
    getInitialState: function () {
        return {
            branchSet: {
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

    mixins: [Reflux.listenTo(BranchStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            branchSet: data
        });
    },

    // 刷新
    handleQueryClick: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.setState({ loading: true });
        this.state.branchSet.operation = '';
        BranchActions.retrieveHrBranch(corpUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.setState({ loading: true });
        BranchActions.initHrBranch(corpUuid);
    },

    handleOpenCreateWindow: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.refs.createWindow.clear(corpUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (branch, event) {
        if (branch != null) {
            this.refs.updateWindow.initPage(branch);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (branch, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的分公司 【' + branch.branchName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, branch)
        });
    },

    onClickDelete2: function (branch) {
        this.setState({ loading: true });
        this.state.branchSet.operation = '';
        BranchActions.deleteHrBranch(branch.uuid);
    },

    handleSelectClick: function (branch) {
        this.props.selectsRole(branch);
    },

    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.branchSet.recordSet, filterValue);
        const columns = [
            {
                title: '类型',
                dataIndex: 'branchType',
                key: 'branchType',
                width: 90,
                render: (text, record) => (Utils.getOptionName('HR系统', '分公司类型', record.branchType, false, this)),
            },
            {
                title: '公司名称',
                dataIndex: 'branchName',
                key: 'branchName',
                width: 160,
            },
            {
                title: '城市',
                dataIndex: 'branchCity',
                key: 'branchCity',
                width: 80,
            },
            {
                title: '办公地址',
                dataIndex: 'branchLoc',
                key: 'branchLoc',
                width: 160,
            },
            {
                title: '总经理',
                dataIndex: 'manager',
                key: 'manager',
                width: 80,
            },
            {
                title: '联络人',
                dataIndex: 'contact',
                key: 'contact',
                width: 80,
            },
            {
                title: '注册资金',
                dataIndex: 'capital',
                key: 'capital',
                width: 90,
            },
            {
                title: '交易总额',
                dataIndex: 'trdAmount',
                key: 'trdAmount',
                width: 90,
            },
            {
                title: '',
                key: 'action',
                width: 90,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改分公司信息'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除分公司'><Icon type={Common.iconRemove} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleSelectClick.bind(this, record)} title='人员维护'><Icon type={Common.iconUser} /></a>
                    </span>
                ),
            }
        ];

        return (
            <div className='grid-page' style={{ padding: '58px 0 0 0' }}>
                <div style={{ margin: '-58px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加事业群" onClick={this.handleOpenCreateWindow} />
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

                <CreateBranchPage ref="createWindow" />
                <UpdateBranchPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = BranchPage;

