'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import { withRouter, browserHistory } from 'react-router'
var Reflux = require('reflux');
import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');

var CorpStore = require('./data/CorpStore');
var CorpActions = require('./action/CorpActions');
import CreateCorpPage from './Components/CreateCorpPage';
import UpdateCorpPage from './Components/UpdateCorpPage';

var filterValue = '';
var CorpPage2 = React.createClass({
    getInitialState: function () {
        return {
            corpSet: {
                campusCode: '',
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
            campusName: '',
        }
    },

    mixins: [Reflux.listenTo(CorpStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            corpSet: data
        });
    },

    // 刷新
    handleQueryClick: function (event) {
        if (this.state.corpSet.campusCode != '') {
            this.setState({ loading: true });
            CorpActions.retrieveAuthCorp(this.state.corpSet.campusCode);
        }
    },

    // 第一次加载
    componentDidMount: function () {
        var q = (Common.corpStruct === '园区') ? this.props.location.query : Common;
        if (q != null && typeof (q) != 'undefined') {
            this.setState({ loading: true });

            this.state.campusName = q.campusName
            this.state.corpSet.campusCode = q.campusUuid
            CorpActions.initAuthCorp(q.campusUuid);
        }

    },

    handleOpenCreateWindow: function (event) {
        this.refs.createWindow.clear(this.state.corpSet.campusCode);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (corp, event) {
        if (corp != null) {
            this.refs.updateWindow.initPage(corp);
            this.refs.updateWindow.toggle();
        }
    },
    onClickManager: function (corp, event) {
        var q = (Common.corpStruct === '园区') ? this.props.location.query : Common;
        if (corp != null && q != null && typeof (q) != 'undefined') {
            browserHistory.push({
                pathname: '/auth/SysUserPage/',
                query: {
                    deptUuid: corp.uuid,
                    deptName: corp.corpName,
                    campusUuid: q.campusUuid,
                    campusName: q.campusName
                },
            });
        }
    },
    onClickDelete: function (corp, event) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的公司 【' + corp.corpCode + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.onClickDelete2.bind(this, corp)
        });
    },

    onClickDelete2: function (corp) {
        this.setState({ loading: true });
        CorpActions.deleteAuthCorp(corp.uuid);
    },

    handleGoBack: function (corp) {
        this.props.router.push({
            pathname: '/auth/CampusPage/',
            state: { fromDashboard: true }
        });
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },

    render: function () {
        var recordSet = Common.filter(this.state.corpSet.recordSet, filterValue);

        const columns = [
            {
                title: '公司代码',
                dataIndex: 'corpCode',
                key: 'corpCode',
                width: 140,
                sorter: (a, b) => Common.strSort(a.corpCode, b.corpCode)
            },
            {
                title: '公司名称',
                dataIndex: 'corpName',
                key: 'corpName',
                width: 140,
                sorter: (a, b) => Common.strSort(a.corpName, b.corpName)
            },
            {
                title: '公司类型',
                dataIndex: 'corpType',
                key: 'corpType',
                width: 250,
                render: (text, record) => (Utils.getOptionName('用户管理', '公司类型', record.corpType, true, this)),
                sorter: (a, b) => Common.strSort(a.corpType, b.corpType)
            },
            {
                title: '办公地址',
                dataIndex: 'corpLoc',
                key: 'corpLoc',
                width: 250,
                sorter: (a, b) => Common.strSort(a.corpLoc, b.corpLoc)
            },
            {
                title: '',
                key: 'action',
                width: 90,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickManager.bind(this, record)} title='管理员'><Icon type={Common.iconUser} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }];

        var toolBar = [];
        if (Common.corpStruct === '园区') {
            toolBar.push(<div style={{ paddingTop: '8px', paddingRight: '8px', display: 'inline' }}>{this.state.campusName}，{recordSet.length}个公司</div>);
        }
        else {
            toolBar.push(<div style={{ paddingTop: '8px', paddingRight: '8px', display: 'inline' }}>共 {recordSet.length} 个公司</div>);
        }

        toolBar.push(<Button icon={Common.iconAdd} type="primary" title="增加公司" onClick={this.handleOpenCreateWindow} />);
        toolBar.push(<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />);

        if (Common.corpStruct === '园区') {
            toolBar.push(<Button icon={Common.iconBack} title="返回园区管理" onClick={this.handleGoBack} style={{ marginLeft: '4px' }} />);
        }

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-corp/retrieve', 'auth-corp/remove']} />

                    <div className='toolbar-table'>
                        <div style={{ float: 'left' }}>
                            {toolBar}
                        </div>
                        <div style={{ textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>

                <CreateCorpPage ref="createWindow" onCreateCallback={this.onCreateCallback} />
                <UpdateCorpPage ref="updateWindow" onSaveCallback={this.onSaveCallback} />
            </div>);
    }
});

var CorpPage = withRouter(CorpPage2);
module.exports = CorpPage;
