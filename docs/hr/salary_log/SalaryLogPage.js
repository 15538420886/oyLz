'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, moreFilter, Spin, Input, Pagination} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var SalaryLogStore = require('./data/SalaryLogStore');
var SalaryLogAction = require('./action/SalaryLogAction');
import CreateSalaryLogPage from './Components/CreateSalaryLogPage';
import UpdateSalaryLogPage from './Components/UpdateSalaryLogPage';
import MoreSalaryLogPage from './Components/MoreSalaryLogPage';
import UploadSalaryPage from './Components/UploadSalaryPage';


var filterValue = '';
var pageRows = 10;
var SalaryLogPage = React.createClass({
    getInitialState : function() {
        return {
            salarySet: {
                recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            action: 'query',
            loading: false,
            moreFilter:false,
            salary: {},
            filterValue: '',
            filter: {},
        }
    },
    mixins: [Reflux.listenTo(SalaryLogStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        //console.log('onServiceComplete', data);
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
                var mp = this.refs.MoreSalaryLogPage;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.salary = this.state.filter;
                }
            }
        }
        else if(data.operation !== 'upload'){
            // 取关键数据
            data.recordSet.map((node, i) => {
                if (node.grossPay === undefined && node.salaryBody !== null) {
                    var salaryBody = eval('(' + node.salaryBody + ')');
                    node.grossPay = salaryBody.grossPay;
                    node.netPay = salaryBody.netPay;
                }
            });
        }

        this.setState({
            loading: false,
            salarySet: data
        });
    },
    handleQueryClick : function() {
        this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        SalaryLogAction.retrieveHrSalaryLogPage(this.state.filter, this.state.salarySet.startPage, pageRows);
    },
    // 第一次加载
    componentDidMount : function(){

    },

    showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

    onChangePage: function(pageNumber){
        this.state.salarySet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.state.salarySet.startPage = 1;
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

        this.state.salarySet.startPage = 1;
        this.handleQueryClick();
    },

    onMoreSearch: function(){
        this.state.filter = this.refs.MoreSalaryLogPage.state.salary;
        this.state.salarySet.startPage = 1;
        this.handleQueryClick();
    },

    onClickDelete : function(salary, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的关系人',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, salary)
        });
    },

    onClickDelete2 : function(salary)
    {
        this.setState({loading: true});
        this.state.salarySet.operation = '';
        SalaryLogAction.deleteHrSalaryLog( salary.uuid );
    },
    handleCreate: function(e){
        this.setState({action: 'create'});
    },
    handleUploadFile:function(){
        this.setState({action: 'upload'});
    },
    onClickUpdate : function(salary, event){
        this.setState({salary: salary, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    render : function(corpUuid) {
        var corpUuid = window.loginData.compUser.corpUuid;
        var recordSet = this.state.salarySet.recordSet;
        var moreFilter = this.state.moreFilter;
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
                    title: '部门名称',
                    dataIndex: 'deptName',
                    key: 'deptName',
                    width: 140,
                },
                {
                    title: '发放月份',
                    dataIndex: 'salaryMonth',
                    key: 'salaryMonth',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '发薪日期',
                    dataIndex: 'payDate',
                    key: 'payDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '绩效分数',
                    dataIndex: 'performScore',
                    key: 'performScore',
                    width: 140,
                },
                {
                    title: '应发工资',
                    dataIndex: 'grossPay',
                    key: 'grossPay',
                    width: 140,
                },
                {
                    title: '税后工资',
                    dataIndex: 'netPay',
                    key: 'netPay',
                    width: 140,
                },

                {
                    title: '更多操作',
                    key: 'action',
                    width: 140,
                    render: (text, record) => (
                        <span>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工资单'><Icon type={Common.iconUpdate}/></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工资单'><Icon type={Common.iconRemove}/></a>
                        </span>
                    ),
                }
            ];

         var visible = (this.state.action === 'query') ? '' : 'none';
         var pag = {showQuickJumper: true, total:this.state.salarySet.totalRow, pageSize:this.state.salarySet.pageRow, current:this.state.salarySet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
         var salaryTable=
             <div className='grid-page' style={{overflow: 'hidden', display:visible}}>
                <div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-salary-log/retrieve', 'hr-salary-log/remove']}/>
                    <MoreSalaryLogPage ref="MoreSalaryLogPage" moreFilter={moreFilter}  />
                    <div style={{margin: '8px 0 0 0'}}>
                        <div className='toolbar-table'>
                            <div style={{float:'left'}}>
                                <Button icon="upload" type="primary" title="导入数据" onClick={this.handleUploadFile}/>
                                <Button icon={Common.iconAdd} title="增加工资单" onClick={this.handleCreate} style={{marginLeft: '4px'}}/>
                                <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                            </div>
                        {
                            moreFilter ?
                            <div visible={this.state.open}  style={{textAlign:'right', width:'100%'}}>
                               <Button  title="查询" type="primary" onClick={this.onMoreSearch} >查询</Button>
                                <Button  title="快速条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>快速条件</Button>
                            </div>:
                            <div style={{textAlign:'right', width:'100%'}}>
                                <Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                                <Button style={{marginLeft:'8px'}} title="更多条件" onClick={this.showMoreFilter} >更多条件</Button>
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
                page = <CreateSalaryLogPage onBack={this.onGoBack} action={this.state.action}/>;
            }
            else if(this.state.action === 'update'){
                page = <UpdateSalaryLogPage onBack={this.onGoBack} salary={this.state.salary}/>
            }
            else if(this.state.action === 'upload'){
                page = <UploadSalaryPage onBack={this.onGoBack}/>
            }

        return (
             <div style={{width: '100%', height: '100%'}}>
                 {salaryTable}
                 {page}
             </div>
        );
    }
});

module.exports = SalaryLogPage;
