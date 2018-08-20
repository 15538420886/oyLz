'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Table, Button, Icon, Input, Modal, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
import CreateFieldPage from './CreateFieldPage'
import UpdateFieldPage from './UpdateFieldPage'
import PathContext from '../PathContext'

var FieldPage = React.createClass({
    getInitialState: function () {
        return {
            fieldSet: {
                errMsg: ''
            },
            loading: false,
            viewType: 'ui',
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete")],

    onServiceComplete: function (data) {
        this.setState({
            loading: false,
        });
    },

    componentDidMount: function () {
    },

    handleUpdateClick: function (field) {
        //修改
        this.refs.updateField.initPage(field);
        this.refs.updateField.toggle();
    },

    handleRemoveClick: function (field, event) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的字段 【' + field.id + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.handleRemoveClick2.bind(this, field)
        });

        event.stopPropagation();
    },

    handleRemoveClick2: function (field) {
        var resNode = PathContext.pageRes;
        var src = resNode.fields;

        var fields = [];
        var id = field.id;
        if (src !== null && src !== undefined) {
            src.map((node, i) => {
                if (node.id !== id) {
                    fields.push(node);
                }
            });
        }

        this.setState({ loading: true });
        PageDesignActions.updateFields(PathContext.selectedRes.resName, fields)
    },

    handleOpenCreateWindow: function () {
        //增加字段
        this.refs.createField.clear();
        this.refs.createField.toggle();
    },

    onChangeView: function (e) {
        var t = e.target.value;
        this.setState({
            viewType: t,
        });
    },

    onClickJsonSave: function () {
        // JSON保存
    },

    render: function () {
        var recordSet = PathContext.pageRes.fields;
        const columns = [
            {
                title: '名称',
                dataIndex: 'id',
                key: 'id',
                width: 140,
            },
            {
                title: '标题',
                dataIndex: 'desc',
                key: 'desc',
                width: 140,
            },
            {
                title: '必输',
                dataIndex: 'required',
                key: 'required',
                width: 140,
            },
            {
                title: '最大长度',
                dataIndex: 'max',
                key: 'max',
                width: 140,
            },
            {
                title: '最小长度',
                dataIndex: 'min',
                key: 'min',
                width: 140,
            },
            {
                title: '数据类型',
                dataIndex: 'datatype',
                key: 'datatype',
                width: 140,
            },
            {
                title: '正则表达式',
                dataIndex: 'pattern',
                key: 'pattern',
                width: 140,
            },
            {
                title: '错误提示',
                dataIndex: 'patternPrompt',
                key: 'patternPrompt',
                width: 140,
            },
            {
                title: '检查函数',
                dataIndex: 'validator',
                key: 'validator',
                width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 80,
                render: (field, record) => (
                    <span>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, field)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleRemoveClick.bind(this, field)} title='删除'><Icon type={Common.iconRemove} /></a>
                    </span>
                )
            },
        ];
        const columns1 = [
            {
                title: '名称',
                dataIndex: 'id',
                key: 'id',
                width: 140,
            },
            {
                title: '字段类型',
                dataIndex: 'type',
                key: 'type',
                width: 140,
            },
            {
                title: '缺省值',
                dataIndex: 'defValue',
                key: 'defValue',
                width: 140,
            },
            {
                title: '检索字段',
                dataIndex: 'opts',
                key: 'opts',
                width: 140,
            },
            {
                title: '显示代码',
                dataIndex: 'showCode',
                key: 'showCode',
                width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 80,
                render: (field, record) => (
                    <span>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, field)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleRemoveClick.bind(this, field)} title='删除'><Icon type={Common.iconRemove} /></a>
                    </span>
                )
            },
        ]

        var page = null;
        var btn = null;
        var viewType = this.state.viewType;
        if (viewType === 'ui') {
            btn = <Button icon="plus" title="增加字段" type="primary" onClick={this.handleOpenCreateWindow} />;
            page = <Table columns={columns} dataSource={recordSet} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />;
        }
        else if (viewType === 'rule') {
            btn = <Button icon="plus" title="增加字段" type="primary" onClick={this.handleOpenCreateWindow} />;
            page = <Table columns={columns1} dataSource={recordSet} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />;
        }
        else {
            btn = <Button icon="save" title="保存JSON数据" type="primary" onClick={this.onClickJsonSave}>保存</Button>;
            page = <Input type="textarea" style={{ height: '400px' }} value='我是JSON数据' onChange={this.handleOnChange} />;
        }

        var cs = Common.getGridMargin(this, 0);
        return (
            <div className='grid-page' style={{ padding: cs.padding ,overflowY: 'auto'}}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['page-design/updateFields']} />
                    <div className='grid-body'>
                        <div>
                            <div style={{ display: 'inline-block', marginTop: '20px' }}>
                                {btn}
                            </div>
                            <div style={{ marginTop: '20px', float: 'right' }}>
                                <RadioGroup value={this.state.viewType} onChange={this.onChangeView}>
                                    <RadioButton value='ui'>UI</RadioButton>
                                    <RadioButton value='rule'>规则</RadioButton>
                                    <RadioButton value='json'>JSON</RadioButton>
                                </RadioGroup>
                            </div>
                        </div>
                        <div style={{ marginTop: '16px'}}>
                            {page}
                        </div>
                    </div>
                </div>
                <CreateFieldPage ref="createField" onCreateCallback={this.onCreateCallback} />
                <UpdateFieldPage ref="updateField" onUpdateCallback={this.onUpdateCallback} />
            </div>);
    }
});

module.exports = FieldPage;
