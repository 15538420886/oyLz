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
var MemberEvalStore = require('./data/MemberEvalStore');
var MemberEvalActions = require('./action/MemberEvalActions');
import MemberEvalFilter from './Components/MemberEvalFilter';
import DetailsMemberPage from './Components/DetailsMemberPage';
import CodeMap from '../../../hr/lib/CodeMap';
var ProjContext = require('../../ProjContext');


var pageRows = 10;
var MemberEvalPage = React.createClass({
	getInitialState : function() {
		return {
			memberEvalSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			viewType: '1',
			action: 'query',
            memberEval: null,
			moreFilter: false,
			filterValue: '',
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(MemberEvalStore, "onServiceComplete"), CodeMap()],
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
                var mp = this.refs.MemberEvalFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.memberEval = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            memberEvalSet: data
        });
    },
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter = this.state.filter;
		filter.projUuid=ProjContext.selectedProj.uuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		MemberEvalActions.retrieveProjMemberPage( this.state.filter,this.state.memberEvalSet.startPage,pageRows );
	},
	componentDidMount : function(){
        MemberEvalActions.getCacheData(ProjContext.selectedProj.uuid);
	},	
	onClickDetails:function(memberEval, event){
        this.setState({memberEval:memberEval , action: 'update'});
    },
	onGoBack: function(){
        this.setState({action: 'query'});
    },
	onChangeView: function(e) {
		this.setState({viewType: e.target.value});
	},
	onChangePage: function(pageNumber){
        this.state.memberEvalSet.startPage = pageNumber;
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
        var filter = this.refs.MemberEvalFilter.state.memberEval;
        if(filter.beginDate !== null && filter.beginDate !== ''){
        	filter.beginDate1 = filter.beginDate + '01';
        	filter.beginDate2 = filter.beginDate + '31';
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
		var columns = [];
		if(this.state.viewType !== '1'){
			columns = [
				{
					title: '员工编号',
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
					title: '人员级别',
					dataIndex: 'userLevel',
					key: 'userLevel',
                    width: 140,
                    render: (text, record) => (this.getLevelName(record.corpUuid, record.userLevel)),
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
					title: '技术岗位',
					dataIndex: 'techLevel',
					key: 'techLevel',
					width: 140,
				},
				{
					title: '入组日期',
					dataIndex: 'beginDate',
					key: 'beginDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '离组日期',
					dataIndex: 'endDate',
					key: 'endDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '操作',
					key: 'action',
					width: 90,
					render: (text, record) => (
						<span>
							<a href="#" onClick={this.onClickDetails.bind(this, record)} title='详情'><Icon type='bars'/></a>
						</span>
					),
				}
			];
		}
		else{
			columns = [
				{
					title: '员工编号',
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
					title: '承担角色',
					dataIndex: 'roleName',
					key: 'roleName',
					width: 140,
				},
				{
					title: '评价日期',
					dataIndex: 'evalDate',
					key: 'evalDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '评价人',
					dataIndex: 'evalName',
					key: 'evalName',
					width: 140,
				},
				{
					title: '贡献度',
					dataIndex: 'contribute',
					key: 'contribute',
					width: 140,
				},
				{
					title: '入组日期',
					dataIndex: 'beginDate',
					key: 'beginDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '离组日期',
					dataIndex: 'endDate',
					key: 'endDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '操作',
					key: 'action',
					width: 90,
					render: (text, record) => (
						<span>
							<a href="#" onClick={this.onClickDetails.bind(this, record)} title='详情'><Icon type='bars'/></a>
						</span>
					),
				}
			]
		}
		
		var recordSet = this.state.memberEvalSet.recordSet;
		var moreFilter = this.state.moreFilter;
		var visible = (this.state.action === 'query') ? '' : 'none';
		var pag = {showQuickJumper: true, total:this.state.memberEvalSet.totalRow, pageSize:this.state.memberEvalSet.pageRow, current:this.state.memberEvalSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		var contactTable =
			<div className='grid-page' style={{overflow: 'hidden', display:visible}}>
				<ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve']}/>
				<MemberEvalFilter  ref="MemberEvalFilter" moreFilter={moreFilter} />	
				<div>	
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>					
							<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
								<RadioButton value="1">评价</RadioButton>
								<RadioButton value="2">人员信息</RadioButton>
							</RadioGroup>
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
			</div>;

			var page = null;
			if(this.state.action === 'update'){
				page = <DetailsMemberPage onBack={this.onGoBack} memberEval={this.state.memberEval} />;
			}

			return (
				<div style={{width: '100%'}}>
					{contactTable}
					{page}
				</div>
			);
	}
});

module.exports = MemberEvalPage;

