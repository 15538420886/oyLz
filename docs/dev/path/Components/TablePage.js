'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal, Tabs, Radio } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ModalForm from '../../../lib/Components/ModalForm';

import TablePageList from './TablePageList';
import CreateFieldPage2 from './CreateFieldPage2';
import UpdateFieldPage2 from './UpdateFieldPage2';
import CreateParamPage from './CreateParamPage';
import UpdateParamPage from './UpdateParamPage';

var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');
import PathContext from '../PathContext'

var filterValue = '';
var TablePage = React.createClass({
    getInitialState: function () {
        return {
            tableSet: {
                recordSet: [],
                appUuid: '',
                errMsg: ''
            },
            viewType: 'page',
            page: {},
            page2: {},
            hints: {},
            validRules: [],
            loading: false,
            loading2: false,
            recordSet: [],
            fieldMap: {},
        }
    },
    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('page2')],
    onServiceComplete: function (data) {
        if (this.state.loading) {
            if (data.operation === 'updatePage') {
                // console.log('data', data)
                this.setState({
                    loading: false,
                }); 
            }
        }
        else if (this.state.loading2) {
            if (data.operation === 'newPage') {
                this.state.page.pageBody = data.pageText;
                this.state.page2.pageBody = data.pageText;

                this.setState({
                    loading2: false,
                });
            }
        }
    },

    componentDidMount: function () {
        this.state.validRules = [
            { id: 'pageBody', desc: '目录名称', required: false, max: 64 },
        ];

        this.loadFields();
    },
    loadFields: function () {
        var fieldMap = {};
        if (PathContext.pageRes.fields !== null) {
            PathContext.pageRes.fields.map((node, i) => {
                fieldMap[node.id] = node;
            });
        }

        this.state.fieldMap = fieldMap;
    },

    onSelectPage: function (data) {
        this.state.page2.pageBody = data.pageBody;
        this.setState({
            page: data,
        });
    },
    onChangeView: function (e) {
        var t = e.target.value;
        this.setState({
            viewType: t,
        });
    },
    handleOpenCreateWindow: function () {
        var id = this.state.page.pageID;
        if (id === undefined || id === null) {
            const modal = Modal['warning']({ title: '警告', content: '请选择页面', width: 400 });
            return;
        }

        if (this.state.viewType === 'field') {
            // 增加字段
            this.refs.createField2.clear(this.state.page);
            this.refs.createField2.toggle();
        }
        else {
            this.refs.createParam.clear(this.state.page);
            this.refs.createParam.toggle();
        }
    },
    onClickSave: function () {
        var id = this.state.page.pageID;
        if (id === undefined || id === null) {
            const modal = Modal['warning']({ title: '警告', content: '请选择页面', width: 400 });
            return;
        }

        var page = {};
        Utils.copyValue(this.state.page, page);
        page.pageBody = this.state.page2.pageBody;

        this.setState({ loading: true });
        PageDesignActions.updatePage(PathContext.selectedRes.resName, page)
    },
    onClickProduct: function () {
        var id = this.state.page.pageID;
        if (id === undefined || id === null) {
            const modal = Modal['warning']({ title: '警告', content: '请选择页面', width: 400 });
            return;
        }

        // 字段
        var fields = [];
        var fieldMap = {};
        var fList = this.state.page.fields;
        if (fList !== undefined && fList !== null) {
            PathContext.pageRes.fields.map((node, i) => {
                fieldMap[node.id] = node;
            });

            fList.map((node, i) => {
                var field = fieldMap[node.fieldID];
                if (field === undefined) {
                    field = null;
                }

                fields.push(field);
            });
        }

        // 服务器地址
        var host = 'authUrl';
        var url = window.devApp.dbSchema;
        var pos = url.indexOf('}');
        if (pos > 0) {
            host = url.substr(1, pos - 1);
        }

        //生成页面
        var obj = {};
        obj.host = host;
        obj.pageInfo = this.state.page;
        obj.resPage = PathContext.pageRes.pageInfo;
        obj.fields = fields;
        // console.log('obj', obj);

        this.setState({ loading2: true });
        PageDesignActions.newPage(obj);
    },
    handleUpdateClick: function (field) {
        //字段修改
        this.refs.updateField2.initPage(this.state.page, field);
        this.refs.updateField2.toggle();
    },
    handleRemoveClick: function (field) {
        //字段删除
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的字段 【' + field.fieldID + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete.bind(this, field)
        });
    },
    onClickDelete: function (field) {
        var page = {};
        Utils.copyValue(this.state.page, page);

        var fields = [];
        var oldName = field.fieldID;
        if (page.fields !== null && page.fields !== undefined) {
            page.fields.map((node, i) => {
                if (oldName !== node.fieldID) {
                    fields.push(node);
                }
            });
        }

        page.fields = fields;

        this.setState({ loading: true });
        PageDesignActions.updatePage(PathContext.selectedRes.resName, page)
    },
    handleUpdateClick1: function (param) {
        //参数修改
        this.refs.updateParam.initPage(this.state.page, param);
        this.refs.updateParam.toggle();
    },
    handleRemoveClick1: function (param) {
        //参数删除 
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的字段 【' + param.name + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete1.bind(this, param)
        });
    },
    onClickDelete1: function (param) {
        var page = {};
        Utils.copyValue(this.state.page, page);

        var params = [];
        var oldName = param.name;
        if (page.params !== null && page.params !== undefined) {
            page.params.map((node, i) => {
                if (oldName !== node.name) {
                    params.push(node);
                }
            });
        }

        page.params = params;

        this.setState({ loading: true });
        PageDesignActions.updatePage(PathContext.selectedRes.resName, page)
    },

    render: function () {
        var fieldSet = this.state.page.fields;
        var paramSet = this.state.page.params;
        var fieldMap = this.state.fieldMap;
        // console.log('fieldMap', fieldMap)
        
        const columns = [
            {
                title: '字段名称',
                dataIndex: 'fieldID',
                key: 'fieldID',
                width: 140,
            },
            {
                title: '标题',
                dataIndex: 'fieldID',
                key: 'fieldTitle',
                width: 140,
                render: (text, record) => ((fieldMap[text] === undefined) ? '' : fieldMap[text].desc),
            },
            {
                title: '宽度',
                dataIndex: 'colSpan',
                key: 'colSpan',
                width: 100,
            },
            {
                title: '参数',
                dataIndex: 'param',
                key: 'param',
                width: 340,
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
            }
        ];
        const columns1 = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: 140,
            },
            {
                title: '值',
                dataIndex: 'value',
                key: 'value',
                width: 340,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 80,
                render: (param, record) => (
                    <span>
                        <a href="#" onClick={this.handleUpdateClick1.bind(this, param)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.handleRemoveClick1.bind(this, param)} title='删除'><Icon type={Common.iconRemove} /></a>
                    </span>
                )
            }
        ];

        var viewType = this.state.viewType
        var cs = Common.getGridMargin(this, 0);
        return ( 
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['page-design/updatePage', 'page-design/newPage']} />
                </div>
                <div style={{ height: '100%', paddingLeft: '4px' }}>
                    <TablePageList ref='modList' width='220px' onSelectPage={this.onSelectPage} >
                        <div className='grid-body'>
                            <div>
                                <div style={{ display: 'inline-block', marginTop: '20px' }}>
                                    <Button icon={Common.iconAdd} type="primary" title="增加" style={{ marginRight: '4px', display: viewType !== 'page' ? '' : 'none' }} onClick={this.handleOpenCreateWindow} />
                                    <Button key="save" type='primary' size="middle" style={{ marginRight: '4px', display: viewType === 'page' ? '' : 'none' }} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>
                                    <Button key="product" type='primary' size="middle" style={{ display: viewType === 'page' ? '' : 'none' }} onClick={this.onClickProduct} loading={this.state.loading2}>生成页面</Button>
                                </div>
                                <div style={{ marginTop: '20px', float: 'right' }}>
                                    <RadioGroup value={this.state.viewType} onChange={this.onChangeView}>
                                        <RadioButton value='field'>字段</RadioButton>
                                        <RadioButton value='param'>参数</RadioButton>
                                        <RadioButton value='page'>页面</RadioButton>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <Table columns={columns} dataSource={fieldSet} style={{ display: viewType === 'field' ? '' : 'none' }} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                                <Table columns={columns1} dataSource={paramSet} style={{ display: viewType === 'param' ? '' : 'none' }} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                                <div style={{ display: viewType === 'page' ? '' : 'none' }}>
                                    <Input type="textarea" name='pageBody' id='pageBody' style={{ height: '400px' }} value={this.state.page2.pageBody} onChange={this.handleOnChange} />
                                </div>
                            </div>
                        </div>
                    </TablePageList>
                </div>
                <CreateFieldPage2 ref="createField2" />
                <UpdateFieldPage2 ref="updateField2" />
                <CreateParamPage ref="createParam" />
                <UpdateParamPage ref="updateParam" />
            </div>
        );
    }
});

module.exports = TablePage;
