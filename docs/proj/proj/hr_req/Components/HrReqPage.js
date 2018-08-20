﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var ProjHrReqStore = require('../data/ProjHrReqStore.js');
var ProjHrReqActions = require('../action/ProjHrReqActions');
var ProjContext = require('../../../ProjContext');
import CreateProjHrReqPage from '../Components/CreateProjHrReqPage';
import UpdateProjHrReqPage from '../Components/UpdateProjHrReqPage';

var filterValue = '';
var HrReqPage = React.createClass({
    getInitialState : function() {
        return {
            projHrReqSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            action: 'query',
            loading: false,
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(ProjHrReqStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projHrReqSet: data
        });
    },

    
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        ProjHrReqActions.retrieveProjHrReq(window.loginData.compUser.corpUuid,ProjContext.selectedProj.uuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        ProjHrReqActions.retrieveProjHrReq(window.loginData.compUser.corpUuid,ProjContext.selectedProj.uuid);
    },

    onClickUpdate : function(projHrReq, event){
        this.refs.updateWindow.initPage(projHrReq);
        this.refs.updateWindow.toggle()
    },
    
    onClickDelete : function(projHrReq, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的类型 【'+projHrReq.reqType+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, projHrReq)
        });
    },

    onClickDelete2 : function(projHrReq)
    {
        this.setState({loading: true});
        this.state.projHrReqSet.operation = '';
        ProjHrReqActions.deleteProjHrReq( projHrReq.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    handleSelectClick: function(projHrReq){
        //console.log("projHrReq",projHrReq)
        this.props.selectsRole(projHrReq);
    },
    handleCreate : function(event) {
        var corpUuid = window.loginData.compUser.corpUuid;
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    render : function() {
        var recordSet = Common.filter(this.state.projHrReqSet.recordSet, filterValue);

        const columns = [
                {
                    title: '调动类型',
                    dataIndex: 'reqType',
                    key: 'reqType',
                    width: 140,
                },
               {
                    title: '时间类型',
                    dataIndex: 'reqType2',
                    key: 'reqType2',
                    width: 140,
                },
               {
                    title: '开始日期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
               {
                    title: '结束日期',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
               {
                    title: '人员数量',
                    dataIndex: 'reqCount',
                    key: 'reqCount',
                    width: 140,
                },
               {
                    title: '执行状态',
                    dataIndex: 'status',
                    key: 'status',
                    width: 140,
                },
            {
                title: '更多操作',
                key: 'action',
                width: 130,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员需求'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员需求'><Icon type={Common.iconRemove}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleSelectClick.bind(this, record)} title='人员详情'><Icon type={Common.iconUser}/></a>
                    </span>
                ),
            }
        ];

        var visible = (this.state.action === 'query') ? '' : 'none';

      return (
        <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
            <ServiceMsg ref='mxgBox' svcList={['proj-hr-req/retrieve', 'proj-hr-req/remove', 'proj-hr-req-detail/retrieve', 'proj-hr-req-detail/remove']}/>

            <div className='toolbar-table'>
                <div style={{float:'left'}}>
                    <Button icon={Common.iconAdd} type="primary" title="增加人员需求" onClick={this.handleCreate}/>
                    <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                </div>
                <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                    <Search placeholder="查询" style={{width: Common.searchWidth}} onChange={this.onFilterRecord}/>
                </div>
            </div>
            <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
            </div>
            <CreateProjHrReqPage ref="createWindow"/>
            <UpdateProjHrReqPage ref='updateWindow'/>
        </div>
      );
        
    }
});

module.exports = HrReqPage;




