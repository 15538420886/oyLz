'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;
import ProjContext from '../../../proj/ProjContext.js'
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var GroupMemberStore = require('./data/GroupMemberStore');
var GroupMemberActions = require('./action/GroupMemberActions');
import ProjCodeMap from '../../lib/ProjCodeMap';
import CodeMap from '../../../hr/lib/CodeMap';
import GroupMemberFilter from './Components/GroupMemberFilter';
import ProjInfoSelect from '../../lib/Components/ProjInfoSelect';

var pageRows = 10;
var GroupMemberPage = React.createClass({
    getInitialState: function () {
        return {
            GroupMemberSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            action: 'query',
            loading: false,
            GroupMember: null,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },
    mixins: [Reflux.listenTo(GroupMemberStore, "onServiceComplete"), CodeMap(), ProjCodeMap()],
    onServiceComplete: function (data) {
        if (data.operation === 'cache') {
            var ff = data.filter.grpUuid;

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if (this.state.moreFilter) {
                var mp = this.refs.GroupMemberFilter;
                if (mp !== null && typeof (mp) !== 'undefined') {
                    mp.state.projDisp = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            GroupMemberSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.grpUuid = ProjContext.selectedGroup.uuid;
        GroupMemberActions.retrieveGroupMemberPage(this.state.filter, this.state.GroupMemberSet.startPage, pageRows);
    },


    // 刷新
    handleQueryClick: function (event) {
        this.setState({ loading: true });
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.grpUuid = ProjContext.selectedGroup.uuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        GroupMemberActions.retrieveGroupMemberPage(this.state.filter, this.state.GroupMemberSet.startPage, pageRows);
    },


    showMoreFilter: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    onChangePage: function (pageNumber) {
        this.state.GroupMemberSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onChangeFilter: function (e) {
        this.setState({ filterValue: e.target.value });
    },

    handleOnSelectedGroup: function (value) {
        this.state.filterValue = value;
        this.setState({
            loading: this.state.loading
        });
        this.state.filter = {};
        var filterValue = this.state.filterValue;
        this.state.filter.projUuid = filterValue;
        this.handleQueryClick();
    },

    onMoreSearch: function () {
        var filter = this.refs.GroupMemberFilter.state.GroupMember;
        console.log(filter)
        if (filter.beginMonth !== null && filter.beginMonth !== '') {
            filter.date1 = filter.beginMonth + '01';
            filter.date2 = filter.beginMonth + '31';
        } else {
            filter.beginDate1 = '';
            filter.beginDate2 = '';
        }

        this.state.filter = filter;
        this.handleQueryClick();
    },

    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var corpUuid = window.loginData.compUser.corpUuid;
        const columns = [
            {
                title: '员工编号',
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
                title: '人员级别',
                dataIndex: 'userLevel',
                key: 'userLevel',
                width: 140,
                render: (text, record) => (this.getLevelName(corpUuid, record.userLevel)),
            },
            {
                title: '承担角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140,
            },
            {
                title: '客户定级',
                dataIndex: 'projLevel',
                key: 'projLevel',
                width: 140,
                //render: (text, record) => (this.getLevelName(corpUuid, record.userLevel)),
            },
            {
                title: '结算单价',
                dataIndex: 'userPrice',
                key: 'userPrice',
                width: 140,
            },
            {
                title: '入组日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
        ]

        var grpUuid = ProjContext.selectedGroup.uuid;
        var recordSet = this.state.GroupMemberSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {
            showQuickJumper: true, total: this.state.GroupMemberSet.totalRow, pageSize: this.state.GroupMemberSet.pageRow,
            current: this.state.GroupMemberSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage
        };
        var contactTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', overflow: 'auto', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve1']} />
                <GroupMemberFilter ref="GroupMemberFilter" moreFilter={moreFilter} />

                <div style={{ margin: '8px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                        </div>
                        {
                            moreFilter ?
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                    <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                </div> :
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <ProjInfoSelect parentUuid={grpUuid} name='projName' id='projName' placeholder="选择 ( 项目组 )" style={{ textAlign: 'left', width: Common.searchWidth }} onSelect={this.handleOnSelectedGroup} />
                                    <Button title="更多条件" onClick={this.showMoreFilter} style={{ marginLeft: '8px' }}>更多条件</Button>
                                </div>
                        }
                    </div>
                </div>
                <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
            </div>;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                {contactTable}
            </div>
        );
    }
});

module.exports = GroupMemberPage;

