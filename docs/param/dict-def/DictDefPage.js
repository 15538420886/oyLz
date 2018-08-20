"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router'
import { Button, Table, Icon, Modal } from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Context = require('../ParamContext');
var Utils = require('../../public/script/utils');
var DictDefStore = require('./data/DictDefStore.js');
var DictDefActions = require('./action/DictDefActions');
import CreateDictDefPage from './Components/CreateDictDefPage';
import UpdateDictDefPage from './Components/UpdateDictDefPage';
import ModListPage from '../mod/Components/ModListPage';

var DictDefPage = React.createClass({
    getInitialState: function () {
        return {
            dictdefSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: false,
            selectedMod: {},
            hiberarchy: this.props.hiberarchy,
            isSelected: false,

        }
    },

    setLoading: function () {
        this.state.dictdefSet.operation = '';
        this.setState({ loading: true });
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            hiberarchy: nextProps.hiberarchy,
        });
    },

    componentDidMount: function () {
        DictDefActions.initParamDictDef('');
    },

    handleOpenCreateWindow: function () {
        var mod = this.state.selectedMod;
        this.refs.createWindow.clear(mod.uuid, mod.appUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate: function (dictdef, e) {
        if (dictdef != null) {
            this.refs.updateWindow.initPage(dictdef);
            this.refs.updateWindow.toggle();
        }

        e.stopPropagation();
    },

    onClickDelete: function (dictdef) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的字典 【' + dictdef.indexName + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.handleRemoveClick2.bind(this, dictdef)
        });
        event.stopPropagation();
    },

    handleRemoveClick2: function (dictdef) {
        this.setLoading();
        DictDefActions.deleteParamDictDef(dictdef.uuid);
    },

    onSelectMod: function (selectedMod) {
        this.setLoading();
        this.state.selectedMod = selectedMod;
        this.state.isSelected = true;
        DictDefActions.initParamDictDef(selectedMod.uuid);
    },
    handleQueryClick: function () {
        this.setLoading();
        DictDefActions.retrieveParamDictDef(this.state.selectedMod.uuid);
    },

    render: function () {
        if (this.state.hiberarchy != 0) {
            return null;
        }

        if (this.state.loading) {
            if (this.state.dictdefSet.operation === 'retrieve' || this.state.dictdefSet.operation === 'remove') {
                this.state.loading = false;
            }
        }

        var modUuid = this.state.selectedMod.uuid;
        var isSelected = (typeof modUuid !== 'undefined');
        var recordSet = this.state.dictdefSet.recordSet;
        const columns = [
            {
                title: '字典名称',
                dataIndex: 'indexName',
                key: 'indexName',
                width: 140,
            },
            {
                title: '说明',
                dataIndex: 'indexDesc',
                key: 'indexDesc',
                width: 140,
            },
            {
                title: '层次字典',
                dataIndex: 'hiberarchy',
                key: 'hiberarchy',
                width: 140,
            },
            {
                title: '状态',
                dataIndex: 'paraStatus',
                key: 'paraStatus',
                width: 50,
            },
            {
                title: '',
                key: 'action',
                width: 80,
                render: (dictdef, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除关系人'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            }
        ];

        var isSelected = this.state.isSelected;
        return (
            <div className='grid-page' style={{ padding: '58px 0 0 0' }}>
                <div style={{ margin: '-58px 0 0 0' }}>
                    <div className='toolbar-table'>
                        <Button icon={Common.iconAdd} disabled={!isSelected} type="primary" title="增加数据字典" onClick={this.handleOpenCreateWindow} />
                        <Button icon={Common.iconRefresh} disabled={!isSelected} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                    </div>
                </div>

                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>

                <CreateDictDefPage ref="createWindow" />
                <UpdateDictDefPage ref="updateWindow" />
            </div>);
    }
});

ReactMixin.onClass(DictDefPage, Reflux.connect(DictDefStore, 'dictdefSet'));
module.exports = DictDefPage;
