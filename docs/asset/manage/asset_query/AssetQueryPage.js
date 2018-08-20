'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Radio} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var AssetQueryStore = require('./data/AssetQueryStore');
var AssetQueryActions = require('./action/AssetQueryActions');
import AssetFilter from './Components/AssetFilter';
import AssetMorePage from './Components/AssetMorePage';

var AssetQueryPage = React.createClass({
	getInitialState : function() {
		return {
			assetQuerySet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
            viewType: '1',
			action: 'query',

            moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(AssetQueryStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.operation === 'cache'){
            var ff = data.filter.assetCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.assetName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.AssetFilterForm;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.assetQuery = this.state.filter;
                }
            }
        }

        this.setState({
            loading: false,
            assetQuerySet: data
        });
    },
    
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.assetQuerySet.operation = '';
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
		AssetQueryActions.retrieveAssetInfo(filter, 1);
	},

	componentDidMount : function(){
		this.setState({loading: true});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
		AssetQueryActions.initAssetInfo(filter);
	},

    onChangeView: function(e) {
		this.setState({viewType: e.target.value});
	},

    	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

	onSearch3:function(){
		var filter = this.refs.AssetFilterForm.state.filter;
        this.state.filter = filter;
        this.handleQueryClick();
    },

	onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },

	onSearch:function(value){
    	this.state.filter={
			corpUuid:window.loginData.compUser.corpUuid,
		};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }
        this.handleQueryClick();
    },

    onClickMore: function(assetQuery,event){
		this.setState({assetQuery: assetQuery, action: 'detail'});
    },
        
    onGoBack:function(){
        this.setState({action: 'query'})
    },


	render : function() {
        var recordSet = this.state.assetQuerySet.recordSet;
		var moreFilter = this.state.moreFilter;
        var opCol = {
			title: '更多操作',
			key: 'action',
			width: 90,
			render: (text, record) => (
				<span>
                    <a href="#" onClick={this.onClickMore.bind(this, record)} title='更多'><Icon type="bars"/></a>
				</span>
			),
		};

        var columns = [];

		if(this.state.viewType === '1'){
			columns = [
	            {
                    title: '编号',
                    dataIndex: 'assetCode',
                    key: 'assetCode',
                    width: 140,
                },
                {
                    title: '名称',
                    dataIndex: 'assetName',
                    key: 'assetName',
                    width: 140,
                },
                {
                    title: '资产种类',
                    dataIndex: 'assertClazz',
                    key: 'assertClazz',
                    width: 140,
                },

                {
                    title: '型号',
                    dataIndex: 'assetModel',
                    key: 'assetModel',
                    width: 140,
                },
                {
                    title: '规格参数',
                    dataIndex: 'modelParam',
                    key: 'modelParam',
                    width: 140,
                },
                {
                    title: '城市',
                    dataIndex: 'assetCity',
                    key: 'assetCity',
                    width: 140,
                },
                {
                    title: '在库状态',
                    dataIndex: 'borrowState',
                    key: 'borrowState',
                    width: 140,
                },
                {
                    title: '状态',
                    dataIndex: 'assertState',
                    key: 'assertState',
                    width: 140,
                },
				opCol
			];
		}
		else if(this.state.viewType === '2'){
			columns = [
	            {
                    title: '编号',
                    dataIndex: 'assetCode',
                    key: 'assetCode',
                    width: 140,
                },
                {
                    title: '名称',
                    dataIndex: 'assetName',
                    key: 'assetName',
                    width: 140,
                },
                {
                    title: '存放地址',
                    dataIndex: 'assetLoc',
                    key: 'assetLoc',
                    width: 140,
                },
                {
                    title: '货架编号',
                    dataIndex: 'shelfCode',
                    key: 'shelfCode',
                    width: 140,
                },
                {
                    title: '借用人',
                    dataIndex: 'borrowName',
                    key: 'borrowName',
                    width: 140,
                },
                {
                    title: '电话',
                    dataIndex: 'borrowPhone',
                    key: 'borrowPhone',
                    width: 140,
                },
                {
                    title: '借用日期',
                    dataIndex: 'borrowTime',
                    key: 'borrowTime',
                    width: 140,
                },
                {
                    title: '归还日期',
                    dataIndex: 'returnDate',
                    key: 'returnDate',
                    width: 140,
                },
                {
                    title: '外借',
                    dataIndex: 'isLend',
                    key: 'isLend',
                    width: 140,
                },				
                opCol
			];
		}
		else if(this.state.viewType === '3'){
			columns = [
	            {
                    title: '编号',
                    dataIndex: 'assetCode',
                    key: 'assetCode',
                    width: 140,
                },
                {
                    title: '名称',
                    dataIndex: 'assetName',
                    key: 'assetName',
                    width: 140,
                },
                {
                    title: '采购部门',
                    dataIndex: 'requDept',
                    key: 'requDept',
                    width: 140,
                },
                {
                    title: '申请编号',
                    dataIndex: 'applyCode',
                    key: 'applyCode',
                    width: 140,
                },
                {
                    title: '价格',
                    dataIndex: 'price',
                    key: 'price',
                    width: 140,
                },
                {
                    title: '用途',
                    dataIndex: 'applyReason',
                    key: 'applyReason',
                    width: 140,
                },
                {
                    title: '生产厂家',
                    dataIndex: 'manufacturer',
                    key: 'manufacturer',
                    width: 140,
                },
                {
                    title: '入库日期',
                    dataIndex: 'storDate',
                    key: 'storDate',
                    width: 140,
                },
                {
                    title: '供应商',
                    dataIndex: 'supplierUuid',
                    key: 'supplierUuid',
                    width: 140,
                },
                opCol
			];
		}
        else{
			columns = [
	            {
                    title: '编号',
                    dataIndex: 'assetCode',
                    key: 'assetCode',
                    width: 140,
                },
                {
                    title: '名称',
                    dataIndex: 'assetName',
                    key: 'assetName',
                    width: 140,
                },
                {
                    title: '负责部门',
                    dataIndex: 'assetDept',
                    key: 'assetDept',
                    width: 140,
                },
                {
                    title: '管理员',
                    dataIndex: 'managerCode',
                    key: 'managerCode',
                    width: 140,
                },
                {
                    title: '来源',
                    dataIndex: 'assetSource',
                    key: 'assetSource',
                    width: 140,
                },
                {
                    title: '折旧方法',
                    dataIndex: 'depreType',
                    key: 'depreType',
                    width: 140,
                },
                {
                    title: '折旧年限',
                    dataIndex: 'depreYears',
                    key: 'depreYears',
                    width: 140,
                },
                {
                    title: '折旧价格',
                    dataIndex: 'deprePrice',
                    key: 'deprePrice',
                    width: 140,
                },

                {
                    title: '折旧参数',
                    dataIndex: 'depreParam',
                    key: 'depreParam',
                    width: 140,
                },
                opCol
			];
		}

        var visible = (this.state.action === 'query') ? '' : 'none';
		var cs = Common.getGridMargin(this);
        var assetTable =
			<div className='grid-page' style={{padding: cs.padding, display:visible}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['asset-info/retrieve']}/>
					<AssetFilter  ref="AssetFilterForm" moreFilter={moreFilter} />
					<div>
						<div className='toolbar-table'>
							<div style={{float:'left'}}>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
								<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
									<RadioButton value="1">基本信息</RadioButton>
									<RadioButton value="2">地址</RadioButton>
									<RadioButton value="3">采购信息</RadioButton>
                                    <RadioButton value="4">其他</RadioButton>
								</RadioGroup>
							</div>
							{
							moreFilter ?
								<div style={{textAlign:'right', width:'100%'}}>
									<Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{marginRight:'8px'}}>查询</Button>
									<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
								</div>
								:
								<div style={{textAlign:'right', width:'100%'}}>
									<Search placeholder="查询（编号/名称）" onSearch={this.onSearch} value={this.state.filterValue}  onChange={this.onChangeFilter} style={{width:'220px'}}/>
									<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
								</div>
							}
						</div>
					</div>
				</div>
                <div  style={{width:'100%', padding: '0 18px 8px 20px'}}>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>;

        var page = null;
        if (this.state.action === 'detail') {
            var asset = {};
            Utils.copyValue(this.state.assetQuery, asset);
            page = <AssetMorePage onBack={this.onGoBack} asset={asset}/>
        }

        return (
            <div style={{width: '100%',height:'100%'}}>
                {assetTable}
                {page}
            </div>
        );

	}
});

module.exports = AssetQueryPage;

