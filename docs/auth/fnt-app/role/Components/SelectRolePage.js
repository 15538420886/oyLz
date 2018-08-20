"use strict";

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Table, Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var FntRoleStore = require('../data/FntRoleStore');
var FntRoleActions = require('../action/FntRoleActions');

var SelectRolePage = React.createClass({
    getInitialState: function () {
        return {
            txnSet: {
                recordSet: [],
                errMsg: ''
            },
            modal: false,
            loading: false,

            selectedRole: {},
            allRoleList: [],
            selRoleList: [],

            roleMap: {},
            rootRoleList: [],
            selectedRows: [],
            selectedRowKeys: [],
            expandedRows: [],
        }
    },

    mixins: [Reflux.listenTo(FntRoleStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (this.state.modal) {
            if (data.errMsg === '') {
                // 成功
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false
                });
            }
        }
    },
    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },

    // 第一次加载
    componentDidMount: function () {

    },

    clear: function (selectedRole, selRoleList, allRoleList) {
        this.state.selRoleList = selRoleList;
        this.state.allRoleList = allRoleList;
        Utils.copyValue(selectedRole, this.state.selectedRole);

        var selRoleMap = {};
        selRoleList.map((role, i) => {
            selRoleMap[role.uuid] = role;
        })

        var roleList = [];
        this.state.roleMap = {};
        allRoleList.map((role, i) => {
            var ff = selRoleMap[role.uuid];
            if (ff === null || typeof (ff) === 'undefined') {
                roleList.push(role);
                this.state.roleMap[role.uuid] = role;
            }
        });

        this.state.rootRoleList = Common.initTreeNodes3(roleList, this.preCrtGroupNode, this.preCrtNode);

        this.state.selectedRows = [];
        this.state.selectedRowKeys = [];
        this.state.expandedRows = [];
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    preCrtNode: function (data, recordSet) {
        var node = {};
        node.key = data.uuid;
        node.pid = data.appCode;

        node.roleName = data.roleName;
        node.roleDesc = data.roleDesc;
        return node;
    },

    preCrtGroupNode: function (data, recordSet) {
        var node = {};
        node.key = data.appCode;

        node.roleName = data.appCode;
        node.roleDesc = data.appName;
        node.disabled = true;
        return node;
    },

    onExpandedRowsChange: function (expandedRows2) {
        this.state.expandedRows = expandedRows2;
    },

    //选项变化
    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },
    //保存  确定
    onClickSave: function () {
        if (this.state.selectedRowKeys.length === 0) {
            this.setState({ modal: false });
            return;
        }

        var selKeys = this.state.selectedRowKeys.join(',');
        this.state.selRoleList.map((role, i) => {
            selKeys = selKeys + ',' + role.uuid;
        })

        this.state.selectedRole.roleList = selKeys;
        this.setState({ loading: true });
        FntRoleActions.updateFntAppRole(this.state.selectedRole);
    },

    render: function () {
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 260,
            },
            {
                title: '角色说明',
                dataIndex: 'roleDesc',
                key: 'roleDesc',
                width: 340,
            },
        ]

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.selectedRows = selectedRows;
            },
            onSelect: (record, selected, selectedRows) => {
                this.state.selectedRows = selectedRows;
            },
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        var recordSet = this.state.rootRoleList;
        return (
            <Modal visible={this.state.modal} width='740px' title="增加分组参数" style={{ overflowY: 'auto' }} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['fnt_app_role/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading1}>确定</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}>
                <div style={{ height: '400px', overflow: 'auto' }}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.key} defaultExpandedRowKeys={this.state.expandedRows} onExpandedRowsChange={this.onExpandedRowsChange} rowSelection={rowSelection} loading={this.state.loading} size='middle' pagination={false} bordered={Common.tableBorder} />
                </div>
            </Modal>
        );
    }
});

export default SelectRolePage;

