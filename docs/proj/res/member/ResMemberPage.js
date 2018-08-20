'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input, Radio, Spin, Tabs } from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjContext = require('../../ProjContext');
var ResMemberStore = require('./data/ResMemberStore');
var ResMemberActions = require('./action/ResMemberActions');

var ResTeamActions = require('../team/action/ResTeamActions');
var ResTeamStore = require('../team/data/ResTeamStore');
import ResMemberFilter from './Components/ResMemberFilter';
import CodeMap from '../../../hr/lib/CodeMap';

import CreateResMemberPage from './Components/CreateResMemberPage';
import CreateOutStaffPage from './Components/CreateOutStaffPage';
import UpdateResMemberPage from './Components/UpdateResMemberPage';
import BatchCreateResMemberPage from './Components/BatchCreateResMemberPage';
import ChangeResMemberPage from './Components/ChangeResMemberPage';
import LeaveResMemberPage from './Components/LeaveResMemberPage';

import CreateResTeamPage from '../team/Components/CreateResTeamPage';
import UpdateResTeamPage from '../team/Components/UpdateResTeamPage';

var pageRows = 10;
var ResMemberPage = React.createClass({
    getInitialState: function () {
        return {
            resMemberSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 10,
                operation: '',
                errMsg: ''
            },
            resTeamSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
            teamLoading: false,
            viewType: '1',
            queryScope: 'all',
            resMember: {},
            team: {},

            moreFilter: false,
            filterValue: '',
            filter: {},

            action: 'team',
        }
    },

    mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), Reflux.listenTo(ResTeamStore, "onServiceComplete2"), CodeMap()],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            resMemberSet: data
        });
    },
    onServiceComplete2: function (data) {
        this.setState({
            teamLoading: false,
            resTeamSet: data
        });
    },

    handleQueryClickTeam: function () {
        var poolUuid = ProjContext.selectedPool.uuid;
        this.setState({ teamLoading: true });
        this.state.resTeamSet.operation = '';
        ResTeamActions.retrieveResTeam(poolUuid);
    },

    // 第一次加载
    componentDidMount: function () {
        var poolUuid = ProjContext.selectedPool.uuid;
        this.setState({ teamLoading: true });
        ResTeamActions.initResTeam(poolUuid);
    },
    onChangeView: function (e) {
        this.setState({ viewType: e.target.value });
    },
    handleCreate: function (e) {
        this.setState({ action: 'create' });
    },
    handleCreateOut: function (e) {
        this.setState({ action: 'createOut' });
    },
    handleCreateTeam: function (e) {
        this.setState({ action: 'createTeam' });
    },
    handleItemClick: function (team, e) {
        if (team) {
            ResMemberActions.clearResMember();
            this.setState({ team: team, action: 'query' });
            this.handleQueryClick();
        }

        e.stopPropagation();
    },
    onClickUpdate: function (resMember, event) {
        if (resMember) {
            this.setState({ resMember: resMember, action: 'update' });
        }
    },
    onClickUpdateTeam: function (team, e) {
        if (team) {
            this.setState({ team: team, action: 'updateTeam' });
        }
        e.stopPropagation();
    },
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    onGoBackTeam: function () {
        this.setState({ action: 'team' });
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.onGoBack();
        }
    },

    onClickDelete: function (resMember, e) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的成员 【' + resMember.uuid + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, resMember)
        });
    },
    onClickDelete2: function (resMember) {
        this.setState({ loading: true });
        this.state.resMemberSet.operation = '';
        ResMemberActions.deleteResMember(resMember.uuid);
    },

    onClickDeleteTeam: function (resTeam, e) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的资源池小组 【' + resTeam.uuid + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDeleteTeam2.bind(this, resTeam)
        });
        e.stopPropagation();
    },
    onClickDeleteTeam2: function (resTeam) {
        this.setState({ loading: true });
        this.state.resTeamSet.operation = '';
        ResTeamActions.deleteResTeam(resTeam.uuid);
    },

    filterToggle: function (event) {
        this.setState({ moreFilter: !this.state.moreFilter });
    },
    onChangePage: function (pageNumber) {
        this.state.resMemberSet.startPage = pageNumber;
        this.setState({ loading: true });
        ResMemberActions.retrieveResMemberPage(this.state.filter, pageNumber, pageRows);
    },
    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },
    handleQueryClick: function () {
        this.state.resMemberSet.startPage = 1;
        this.setState({ loading: true });

        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.poolUuid = ProjContext.selectedPool.uuid;
        filter.teamUuid = this.state.team.uuid;
        filter.more = (this.state.moreFilter ? '1' : '0');
        ResMemberActions.retrieveResMemberPage(filter, 1, this.state.resMemberSet.pageRow);
    },
    onSearch3: function () {
        var filter = this.refs.ResMemberFilterForm.state.filter;
        if (filter.value !== null && filter.value !== '') {
            if (Common.isIncNumber(filter.value)) {
                filter.staffCode = filter.value;
            }
            else {
                filter.perName = filter.value;
            }
        } else {
            filter.staffCode = '';
            filter.perName = '';
        }
        this.state.filter = filter;
        this.handleQueryClick();
    },
    onChangeFilter: function (e) {
        this.setState({ filterValue: e.target.value });
    },
    onSearch: function (value) {
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)) {
            this.state.filter.staffCode = filterValue;
        }
        else {
            this.state.filter.perName = filterValue;
        }
        this.handleQueryClick();
    },
    onChangeScope: function (e) {
        var scope = e.target.value;
        this.setState({ queryScope: scope });

        if (scope === 'all') {
            this.state.filter.resStatus = '';
        }
        else if (scope === 'pool') {
            this.state.filter.resStatus = '资源池';
        }
        else if (scope === 'proj') {
            this.state.filter.resStatus = '项目';
        }
        else if (scope === 'bizi') {
            this.state.filter.resStatus = '事务';
        }
        this.handleQueryClick();
    },

    render: function () {
        var recordSet = this.state.resMemberSet.recordSet;
        var moreFilter = this.state.moreFilter;

        var teamVisible = (this.state.action === 'team') ? '' : 'none';
        var resItem = this.state.resTeamSet.recordSet;
        var len = resItem.length;
        var teamCardList =
            resItem.map((team, i) => {
                return <div key={team.uuid} className='card-div' style={{ width: 300 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.handleItemClick.bind(this, team)} title='点击进入小组成员管理页面'>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{team.teamName}</h3></div>
                        <div className="ant-card-extra">
                            <a href="#" onClick={this.onClickUpdateTeam.bind(this, team)} title='修改'><Icon type={Common.iconUpdate} /></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDeleteTeam.bind(this, team)} title='删除'><Icon type={Common.iconRemove} /></a>
                        </div>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>
                            <p>{team.teamDesc}（{team.tmName}）<Icon type="user" title="成员数量" style={{marginLeft:'10px'}}/> {team.memberCount? team.memberCount : 0}</p>
                        </div>
                    </div>
                </div>
            });
        var cs = Common.getCardMargin(this);
        var teamCard =
            <div className='card-page' style={{ padding: cs.padding, display: teamVisible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['res-team/retrieve', 'res-team/remove']} />

                    <div className='toolbar-card'>
                        <div style={{ float: 'left' }}>
                            <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>共{len}个小组</div>
                            <Icon type="plus-circle-o" onClick={this.handleCreateTeam} title='增加小组' className='toolbar-icon' style={{ color: '#108ee9' }} />
                            <Icon type="reload" onClick={this.handleQueryClickTeam} title='刷新数据' className='toolbar-icon' style={{ paddingLeft: '8px' }} />
                        </div>
                    </div>
                </div>
                {
                    this.state.teamLoading ?
                        <Spin tip="正在努力加载数据..."><div style={{ minHeight: '200px' }}>{teamCardList}</div></Spin>
                        :
                        <div>{teamCardList}</div>
                }
            </div>;

        var opCol = {
            title: '',
            key: 'action',
            width: 90,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新'><Icon type={Common.iconDetail} /></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove} /></a>
                </span>
            ),
        };
        var corpUuid = window.loginData.compUser.corpUuid;
        var columns = [];
        if (this.state.viewType === '1') {
            columns = [
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
                    width: 120,
                },
                {
                    title: '项目名称',
                    dataIndex: 'resName',
                    key: 'resName',
                    width: 140,
                },
                {
                    title: '最高学历',
                    dataIndex: 'eduDegree',
                    key: 'eduDegree',
                    width: 120,
                },
                {
                    title: '毕业院校',
                    dataIndex: 'eduCollege',
                    key: 'eduCollege',
                    width: 140,
                },
                {
                    title: '工作年限',
                    dataIndex: 'workBegin',
                    key: 'workBegin',
                    width: 100,
                    render: (text, record) => (ProjContext.getColumnWorkYears(text)),
                },
                {
                    title: '行业经验',
                    dataIndex: 'induBegin',
                    key: 'induBegin',
                    width: 100,
                    render: (text, record) => (ProjContext.getColumnWorkYears(text)),
                },
                {
                    title: '归属地',
                    dataIndex: 'baseCity',
                    key: 'baseCity',
                    width: 100,
                },
                opCol
            ];
        }
        else if (this.state.viewType === '2') {
            columns = [
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
                    width: 120,
                },
                {
                    title: '公司名称',
                    dataIndex: 'corpName',
                    key: 'corpName',
                    width: 140,
                    render: (text, record) => ((text === null || text === '' || text === undefined) ? record.deptName : text),
                },
                {
                    title: '员工级别',
                    dataIndex: 'empLevel',
                    key: 'empLevel',
                    width: 100,
                    render: (text, record) => (this.getLevelName(corpUuid, record.empLevel)),
                },
                {
                    title: '技术岗位',
                    dataIndex: 'techName',
                    key: 'techUuid',
                    width: 100,
                },
                {
                    title: '管理岗位',
                    dataIndex: 'manName',
                    key: 'manUuid',
                    width: 100,
                },
                {
                    title: '成本',
                    dataIndex: 'userCost',
                    key: 'userCost',
                    width: 100,
                },
                {
                    title: '入职',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 100,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                opCol
            ];
        }
        else{
            columns =[
                {
                    title: '员工编号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 100,
                },
                {
                    title: '姓名',
                    dataIndex: 'perName',
                    key: 'perName',
                    width: 120,
                },
                {
                    title: '状态',
                    dataIndex: 'resStatus',
                    key: 'resStatus',
                    width: 100,
                },
                {
                    title: '项目名称',
                    dataIndex: 'resName',
                    key: 'resName',
                    width: 180,
                },
                {
                    title: '项目地址',
                    dataIndex: 'resLoc',
                    key: 'resLoc',
                    width: 120,
                },
                {
                    title: '入组日期',
                    dataIndex: 'resDate',
                    key: 'resDate',
                    width: 100,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '电话',
                    dataIndex: 'phoneno',
                    key: 'phoneno',
                    width: 100,
                },
                opCol
            ];
        }

        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = { showQuickJumper: true, total: this.state.resMemberSet.totalRow, pageSize: this.state.resMemberSet.pageRow, current: this.state.resMemberSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage };
        var resMemberTable =
            <div className='grid-page' style={{ padding: '8px 0 0 0', display: visible }}>
                <ServiceMsg ref='mxgBox' svcList={['res-member/retrieve', 'res-member/remove']} />
                <ResMemberFilter ref="ResMemberFilterForm" moreFilter={moreFilter} />
                <div>
                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            <div>
                                <Button icon={Common.iconAdd} type="primary" title="增加员工" onClick={this.handleCreate}>员工</Button>
                                <Button icon={Common.iconAdd} title="增加外协" onClick={this.handleCreateOut} style={{ marginLeft: '4px' }}>外协</Button>
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                                <RadioGroup value={this.state.viewType} style={{ marginLeft: '16px' }} onChange={this.onChangeView}>
                                    <RadioButton value="1">经验</RadioButton>
                                    <RadioButton value="2">岗位</RadioButton>
                                    <RadioButton value="3">项目</RadioButton>
                                </RadioGroup>
                            </div>
                        </div>
                        {
                            moreFilter ?
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{ marginRight: '8px' }}>查询</Button>
                                    <Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
                                </div>
                                :
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <RadioGroup value={this.state.queryScope} style={{ marginRight: '16px' }} onChange={this.onChangeScope}>
                                        <RadioButton value="all">所有</RadioButton>
                                        <RadioButton value="pool">资源池</RadioButton>
                                        <RadioButton value="proj">项目</RadioButton>
                                        <RadioButton value="bizi">事务</RadioButton>
                                    </RadioGroup>

                                    <Search placeholder="查询（员工编号/姓名）" onSearch={this.onSearch} value={this.state.filterValue} onChange={this.onChangeFilter} style={{ width: '160px' }} />
                                    <Button title="更多条件" onClick={this.filterToggle} style={{ marginLeft: '8px' }}>更多条件</Button>
                                </div>
                        }
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                    <div style={{ margin: '-44px 0 0 0', width: '100%'}} >
                        <div style={{ float: 'left' }}>
                            <Button key="btnGoBack" onClick={this.onGoBackTeam} >返回资源池</Button>
                        </div>
                    </div>
                </div>
            </div>;
        var page = null;
        if (this.state.action === 'create') {
            page = (
                <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                    <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                        <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                        </TabPane>
                        <TabPane tab="增加成员" key="2" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            <CreateResMemberPage onBack={this.onGoBack} team={this.state.team} />
                        </TabPane>
                        <TabPane tab="批量增加成员" key="3" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            <BatchCreateResMemberPage onBack={this.onGoBack} team={this.state.team} />
                        </TabPane>
                    </Tabs>
                </div>
            );
        } else if (this.state.action === 'createOut') {
            page = <CreateOutStaffPage onBack={this.onGoBack} team={this.state.team} />;
        }
        else if (this.state.action === 'update') {
            var resMember = {};
            Utils.copyValue(this.state.resMember, resMember);
            page = (
                <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                    <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                        <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                        </TabPane>
                        <TabPane tab="修改成员信息" key="2" style={{ width: '100%', height: '100%' }}>
                            <UpdateResMemberPage onBack={this.onGoBack} resMember={resMember} />
                        </TabPane>
                        <TabPane tab="资源池变更" key="3" style={{ width: '100%', height: '100%' }}>
                           <ChangeResMemberPage onBack={this.onGoBack} resMember={resMember} />
                        </TabPane>
                        <TabPane tab="人员离场" key="4" style={{ width: '100%', height: '100%' }}>
                            <LeaveResMemberPage onBack={this.onGoBack} resMember={resMember} />
                        </TabPane>
                    </Tabs>
                </div>
            );
        } else if (this.state.action === 'createTeam') {
            page = <CreateResTeamPage onBack={this.onGoBackTeam} />;
        } else if (this.state.action === 'updateTeam') {
            var resTeam = {};
            Utils.copyValue(this.state.team, resTeam);
            page = <UpdateResTeamPage onBack={this.onGoBackTeam} resTeam={resTeam} />
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {teamCard}
                {resMemberTable}
                {page}
            </div>
        );
    }
});

module.exports = ResMemberPage;

