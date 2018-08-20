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

var ParamsStore = require('./data/ParamsStore.js');
var ParamsActions = require('./action/ParamsActions');
import CreateParamsPage from './Components/CreateParamsPage';
import UpdateParamsPage from './Components/UpdateParamsPage';

var ParamsPage = React.createClass({
    getInitialState : function() {
        return {
            paramsSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ParamsStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            paramsSet: data
        });
    },
    

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        ParamsActions.initParams(this.props.assetType.params);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(params, event)
    {
        if(params != null){
            this.refs.updateWindow.initPage(params);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(params, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的规格参数 【'+params.paramName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, params)
        });
    },

    onClickDelete2 : function(params)
    {
        this.setState({loading: true});
        var obj = {
            filter: this.props.assetType.uuid,
            object: params.paramName
        }
        ParamsActions.deleteParams( obj );
    },

    render : function() {
        var recordSet = this.state.paramsSet.recordSet;

        const columns = [
            {
                title: '名称',
                dataIndex: 'paramName',
                key: 'paramName',
                width: 140,
            },
            {
                title: '描述',
                dataIndex: 'paramDesc',
                key: 'paramDesc',
                width: 140,
            },
            {
                title: '可选择内容',
                dataIndex: 'paramOpts',
                key: 'paramOpts',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改规格参数'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除规格参数'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            },
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['params/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加规格参数" onClick={this.handleOpenCreateWindow}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateParamsPage ref="createWindow" assetType={this.props.assetType}/>
                <UpdateParamsPage ref="updateWindow" assetType={this.props.assetType}/>
            </div>
        );
    }
});

module.exports = ParamsPage;