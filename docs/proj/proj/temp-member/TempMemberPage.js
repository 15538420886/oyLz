'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Spin, Input, Pagination } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjTempMemberStore = require('./data/ProjTempMemberStore');
var ProjTempMemberActions = require('./action/ProjTempMemberActions');

import CodeMap from '../../../hr/lib/CodeMap';
import ProjCodeMap from '../../lib/ProjCodeMap';
var ProjContext = require('../../ProjContext');
import SelectProjTeam from '../../lib/Components/SelectProjTeam';
import CreateTempMemberPage from './Components/CreateTempMemberPage';
import LeaveTempMemberPage from './Components/LeaveTempMemberPage';
import UpdateTempMemberPage from './Components/UpdateTempMemberPage';
import EnterTempMemberPage from './Components/EnterTempMemberPage';

var filterValue = '';
var TempMemberPage = React.createClass({
    getInitialState: function () {
        return {
            projMemberSet: {
                recordSet: [],
                errMsg: ''
            },
            action: 'query',
            loading: false,
            tempMember: null,
        }
    },
    mixins: [Reflux.listenTo(ProjTempMemberStore, "onServiceComplete"), CodeMap(), ProjCodeMap()],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projMemberSet: data
        });
    },
    componentDidMount: function () {
        this.setState({ loading: true });
        var projUuid = ProjContext.selectedProj.uuid;
        var filter = { projUuid: projUuid, manStatus:'入组' };
        ProjTempMemberActions.initProjTempMember(filter);
    },
    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var projUuid = ProjContext.selectedProj.uuid;
        var filter = { projUuid: projUuid, manStatus: '入组' };
        ProjTempMemberActions.retrieveProjTempMember(filter);
    },

    
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    
    onClickLeave: function (tempMember, event) {
        this.setState({ tempMember: tempMember, action: 'leave' });
    },
    onClickUpdate: function (tempMember, event) {
        this.setState({ tempMember: tempMember, action: 'update' });
    },
    onClickEnter: function (tempMember, event) {
        this.setState({ tempMember: tempMember, action: 'enter' });
    },
    handleAddMember: function (e) {
        this.setState({ action: 'create' });
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.projMemberSet.recordSet, filterValue);

        var proj = ProjContext.selectedProj;
        var projUuid = proj.uuid;
        var corpUuid = window.loginData.compUser.corpUuid;

        var columns = [
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
                title: '承担角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 240,
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
        
        var visible = (this.state.action === 'query') ? '' : 'none';

        var MemberTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['proj_temp_member/retrieve']} />

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconAdd} type="primary" title="增加组员" onClick={this.handleAddMember} style={{ marginRight: '4px' }} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>

        var page = null;
        if (this.state.action === 'create') {
            page = <CreateTempMemberPage onBack={this.onGoBack} />
        }
        else if (this.state.action === 'leave') {
            page = <LeaveTempMemberPage onBack={this.onGoBack} tempMember={this.state.tempMember} />
        }
        else if (this.state.action === 'update') {
            page = <UpdateTempMemberPage onBack={this.onGoBack} tempMember={this.state.tempMember} />
        }
        else if (this.state.action === 'enter') {
            page = <EnterTempMemberPage onBack={this.onGoBack} tempMember={this.state.tempMember} />
        }

        return (
            <div>
                {MemberTable}
                {page}
            </div>
        );
    }
});

module.exports = TempMemberPage;





