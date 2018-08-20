'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Modal, Button, Input, Select, Table, Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var AssetQueryTableStore = require('../data/AssetQueryTableStore');
var AssetQueryActions = require('../action/AssetQueryActions');

var AssetInfoTablePage = React.createClass({
    getInitialState : function() {
        return {
            assetQuerySet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(AssetQueryTableStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            assetQuerySet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var uuid = this.props.asset.uuid;
        AssetQueryActions.retrieveAssetInfoArticle(uuid);
    },

    render : function() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'inventCode',
                key: 'inventCode',
                width: 140,
            },
            {
                title: '名称',
                dataIndex: 'inventName',
                key: 'inventName',
                width: 140,
            },
            {
                title: '数量',
                dataIndex: 'inventCount',
                key: 'inventCount',
                width: 140,
            },
        ];

        var recordSet = this.state.assetQuerySet.recordSet;
        return (
            <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                <div style={{padding: '12px',height: '100%',overflowY: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['asset-info/find-by-uuid']}/>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
                </div>
            </div>             
        );
    }
});

module.exports = AssetInfoTablePage;
