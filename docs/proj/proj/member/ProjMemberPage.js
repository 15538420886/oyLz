'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Spin, Input, Pagination } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjMemberStore = require('./data/ProjMemberStore');
var ProjMemberActions = require('./action/ProjMemberActions');

import LeaveProjMemberPage from './Components/LeaveProjMemberPage';
import UpdateProjMemberPage from './Components/UpdateProjMemberPage';
import EnterProjMemberPage from './Components/EnterProjMemberPage';
import CreateProjMemberPage from './Components/CreateProjMemberPage';
import CodeMap from '../../../hr/lib/CodeMap';
import ProjCodeMap from '../../lib/ProjCodeMap';
import ProjMemberFilter from './Components/ProjMemberFilter';
import SelectProjTeam from '../../lib/Components/SelectProjTeam';
var ProjContext = require('../../ProjContext');

var pageRows = 10;
var ProjMemberPage = React.createClass({
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

            // 内部调度成员时使用
            poolUuid: '',
            grpUuid: '',
        }
    },
    mixins: [Reflux.listenTo(ProjMemberStore, "onServiceComplete"), CodeMap(), ProjCodeMap()],
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
    showMoreFilter: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    filterToggle: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    onMoreSearch: function () {
        var filter = this.refs.ProjMemberFilter.state.projMember;
        if (filter.beginMonth !== null && filter.beginMonth !== '') {
            filter.date1 = filter.beginDate + '01';
            filter.date2 = filter.beginDate + '31';
        } else {
            filter.date1 = '';
            filter.date2 = '';
        }

        this.state.filter = filter;
        this.handleQueryClick();
    },
    onChangePage: function (pageNumber) {
        this.state.projMemberSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onClickLeave: function (projMember, event) {
        this.setState({ projMember: projMember, action: 'leave' });
    },
    onClickUpdate: function (projMember, event) {
        this.setState({ projMember: projMember, action: 'update' });
    },
    onClickEnter: function (projMember, event) {
        this.setState({ projMember: projMember, action: 'enter' });
    },
    handleOnSelectedTeam: function (value) {
        this.state.filterValue = value;
        this.setState({
            loading: this.state.loading
        });
        this.state.filter = {};
        var filterValue = this.state.filterValue;
        this.state.filter.teamUuid = filterValue;
        this.handleQueryClick();
    },
    handleAddMember: function (e) {
        var poolUuid = ProjContext.selectedProj.contUuid;
        if (!poolUuid) {
            Common.warnMsg("项目组[" + ProjContext.selectedProj.projName + "]不属于资源池");
            return;
        }

        this.setState({ poolUuid: poolUuid, grpUuid: '', action: 'create' });
    },
    handleAddMember2: function (projMember, e) {
        var grpUuid = ProjContext.selectedProj.parentUuid
        if (!grpUuid) {
            Common.warnMsg("项目组[" + ProjContext.selectedProj.projName + "]不属于项目群");
            return;
        }

        this.setState({ poolUuid: '', grpUuid: grpUuid, action: 'create' });
    },

    render: function () {
        var recordSet = this.state.projMemberSet.recordSet;

        var proj = ProjContext.selectedProj;
        var projUuid = proj.uuid;
        var corpUuid = window.loginData.compUser.corpUuid;
        // contUuid=资源池编号，induType=是否资源池内部项目
        var resProj = (proj.induType === '1' && proj.contUuid !== '' && proj.contUuid !== null);

        var columns = null;
        if (resProj) {
            // 内部项目组
            columns = [
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
                    title: '承担角色',
                    dataIndex: 'roleName',
                    key: 'roleName',
                    width: 240,
                },
                {
                    title: '入组日期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickLeave.bind(this, record)} title='人员离组'><Icon type="user-delete" /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='小组调整'><Icon type="team" /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickEnter.bind(this, record)} title='人员定级'><Icon type="star" /></a>
                        </span>
                    ),
                }
            ];
        }
        else {
            columns = [
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
                    title: '承担角色',
                    dataIndex: 'roleName',
                    key: 'roleName',
                    width: 240,
                },
                {
                    title: '入组日期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickLeave.bind(this, record)} title='人员离组'><Icon type="user-delete" /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='小组调整'><Icon type="team" /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickEnter.bind(this, record)} title='人员定级'><Icon type="star" /></a>
                        </span>
                    ),
                }
            ];
        }

        var btnAdd = null;
        if (resProj) {
            btnAdd = <Button icon={Common.iconAdd} type="primary" title="资源池内调度" onClick={this.handleAddMember} style={{ marginRight: '4px' }} />;
        }

        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.projMemberSet.totalRow, pageSize: this.state.projMemberSet.pageRow, current: this.state.projMemberSet.startPage,
            size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        var moreFilter = this.state.moreFilter;

        var MemberTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve']} />
                <ProjMemberFilter ref="ProjMemberFilter" moreFilter={moreFilter} />
                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            {btnAdd}
                            <Button icon={Common.iconAdd} title="项目群内调度" onClick={this.handleAddMember2} style={{ marginRight: '4px' }} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} />
                        </div>
                        {
                            moreFilter ?
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                    <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                </div> :
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <SelectProjTeam placeholder="选择 ( 小组 )" style={{ textAlign: 'left', width: Common.searchWidth }} projUuid={projUuid} name="teamUuid" id="teamUuid" value={this.state.filterValue} onSelect={this.handleOnSelectedTeam} />

                                    <Button title="更多条件" onClick={this.showMoreFilter} style={{ marginLeft: '8px' }}>更多条件</Button>
                                </div>
                        }

                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>

        var page = null;
        if (this.state.action === 'leave') {
            page = <LeaveProjMemberPage onBack={this.onGoBack} projMember={this.state.projMember} />
        }
        else if (this.state.action === 'update') {
            page = <UpdateProjMemberPage onBack={this.onGoBack} projMember={this.state.projMember} />
        }
        else if (this.state.action === 'enter') {
            page = <EnterProjMemberPage onBack={this.onGoBack} projMember={this.state.projMember} />
        }
        else if (this.state.action === 'create') {
            page = <CreateProjMemberPage poolUuid={this.state.poolUuid} grpUuid={this.state.grpUuid} onBack={this.onGoBack} />
        }

        return (
            <div>
                {MemberTable}
                {page}
            </div>
        );
    }
});

module.exports = ProjMemberPage;





