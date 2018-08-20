'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Icon, Button, Tree, Modal, Tabs, Spin } from 'antd';
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import PathContext from './PathContext'
var PathStore = require('./data/PathStore');
var PathActions = require('./action/PathActions');
var PageDesignActions = require('../page/action/PageDesignActions');
var PageDesignStore = require('../page/data/PageDesignStore');
var ResStore = require('../svc/data/ResStore');
var ResActions = require('../svc/action/ResActions');
import CreatePathPage from './Components/CreatePathPage';
import UpdatePathPage from './Components/UpdatePathPage';
import InfoPage from './Components/InfoPage';
import CreateResourcePage from './Components/CreateResourcePage';
import InterfacePage from './Components/InterfacePage';
import FieldPage from './Components/FieldPage';
import TablePage from './Components/TablePage';

var expandedKeys2 = [];
var selectedKeys2 = [];
var PathPage = React.createClass({
    getInitialState: function () {
        return {
            pathSet: {
                recordSet: [],
            },
            resSet: {
                pageInfo: {
                    resList: []
                },
            },
            resNode: {},
            loading: false,
            pageLoading: false,
            rootNodes: [],
            activeKey: '1',
            viewType: 'path',
            pathType: '0',
            findRes: {}
        }
    },
    mixins: [Reflux.listenTo(PathStore, "onServiceComplete"),
        Reflux.listenTo(PageDesignStore, "onServiceComplete2"), Reflux.listenTo(ResStore, "onResServiceComplete")],
    // path
    onServiceComplete: function (data) {
    	console.log(data)
        var rootNodes = Common.initTreeNodes(data.recordSet, this.preCrtNode);
        this.setState({
            loading: false,
            pathSet: data,
            rootNodes: rootNodes
        });
    },
    // pageInfo
    onServiceComplete2: function (data) {
        // 失败
        this.setState({
            pageLoading: false,
            resSet: data
        });
    },
    
    onResServiceComplete: function (data) {
        if (data.operation === 'find') {
            this.setState({
                pageLoading: false,
            });

            if (data.errMsg === '') {
                if (data.selectedRes === undefined || data.selectedRes === null) {
                    Common.infoMsg('没有找到资源【' + resNode.resName + '】');
                }
                else {
                    // 保存全局变量
                    PathContext.selectedRes = data.selectedRes;

                    this.setState({
                        findRes: data.selectedRes,
                        viewType: 'resource',
                        activeKey: '1'
                    });
                }
            }
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.setState({ loading: true });
        var app = window.devApp;
        console.log(app)
        PathActions.initPagePath(app.uuid);
    },

    showError: function (msg) {
        this.refs.mxgBox.showError(msg);
    },

    handleQueryClick:function(){
        this.setState({ loading: true });
        var app = window.devApp;
        PathActions.retrievePagePath(app.uuid);
    },

    onSelect: function (selectedKeys, info) {
    	console.log(selectedKeys)
    	console.log(info)
        selectedKeys2 = selectedKeys;

        var pathNode = null;
        var recordSet = this.state.pathSet.recordSet;
        var len = recordSet.length;
        for (var i = 0; i < len; i++) {
            if (recordSet[i].uuid === selectedKeys[0]) {
                pathNode = recordSet[i];
                break;
            }
        }

        if (pathNode !== null) {
            var pathType = pathNode.isPage;
            if (pathType === '1') {
                this.setState({ pageLoading: true, pathType: pathType });
                PageDesignActions.getPageInfo(selectedKeys[0])
            }
            else {
                this.setState({ pathType: pathType });
            }
        }
    },

    onExpand: function (expandedKeys, info) {
        expandedKeys2 = expandedKeys;
    },

    getSelectedNode: function () {
        if (selectedKeys2.length !== 1) {
            return null;
        }

        var recordSet = this.state.pathSet.recordSet;
        var len = recordSet.length;
        for (var i = 0; i < len; i++) {
            if (recordSet[i].uuid === selectedKeys2[0]) {
                return recordSet[i];
            }
        }

        return null;
    },

    handleOpenCreateWindow: function (event) {
        var app = window.devApp;
        this.refs.createWindow.clear(app.uuid, '');
        this.refs.createWindow.toggle();
    },
    handleAddChild: function (event) {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个父目录');
            return;
        }
        console.log(selectedKeys2[0])
        var app = window.devApp;
        this.refs.createWindow.clear(app.uuid, selectedKeys2[0]);
        this.refs.createWindow.toggle();
    },
    onClickUpdate: function (event) {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个目录');
            return;
        }

        this.refs.updateWindow.initPage(selNode);
        this.refs.updateWindow.toggle();
    },
    onClickDelete: function (event) {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个目录');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的路径 【' + selNode.pathName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, selNode)
        });
    },

    onClickDelete2: function (path) {
        this.setState({ loading: true });
        PathActions.deletePagePath(path.uuid);
    },

    handleAddResources: function () {
        this.refs.createRes.clear(this.state.resSet.pageInfo);
        this.refs.createRes.toggle();
    },
    //	进入
    handleClick: function (resNode) {
    	console.log(resNode)
        if (resNode) {
            PathContext.pageRes = resNode;  // 当前选中的资源

            this.setState({
                resNode: resNode,
                pageLoading: true,
            });

            // 查找资源
            var app = window.devApp;
            ResActions.findAppRes(app.uuid, resNode.resName);
        }
    },

    onTabClick: function (tabIndex) {
        this.setState({
            activeKey: tabIndex
        });

        if (tabIndex === '0') {
            this.onGoBack();
        }
        else if (tabIndex === '4') {
            var page = this.refs.pagePage;
            if (page !== undefined && page !== null) {
                page.loadFields();
            }
        }
    },

    onGoBack: function () {
        //返回
        this.setState({
            viewType: 'path'
        });
    },

    preCrtNode: function (data, recordSet) {
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if (data.pathDesc === '' || data.pathDesc == data.pathName) {
            node.title = data.pathName;
        }
        else {
            node.title = data.pathName + '(' + data.pathDesc + ')';
        }

        return node;
    },

    render: function () {
        var isDisabled = (selectedKeys2.length === 0);
        var resVisible = (this.state.pathType === '0') ? 'none' : '';
        var pathVisible = (this.state.viewType === 'path') ? '' : 'none';

        var cardList = null;
        var resList = this.state.resSet.pageInfo.resList;
        if (resList !== null) {
            cardList = resList.map((resNode, i) => {
                return <div key={resNode.uuid} className='card-div' style={{ width: 280 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }}>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{resNode.resName}</h3></div>
                        <div className="ant-card-body" onClick={this.handleClick.bind(this, resNode)} title='点击进入' style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{resNode.resDesc}</div>
                    </div>
                </div>
            });
        }

        var tree = (
            <Tree
                defaultExpandedKeys={expandedKeys2}
                defaultSelectedKeys={selectedKeys2}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
            >
                {
                    this.state.rootNodes.map((data, i) => {
                        return Common.prepareTreeNodes(data);
                    })
                }
            </Tree>
        );

        // 详细页面
        var contentPage = null;
        if (this.state.viewType !== 'path') {
            contentPage = (
                <div style={{ overflow: 'hidden', height: '100%', width: '100%', padding: '10px 0 0 2px'}}>
                    <Tabs activeKey={this.state.activeKey} onChange={this.onTabClick} tabBarStyle={{ margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                        <TabPane tab="返回" key="0">
                        </TabPane>
                        <TabPane tab="基本信息" key="1" style={{ width: '100%', height: '100%' }}>
                            <InfoPage findRes={this.state.findRes} data={this.state.resSet} />
                        </TabPane>
                        <TabPane tab="接口表" key="2" style={{ width: '100%', height: '100%' }}>
                            <InterfacePage />
                        </TabPane>
                        <TabPane tab="字段表" key="3" style={{ width: '100%', height: '100%' }}>
                            <FieldPage ref="fieldPage" />
                        </TabPane>
                        <TabPane tab="页面表" key="4" style={{ width: '100%', height: '100%' }}>
                            <TablePage ref="pagePage" />
                        </TabPane>
                    </Tabs>
                </div>
            );
        }

        return (
            <div style={{ width: '100%', height: '100%'}}>
                <div className='grid-page' style={{ display: pathVisible }}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div className='left-tree' style={{ flex: '0 0 230px', width: '230px', overflowY: 'auto', overflowX: 'hidden' }}>
                            <ServiceMsg ref='mxgBox' svcList={['page-path/retrieve', 'page-path/remove']} />
                            <div style={{ margin: '8px 8px 0' }}>
                                <Button icon="plus" title="增加目录" type="primary" onClick={this.handleOpenCreateWindow} />
                                <Button icon="folder-add" title="增加子目录" onClick={this.handleAddChild} disabled={isDisabled} style={{ marginLeft: '4px' }} />
                                <Button icon="edit" title="修改目录" onClick={this.onClickUpdate} disabled={isDisabled} style={{ marginLeft: '4px' }} />
                                <Button icon="delete" title="删除目录" onClick={this.onClickDelete} disabled={isDisabled} style={{ marginLeft: '4px' }} />
                                <Button icon="sync" title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            </div>
                            {this.state.loading ?
                                <Spin tip="正在努力加载数据...">{tree}</Spin>
                                :
                                tree
                            }
                        </div>
                        <div style={{ overflow: 'hidden', width: '100%', display: resVisible }}>
                            <ServiceMsg ref='mxgBox' svcList={['page-design/find']} />
                            <div style={{ margin: '10px 24px 0' }}>
                                <Button icon="plus" title="增加资源" type="primary" onClick={this.handleAddResources} />
                            </div>

                            {this.state.pageLoading ?
                                <Spin tip="正在努力加载数据..." >{cardList}</Spin>
                                :
                                <div className='card-body' style={{ paddingTop: '10px' }}>{cardList}</div>}
                        </div>
                    </div>
                    <CreateResourcePage ref="createRes" />
                    <CreatePathPage ref="createWindow" onCreateCallback={this.onCreateCallback} />
                    <UpdatePathPage ref="updateWindow" onSaveCallback={this.onSaveCallback} />
                </div>
                {contentPage}
            </div>
        );
    }
});

module.exports = PathPage;

