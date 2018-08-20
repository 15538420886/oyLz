'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var EntryLocStore = require('./data/EntryLocStore.js');
var EntryLocActions = require('./action/EntryLocActions');
import CreateEntryLocPage from './Components/CreateEntryLocPage';
import UpdateEntryLocPage from './Components/UpdateEntryLocPage';

var filterValue = '';
var EntryLocPage = React.createClass({
    getInitialState : function() {
        return {
            entryLocSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            filter:{},
        }
    },

    mixins: [Reflux.listenTo(EntryLocStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            entryLocSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
        var filter=this.state.filter;
        filter.corpUuid=window.loginData.compUser.corpUuid;
        EntryLocActions.retrieveEntryLoc(filter);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var filter=this.state.filter;
        filter.corpUuid=window.loginData.compUser.corpUuid;
        EntryLocActions.initEntryLoc(filter);
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(entryLoc, event)
    {
        if(entryLoc != null){
            this.refs.updateWindow.initPage(entryLoc);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(entryLoc, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的入职地址信息 【'+entryLoc.locName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, entryLoc)
        });
    },

    onClickDelete2 : function(entryLoc)
    {
        this.setState({loading: true});
        EntryLocActions.deleteEntryLoc( entryLoc.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        var recordSet = Common.filter(this.state.entryLocSet.recordSet, filterValue);

        const columns = [
            {
                title: '地址',
                dataIndex: 'locName',
                key: 'locName',
                width: 260,
            },
            {
                title: '公司名称',
                dataIndex: 'corpName',
                key: 'corpName',
                width: 140,
            },
            {
                title: '电话',
                dataIndex: 'corpPhone',
                key: 'corpPhone',
                width: 100,
            },
            {
                title: '城市',
                dataIndex: 'cityName',
                key: 'cityName',
                width: 100,
            },
            {
                title: '操作',
                key: 'action',
                width: 40,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改入职地址信息'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除入职地址信息'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['entry-loc/retrieve', 'entry-loc/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加入职地址信息" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateEntryLocPage ref="createWindow"/>
                <UpdateEntryLocPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = EntryLocPage;