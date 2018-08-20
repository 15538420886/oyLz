'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var DeptStore = require('../data/DeptStore.js');
var DeptActions = require('../action/DeptActions');
import CreateDeptPage from './CreateDeptPage';
import UpdateDeptPage from './UpdateDeptPage';

var filterValue = '';
var expandedRows = [];
var DeptTablePage = React.createClass({
    getInitialState: function () {
        return {
            deptSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
            corpUuid: window.loginData.compUser.corpUuid,
            rootNodes: [],
            filterValue: '',
            filterNodes: []
        }
    },

    mixins: [Reflux.listenTo(DeptStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            deptSet: data,
            rootNodes: [],
            filterValue: '',
            filterNodes: []
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        this.state.deptSet.operation = '';
        DeptActions.retrieveHrDept(this.state.corpUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        DeptActions.initHrDept(this.state.corpUuid);
    },

    handleOpenCreateWindow: function (event) {
        this.refs.createWindow.clear(this.state.corpUuid, '');
        this.refs.createWindow.toggle();
    },
    onClickAddChild: function (dept, event) {
        if (dept != null) {
            this.refs.createWindow.clear(this.state.deptSet.corpUuid, dept.uuid);
            this.refs.createWindow.toggle();
        }
    },

    onClickUpdate: function (dept, event) {
        if (dept != null) {
            this.refs.updateWindow.initPage(dept);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (dept, event) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的部门 【' + dept.deptName + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.onClickDelete2.bind(this, dept)
        });
    },

    onClickDelete2: function (dept) {
        this.setState({ loading: true });
        this.state.deptSet.operation = '';
        DeptActions.deleteHrDept(dept.uuid);
    },

    preCrtNode: function (data, recordSet) {
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if (data.deptCode === '' || data.deptCode == data.deptName) {
            node.title = data.deptName;
        }
        else {
            node.title = data.deptName + '(' + data.deptCode + ')';
        }

        node.deptCode = data.deptCode;
        node.deptName = data.deptName;
        node.deptDesc = data.deptDesc;
        node.deptLoc = data.deptLoc;
        return node;
    },

    onExpandedRowsChange: function (expandedRows2) {
        expandedRows = expandedRows2;
    },
    //选择角色功能
    handleSelectClick: function (dept) {
        this.props.selectsRole(dept);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        if (this.state.rootNodes.length === 0) {
            this.state.rootNodes = Common.initTreeNodes(this.state.deptSet.recordSet, this.preCrtNode);
            this.state.rootNodes.map((item, i) => {
                if (item.key === '__unknow') {
                    item.deptCode = '未分类';
                }
            });
        }

        if (filterValue !== '') {
            if (this.state.filterValue !== filterValue) {
                this.state.filterNodes = Common.filter(this.state.deptSet.recordSet, filterValue);
                this.state.filterValue = filterValue;
            }
        }

        var recordSet = (filterValue !== '') ? this.state.filterNodes : this.state.rootNodes;
        const columns = [
            {
                title: '机构名称',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 120,
            },
            {
                title: '机构代码',
                dataIndex: 'deptCode',
                key: 'deptCode',
                width: 120,
            },
            {
                title: '机构描述',
                dataIndex: 'deptDesc',
                key: 'deptDesc',
                width: 160,
            },
            {
                title: '办公地址',
                dataIndex: 'deptLoc',
                key: 'deptLoc',
                width: 160,
            },
            {
                title: '',
                key: 'action',
                width: 100,
                // 判断 __unknow
                render: (text, record) => (
                    (record.key != '__unknow') ?
                        <span>
                            {filterValue !== '' ? null : <a href="#" onClick={this.onClickAddChild.bind(this, record.object)} title='增加下级部门'><Icon type={Common.iconAddChild} /></a>}
                            {filterValue !== '' ? null : <span className="ant-divider" />}
                            <a href="#" onClick={this.onClickUpdate.bind(this, record.object)} title='修改部门信息'><Icon type={Common.iconUpdate} /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record.object)} title='删除部门'><Icon type={Common.iconRemove} /></a>

                            <span className="ant-divider" />
                            <a href="#" onClick={this.handleSelectClick.bind(this, record)} title='人员维护'><Icon type={Common.iconUser} /></a>
                        </span>
                        : null
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加部门" onClick={this.handleOpenCreateWindow} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.key} defaultExpandedRowKeys={expandedRows} onExpandedRowsChange={this.onExpandedRowsChange} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
                <CreateDeptPage ref="createWindow" />
                <UpdateDeptPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = DeptTablePage;