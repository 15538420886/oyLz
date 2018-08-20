import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Table } from 'antd';
const FormItem = Form.Item;

import ModalForm from '../../../lib/Components/ModalForm';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
import PathContext from '../PathContext'

var CreateFieldPage2 = React.createClass({
    getInitialState: function () {
        return {
            field2Set: [],
            selectedRowKeys: [],

            loading: false,
            modal: false,
            hints: {},
            validRules: [],
            page: {},
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('')],
    onServiceComplete: function (data) {
        if (data.operation === 'updatePage') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },

    clear: function (page) {
        this.state.page = page;

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        var page = {};
        Utils.copyValue(this.state.page, page);

        var fields = [];
        var fieldMap = {};
        if (page.fields !== null && page.fields !== undefined) {
            page.fields.map((node, i) => {
                fields.push(node);
                fieldMap[node.fieldID] = node;
            });
        }

        this.state.selectedRowKeys.map((node, i) => {
            var field = fieldMap[node];
            if (field === null || field === undefined) {
                field = { fieldID: node };
                fields.push(field );
            }
        });

        page.fields = fields;
        this.setState({ loading: true });
        PageDesignActions.updatePage(PathContext.selectedRes.resName, page)
    },
    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },

    render: function () {
        const columns = [
            {
                title: '名称',
                dataIndex: 'id',
                key: 'id',
                width: 200,
            },
            {
                title: '标题',
                dataIndex: 'desc',
                key: 'desc',
                width: 200,
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 200,
            }
        ];

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.selectedRows = selectedRows;
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record);//内容
                console.log(selected);//true  false
                console.log(selectedRows); //[内容]
                this.state.selectedRows = selectedRows;
            },
        };

        var recordSet = PathContext.pageRes.fields;
        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加字段" style={{ overflowY: 'auto' }} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['page-design/updatePage']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading1}>确定</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '0 12px 0 12px' }}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.id} rowSelection={rowSelection} loading={this.state.loading} size='middle' pagination={false} bordered={Common.tableBorder} />
                    </div>
                </div>
            </Modal>
        );
    }
});

export default CreateFieldPage2;
