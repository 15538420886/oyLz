"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal } from 'antd';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import TableListPage from './Components/TableListPage';

import XlsDown from '../../lib/Components/XlsDown';
import XlsTempFile from '../../lib/Components/XlsTempFile';
var TableInfoPage = React.createClass({
    getInitialState: function () {
        return {
            selectedTable: {},
        }
    },
    mixins: [XlsTempFile()],
    componentDidMount: function () {
    },
    onSelectTable: function (table) {
        this.setState({
            selectedTable: table
        });
    },
    xlsExport:function(){
        if(this.state.selectedTable.table === undefined || this.state.selectedTable.table.field.length ===0){
            Common.infoMsg('字段为空');
            return;
        }
        var data = this.state.selectedTable.table.field;
        var recordSet = Common.filter(data);
        var checkMemberFields = [
            { id: 'A', name: 'name', title: '字段名称' },
            { id: 'B', name: 'comment', title: '字段说明' },
            { id: 'C', name: 'type', title: '类型' },
            { id: 'D', name: 'isNull', title: '是否为空' },
        ];
        this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls);
    },
    render: function () {
        var fieldSet = [];
        var indexSet = [];
        var t = this.state.selectedTable;
        if (t !== null && t.table !== undefined) {
            fieldSet = t.table.field;
            indexSet = t.table.index;
        }

        const columns = [
            {
                title: '字段名称',
                dataIndex: 'name',
                key: 'name',
                width: 140,
            },
            {
                title: '字段说明',
                dataIndex: 'comment',
                key: 'comment',
                width: 140,
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 140,
            },
            {
                title: '非空',
                dataIndex: 'isNull',
                key: 'isNull',
                width: 90,
            },
        ];
        const idxColumns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: 160,
            },
            {
                title: '字段',
                dataIndex: 'type',
                key: 'type',
                width: 240,
            },
            {
                title: '类型',
                dataIndex: 'property',
                key: 'property',
                width: 100,
            },
        ];
        
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['table/retrieve']} />
                <TableListPage width='220px' onSelectTable={this.onSelectTable}>
                    <div style={{margin:"15px 0 0 10px"}}>
                        <Button icon='download' title="导出数据" onClick={this.xlsExport} style={{ marginLeft: '14px' }} />
                    </div>
                    <div style={{ margin: '10px 12px 32px 24px', overflow:'hidden' }}>
                        <Table columns={columns} dataSource={fieldSet} rowKey={record => record.name} pagination={false} size="middle" bordered={Common.tableBorder} />
                        <Table columns={idxColumns} dataSource={indexSet} rowKey={record => record.name} pagination={false} size="middle" bordered={Common.tableBorder} style={{ margin: '20px 0 0 0' }}/>
                    </div>
                </TableListPage>
                <XlsDown ref='xls' />
            </div>);
    }
});

module.exports = TableInfoPage;

