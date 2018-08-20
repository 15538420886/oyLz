'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var UiParamStore = require('./data/UiParamStore.js');
var UiParamActions = require('./action/UiParamActions');
import CreateUiParamPage from './Components/CreateUiParamPage';
import UpdateUiParamPage from './Components/UpdateUiParamPage';

var filterValue = '';
var UiParamPage = React.createClass({
    getInitialState : function() {
        return {
            uiParamSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(UiParamStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            uiParamSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
        // FIXME 查询条件
        UiParamActions.retrieveUiParam(corpUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var corpUuid = window.loginData.compUser.corpUuid;
        UiParamActions.initUiParam(corpUuid);
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        var corpUuid = window.loginData.compUser.corpUuid;
        this.refs.createWindow.clear(corpUuid);
        this.refs.createWindow.toggle(corpUuid);
    },

    onClickUpdate : function(uiParam, event)
    {
        if(uiParam != null){
            this.refs.updateWindow.initPage(uiParam);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(uiParam, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的UI参数管理 【'+uiParam.paramName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, uiParam)
        });
    },

    onClickDelete2 : function(uiParam)
    {
        this.setState({loading: true});
        UiParamActions.deleteUiParam( uiParam.uuid );
    },

    render : function() {
        var recordSet = Common.filter(this.state.uiParamSet.recordSet, filterValue);

        const columns = [
            {
            	title: '参数名称',
            	dataIndex: 'paramName',
            	key: 'paramName',
            	width: 120,
            },
            {
            	title: '参数值',
            	dataIndex: 'paramValue',
            	key: 'paramValue',
            	width: 500,
            },
            {
                title: '操作',
                key: 'action',
                width: 80,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改UI参数管理'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除UI参数管理'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['ui-param/retrieve', 'ui-param/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加UI参数管理" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateUiParamPage ref="createWindow"/>
                <UpdateUiParamPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = UiParamPage;