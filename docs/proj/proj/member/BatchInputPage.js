'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Spin, Input, Pagination, Upload } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjMemberStore = require('./data/ProjMemberStore');
var ProjMemberActions = require('./action/ProjMemberActions');

import UploadProjMemberPage from './Components/UploadProjMemberPage';
import CreateProjMemberPage from './Components/CreateProjMemberPage';
import CodeMap from '../../../hr/lib/CodeMap';
import ProjCodeMap from '../../lib/ProjCodeMap';
import SelectProjTeam from '../../lib/Components/SelectProjTeam';
var ProjContext = require('../../ProjContext');

import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';


var pageRows = 10;
var BatchInputPage = React.createClass({
    getInitialState: function () {
        return {
            projMemberSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            action: 'query',
            loading: false,
            projMember: null,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },
    mixins: [Reflux.listenTo(ProjMemberStore, "onServiceComplete"), CodeMap(), XlsTempFile(), ProjCodeMap()],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            var ff = data.filter.teamUuid;

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if (this.state.moreFilter) {
                var mp = this.refs.ProjMemberFilter;
                if (mp !== null && typeof (mp) !== 'undefined') {
                    mp.state.projMember = this.state.filter;
                }
            }
            this.setState({ loading: true });
            var filter = this.state.filter;
            filter.projUuid = ProjContext.selectedProj.uuid;
            filter.corpUuid = window.loginData.compUser.corpUuid;
            this.state.filter.more = data.filter.more;
            ProjMemberActions.initProjMember(filter, this.state.projMemberSet.startPage, pageRows);
            return;
        }
        this.setState({
            loading: false,
            projMemberSet: data
        });

    },

    componentDidMount: function () {
        var projUuid = ProjContext.selectedProj.uuid;
        ProjMemberActions.getCacheData(projUuid);
    },

    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var filter = this.state.filter;
        filter.projUuid = ProjContext.selectedProj.uuid;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        ProjMemberActions.retrieveProjMemberPage(filter, this.state.projMemberSet.startPage, pageRows);
    },

    handleUploadFile: function () {
        this.setState({ action: 'upload' });
    },

    onChangePage: function (pageNumber) {
        this.state.projMemberSet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },

    handleTempDown: function (e) {
        this.downXlsTempFile(XlsConfig.projMemberFields);
    },

    handleCreate: function (e) {
        this.setState({ action: 'create' });
    },

    onGoBack: function () {
        this.setState({ action: 'query' });
    },

    render: function () {
        var visible = (this.state.action === 'query') ? '' : 'none';
        var projUuid = ProjContext.selectedProj.uuid;
        var corpUuid = window.loginData.compUser.corpUuid;
        var recordSet = Common.filter(this.state.projMemberSet.recordSet, this.state.filterValue);
        const columns = [
            {
                title: '员工号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 140,
            },
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 140,
            },
            {
                title: '员工级别',
                dataIndex: 'userLevel',
                key: 'userLevel',
                width: 140,
                render: (text, record) => (this.getLevelName(corpUuid, record.userLevel)),
            },
            {
                title: '客户定级',
                dataIndex: 'projLevel',
                key: 'projLevel',
                width: 140,
            },
            {
                title: '技术岗位',
                dataIndex: 'techLevel',
                key: 'techLevel',
                width: 140,
            },
            {
                title: '小组',
                dataIndex: 'teamUuid',
                key: 'teamUuid',
                width: 140,
                render: (text, record) => (this.getTeamName(projUuid, text))
            },
            {
                title: '入组日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '离组日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
        ];
        var pag = {
            showQuickJumper: true, total: this.state.projMemberSet.totalRow, pageSize: this.state.projMemberSet.pageRow, current: this.state.projMemberSet.startPage,
            size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        var projMemberTable =
            <div className='grid-page' style={{ overflow: 'hidden', display: visible }}>

                <ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve']} />
                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <Button icon={Common.iconAdd} type="primary" title="增加组员" onClick={this.handleCreate} />
                        <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                        <Button icon="upload" title="导入数据" onClick={this.handleUploadFile} style={{ marginLeft: '4px' }} />
                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                    </div>
                </div>
            </div>
        var page = null;
        if (this.state.action === 'upload') {
            page = <UploadProjMemberPage onBack={this.onGoBack} />
        } else if (this.state.action === 'create') {
            page = <CreateProjMemberPage onBack={this.onGoBack} />
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {projMemberTable}
                {page}
            </div>
        );
    }
});


module.exports = BatchInputPage;

