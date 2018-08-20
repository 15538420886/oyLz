'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin, Input, Pagination, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var ContractStore = require('./data/ContractStore');
var ContractActions = require('./action/ContractActions');
import CreateContractPage from './Components/CreateContractPage';
import UpdateContractPage from './Components/UpdateContractPage';
import DetailsContractPage from './Components/DetailsContractPage';
import MoreContractPage from './Components/MoreContractPage';
import XlsTempFile from '../../lib/Components/XlsTempFile';
import XlsConfig from '../lib/XlsConfig';

var pageRows = 10;
var ContactPage = React.createClass({
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

    mixins: [Reflux.listenTo(ContractStore, "onServiceComplete"), XlsTempFile()],
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
                var mp = this.refs.MoreContractPage;
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
    handleQueryClick : function() {
        this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        ContractActions.retrieveHrContractPage(this.state.filter, this.state.contractSet.startPage, pageRows);
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
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }

        this.handleQueryClick();
    },
    onMoreSearch: function(){
        this.state.filter = this.refs.MoreContractPage.state.contract;
        this.handleQueryClick();
    },
    onClickDelete : function(contract, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的员工',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, contract)
        });
    },
    onClickDelete2 : function(contract)
    {
        this.setState({loading: true});
        this.state.contractSet.operation = '';
        ContractActions.deleteHrContract( contract.uuid );
    },
    handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickDetails:function(contract, event){
        this.setState({contract: contract, action: 'detail'});
    },
    onClickUpdate : function(contract, event){
        this.setState({contract: contract, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
    handleTempDown: function(e){
        this.downXlsTempFile(XlsConfig.contractFields);
    },
    uploadComplete: function(errMsg){
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }
    },
    beforeUpload: function(file) {    
        this.setState({loading: true});
        var url = Utils.hrUrl+'hr_contract/upload-xls';
        var data={corpUuid: window.loginData.compUser.corpUuid};
        this.uploadXlsFile(url, data, XlsConfig.contractFields, file, this.uploadComplete);
        return false;
    },

    render : function(corpUuid) {
        const columns = [
            {
                title: '员工号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 140,
            },
            {
                title: '员工',
                dataIndex: 'perName',
                key: 'perName',
                width: 140,
            },
            {
                title: '合同编号',
                dataIndex: 'contCode',
                key: 'contCode',
                width: 140,
            },
            {
                title: '岗位',
                dataIndex: 'jobName',
                key: 'jobName',
                width: 140,
            },
            {
                title: '签订日期',
                dataIndex: 'signDate',
                key: 'signDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
           {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
           {
                title: '失效日期',
                dataIndex: 'expiryDate',
                key: 'expiryDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
           {
                title: 'HR人员',
                dataIndex: 'hrName',
                key: 'hrName',
                width: 140,
            },

            {
                title: '更多操作',
                key: 'action',
                width: 140,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改合同'><Icon type={Common.iconUpdate}/></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除合同'><Icon type={Common.iconRemove}/></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='详情'><Icon type='bars'/></a>
                    </span>
                ),
            }
        ];

        var recordSet = this.state.contractSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.contractSet.totalRow, pageSize:this.state.contractSet.pageRow, current:this.state.contractSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
        var contactTable =
            <div className='grid-page' style={{overflow: 'hidden', display:visible}}>
                <div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_contract/retrieve', 'hr_contract/remove']}/>
                    <MoreContractPage ref="MoreContractPage" moreFilter={moreFilter}/>

                    <div style={{margin: '8px 0 0 0'}}>
                        <div className='toolbar-table'>
                            <div style={{float:'left'}}>
                                <Button icon={Common.iconAdd} type="primary" title="增加人员" onClick={this.handleCreate}/>
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                                <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{marginLeft: '4px'}}/>
                                <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload}  style={{marginLeft: '4px'}}>
                                    <Button icon="upload"/>
                                </Upload>
                            </div>
                        {
                            moreFilter ?
                            <div style={{textAlign:'right', width:'100%'}}>
                               <Button  title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
                               <Button  title="快速条件" onClick={this.showMoreFilter} >快速条件</Button>
                            </div>:
                            <div style={{textAlign:'right', width:'100%'}}>
                                <Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                                <Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
                            </div>
                        }
                        </div>
                    </div>
                    <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                    </div>
                </div>
             </div>;

         var page = null;
         if(this.state.action === 'create'){
             page = <CreateContractPage onBack={this.onGoBack}/>;
         }
         else if(this.state.action === 'detail'){
             page =<DetailsContractPage onBack={this.onGoBack} userUuid={this.state.contract.userUuid}/>
         }
         else if(this.state.action === 'update'){
             page = <UpdateContractPage onBack={this.onGoBack} contract={this.state.contract}/>
         }

         return (
             <div style={{width: '100%', height: '100%'}}>
                 {contactTable}
                 {page}
             </div>
         );
    }
});

module.exports = ContactPage;
