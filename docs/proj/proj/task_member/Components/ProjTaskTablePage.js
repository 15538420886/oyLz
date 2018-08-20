'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../../../public/script/common');

var ProjContext = require('../../../ProjContext');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';

var Utils = require('../../../../public/script/utils');
var ProjTaskMemberStore = require('../data/ProjTaskMemberStore');
var ProjTaskMemberActions = require('../action/ProjTaskMemberActions'); 
import CreateProjTaskMemberPage from '../Components/CreateProjTaskMemberPage';
import UpdateProjTaskMemberPage from '../Components/UpdateProjTaskMemberPage';
import CreateProjTempMemberPage from '../Components/CreateProjTempMemberPage';

var filterValue = '';
var pageRows = 10;
var ProjTaskTablePage = React.createClass({
    getInitialState : function() {
        return {
            projSet:{
                recordSet:[],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading:false,
            taskUuid:'',
            recordSet:[],
        }
    },
    mixins: [Reflux.listenTo(ProjTaskMemberStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.state.recordSet = [];
        if(data.errMsg === '' && this.state.taskUuid !== ''){
            data.recordSet.map((proj,index)=>{
                if(this.state.taskUuid === proj.taskUuid){
                    this.state.recordSet.push(proj);
                }
            })
        }   
        this.setState({
            loading: false,
            projSet: data
        });
    },
    componentDidMount : function(){
    },
    handleQueryClick: function(){
        this.setState({loading: true});
        var taskUuid = this.state.taskUuid;
        ProjTaskMemberActions.retrieveProjTaskMemberPage(taskUuid,this.state.projSet.startPage, pageRows)
    },
    initProjTask:function(proj){
        this.state.taskUuid = proj.uuid;
        var taskUuid = this.state.taskUuid;
        this.setState({loading: true});  
        ProjTaskMemberActions.retrieveProjTaskMemberPage(taskUuid,this.state.projSet.startPage, pageRows)
    },
    handleOpenCreateWindow : function() {
        var taskUuid = this.state.taskUuid;
        this.refs.createWindow.clear(taskUuid);
        this.refs.createWindow.toggle();
    },
    handleCreateTempMember: function () {
        var taskUuid = this.state.taskUuid;
        this.refs.tempMemberWindow.clear(taskUuid);
        this.refs.tempMemberWindow.toggle();
    },
    handleUpdateClick: function( proj , e ) {
        if(proj != null) {
            this.refs.updateWindow.initPage( proj );
            this.refs.updateWindow.toggle();
        }
        e.stopPropagation();
    },
    handleRemoveClick : function( proj ) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的功能 【'+proj.perName+'】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.handleRemoveClick2.bind( this, proj )
        });
        event.stopPropagation();
    },
    handleRemoveClick2: function( proj ) {
        this.setState({loading: true});
        ProjTaskMemberActions.deleteProjTaskMember( proj.uuid );
    },
    onChangePage: function(pageNumber){
        this.state.projSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    render : function() {
        var recordSet = Common.filter(this.state.projSet.recordSet, filterValue);
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
            title: '入组日期',
            dataIndex: 'beginDate',
            key: 'beginDate',
            width: 140,
            render: (text, record) => (Common.formatDate(text, Common.dateFormat))
        },
        {
            title: '承担角色',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 140,
        },
        {
            title: '归属地',
            dataIndex: 'baseCity',
            key: 'baseCity',
            width: 140,
        },
        {
            title: '当前项目组',
            dataIndex: 'resName',
            key: 'resName',
            width: 140,
        },
        {
            title: '更多操作',
            key: 'action',
            width: 60,
            render: ( proj, record ) => (
                <span>
                    <a href="#" onClick={this.handleUpdateClick.bind(this, proj)} title='修改'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleRemoveClick.bind(this, proj)} title='删除'><Icon type={Common.iconRemove}/></a>
                </span>
            )
        }
        ]
        var isSelected = (this.state.taskUuid !== '');
        var pag = {showQuickJumper: true, total:this.state.projSet.totalRow, pageSize:this.state.projSet.pageRow,
                current:this.state.projSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
        return (
    		<div className='grid-page' style={{padding: '58px 0 0 0'}}>
                <div style={{margin: '-58px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} disabled={!isSelected} onClick={this.handleOpenCreateWindow} type="primary" title='增加人员' />
                            <Button icon={Common.iconAdd} disabled={!isSelected} onClick={this.handleCreateTempMember} title='增加临时人员' style={{ marginLeft: '4px' }}/>
                            <Button icon={Common.iconRefresh} disabled={!isSelected}  onClick={this.handleQueryClick} title='刷新数据' style={{marginLeft:'4px'}}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
                <CreateProjTaskMemberPage ref="createWindow"/>
                <UpdateProjTaskMemberPage ref="updateWindow" />
                <CreateProjTempMemberPage ref="tempMemberWindow" />
            </div>
        )
    }
});

module.exports = ProjTaskTablePage;
