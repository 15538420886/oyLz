﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ProjContext from '../../ProjContext';
import {Button, Table, Icon, Modal, Input, Tabs} from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var BiziMemberStore = require('./data/BiziMemberStore.js');
var BiziMemberActions = require('./action/BiziMemberActions');
import UpdateBiziMemberPage from './Components/UpdateBiziMemberPage';
import BiziMemberFilter from './Components/BiziMemberFilter';

var pageRows = 10;
var BiziMemberPage = React.createClass({
	getInitialState : function() {
		return {
			biziMemberSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			biziMember: null,
			moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(BiziMemberStore, "onServiceComplete")],
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
                var mp = this.refs.BiziMemberFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.biziMember = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            biziMemberSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
        this.state.filter.corpUuid = ProjContext.selectedBiziProj.corpUuid;
		this.state.filter.projUuid = ProjContext.selectedBiziProj.uuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		BiziMemberActions.retrieveBiziProjMemberPage( this.state.filter,this.state.biziMemberSet.startPage,pageRows );
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
        this.state.filter.corpUuid = ProjContext.selectedBiziProj.corpUuid;
		this.state.filter.projUuid = ProjContext.selectedBiziProj.uuid;
		BiziMemberActions.initBiziProjMember(this.state.filter);
	},


	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.biziMemberSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
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
    onMoreSearch: function(){
        this.state.filter = this.refs.BiziMemberFilter.state.biziMember;
        this.handleQueryClick();
    },

	onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    onClickUpdate : function( biziMember, event ){
        this.setState({biziMember: biziMember, action: 'update'});
    },

    onClickLeave : function( biziMember ){
        this.setState({biziMember: biziMember, action: 'update'});
    },

    onGoBack: function () {
     
         this.setState({ action: 'query' });
        
    },

	render : function() {
		const columns = [
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
            	title: '电话',
            	dataIndex: 'phoneno',
            	key: 'phoneno',
            	width: 140,
      		},
      		{
            	title: '公司/部门名称',
            	dataIndex: 'corpName',
            	key: 'corpName',
            	width: 140,
                render:(text,record) =>( record.corpName ? record.corpName : record.deptName )
      		},
      		{
            	title: '归属地',
            	dataIndex: 'baseCity',
            	key: 'baseCity',
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
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员' style={{display:(record.endDate === "#" ) ? "none":"block" }}><Icon type={Common.iconUpdate}/></a>
					<a href="#" onClick={this.onClickLeave.bind(this, record)} title='人员离组' style={{display:(record.endDate === "#" ) ? "block":"none" }}><Icon type="user-delete"/></a>
					</span>
				),
			}
		];

        var recordSet = this.state.biziMemberSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.biziMemberSet.totalRow, pageSize:this.state.biziMemberSet.pageRow,
                current:this.state.biziMemberSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

        var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['bizi-proj-member/retrieve', 'bizi-proj-member/remove']}/>
                <BiziMemberFilter ref="BiziMemberFilter" moreFilter={moreFilter}/>

                <div style={{margin: '8px 0 0 0'}}>
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
                            <Search placeholder="查询(项目编号/项目名称)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                            <Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
                        </div>
                    }
                    </div>
                </div>
                <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                </div>
             </div>;

          var page = null;
          if(this.state.action === 'update'){
              var biziMember = {};
              Utils.copyValue(this.state.biziMember, biziMember);
              page = <UpdateBiziMemberPage onBack={this.onGoBack} biziMember={ biziMember }/>
          }

          return (
              <div style={{width: '100%', height: '100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
	}
});

module.exports = BiziMemberPage;

