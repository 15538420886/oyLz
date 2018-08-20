'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';

var ProjTaskStore = require('./../../../proj/task/data/ProjTaskStore');
var ProjTaskActions = require('./../../../proj/task/action/ProjTaskActions');
import CreateProjTaskPage from './CreateProjTaskPage';
import UpdateProjTaskPage from '../../../proj/task/Components/UpdateProjTaskPage';
var ProjContext = require('../../../ProjContext');

var pageRows = 10;
var filterValue = '';
var ProjTaskPage = React.createClass({
    getInitialState : function() {
        return {
            projTaskSet: {
                recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                errMsg : ''
            },
            loading: false,
            action: 'query',
            projTask: null,
            parentUuid:'',
            projUuid:''

        }
    },

    mixins: [Reflux.listenTo(ProjTaskStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projTaskSet: data
        });
    },
    componentDidMount : function(){

    },
    componentWillReceiveProps:function(nextProps){
        if( nextProps.ProjGrpUuid!==""){
            var projUuid = nextProps.ProjGrpUuid;
            var parentUuid = nextProps.parentUuid
             this.setState({
                loading: true,
                projUuid: projUuid,
                parentUuid:parentUuid
            });
            var filter = {};
            filter.projUuid = projUuid;

            ProjTaskActions.retrieveProjTaskPage(filter, this.state.projTaskSet.startPage, pageRows);
        }
     },
    init:function(){
        this.setState({loading: true});
        var filter = {};

        filter.projUuid = this.state.projUuid;
        ProjTaskActions.retrieveProjTaskPage(filter, this.state.projTaskSet.startPage, pageRows);    
    },

    handleQueryClick : function() {
        this.setState({
            loading: true,
           
        });
        var filter = {};
        filter.projUuid = this.state.projUuid;
        ProjTaskActions.retrieveProjTaskPage(filter, this.state.projTaskSet.startPage, pageRows);
    },
    onChangePage: function(pageNumber){
        this.state.projTaskSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    handleOpenCreateWindow : function(event) {
        this.setState({
            action: 'create',
        });
    },
    onClickUpdate : function(projTask, event){
        if(projTask != null){
            this.setState({projTask: projTask, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
    onClickDelete : function(projTask, event){
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的项目组订单表 【'+projTask.ordName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, projTask)
        });
    },
    onClickDelete2 : function(projTask){
        this.setState({loading: true});
        ProjTaskActions.deleteProjTask( projTask.uuid );
    },
    render : function() {
        var recordSet = Common.filter(this.state.projTaskSet.recordSet, filterValue);
        const columns = [
            {
            	title: '订单编号',
            	dataIndex: 'ordCode',
            	key: 'ordCode',
            	width: 140,
            },
            {
            	title: '订单名称',
            	dataIndex: 'ordName',
            	key: 'ordName',
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
            	title: '状态',
            	dataIndex: 'tastStatus',
            	key: 'tastStatus',
            	width: 140,
            	render: (text, record) => (Utils.getOptionName('项目管理', '项目任务状态', text, false, this)),
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目组订单表'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目组订单表'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var pag = {showQuickJumper: true, total:this.state.projTaskSet.totalRow, pageSize:this.state.projTaskSet.pageRow, current:this.state.projTaskSet.startPage,
                size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
        var isSelected = (this.state.projUuid !== '');
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['proj_task/retrieve', 'proj_task/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} disabled={!isSelected} type="primary" title="增加项目组订单表" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} disabled={!isSelected} title="刷新数据" onClick={this.init} style={{marginLeft: '4px'}}/>
                        </div>
                         <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
                </div>
            </div>
        );
        
        var formPage = null;
        if(this.state.action === 'create'){
            // FIXME 输入参数
            formPage = <CreateProjTaskPage onBack={this.onGoBack} projUuid={this.state.projUuid} parentUuid={this.state.parentUuid}/>;
        }
        else if (this.state.action === 'update') {
            formPage = <UpdateProjTaskPage onBack={this.onGoBack} projTask={this.state.projTask}/>
        }
        
        return (
            <div style={{width: '100%',height:'100%'}}>
                {tablePage}
                {formPage}
            </div>
        );
    }
});

module.exports = ProjTaskPage;