'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

var Common = require('../../../public/script/common');
var ChkProjStore = require('../data/ChkProjStore');
var ChkProjActions = require('../action/ChkProjActions');

var expandedKeys2 = [];
var selectedKeys2 = [];
var ChkProjTree = React.createClass({
    getInitialState: function () {
        return {
            chkProjSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: false,
            rootNodes: [],
            chkProjMap: {},
            timer: null,
        }
    },

    mixins: [Reflux.listenTo(ChkProjStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        var arr = [];
        for (var i = 0; i < data.recordSet.length; i++) {
            if (data.recordSet[i].parentUuid === undefined || data.recordSet[i].parentUuid !== null) {
                arr = arr.concat(data.recordSet[i]);
            }
        }
        data.recordSet = arr;
        if (data.operation === 'retrieve') {
            var rootNodes = [];
            var chkProjMap = {};
            if (data.errMsg === '') {
                rootNodes = Common.initTreeNodes(data.recordSet, this.preCrtNode);
                data.recordSet.map((node, i) => {
                    chkProjMap[node.uuid] = node;
                });
            }
            this.setState({
                loading: false,
                chkProjSet: data,
                rootNodes: rootNodes,
                chkProjMap: chkProjMap
            });
            // 初始化，加载用户
            if (selectedKeys2.length === 1) {
                this.state.timer = setTimeout(
                    () => {
                        this.onSelect2();
                        clearInterval(this.state.timer);
                    },
                    100
                );
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.chkProjSet.operation = '';
        this.setState({ loading: true });

        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        ChkProjActions.initChkProj(corpUuid);
    },

    preCrtNode: function (data, recordSet) {
        // console.log(data);
        var node = {};
        node.key = data.uuid;
        node.pid = data.parentUuid;
        if (data.grpName) {
            node.title = data.grpName;
        }
        else {
            node.title = data.projName + '(' + data.projCode + ')';
        }

        return node;

    },

    onSelect: function (selectedKeys, info) {
        var po = info.node.props;
        if (!po.expanded && typeof (po.children) !== 'undefined') {
            expandedKeys2.push(po.eventKey);
        }

        selectedKeys2 = selectedKeys;
        this.onSelect2();
    },
    onSelect2: function () {
        var chkProj = null;
        if (selectedKeys2.length === 1) {
            chkProj = this.state.chkProjMap[selectedKeys2[0]];
        }

        this.props.onSelectChkProj(chkProj);
    },
    onExpand: function (expandedKeys, info) {
        expandedKeys2 = expandedKeys;
    },

    render: function () {
        if (this.state.loading) {
            return (
                <Spin tip="正在努力加载数据...">
                    <div style={{ height: '200px' }} />
                </Spin>
            );
        }

        return (
            <Tree
                className='left-tree2'
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
            </Tree>);
    }
});

module.exports = ChkProjTree;
