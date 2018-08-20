'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');

var Context = require('../../AuthContext');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Utils = require('../../../public/script/utils');
var ResStore = require('../data/ResStore');
var ResActions = require('../action/ResActions');
import CreateResPage from './CreateResPage';
import UpdateResPage from './UpdateResPage';

var filterValue = '';
var ResTablePage = React.createClass({
    getInitialState : function() {
        return {
            resSet:{
                recordSet:[],
                appUuid:'',
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading:false,
            modUuid:'',
            recordSet:[],
        }
    },
    mixins: [Reflux.listenTo(ResStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.state.recordSet = [];
        if(data.errMsg === '' && this.state.modUuid !== ''){
            data.recordSet.map((res,index)=>{
                if(this.state.modUuid === res.modUuid){
                    this.state.recordSet.push(res);
                }
            })
        }
        
        this.setState({
            loading: false,
            resSet: data
        });
    },

    componentDidMount : function(){
        this.setState({loading: true});
        ResActions.initResInfo( Context.authApp.uuid );
    },
    initResMod:function(module){  
         this.setState({loading: true});  
         this.state.modUuid = module.uuid;
         ResActions.initResInfo(module.appUuid)
    },
    handleOpenCreateWindow : function() {
        var appUuid = Context.authApp.uuid
        var modUuid = this.state.modUuid
        this.refs.createWindow.clear(modUuid,appUuid);
        this.refs.createWindow.toggle();
    },
    handleUpdateClick: function( res , e ) {
        if(res != null) {
            this.refs.updateWindow.initPage( res );
            this.refs.updateWindow.toggle();
        }

        e.stopPropagation();
    },

    handleRemoveClick : function( res ) {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的功能 【'+res.resName+'】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.handleRemoveClick2.bind( this, res )
        });
        event.stopPropagation();
    },

    handleRemoveClick2: function( res ) {
        this.setState({loading: true});
        ResActions.deleteResInfo( res.uuid );
    },

    handleQueryClick: function(){
        this.setState({loading: true});
        ResActions.retrieveResInfo( Context.authApp.uuid );
    },

   
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },


    render : function() {
        var recordSet = [];
        if(filterValue === ''){
            recordSet = this.state.recordSet;
        }
        else{
            recordSet = Common.filter(this.state.recordSet, filterValue);
        }
        
        const columns = [
        {
            title: '资源名称',
            dataIndex: 'resName',
            key: 'resName',
            width: 160,
        },
        {
            title: '资源描述',
            dataIndex: 'resDesc',
            key: 'resDesc',
            width: 200,
        },
        {
            title: '登记人',
            dataIndex: 'regName',
            key: 'regName',
            width: 90,
        },
        {
            title: '登记时间',
            dataIndex: 'regTime',
            key: 'regTime',
            width: 140,
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: ( res, record ) => (
                <span>
                    <a href="#" onClick={this.handleUpdateClick.bind(this, res)} title='修改'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleRemoveClick.bind(this, res)} title='删除'><Icon type={Common.iconRemove}/></a>
                </span>
            )
        }
        ]
        
        var isSelected = (this.state.modUuid !== '');
        return (
            <div className='grid-page' style={{padding: '58px 0 0 0'}}>
                <div style={{margin: '-58px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} disabled={!isSelected}  onClick={this.handleOpenCreateWindow} type="primary" title='增加资源'/>
                            <Button icon={Common.iconRefresh} disabled={!isSelected}  onClick={this.handleQueryClick} title='刷新数据' style={{marginLeft:'4px'}}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
                <UpdateResPage ref="updateWindow"/>
                <CreateResPage ref="createWindow"/>
            </div>
        )
    }
});

module.exports = ResTablePage;