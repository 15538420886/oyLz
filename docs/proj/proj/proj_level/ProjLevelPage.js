'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjLevelStore = require('./data/ProjLevelStore.js');
var ProjLevelActions = require('./action/ProjLevelActions');
import ProjLevelFilter from './Components/ProjLevelFilter';
import CodeMap from '../../../hr/lib/CodeMap';
var ProjContext = require('../../ProjContext');

var pageRows = 10;
var ProjLevelPage = React.createClass({
	getInitialState : function() {
		return {
			projLevelSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			projLevel:null,
			moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(ProjLevelStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function(data) {
		if(data.operation === 'cache'){
            var ff = data.filter.staffCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.perName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.ProjLevelFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.projLevel = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            projLevelSet: data
        });
    },
    
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		this.state.filter.projUuid = ProjContext.selectedProj.uuid;
		ProjLevelActions.retrieveProjMemberLevelPage(this.state.filter,this.state.projLevelSet.startPage,pageRows);
	},
	componentDidMount : function(){
		this.setState({ loading: true });
        this.state.filter.projUuid = ProjContext.selectedProj.uuid;
        ProjLevelActions.initProjMemberLevel(this.state.filter);
	},	
	onChangePage: function(pageNumber){
        this.state.projLevelSet.startPage = pageNumber;
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
        var filter = this.refs.ProjLevelFilter.state.projLevel;
        if(filter.beginDate !== null && filter.beginDate !== ''){
        	filter.beginDate1 = filter.beginMonth + '01';
        	filter.beginDate2 = filter.beginMonth + '31';
        }else{
            filter.beginDate1 = '';
            filter.beginDate2 = '';
        }

        this.state.filter = filter;
        this.handleQueryClick();
    },
	onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
	onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }
        this.handleQueryClick();
    },

	render : function() {
		var recordSet = this.state.projLevelSet.recordSet;
		var moreFilter = this.state.moreFilter;
		var pag = {showQuickJumper: true, total:this.state.projLevelSet.totalRow, pageSize:this.state.projLevelSet.pageRow, current:this.state.projLevelSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		const columns = [
			{
				title: '员工号',
				dataIndex: 'staffCode',
				key: 'staffCode',
				width: 140,
			},
			{
				title: '姓名',
				dataIndex: 'perName',
				key: 'perName',
				width: 140,
			},
			{
				title: '执行日期',
				dataIndex: 'beginDate',
				key: 'beginDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},
			{
				title: '结束日期',
				dataIndex: 'endDate',
				key: 'endDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},
			{
				title: '客户定级',
				dataIndex: 'projLevel',
				key: 'projLevel',
				width: 140,
			},
			{
				title: '结算单价',
				dataIndex: 'userPrice',
				key: 'userPrice',
				width: 140,
			},
			{
				title: '人员级别',
				dataIndex: 'userLevel',
				key: 'userLevel',
				width: 140,
				render: (text, record) => (this.getLevelName(record.corpUuid, record.userLevel)),
			},
			{
				title: '成本价',
				dataIndex: 'userCost',
				key: 'userCost',
				width: 140,
			}
		];

		return (
			<div className='grid-page'>
				<div>
					<ServiceMsg ref='mxgBox' svcList={['proj-member-level/retrieve', 'proj-member-level/remove']}/>
					<ProjLevelFilter  ref="ProjLevelFilter" moreFilter={moreFilter} />
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						{
							moreFilter ?
							<div style={{textAlign:'right', width:'100%'}}>
								<Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
								<Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
							</div>:
							<div style={{textAlign:'right', width:'100%'}}>
								<Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
								<Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
							</div>
                    	}
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>
		);
	}
});

module.exports = ProjLevelPage;

