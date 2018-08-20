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

var ArticlesStore = require('./data/ArticlesStore.js');
var ArticlesActions = require('./action/ArticlesActions');
import CreateArticlesPage from './Components/CreateArticlesPage';
import UpdateArticlesPage from './Components/UpdateArticlesPage';

var ArticlesPage = React.createClass({
    getInitialState : function() {
        return {
            articlesSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ArticlesStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            articlesSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        ArticlesActions.initArticles(this.props.assetType.articles);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(articles, event)
    {
        if(articles != null){
            this.refs.updateWindow.initPage(articles);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(articles, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的物品清单 【'+articles.inventCode+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, articles)
        });
    },

    onClickDelete2 : function(articles)
    {
        this.setState({loading: true});
        var obj = {
            filter: this.props.assetType.uuid,
            object: articles.inventCode
        }
        ArticlesActions.deleteArticles( obj );
    },

    render : function() {
        var recordSet = this.state.articlesSet.recordSet;

        const columns = [
            {
                title: '序号',
                dataIndex: 'inventCode',
                key: 'inventCode',
                width: 140,
            },
            {
                title: '二维码',
                dataIndex: 'isQrcode',
                key: 'isQrcode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'inventName',
                key: 'inventName',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改物品清单'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除物品清单'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['articles/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加物品清单" onClick={this.handleOpenCreateWindow}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateArticlesPage ref="createWindow" assetType={this.props.assetType}/>
                <UpdateArticlesPage ref="updateWindow" assetType={this.props.assetType}/>
            </div>
        );
    }
});

module.exports = ArticlesPage;