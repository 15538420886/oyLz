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
var ContractStore = require('./data/ContractStore');
var ContractActions = require('./action/ContractActions');

import CreateContractPage from './Components/CreateContractPage';
import UpdateContractPage from './Components/UpdateContractPage';
import ContractFilter from './Components/ContractFilter';

var pageRows = 10;
var ContractPage = React.createClass({
	getInitialState : function() {
		return {
			contractSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			contract: null,

			loading: false,
			moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(ContractStore, "onServiceComplete")],
    onServiceComplete: function(data) {
    	 if(data.operation === 'cache'){
            var ff = data.filter.contCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.contName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.ContractFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.contract = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            contractSet: data
        });
    },
    
    // 第一次加载
	componentDidMount : function(){
		ContractActions.getCacheData();
	},

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		ContractActions.retrieveProjContractPage(this.state.filter, this.state.contractSet.startPage, pageRows);
	},

	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

    onChangePage: function(pageNumber){
        this.state.contractSet.startPage = pageNumber;
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
            this.state.filter.contCode = filterValue;
        }
        else{
            this.state.filter.contName = filterValue;
        }

        this.handleQueryClick();
    },

    onMoreSearch: function(){
        var filter = this.refs.ContractFilter.state.contract;
        if(filter.signMonth !== null && filter.signMonth !== ''){
        	filter.signDate1 = filter.signMonth + '01';
        	filter.signDate2 = filter.signMonth + '31';
        } else {
            filter.signDate1 = '';
            filter.signDate2 = '';
        }
        this.state.filter = filter;
        this.handleQueryClick();
    },

	onClickDelete : function(contract, event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的合同 【'+contract.contCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, contract)
		});
	},

	onClickDelete2 : function(contract){
		this.setState({loading: true});
		this.state.contractSet.operation = '';
		ContractActions.deleteProjContract( contract.uuid );
	},

    handleAppClick: function(contract){
        ContractContext.openCustContractPage(contract);
    },


	handleCreate: function(e){
        this.setState({action: 'create'});
    },

    onClickUpdate : function(contract, event){
        this.setState({contract: contract, action: 'update'});
    },

    onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function() {
		const columns = [
			{
            	title: '合同编号',
            	dataIndex: 'contCode',
            	key: 'contCode',
            	width: 140,
      		},
      		{
            	title: '合同名称',
            	dataIndex: 'contName',
            	key: 'contName',
            	width: 140,
      		},
      		{
            	title: '合同金额',
            	dataIndex: 'contAmount',
            	key: 'contAmount',
            	width: 140,
      		},
      		{
            	title: '预估人月',
            	dataIndex: 'manMonth',
            	key: 'manMonth',
            	width: 140,
      		},
      		{
            	title: '签订日期',
            	dataIndex: 'signDate',
            	key: 'signDate',
            	width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
      		},
      		{
            	title: '开始日期',
            	dataIndex: 'beginDate',
            	key: 'beginDate',
            	width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))

      		},
      		{
            	title: '执行阶段',
            	dataIndex: 'contStage',
            	key: 'contStage',
            	width: 140,
      		},
      		{
            	title: '结束日期',
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
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var recordSet = this.state.contractSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.contractSet.totalRow, pageSize:this.state.contractSet.pageRow,
                current:this.state.contractSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		 var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['proj_contract/retrieve', 'proj_contract/remove']}/>
                <ContractFilter ref="ContractFilter" moreFilter={moreFilter}/>

                <div style={{margin: '8px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加合同" onClick={this.handleCreate}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    {
                        moreFilter ?
                        <div style={{textAlign:'right', width:'100%'}}>
                            <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
                            <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                        </div>:
                        <div style={{textAlign:'right', width:'100%'}}>
                            <Search placeholder="查询(合同编号/合同名称)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
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
              page = <CreateContractPage onBack={this.onGoBack}/>;
          }
          else if(this.state.action === 'update'){
              page = <UpdateContractPage onBack={this.onGoBack} contract={this.state.contract}/>
          }

          return (
              <div style={{width: '100%',height:'100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
    }
});

module.exports = ContractPage;

