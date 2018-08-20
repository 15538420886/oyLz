'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var AllowLogStore = require('./data/AllowLogStore.js');
var AllowLogActions = require('./action/AllowLogActions');
import AllowLogFilter from './Components/AllowLogFilter';
import CreateAllowLogPage from './Components/CreateAllowLogPage';
import UpdateAllowLogPage from './Components/UpdateAllowLogPage';
import XlsTempFile from '../../lib/Components/XlsTempFile';
import XlsConfig from '../lib/XlsConfig';

var pageRows = 10;
var AllowLogPage = React.createClass({
    getInitialState : function() {
        return {
            allowLogSet: {
                recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            action: 'query',
            allowLog: null,

            loading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(AllowLogStore, "onServiceComplete"), XlsTempFile()],
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
                var mp = this.refs.AllowLogFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.allowLog = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            allowLogSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        //this.setState({loading: true});
        AllowLogActions.getCacheData();
    },

    // 刷新
    handleQueryClick : function() {
        this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        AllowLogActions.retrieveHrAllowLogPage(this.state.filter, this.state.allowLogSet.startPage, pageRows);
    },

    showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.allowLogSet.startPage = pageNumber;
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
        var filter = this.refs.AllowLogFilter.state.allowLog;
        if(filter.applyDate !== null && filter.applyDate !== ''){
        	filter.applyDate1 = filter.applyDate + '01';
        	filter.applyDate2 = filter.applyDate + '31';
        }

        if(filter.payDate !== null && filter.payDate !== ''){
        	filter.date1 = filter.payDate + '01';
        	filter.date2 = filter.payDate + '31';
        }

        this.state.filter = filter;
        this.handleQueryClick();
    },

    onClickDelete : function(allowLog, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的报销单',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, allowLog)
        });
    },

    onClickDelete2 : function(allowLog)
    {
        this.setState({loading: true});
        this.state.allowLogSet.operation = '';
        AllowLogActions.deleteHrAllowLog( allowLog.uuid );
    },
    handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(allowLog, event){

        this.setState({allowLog: allowLog, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    handleTempDown: function(e){
        this.downXlsTempFile(XlsConfig.allowLogFields);
    },
    uploadComplete: function(errMsg){
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }
    },
    beforeUpload: function(file) {
        
        this.setState({loading: true});
        var url = Utils.hrUrl+'hr-allow-log/upload-xls';
        var data={corpUuid: window.loginData.compUser.corpUuid};
        this.uploadXlsFile(url, data, XlsConfig.allowLogFields, file, this.uploadComplete);
        return false;
    },
    getFeeDate: function (record) {
        var str = '';
        if (record.beginDate) {
            if (record.endDate) {
                str = record.beginDate + ' ~ ' + record.endDate;
            }
            else {
                str = record.beginDate + ' ~ ';
            }
        }
        else if (record.endDate) {
            str = ' ~ ' + record.endDate;
        }

        return str;
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
                        title: '部门',
                        dataIndex: 'deptName',
                        key: 'deptName',
                        width: 140,
                    },
                   {
                        title: '发放日期',
                        dataIndex: 'payDate',
                        key: 'payDate',
                        width: 140,
                        render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                    },
                   {
                        title: '报销类型',
                        dataIndex: 'allowType',
                        key: 'allowType',
                        width: 140,
                    },
                   {
                        title: '项目名称',
                        dataIndex: 'projName',
                        key: 'projName',
                        width: 140,
                    },
                   {
                        title: '费用日期',
                        dataIndex: 'beginDate',
                        key: 'beginDate',
                        width: 140,
                        render: (text, record) => (this.getFeeDate(record)),
                    },
                    {
                        title: '报销金额',
                        dataIndex: 'payAmount',
                        key: 'payAmount',
                        width: 140,
                    },
                    {
                        title: '更多操作',
                        key: 'action',
                        width: 100,
                        render: (text, record) => (
                            <span>
                            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改报销单查询'><Icon type={Common.iconUpdate}/></a>
                            <span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除报销单查询'><Icon type={Common.iconRemove}/></a>
                            </span>
                        ),
                    }
        ];

        var recordSet = this.state.allowLogSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.allowLogSet.totalRow, pageSize:this.state.allowLogSet.pageRow,
                current:this.state.allowLogSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

        var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['hr-allow-log/retrieve', 'hr-allow-log/remove']}/>
                <AllowLogFilter ref="AllowLogFilter" moreFilter={moreFilter}/>

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
              page = <CreateAllowLogPage onBack={this.onGoBack}/>;
          }
          else if(this.state.action === 'update'){
              page = <UpdateAllowLogPage onBack={this.onGoBack} allowLog={this.state.allowLog}/>
          }

          return (
              <div style={{width: '100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
    }
});

module.exports = AllowLogPage;
