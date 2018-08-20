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
var ProjReqStore = require('./data/ProjReqStore');
var ProjReqActions = require('./action/ProjReqActions');
import ProjReqFilter from './Components/ProjReqFilter';
var ProjContext = require('../../ProjContext');


var pageRows = 10;
var ProjReqPage = React.createClass({
	getInitialState : function() {
		return {
			ProjReqSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			viewType: '1',
			action: 'query',
            ProjReq: null,
			moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(ProjReqStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.operation === 'cache'){
            var ff = data.filter.projName;
            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.ProjReqFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.ProjReq = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            ProjReqSet: data
        });
    },
    // 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter = this.state.filter;
		filter.corpUuid= window.loginData.compUser.corpUuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		ProjReqActions.retrieveProjReqPage( this.state.filter,this.state.ProjReqSet.startPage,pageRows );
        
	},
	// 第一次加载
	componentDidMount : function(){
		this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        ProjReqActions.initProjReq(this.state.filter);
	},
	onGoBack: function(){
        this.setState({action: 'query'});
    },
	onChangeView: function(e) {
		this.setState({viewType: e.target.value});
	},
	onChangePage: function(pageNumber){
		console.log(pageNumber)
        this.state.ProjReqSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
	onMoreSearch: function(){
        var filter = this.refs.ProjReqFilter.state.ProjReq;

        // if(filter.beginDate !== null && filter.beginDate !== ''){
        // 	// filter.beginDate1 = filter.beginDate + '01';
        // 	// filter.beginDate2 = filter.beginDate + '31';
        	
        // }else{
        //     filter.beginDate1 = '';
        //     filter.beginDate2 = '';
        // }
        console.log(filter);
        this.state.filter = filter;
        this.handleQueryClick();

    },
	onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
	onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        this.state.filter.projName = filterValue;
        this.handleQueryClick();
    },
	
	render : function() {
		var columns = [];
		if(this.state.viewType !== '1'){
			columns = [
				{
					title: '项目名称',
					dataIndex: 'projName',
					key: 'projName',
					width: 120,
                },
				{
					title: '人员数量',
					dataIndex: 'reqCount',
					key: 'reqCount',
					width: 120,
				},
				{
					title: '人员类型',
					dataIndex: 'manType',
					key: 'manType',
					width: 120,
                },
                {
                    title: '技术方向',
                    dataIndex: 'techCode',
                    key: 'techCode',
                    width: 150,
                },
                {
                    title: '业务方向',
                    dataIndex: 'biziCode',
                    key: 'biziCode',
                    width: 180,
                },
				{
					title: '从业经验',
					dataIndex: 'induYears',
					key: 'induYears',
					width: 120,
				},
				{
					title: '人员级别',
					dataIndex: 'manLevel',
					key: 'manLevel',
					width: 120,
				},
				{
					title: '到岗数量',
					dataIndex: 'supCount',
					key: 'supCount',
					width: 120,
				},
				{
					title: '执行状态',
					dataIndex: 'status',
					key: 'status',
					width: 90,
				}
			];
		}
		else{
			columns = [
				{
					title: '项目名称',
					dataIndex: 'projName',
					key: 'projName',
					width: 120,
				},
				{
					title: '项目地址',
					dataIndex: 'projLoc',
					key: 'projLoc',
					width: 120,
				},
				{
					title: '项目经理',
					dataIndex: 'pmName',
					key: 'pmName',
					width: 120,
				},
				{
					title: '调动类型',
					dataIndex: 'reqType',
					key: 'reqType',
					width: 120,
				},
				{
					title: '预计开始',
					dataIndex: 'beginDate',
					key: 'beginDate',
					width: 120,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '预计结束',
					dataIndex: 'endDate',
					key: 'endDate',
					width: 120,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
                },
                {
                    title: '人员类型',
                    dataIndex: 'manType',
                    key: 'manType',
                    width: 120,
                },
                {
                    title: '人员数量',
                    dataIndex: 'reqCount',
                    key: 'reqCount',
                    width: 120,
                },
			]
		}
		
		var recordSet = this.state.ProjReqSet.recordSet;
		var moreFilter = this.state.moreFilter;
		var visible = (this.state.action === 'query') ? '' : 'none';
		var pag = {showQuickJumper: true, total:this.state.ProjReqSet.totalRow, pageSize:this.state.ProjReqSet.pageRow, current:this.state.ProjReqSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		
		var contactTable =
			<div className='grid-page' style={{overflow: 'hidden', display:visible}}>
				<ServiceMsg ref='mxgBox' svcList={['proj-hr-req-detail/retrieve1']}/>
				<ProjReqFilter  ref="ProjReqFilter" moreFilter={moreFilter} />
				<div>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>					
							<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
								<RadioButton value="1">项目</RadioButton>
								<RadioButton value="2">人员</RadioButton>
							</RadioGroup>
						</div>
						{
							moreFilter ?
							<div style={{textAlign:'right', width:'100%'}}>
								<Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
								<Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
							</div>:
							<div style={{textAlign:'right', width:'100%'}}>
								<Search placeholder="查询(项目名称)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
								<Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
							</div>
                    	}
					</div>
				</div>
				<div className='grid-body'>
				<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} expandedRowRender={record => <div><p>{record.techDesc}</p><p>{record.biziDesc}</p></div>}/>
				</div>
			</div>;
			return (
				<div style={{width:'100%'}}>
					{contactTable}
				</div>
			);
	}
});

module.exports = ProjReqPage;

