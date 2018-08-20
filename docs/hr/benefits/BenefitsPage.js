'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { withRouter } from 'react-router';
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, moreFilter, Spin, Input, Pagination} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var BenefitsStore = require('./data/BenefitsStore');
var BenefitsActions = require('./action/BenefitsActions');
import CreateBenefitsPage from './Components/CreateBenefitsPage';
import UpdateBenefitsPage from './Components/UpdateBenefitsPage';
import DetailsBenefitsPage from './Components/DetailsBenefitsPage';
import MoreBenefitsPage from './Components/MoreBenefitsPage';
import CodeMap from '../lib/CodeMap';


var filterValue = '';
var pageRows = 10;
var BenefitsPage = React.createClass({
    getInitialState : function() {
        return {
            benefitsSet: {
                recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            action: 'query',
            benefits: null,

            loading: false,
            moreFilter:false,
            filterValue: '',
            filter: {},
        }
    },
     mixins: [
            Reflux.listenTo(BenefitsStore, "onServiceComplete"),
            CodeMap(),
    ],
    onServiceComplete: function(data) {
        console.log("data=",data)
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
                var mp = this.refs.MoreBenefitsPage;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.benefits = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            benefitsSet: data
        });
    },
    handleQueryClick : function() {
        this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        BenefitsActions.retrieveHrBenefitsPage(this.state.filter, this.state.benefitsSet.startPage, pageRows);
    },
    // 第一次加载
    componentDidMount : function(){
        BenefitsActions.getCacheData();
    },
    showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

    onChangePage: function(pageNumber){
        this.state.benefitsSet.startPage = pageNumber;
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
        this.state.filter = this.refs.MoreBenefitsPage.state.benefits;
        console.log('this.state.filter', this.state.filter);
        this.handleQueryClick();
    },

    onClickDelete : function(benefits, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的关系人',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, benefits)
        });
    },

    onClickDelete2 : function(benefits)
    {
        this.setState({loading: true});
        this.state.benefitsSet.operation = '';
        BenefitsActions.deleteHrBenefits( benefits.uuid );
    },
    handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickDetails:function(benefits, event){
        this.setState({benefits: benefits, action: 'detail'});
    },
    onClickUpdate : function(benefits, event){
        this.setState({benefits: benefits, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    render : function(corpUuid) {
        var corpUuid = window.loginData.compUser.corpUuid;
        var recordSet = this.state.benefitsSet.recordSet;
        var moreFilter = this.state.moreFilter;
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
                        title: '基本工资',
                        dataIndex: 'salary',
                        key: 'salary',
                        width: 140,
                    },
                    {
                        title: '绩效工资',
                        dataIndex: 'salary2',
                        key: 'salary2',
                        width: 140,
                    },
                    {
                        title: '社保基数',
                        dataIndex: 'insuBase',
                        key: 'insuBase',
                        width: 140,
                    },
                    {
                        title: '公积金基数',
                        dataIndex: 'cpfBase',
                        key: 'cpfBase',
                        width: 140,
                    },
                    {
                        title: '社保类型',
                        dataIndex: 'insuName',
                        key: 'insuName',
                        width: 140,
                        render: (text, record) => (this.getInsuName(corpUuid, record.insuName)),
                    },
                    {
                        title: '补贴类型',
                        dataIndex: 'allowName',
                        key: 'allowName',
                        width: 140,
                        render: (text, record) => (this.getAllowName(corpUuid, record.allowName)),
                    },
                    {
                        title: '更多操作',
                        key: 'action',
                        width: 140,
                        render: (text, record) => (
                            <span>
                                <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工资信息'><Icon type={Common.iconUpdate}/></a>
                                <span className="ant-divider" />
                                <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工资信息'><Icon type={Common.iconRemove}/></a>
                                <span className="ant-divider" />
                                <a href="#" onClick={this.onClickDetails.bind(this, record)} title='工资信息详情'><Icon type='bars'/></a>
                            </span>
                        ),
                    }
                ];

         var visible = (this.state.action === 'query') ? '' : 'none';
         var pag = {showQuickJumper: true, total:this.state.benefitsSet.totalRow, pageSize:this.state.benefitsSet.pageRow, current:this.state.benefitsSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
         var benefitsTable=
             <div className='grid-page' style={{overflow: 'hidden', display:visible}}>
                <div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-benefits/retrieve', 'hr-benefits/remove']}/>
                    <MoreBenefitsPage ref="MoreBenefitsPage" moreFilter={moreFilter}  />
                    <div style={{margin: '8px 0 0 0'}}>
                        <div className='toolbar-table'>
                            <div style={{float:'left'}}>
                                <Button icon={Common.iconAdd} type="primary" title="增加工资信息" onClick={this.handleCreate}/>
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                            </div>
                        {
                            moreFilter ?
                            <div visible={this.state.open}  style={{textAlign:'right', width:'100%', paddingRight:'8px',}}>
                               <Button  title="查询" onClick={this.onMoreSearch} >查询</Button>
                                <Button  title="快速条件" onClick={this.showMoreFilter} >快速条件</Button>
                            </div>:
                            <div style={{textAlign:'right', width:'100%'}}>
                                <Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                                <Button  style={{marginLeft:'8px'}} title="更多条件" onClick={this.showMoreFilter} >更多条件</Button>
                            </div>
                        }
                        </div>
                    </div>
                    <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                    </div>
                </div>
            </div>

            var page = null;
            if(this.state.action === 'create'){
                page = <CreateBenefitsPage onBack={this.onGoBack}/>;
            }
            else if(this.state.action === 'detail'){
                page =<DetailsBenefitsPage onBack={this.onGoBack} userUuid={this.state.benefits.userUuid}/>
            }
            else if(this.state.action === 'update'){
                page = <UpdateBenefitsPage onBack={this.onGoBack} benefits={this.state.benefits}/>
            }

        return (
             <div style={{width: '100%', height: '100%'}}>
                 {benefitsTable}
                 {page}
             </div>

        );
    }
});

module.exports = BenefitsPage;
