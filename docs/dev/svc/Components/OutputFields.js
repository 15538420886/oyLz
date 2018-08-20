'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon } from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var MethodStore = require('../data/MethodStore.js');
var MethodActions = require('../action/MethodActions');
import XlsDown from '../../../lib/Components/XlsDown';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import ExportTypeScriptData from './ExportTypeScriptData';
import InputCode from './InputCode';
var expandedRows = [];
var OutputFields = React.createClass({
    getInitialState: function () {
        return {
            methodSet: {
                uuid: '',
                methodInfo: {},
                operation: '',
                errMsg: ''
            },
            loading: false,
            resUuid: '',
            id: 1,
            rootNodes: [],
            allNodes: [],
            selectedRowKeys: [],
            childrenNodes:[]
        }
    },
    mixins: [XlsTempFile()],
    // 第一次加载
    componentDidMount: function () {
        if (this.props.resUuid !== '') {
            this.setState({ resUuid: this.props.resUuid, loading: true });
            MethodActions.getDevService(this.props.resUuid);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.state.resUuid !== nextProps.resUuid) {
            this.setState({ resUuid: nextProps.resUuid, loading: true });
            MethodActions.getDevService(nextProps.resUuid);
        }
    },

    onExpandedRowsChange: function (expandedRows2) {
        expandedRows = expandedRows2;
    },

    preFieldNode: function (data) {
        var node = {};
        node.id = '' + this.state.id;
        this.state.id = this.state.id + 1;

        node.key = node.id;
        node.fieldName = data.fieldName;
        node.fieldDesc = data.fieldDesc;
        node.dataType = data.dataType;
        node.fieldType = data.fieldType;
        node.fieldLength = data.fieldLength;
        node.notNull = data.notNull;

        this.state.allNodes.push(node);
        return node;
    },

    prepareChildRows: function (pNode, fields) {
        this.state.childrenNodes = fields;
        fields.map((item, i) => {
            var node = this.preFieldNode(item);
            pNode.children.push(node);

            if (item.fields !== null && typeof (item.fields) !== "undefined" && item.fields.length !== 0) {
                node.children = [];
                expandedRows.push(node.id);
                this.prepareChildRows(node, item.fields);
            }
        });
    },
    prepareTableRows: function () {
        expandedRows = [];
        this.state.id = 1;
        this.state.rootNodes = [];
        this.state.allNodes = [];

        var recordSet = this.state.methodSet.methodInfo.output;
        if (recordSet === null || typeof (recordSet) === "undefined" || recordSet.length == 0) {
            return;
        }

        recordSet = recordSet[0].fields;
        recordSet.map((item, i) => {
            var node = this.preFieldNode(item);
            this.state.rootNodes.push(node);

            if (item.fields !== null && typeof (item.fields) !== "undefined" && item.fields.length !== 0) {
                node.children = [];
                expandedRows.push(node.id);
                this.prepareChildRows(node, item.fields);
            }
        });
    },

    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },
    getSelectedRows: function () {
        var selRows = [];
        var count = this.state.allNodes.length;
        this.state.selectedRowKeys.map((data, i) => {
            for (var i = 0; i < count; i++) {
                if (this.state.allNodes[i].key === data) {
                    selRows.push(this.state.allNodes[i]);
                    break;
                }
            }
        });

        return selRows;
    },
    onCreateForm: function () {
        var selRows = this.getSelectedRows();
        if (!selRows.length) {
            Common.infoMsg('请选择一个字段');
        } else {
            var mark = 'inForm';
            this.refs.createForm.handleOpen(selRows, mark);
        }
    },
    onCreateTable: function () {
        var selRows = this.getSelectedRows();
        if (!selRows.length) {
            Common.infoMsg('请选择一个字段');
        } else {
            var mark = 'inTable';
            this.refs.createForm.handleOpen(selRows, mark);
        }
    },
    xlsExport:function(){
        if(this.state.allNodes.length === 0){
            Common.infoMsg('字段为空');
            return;
        }
        var data = this.state.allNodes;
        var recordSet = Common.filter(data);
        var checkMemberFields = [
            { id: 'A', name: 'fieldName', title: '字段名称' },
            { id: 'B', name: 'fieldDesc', title: '字段说明' },
            { id: 'C', name: 'dataType', title: '数据类型' },
            { id: 'D', name: 'fieldType', title: '字段类型' },
            { id: 'E', name: 'fieldLength', title: '长度' },
            { id: 'F', name: 'notNull', title: '非空' },
        ];
        this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls);
    },
    childrenXlsExport:function(){
        this.refs.createTypescript.toggle()
    },
    render: function () {
        if (this.state.loading) {
            if (this.state.methodSet.operation === 'retrieve' || this.state.methodSet.operation === 'remove') {
                this.state.loading = false;
            }
        }

        // 生成数据表
        this.prepareTableRows();

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const columns = [
            {
                title: '字段名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: 160,
            },
            {
                title: '字段说明',
                dataIndex: 'fieldDesc',
                key: 'fieldDesc',
                width: 180,
            },
            {
                title: '数据类型',
                dataIndex: 'dataType',
                key: 'dataType',
                width: 100,
            },
            {
                title: '字段类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                width: 100,
            },
            { 
                title: '长度',
                dataIndex: 'fieldLength',
                key: 'fieldLength',
                width: 100,
            },
            {
                title: '非空',
                dataIndex: 'notNull',
                key: 'notNull',
                width: 100,
            }
        ];

        return (
            <div className='grid-page'>
                <Button icon="layout" title="生成表单" onClick={this.onCreateForm} />
                <Button icon="database" title="生成表格" onClick={this.onCreateTable} style={{ marginLeft: '4px' }} />
                <Button icon='download' title="导出数据" onClick={this.xlsExport} style={{ marginLeft: '4px' }} />
                <Button icon='code-o' title="生成TypeScript类型数据" onClick={this.childrenXlsExport} style={{ marginLeft: '4px' }} />
                <Table columns={columns} dataSource={this.state.rootNodes} rowSelection={rowSelection} rowKey={record => record.id} defaultExpandedRowKeys={expandedRows} onExpandedRowsChange={this.onExpandedRowsChange} loading={this.state.loading} style={{ paddingTop: '8px' }} size='small' pagination={false} bordered />
                <InputCode ref="createForm" />
                <XlsDown ref='xls' />
                <ExportTypeScriptData ref="createTypescript" typescript={this.state.childrenNodes} />
            </div>

        );
    }
});

ReactMixin.onClass(OutputFields, Reflux.connect(MethodStore, 'methodSet'));
module.exports = OutputFields;
