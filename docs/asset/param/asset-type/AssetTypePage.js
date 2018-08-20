'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import DictRadio from '../../../lib/Components/DictRadio';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var AssetTypeStore = require('./data/AssetTypeStore.js');
var AssetTypeActions = require('./action/AssetTypeActions');
import CreateAssetTypePage from './Components/CreateAssetTypePage';
import UpdateAssetTypePage from './Components/UpdateAssetTypePage';

var filterValue = '';
var AssetTypePage = React.createClass({
    getInitialState : function() {
        return {
            assetTypeSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            assetType: null,
            assertClazz: ''
        }
    },

    mixins: [Reflux.listenTo(AssetTypeStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            assetTypeSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
    },

    onButtonChange : function(e) {
        this.state.assertClazz = '' + e.target.value;
        this.setState({loading: true});
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.assertClazz = this.state.assertClazz;
        AssetTypeActions.retrieveAssetType(filter);
    },

    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },
    onClickUpdate : function(assetType, event)
    {
        if(assetType != null){
            this.setState({assetType: assetType, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        var recordSet = Common.filter(this.state.assetTypeSet.recordSet, filterValue);

        const columns = [
            {
                title: '类别编号',
                dataIndex: 'typeCode',
                key: 'typeCode',
                width: 140,
            },
            {
                title: '类别名称',
                dataIndex: 'typeName',
                key: 'typeName',
                width: 140,
            },
            {
                title: '折旧年限',
                dataIndex: 'depreYear',
                key: 'depreYear',
                width: 140,
            },
            {
                title: '折旧方法',
                dataIndex: 'depreType',
                key: 'depreType',
                width: 140,
                render: (text, record) => (Utils.getOptionName('固定资产', '折旧方法', record.depreType, true, this)),
            },
            {
                title: '采购部门',
                dataIndex: 'purchDept',
                key: 'purchDept',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改资产类别'><Icon type={Common.iconUpdate}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['asset-type/retrieve']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加资产类别" onClick={this.handleOpenCreateWindow}/>
                            <DictRadio style={{marginLeft: '24px'}} type='button' value={this.state.assertClazz} appName='固定资产' optName='资产种类' onChange={this.onButtonChange}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
            </div>
        );
        
		var formPage = null;
		if(this.state.action === 'create'){
            formPage = <CreateAssetTypePage onBack={this.onGoBack} assertClazz={this.state.assertClazz}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateAssetTypePage onBack={this.onGoBack} assetType={this.state.assetType} assertClazz={this.state.assertClazz}/>
		}
		
		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = AssetTypePage;