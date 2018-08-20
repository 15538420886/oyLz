'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var HrReqDetailStore = require('../data/ProjHrReqDetailStore.js');
var HrReqDetailActions = require('../action/ProjHrReqDetailActions');
import CreateHrReqDetailPage from '../Components/CreateProjHrReqDetailPage';
import UpdateHrReqDetailPage from '../Components/UpdateProjHrReqDetailPage';

var filterValue = '';
var HrReqDetailPage = React.createClass({
    getInitialState : function() {
        return {
            HrReqDetailSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(HrReqDetailStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            HrReqDetailSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        HrReqDetailActions.retrieveProjHrReqDetail(this.props.reqUuid);
    },


    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        //console.log("reqUuid",this.props.reqUuid);
       
        HrReqDetailActions.retrieveProjHrReqDetail(this.props.reqUuid);
    },
    componentWillReceiveProps:function(newProps){
        HrReqDetailActions.retrieveProjHrReqDetail(newProps.reqUuid);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear(this.props.reqUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(HrReqDetail, event)
    {
        if(HrReqDetail != null){
            this.refs.updateWindow.initPage(HrReqDetail);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(HrReqDetail, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的人员 【'+HrReqDetail.manType+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, HrReqDetail)
        });
    },

    onClickDelete2 : function(HrReqDetail)
    {
        this.setState({loading: true});
        HrReqDetailActions.deleteProjHrReqDetail( HrReqDetail.uuid );
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        //var recordSet = this.state.branchStaffSet.recordSet;
        var recordSet = Common.filter(this.state.HrReqDetailSet.recordSet, filterValue);

        const columns = [
                    {
                        title: '人员数量',
                        dataIndex: 'reqCount',
                        key: 'reqCount',
                        width: 140,
                        render: (text, record) => (
                        <span>
                          <span>{record.reqCount}/</span>
                          <span>{record.supCount}</span>
                        </span>
                      ),
                    },
                    {
                        title: '人员类型',
                        dataIndex: 'manType',
                        key: 'manType',
                        width: 140,
                    },
                    {
                        title: '从业经验',
                        dataIndex: 'induYears',
                        key: 'induYears',
                        width: 140,
                    },
                   {
                        title: '人员级别',
                        dataIndex: 'manLevel',
                        key: 'manLevel',
                        width: 140,
                    },
                   {
                        title: '技术方向',
                        dataIndex: 'techCode',
                        key: 'techCode',
                        width: 140,
                    },
                   {
                        title: '业务方向',
                        dataIndex: 'biziCode',
                        key: 'biziCode',
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
                    width: 120,
                    render: (text, record) => (
                        <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员信息'><Icon type={Common.iconUpdate}/></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员'><Icon type={Common.iconRemove}/></a>
                        </span>
                    ),
                }
        ];

        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['proj-hr-req-detail/retrieve', 'proj-hr-req-detail/remove']}/>
                <div>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加人员明细" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
                <CreateHrReqDetailPage ref="createWindow"/>
                <UpdateHrReqDetailPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = HrReqDetailPage;

