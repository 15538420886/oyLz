"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Spin, Button } from 'antd';
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var LeftList = require('../../../lib/Components/LeftList');

import PathContext from '../PathContext'
var ServiceStore = require('../../svc/data/ServiceStore');
var ServiceActions = require('../../svc/action/ServiceActions');
import CreatePaperPage from './CreatePaperPage';
import UpdatePaperPage from './UpdatePaperPage';

var TablePageList = React.createClass({
    getInitialState: function () {
        return {
            selectedRows: null,
            loading: false,
            activeNode: '',
        }
    },
    componentDidMount: function () {

    },
    handlePageClick: function (page) {
        this.setState({ selectedRows: page, activeNode: page.pageID });
        this.props.onSelectPage(page);
    },
    handleOpenCreateWindow: function () {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },
    handleOpenUpdateWindow: function () {
        if (this.state.selectedRows != null) {
            this.refs.updateWindow.initPage(this.state.selectedRows);
            this.refs.updateWindow.toggle();
        }
    },
    onClickDelete: function () {
        var page = this.state.selectedRows;
        if (page === null) {
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的角色 【' + page.pageName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, roles)
        });
    },
    onClickDelete2: function (page) {
 //       this.setState({ loading: true });
 //       FntRoleActions.deleteFntAppRole(roles.uuid);
    },

    render: function () {
        if (this.state.loading) {
            if (this.state.tableSet.operation === 'retrieve') {
                this.state.loading = false;
            }
        }
        const {
        	appUuid,
            onSelectTable,
            ...attributes,
        } = this.props;

        var isSelected = (this.state.selectedRows !== null);
        var recordSet = PathContext.pageRes.pages;

        var tool =
            <div style={{ padding: '8px 0 8px 8px' }}>
                <Button icon={Common.iconAdd} type="primary" title="增加页面" onClick={this.handleOpenCreateWindow} style={{ marginLeft: '4px' }} />
                <Button icon={Common.iconUpdate} disabled={!isSelected} title="修改页面" onClick={this.handleOpenUpdateWindow} style={{ marginLeft: '4px' }} />
                {/*<Button icon={Common.iconRemove} title="删除页面" disabled={!isSelected} onClick={this.onClickDelete} style={{ marginLeft: '4px' }} />*/}
            </div>

        return (
            <div className='grid-page'>
                <div style={{ height: '100%', overflow: 'auto' }}>
                    {
                        this.state.loading
                            ? <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>
                                <LeftList dataSource={recordSet} rowKey="pageID" rowText='pageName' activeNode={this.state.activeNode} onClick={this.handlePageClick} toolbar={tool} {...attributes} />
                            </Spin>
                            :
                            <LeftList dataSource={recordSet} rowKey="pageID" rowText='pageName' activeNode={this.state.activeNode} onClick={this.handlePageClick} toolbar={tool} {...attributes} />	
                    }
                </div>
                <CreatePaperPage ref="createWindow" />
                <UpdatePaperPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = TablePageList;
