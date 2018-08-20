﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal } from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var CorpStaffStore = require('./data/CorpStaffStore.js');
var CorpStaffActions = require('./action/CorpStaffActions');
import CreateCorpStaffPage from './Components/CreateCorpStaffPage';
import UpdateCorpStaffPage from './Components/UpdateCorpStaffPage';

var CorpStaffPage = React.createClass({
    getInitialState: function () {
        return {
            CorpStaffSet: {
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

    mixins: [Reflux.listenTo(CorpStaffStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            CorpStaffSet: data
        });
    },

    // 刷新
    handleQueryClick: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.setState({ loading: true });
        this.state.CorpStaffSet.operation = '';
        CorpStaffActions.retrieveCorpStaff(corpUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.setState({ loading: true });
        CorpStaffActions.initCorpStaff(corpUuid);
    },

    handleOpenCreateWindow: function () {
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        this.refs.createWindow.clear(corpUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (CorpStaff, event) {
        if (CorpStaff != null) {
            this.refs.updateWindow.initPage(CorpStaff);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete: function (CorpStaff, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的关系人',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, CorpStaff)
        });
    },

    onClickDelete2: function (CorpStaff) {
        this.setState({ loading: true });
        this.state.CorpStaffSet.operation = '';
        CorpStaffActions.deleteCorpStaff(CorpStaff.uuid);
    },

    render: function (corpUuid) {
        var recordSet = this.state.CorpStaffSet.recordSet;

        const columns = [
            {
                title: '用户姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 110,
            },
            {
                title: '职位',
                dataIndex: 'jobTitle',
                key: 'jobTitle',
                width: 110,
            },
            {
                title: '办公地址',
                dataIndex: 'officeLoc',
                key: 'officeLoc',
                width: 300,
            },
            /*{
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
                title: '职务说明',
                dataIndex: 'jobDesc',
                key: 'jobDesc',
                width: 140,
            },*/
            {
                title: ' ',
                key: 'action',
                width: 70,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改关系人'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除关系人'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_corp_staff/retrieve', 'hr_corp_staff/remove']} />
                    <div className='toolbar-table'>
                        <Button icon={Common.iconAdd} type="primary" title="增加关系人" onClick={this.handleOpenCreateWindow} />
                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>

                <CreateCorpStaffPage ref="createWindow" />
                <UpdateCorpStaffPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = CorpStaffPage;
