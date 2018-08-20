"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Spin, Icon, Modal } from 'antd';

var Utils = require('../../../../public/script/utils');
var Common = require('../../../../public/script/common');
var LeftList = require('../../../../lib/Components/LeftList');

var Context = require('../../../AuthContext');
var FntRoleStore = require('../data/FntRoleStore');
var FntRoleActions = require('../action/FntRoleActions');
import CreateRolesPage from './CreateRolesPage';
import UpdateRolesPage from './UpdateRolesPage';

var RoleListPage = React.createClass({
    getInitialState: function () {
        return {
            roleSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            appUuid: '',
            selectedRows: null,
        }
    },
    mixins: [Reflux.listenTo(FntRoleStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.errMsg === '' && data.operation === 'remove') {
            this.handleRoleClick(null);
        }

        this.setState({
            loading: false,
            roleSet: data
        });
    },
    componentDidMount: function () {
        var appUuid = Context.fntApp.uuid;
        this.setState({ loading: true, appUuid: appUuid });
        FntRoleActions.initFntAppRole(appUuid);
    },
    handleRoleClick: function (roles) {
        this.state.selectedRows = roles;
        this.props.onSelectRoles(roles);
    },
    handleOpenCreateWindow: function () {
        this.refs.createWindow.clear(this.state.appUuid);
        this.refs.createWindow.toggle();
    },
    handleOpenUpdateWindow: function () {
        if (this.state.selectedRows != null) {
            this.refs.updateWindow.initPage(this.state.selectedRows);
            this.refs.updateWindow.toggle();
        }
    },
    onClickDelete: function () {
        var roles = this.state.selectedRows;
        if (roles === null) {
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的角色 【' + roles.roleName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, roles)
        });
    },
    onClickDelete2: function (roles) {
        this.setState({ loading: true });
        FntRoleActions.deleteFntAppRole(roles.uuid);
    },

    render: function () {
        const {
        	appUuid,
            onSelectRoles,
            ...attributes,
        } = this.props;

        var isSelected = (this.state.selectedRows !== null);

        var recordSet = this.state.roleSet.recordSet;
        recordSet.map((role, i) => {
            if (role.roleName !== role.roleDesc) {
                role.listText = role.roleName + '(' + role.roleDesc + ')';
            }
            else {
                role.listText = role.roleName;
            }
        });

        var tool =
            <div style={{ padding: '8px 0 8px 8px' }}>
                <Button icon={Common.iconAdd} type="primary" title="增加角色组" onClick={this.handleOpenCreateWindow} style={{ marginLeft: '4px' }} />
                <Button icon={Common.iconUpdate} type="primary" disabled={!isSelected} title="修改角色组" onClick={this.handleOpenUpdateWindow} style={{ marginLeft: '4px' }} />
                <Button icon={Common.iconRemove} title="删除角色组" disabled={!isSelected} onClick={this.onClickDelete} style={{ marginLeft: '4px' }} />
            </div>

        return (
            <div className='grid-page'>
                <div style={{ height: '100%', overflow: 'auto' }}>
                    {
                        this.state.loading
                            ? <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>
                                <LeftList dataSource={recordSet} rowText='listText' onClick={this.handleRoleClick} toolbar={tool} {...attributes} />
                            </Spin>
                            : <LeftList dataSource={recordSet} rowText='listText' onClick={this.handleRoleClick} toolbar={tool} {...attributes} />
                    }
                </div>
                <CreateRolesPage ref="createWindow" />
                <UpdateRolesPage ref="updateWindow" />
            </div>
        );
    }
});

module.exports = RoleListPage;
