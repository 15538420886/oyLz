'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var DeptStaffStore = require('./data/DeptStaffStore');
var DeptStaffActions = require('./action/DeptStaffActions');
import CreateDeptStaffPage from './Components/CreateDeptStaffPage';
import UpdateDeptStaffPage from './Components/UpdateDeptStaffPage';

var filterValue = '';
var DeptStaffPage = React.createClass({
    getInitialState: function () {
        return {
            deptStaffSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
            deptUuid: this.props.dept.key,
            corpUuid: window.loginData.compUser.corpUuid,
        }
    },

    mixins: [Reflux.listenTo(DeptStaffStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            deptStaffSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        this.state.deptStaffSet.operation = '';
        DeptStaffActions.retrieveHrDeptStaff(this.state.deptUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        DeptStaffActions.initHrDeptStaff(this.props.dept.key);
    },

    //接受新的props
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.dept.key == this.props.dept.key) {
            return;
        }

        this.state.deptUuid = nextProps.dept.key;
        this.setState({ loading: true });
        this.state.deptStaffSet.operation = '';
        DeptStaffActions.retrieveHrDeptStaff(nextProps.dept.key);
    },

    handleOpenCreateWindow: function (event) {
        this.refs.createWindow.clear(this.state.corpUuid, this.state.deptUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (deptStaff, event) {
        if (deptStaff != null) {
            this.refs.updateWindow.initPage(deptStaff);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (deptStaff, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的人员 【' + deptStaff.perName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, deptStaff)
        });
    },

    onClickDelete2: function (deptStaff) {
        this.setState({ loading: true });
        this.state.deptStaffSet.operation = '';
        DeptStaffActions.deleteHrDeptStaff(deptStaff.uuid);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    render: function () {
        var recordSet = Common.filter(this.state.deptStaffSet.recordSet, filterValue);
        const columns = [
            {
                title: '用户姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 120,
            },
            {
                title: '职位',
                dataIndex: 'jobTitle',
                key: 'jobTitle',
                width: 140,
            },
            {
                title: '电话',
                dataIndex: 'phoneno',
                key: 'phoneno',
                width: 140,
            },
            {
                title: '电子邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 140,
            },
            {
                title: '',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员信息'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        return (
            <div className='grid-page' style={{ padding: '58px 0 0 0' }}>
                <div style={{ margin: '-58px 0 0 0' }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-dept-staff/retrieve', 'hr-dept-staff/remove']} />
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加人员" onClick={this.handleOpenCreateWindow} />
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

                <CreateDeptStaffPage ref="createWindow" />
                <UpdateDeptStaffPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = DeptStaffPage;