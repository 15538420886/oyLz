'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal,Spin,Input,Radio,Pagination} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var StaffQueryStore = require('./data/StaffQueryStore');
var StaffQueryActions = require('./action/StaffQueryActions');

import StaffQueryFilter from './Components/StaffQueryFilter';
import ProjContext from '../../ProjContext';
import CodeMap from '../../../hr/lib/CodeMap';

var pageRows = 10;
var StaffQueryPage = React.createClass({
	getInitialState : function() {
		return {
			staffQuerySet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			moreFilter: false,
			viewType: '1',
			filterValue:'',
			filter:{},
			staffQuery:null
		}
	},

    mixins: [Reflux.listenTo(StaffQueryStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function(data) {
		 if(data.operation === 'cache'){
            var ff = data.filter.staffQueryCode;
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
                var mp = this.refs.StaffQueryFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.filter = data.filter;
                }
            }
        }
        this.setState({
            loading: false,
            staffQuerySet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter = this.state.filter;
		filter.corpUuid= window.loginData.compUser.corpUuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
		StaffQueryActions.retrieveOutJobPage(filter, this.state.staffQuerySet.startPage,pageRows);
	},

	// 第一次加载
	componentDidMount : function(){
		StaffQueryActions.getCacheData();
	},

	onChangeView: function(e) {
		this.setState({viewType: e.target.value});
	},

	onFilterRecord: function(e){
		 this.setState( {filterValue: e.target.value} );
	},

	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
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

	onSearch3:function(){
		var filter = this.refs.StaffQueryFilter.state.filter;
        this.state.filter = filter;
        this.handleQueryClick();
    },

	onChangePage: function(pageNumber){
        this.state.staffQuerySet.startPage = pageNumber;
        this.handleQueryClick();
    },

	onGoBack: function(){
        this.setState({action: 'query'});
    },
	
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },

	getWorkYear: function(value){
		if(value === undefined || value === null || value === ''){
			return '';
		}

		var pos = value.indexOf('.');
		if(pos > 0){
			var y = value.substr(0, pos);
			var m = value.substr(pos+1);
			var y2 = parseInt(y);
			var m2 = parseInt(m);
			if(m2 > 0){
				return '' + y2 + '年' + m2 + '月';
			}
			else{
				return '' + y2 + '年';
			}
		}

		return value + '年';
	},

	render : function(corpUuid) {
		var corpUuid = window.loginData.compUser.corpUuid;
		var columns = [];
		if(this.state.viewType === '1'){
			 columns = [
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
					title: '职位',
					dataIndex: 'jobTitle',
					key: 'jobTitle',
					width: 140,
				},
				{
					title: '最高学历',
					dataIndex: 'eduDegree',
					key: 'eduDegree',
					width: 140,
				},
				{
					title: '公司名称',
					dataIndex: 'corpName',
					key: 'corpName',
					width: 140,
				},
				{
					title: '工作年限',
					dataIndex: 'workYears',
					key: 'workYears',
					width: 140,
					render: (text, record) => (this.getWorkYear(text)),
				},
				{
					title: '行业经验',
					dataIndex: 'induYears',
					key: 'induYears',
					width: 140,
					render: (text, record) => (this.getWorkYear(text)),
				},
				{
					title: '归属地',
					dataIndex: 'baseCity',
					key: 'baseCity',
					width: 140,
				},
			];
		}else{
			 columns = [
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
            		    title: '公司名称',
            		    dataIndex: 'corpName',
            		    key: 'corpName',
            		    width: 140,
      		        },
      		       {
            		    title: '员工级别',
            		    dataIndex: 'empLevel',
            		    key: 'empLevel',
            		    width: 140,
						render: (text, record) => (this.getLevelName(corpUuid, record.empLevel)),
      		        },
      		       {
            		    title: '管理岗位',
            		    dataIndex: 'manName',
            		    key: 'manUuid',
            		    width: 140,
      		        },
      		       {
            		    title: '技术岗位',
            		    dataIndex: 'techName',
            		    key: 'techUuid',
            		    width: 140,
      		        },
      		       {
            		    title: '结算单价',
            		    dataIndex: 'userCost',
            		    key: 'userCost',
            		    width: 140,
      		        },
      		       {
            		    title: '生效日期',
            		    dataIndex: 'effectDate',
            		    key: 'effectDate',
            		    width: 140,
      		        },
      		 ]
		}	

	    var recordSet = this.state.staffQuerySet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.staffQuerySet.totalRow, pageSize:this.state.staffQuerySet.pageRow, current:this.state.staffQuerySet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		 var staffQueryTable =
		 	<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
					<ServiceMsg ref='mxgBox' svcList={['out-staff/retrieve']}/>
					<StaffQueryFilter  ref="StaffQueryFilter" moreFilter={moreFilter} />
					<div style={{margin: '8px 0 0 0'}}>
						<div className='toolbar-table'>
							<div style={{float:'left'}}>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
								<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
									<RadioButton value="1">基本信息</RadioButton>
									<RadioButton value="2">岗位</RadioButton>
								</RadioGroup>
							</div>
							{
								moreFilter ?
									<div style={{textAlign:'right', width:'100%'}}>
										<Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{marginRight:'8px'}}>查询</Button>
										<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
									</div>
									:
									<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} onSearch={this.onSearch}  />
										<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
									</div>
							}
						</div>
					</div>	
					<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
						<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
					</div>
			</div>

			var page = null;
		    if(this.state.action === 'update'){
				page = <UpdateStaffQueryPage onBack={this.onGoBack} staffQuery={this.state.staffQuery}/>
			}

			return (
				<div style={{width: '100%', height: '100%'}}>
					{staffQueryTable}
					{page}
				</div>
			);
	}
});

module.exports = StaffQueryPage;

