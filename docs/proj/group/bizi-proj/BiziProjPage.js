﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var BiziProjStore = require('./data/BiziProjStore.js');
var BiziProjActions = require('./action/BiziProjActions');
var ProjContext = require('../../ProjContext');
import CreateBiziProjPage from './Components/CreateBiziProjPage';
import UpdateBiziProjPage from './Components/UpdateBiziProjPage';
import BiziProjFilter from './Components/BiziProjFilter';

var pageRows = 10;
var BiziProjPage = React.createClass({
	getInitialState : function() {
		return {
			biziProjSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			biziProj: null,

			loading: false,
			moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(BiziProjStore, "onServiceComplete")],
    onServiceComplete: function(data) {
    	 if(data.operation === 'cache'){
            var ff = data.filter.projCode;
            if(!ff){
                ff = data.filter.projName;
                if(!ff){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.BiziProjFilter;
                if(mp){
                    mp.state.biziProj = this.state.filter;
                }
            }

            if (this.state.filter.corpUuid !== window.loginData.compUser.corpUuid) {
                this.handleQueryClick();
                return;
            }
        }

        this.setState({
            loading: false,
            biziProjSet: data
        });
    },

    // 第一次加载
	componentDidMount : function(){
		BiziProjActions.getCacheData();
	},

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		BiziProjActions.retrieveBiziProjInfoPage(this.state.filter, this.state.biziProjSet.startPage, pageRows);
	},

	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.biziProjSet.startPage = pageNumber;
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
            this.state.filter.projCode = filterValue;
        }
        else{
            this.state.filter.projName = filterValue;
        }

        this.handleQueryClick();
    },
    onMoreSearch: function(){
        var filter = this.refs.BiziProjFilter.state.biziProj;
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

	onClickDelete : function(biziProj, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的项目 【'+biziProj.projCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, biziProj)
		});
	},

	onClickDelete2 : function(biziProj)
	{
		this.setState({loading: true});
		this.state.biziProjSet.operation = '';
		BiziProjActions.deleteBiziProjInfo( biziProj.uuid );
	},

    handleAppClick: function(biziProj){
        ProjContext.openGroupBiziProjPage(biziProj);
    },


	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(biziProj, event){

        this.setState({biziProj: biziProj, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function() {

		const columns = [
					{
            		    title: '项目编号',
            		    dataIndex: 'projCode',
            		    key: 'projCode',
            		    width: 140,
      		        },
      		       {
            		    title: '项目名称',
            		    dataIndex: 'projName',
            		    key: 'projName',
            		    width: 140,
      		        },
      		       {
            		    title: '项目类型',
            		    dataIndex: 'projType',
            		    key: 'projType',
            		    width: 140,
      		        },
      		       {
            		    title: '主办方',
            		    dataIndex: 'projHost',
            		    key: 'projHost',
            		    width: 140,
      		        },
      		       {
            		    title: '开始日期',
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
            		    title: '项目地址',
            		    dataIndex: 'projLoc',
            		    key: 'projLoc',
            		    width: 140,
      		        },
      		       {
            		    title: '项目经理',
            		    dataIndex: 'pmName',
            		    key: 'pmName',
            		    width: 140,
      		        },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目'><Icon type={Common.iconRemove}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleAppClick.bind(this, record)} title='项目详情'><Icon type="bars"/></a>
					</span>
				),
			}
		];

		var recordSet = this.state.biziProjSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.biziProjSet.totalRow, pageSize:this.state.biziProjSet.pageRow,
                current:this.state.biziProjSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		 var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['bizi-proj/retrieve', 'bizi-proj/remove']}/>
                <BiziProjFilter ref="BiziProjFilter" moreFilter={moreFilter}/>

                <div style={{margin: '8px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加项目" onClick={this.handleCreate}/>
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
          if(this.state.action === 'create'){
              page = <CreateBiziProjPage onBack={this.onGoBack}/>;
          }
          else if(this.state.action === 'update'){
              var biziProj = {};
              Utils.copyValue(this.state.biziProj, biziProj);
              page = <UpdateBiziProjPage onBack={this.onGoBack} biziProj={biziProj}/>
          }

          return (
              <div style={{width: '100%',height:'100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
    }
});

module.exports = BiziProjPage;
