'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import { Button, Form, Row, Col, Input, Modal, Icon, Table, Tabs, Pagination } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var Utils = require('../../../public/script/utils');
// tap状态页
var CommunicateTable = require('../Components/CommunicateTable');
var InterviewTable = require('../Components/InterviewTable');
var EmployedTable = require('../Components/EmployedTable');
var UnsuitTable = require('../Components/UnsuitTable');

var UploadResumePage = require('../Components/UploadResumePage');
var AstResumePage = require('../Components/AstResumePage');
var WaitEmployPage = require('../Components/WaitEmployPage');
var ResumeStore = require('../data/ResumeStore');
var ResumeActions = require('../action/ResumeActions');

var ScoreTabPage = require('../Components/ScoreTabPage');


var pageRows = 10;
var PendingTable = React.createClass({
    getInitialState: function () {
        return {
            resumeSet: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            selectedRowKeys: null,
            action: 'query',
            resume: {},
            resumeMsg: {},
            loading: false,
            type: '待处理',
        }
    },

    mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            resumeSet: data
        });
    },
    // 第一次加载
    componentDidMount: function () {
        this.initPage(this.props.resume);
    },
    initPage: function (resume) {
        Utils.copyValue(resume, this.state.resume);
        if (resume) {
            var filter = {};
            filter.resumeState = "待处理";
            filter.reqUuid = resume.uuid;
            // --请求---
            ResumeActions.initResume(filter, this.state.resumeSet.startPage, pageRows)
        }
    },

    handleQueryClick: function (event) {
        this.setState({ loading: true });
        var filter = {};
        filter.resumeState = "待处理";
        filter.reqUuid = this.state.resume.uuid;
        ResumeActions.initResume(filter, this.state.resumeSet.startPage, pageRows)

    },
    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },

    onChangePage: function (pageNumber) {
        this.state.resumeSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function (current, pageSize) {
        pageRows = pageSize;
        this.handleQueryClick();
    },

    handleUpload: function () {
        this.setState({ action: 'upload' });

    },
    doAction: function (name, resumeMsg, type) {
        this.state.type = type
        this.setState({ action: name, resumeMsg: resumeMsg });
    },
    goBack: function () {
        this.props.onBack();
    },
    onGoBack: function () {
        this.setState({ action: 'query' });
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    onCommunicat: function () {
        // 待沟通
        var data = {};
        data.resumeState = "待沟通";
        data.uuidList = this.state.selectedRowKeys;
        ResumeActions.batchUpdateResume(data);
    },
    onUnsuit: function () {
        //不合适
        var data = {};
        data.resumeState = "不合适";
        data.uuidList = this.state.selectedRowKeys;
        ResumeActions.batchUpdateResume(data);
    },
    onWaitInterview: function () {
        //待面试
        var data = {};
        data.resumeState = "待面试";
        data.uuidList = this.state.selectedRowKeys;
        ResumeActions.batchUpdateResume(data);
    },
    onClickUpdate: function (resumeMsg, event) {
        if (resumeMsg != null) {
            this.setState({ resumeMsg: resumeMsg, action: 'score' });
        }
    },
    onClickDelete: function (resume, event) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的简历 【' + resume.perName + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.onClickDelete2.bind(this, resume)
        });
    },

    onClickDelete2: function (resume) {
        this.state.resumeSet.operation = '';
        this.setState({ loading: true });
        ResumeActions.deleteResume(resume.uuid)
    },

    render: function () {
        const columns = [
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 100,
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                width: 90,
            },
            {
                title: '年龄',
                dataIndex: 'years',
                key: 'years',
                width: 90,
            },
            {
                title: '工作经验',
                dataIndex: 'induYear',
                key: 'induYear',
                width: 110,
            },
            {
                title: '学校',
                dataIndex: 'eduCollege',
                key: 'eduCollege',
                width: 140,
            },
            {
                title: '专业',
                dataIndex: 'profession',
                key: 'profession',
                width: 140,
            },
            {
                title: '学历',
                dataIndex: 'eduDegree',
                key: 'eduDegree',
                width: 140,
            },
            {
                title: '现单位',
                dataIndex: 'corpName',
                key: 'corpName',
                width: 140,
            },
            {
                title: '收录日期',
                dataIndex: 'regDate',
                key: 'regDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改待入职人员信息'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除待入职人员信息'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var visible = (this.state.action === 'query') ? '' : 'none';
        var recordSet = this.state.resumeSet.recordSet;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        var btnVisible = (recordSet.length === 0) ? 'none' : '';
        var pag = { showQuickJumper: true, total: this.state.resumeSet.totalRow, pageSize: this.state.resumeSet.pageRow, current: this.state.resumeSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage };
        
        var tabs = <div className='grid-body' style={{ display: visible }}>
            <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                </TabPane>
                <TabPane tab="待处理" key="2" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "2px 8px 16px 8px", height: '100%' }}>
                        <div className='toolbar-table' style={{padding:'0'}}>
                            <div style={{ float: 'left' }}>
                                <Button icon={Common.iconAdd} type="primary" title="增加组员" onClick={this.handleUpload} style={{ marginRight: '4px' }} />
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} />
                            </div>
                        </div>

                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} rowSelection={rowSelection} expandedRowRender={record => <div><p>{record.introduce}</p><p>{record.lastWork}</p></div>} pagination={pag} size="middle" bordered={Common.tableBorder} />
                        <div style={{ margin: '-44px 0 0 0', width: '100%', display: btnVisible }} >
                            <div style={{ float: 'left' }}>
                                <Button key="btnCommunicat" onClick={this.onCommunicat} >标记为待沟通</Button>
                                <Button key="btnUnsuit" style={{ marginLeft: '4px' }} onClick={this.onUnsuit} >标记为不合适</Button>
                                <Button key="btnWaitInterview" style={{ marginLeft: '4px' }} onClick={this.onWaitInterview} >标记为待面试</Button>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="待沟通" key="3" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "2px 0 16px 8px", height: '100%' }}>
                        <CommunicateTable type="待沟通" doAction={this.doAction} resume={this.state.resume} />
                    </div>
                </TabPane>
                <TabPane tab="待面试" key="4" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "2px 0 16px 8px", height: '100%' }}>
                        <InterviewTable type="待面试" doAction={this.doAction} resume={this.state.resume} />
                    </div>
                </TabPane>

                <TabPane tab="已录用" key="5" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "2px 0 16px 8px", height: '100%' }}>
                        <EmployedTable type="已录用" doAction={this.doAction} resume={this.state.resume} />
                    </div>
                </TabPane>
                <TabPane tab="不合适" key="6" style={{ width: '100%', height: '100%' }}>
                    <div style={{ padding: "2px 0 16px 8px", height: '100%' }}>
                        <UnsuitTable type="不合适" doAction={this.doAction} resume={this.state.resume} />
                    </div>
                </TabPane>
            </Tabs>
        </div>

        var page = null;
        if (this.state.action === 'upload') {
            page = (<UploadResumePage onBack={this.onGoBack} resume={this.state.resume} />)
        } else if (this.state.action === 'talent') {
            page = (<AstResumePage onBack={this.onGoBack} />);
        } else if (this.state.action === 'employed') {
            page = (<WaitEmployPage onBack={this.onGoBack} />);
        } else if (this.state.action === 'score') {
            page = (<ScoreTabPage onBack={this.onGoBack} type={this.state.type} resumeMsg={this.state.resumeMsg} />);
        };

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                {tabs}
                {page}
            </div>
        );
    }
});

module.exports = PendingTable;