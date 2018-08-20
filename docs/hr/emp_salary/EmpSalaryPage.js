'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var EmpSalaryStore = require('./data/EmpSalaryStore.js');
var EmpSalaryActions = require('./action/EmpSalaryActions');
import EmpSalaryFilter from './Components/EmpSalaryFilter';
import CreateEmpSalaryPage from './Components/CreateEmpSalaryPage';
import UpdateEmpSalaryPage from './Components/UpdateEmpSalaryPage';
import DetailsEmpSalaryPage from './Components/DetailsEmpSalaryPage';
import XlsTempFile from '../../lib/Components/XlsTempFile';
import XlsConfig from '../lib/XlsConfig';


var pageRows = 10;
var EmpSalaryPage = React.createClass({
    getInitialState : function() {
        return {
            empSalarySet: {
                recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            action: 'query',
            empSalary: null,

            loading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(EmpSalaryStore, "onServiceComplete"), XlsTempFile()],
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
                var mp = this.refs.EmpSalaryFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.empSalary = this.state.filter;
                }
            }
        }

        this.setState({
            loading: false,
            empSalarySet: data
        });
    },
    // 第一次加载
    componentDidMount : function(){
        EmpSalaryActions.getCacheData();
    },
    handleQueryClick : function() {
        this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        EmpSalaryActions.retrieveHrEmpSalaryPage(this.state.filter, this.state.empSalarySet.startPage, pageRows);
    },
    showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.empSalarySet.startPage = pageNumber;
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
        this.state.filter = this.refs.EmpSalaryFilter.state.empSalary;
        this.handleQueryClick();
    },
    onClickDelete : function(empSalary, event){
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的工作日志',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, empSalary)
        });
    },
    onClickDelete2 : function(empSalary){
        this.setState({loading: true});
        this.state.empSalarySet.operation = '';
        EmpSalaryActions.deleteHrEmpSalary( empSalary.uuid);
    },
    handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickDetails:function(empSalary, event){
        this.setState({empSalary: empSalary, action: 'detail'});
    },
    onClickUpdate : function(empSalary, event){
        this.setState({empSalary: empSalary, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
    handleTempDown: function(e){
        this.downXlsTempFile(XlsConfig.empSalaryFields);
    },
    uploadComplete: function(errMsg){
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }
    },
    beforeUpload: function(file) {
        
        this.setState({loading: true});
        var url = Utils.hrUrl+'hr-emp-salary/upload-xls';
        var data={corpUuid: window.loginData.compUser.corpUuid};
        this.uploadXlsFile(url, data, XlsConfig.empSalaryFields, file, this.uploadComplete);
        return false;
    },

    render : function() {
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
                        title: '部门名称',
                        dataIndex: 'deptName',
                        key: 'deptName',
                        width: 140,
                    },
                    {
                        title: '调前薪水',
                        dataIndex: 'befSalary',
                        key: 'befSalary',
                        width: 140,
                    },
                    {
                        title: '调后薪水',
                        dataIndex: 'aftSalary',
                        key: 'aftSalary',
                        width: 140,
                    },
                    {
                        title: '申请日期',
                        dataIndex: 'applyDate',
                        key: 'applyDate',
                        width: 140,
                        render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                    },
                    {
                        title: '执行月份',
                        dataIndex: 'chgMonth',
                        key: 'chgMonth',
                        width: 140,
                        render: (text, record) => (Common.formatMonth(text, Common.monthFormat)),
                    },
                    {
                        title: '调整类型',
                        dataIndex: 'chgType',
                        key: 'chgType',
                        width: 140,
                        render: (text, record) => (Utils.getOptionName('HR系统', '薪资调整类型', record.chgType, false, this)),
                    },

                    {
                        title: '更多操作',
                        key: 'action',
                        width: 100,
                        render: (text, record) => (
                            <span>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工作'><Icon type={Common.iconUpdate}/></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工作'><Icon type={Common.iconRemove}/></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDetails.bind(this, record)} title='详情'><Icon type='bars'/></a>
                            </span>
                        ),
                    }
        ];

        var recordSet = this.state.empSalarySet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.empSalarySet.totalRow, pageSize:this.state.empSalarySet.pageRow,
                current:this.state.empSalarySet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

        var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['hr-emp-salary/retrieve', 'hr-emp-salary/remove']}/>
                <EmpSalaryFilter ref="EmpSalaryFilter" moreFilter={moreFilter}/>

                <div style={{margin: '8px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加调薪记录" onClick={this.handleCreate}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{marginLeft: '4px'}}/>
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload}  style={{marginLeft: '4px'}}>
                                <Button icon="upload"/>
                            </Upload>
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
                <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                </div>
             </div>;

          var page = null;
          if(this.state.action === 'create'){
              page = <CreateEmpSalaryPage onBack={this.onGoBack}/>;
          }
          else if(this.state.action === 'detail'){
              page =<DetailsEmpSalaryPage onBack={this.onGoBack} userUuid={this.state.empSalary.userUuid}/>
          }
          else if(this.state.action === 'update'){
              page = <UpdateEmpSalaryPage onBack={this.onGoBack} empSalary={this.state.empSalary}/>
          }

          return (
              <div style={{width: '100%', height: '100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
    }
});

module.exports = EmpSalaryPage;
