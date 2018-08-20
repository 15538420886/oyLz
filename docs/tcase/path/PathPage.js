'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Icon, Button, Tree, Modal, Tabs, Spin } from 'antd';
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import PathContext from './PathContext'
var PathStore = require('./data/TmCaseStore');
var PathActions = require('./action/TmCaseActions');
//pagewuyong
var PageDesignActions = require('../resume/action/TmCaseActions');
var PageDesignStore = require('../resume/data/TmCaseStore');

var ResStore = require('../svc/data/ResStore');
var ResActions = require('../svc/action/ResActions');
import CreatePathPage from './Components/CreatePathPage';
import UpdatePathPage from './Components/UpdatePathPage';
import RealPage from '../resume/UseCaseListPage'

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
        PathActions.initTmCase('12');
    },

    showError: function (msg) {
        this.refs.mxgBox.showError(msg);
    },

    handleQueryClick:function(){
        this.setState({ loading: true });
        PathActions.retrieveTmCase("12");
    },

    onSelect: function (selectedKeys, info) {
    	console.log(selectedKeys[0])
        selectedKeys2 = selectedKeys;
        PageDesignActions.retrieveTmCase(selectedKeys[0])
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
                
               PageDesignActions.retrieveTmCase(selectedKeys[0])
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
        this.refs.createWindow.clear("12", '');
        this.refs.createWindow.toggle();
    },
    handleAddChild: function (event) {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个父目录');
            return;
        }
        this.refs.createWindow.clear("12", selectedKeys2[0]);
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
            content: '是否删除选中的路径 【' + selNode.cateName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, selNode)
        });
    },

    onClickDelete2: function (path) {
        this.setState({ loading: true });
        PathActions.deleteTmCase(path.uuid);
    },
  

    preCrtNode: function (data, recordSet) {
        var node = {};
        node.key = data.uuid;
        node.pid = data.ord;
        node.title = data.cateName
//          + '(' + data.pathDesc + ')';
        return node;
    },

    render: function () {
        var isDisabled = (selectedKeys2.length === 0);
      
        var pathVisible = (this.state.viewType === 'path') ? '' : 'none';
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
        return (
            <div style={{ width: '100%', height: '100%'}}>
                <div className='grid-page' style={{ display: pathVisible }}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div className='left-tree' style={{ flex: '0 0 230px', width: '230px', overflowY: 'auto', overflowX: 'hidden' }}>
                       
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
                        <div style={{ overflow: 'hidden', width: '100%'}}>
                             <RealPage/>
                        </div>
                    </div>
                   
                    <CreatePathPage ref="createWindow" onCreateCallback={this.onCreateCallback} />
                    <UpdatePathPage ref="updateWindow" onSaveCallback={this.onSaveCallback} />
                </div>
               
            </div>
        );
    }
});

module.exports = PathPage;

