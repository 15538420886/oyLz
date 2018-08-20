'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree, Button, Table, Icon, Input } from 'antd';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
import ServiceMsg from '../../lib/Components/ServiceMsg';

var Context = require('../ParamContext');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var DictFindStore = require('./data/DictFindStore');
var DictFindActions = require('./action/DictFindActions');
var DictStore = require('../dict/data/DictStore');
var DictActions = require('../dict/action/DictActions');

import DictTable from './Components/DictTable.js';

var selectedRowUuid = '';
var filterValue = '';
var DictFindPage = React.createClass({
    getInitialState : function() {
        return {
            DictFindSet: {
                recordSet: [],
                operation : '',
                errMsg : '',
                codeName:''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(DictFindStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            DictFindSet: data
        });
    },

    handleQueryClick : function(event) {
        this.setState({loading: true});
        var codeName = this.state.codeName;
        this.state.DictFindSet.operation = '';
        DictFindActions.retrieveSysCodeData(codeName);
    }, 
    
    componentDidMount : function(){
    },
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
    onSearch: function(e){
        var filterValue = this.state.filterValue;
        this.state.codeName = filterValue;
        this.handleQueryClick();
    },

    //点击行发生的事件
    onRowClick: function(record, index){
        selectedRowUuid = record.uuid;
        this.state.isSelected = false;
        this.state.appName= record.appName;
        this.state.indexName= record.indexName;
        this.setState({
            DictFindSet: this.state.DictFindSet,
        });
        DictActions.initSysCodeData(selectedRowUuid);
    },
    getRowClassName: function(record, index){
        var uuid = record.uuid;
        if(selectedRowUuid == uuid){
            return 'selected';
        }
        else{
            return '';
        }
    },
    render : function() {
        var recordSet = Common.filter(this.state.DictFindSet.recordSet, filterValue);
        const columns = [
            {
                title: '应用名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 140,
            },
            {
                title: '字典名称',
                dataIndex: 'indexName',
                key: 'indexName',
                width: 140,
            }
        ];
        return (
            <div className='grid-page' style={{height:'100%'}}>
                <ServiceMsg ref='mxgBox' svcList={[ 'SysCodeData/findCodeIndex','SysCodeData/retrieve']}/>
                <div style={{overflow:'hidden',height:'100%'}}>
                    <div style={{borderRight: '1px solid #e2e2e2', width:'300px', height:'100%', float:'left', overflowY:'auto'}}>
                        <div style={{margin:"15px 10px"}}>
                            <Search style={{marginBottom:"10px"}} placeholder="请输入字典内容" onSearch={this.onSearch} onChange={this.onChangeFilter} value={this.state.filterValue} />
                           <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} rowClassName={this.getRowClassName} onRowClick={this.onRowClick} loading={this.state.loading} pagination={false} size='small' bordered />
                        </div>
                    </div>

                    <div style={{height:'100%',overflow:'hidden', paddingLeft:'20px'}}>
                        <DictTable ref="dictTable" indexName={this.state.indexName} appName={this.state.appName} isSelected={this.state.isSelected}/>
                    </div>

                </div>
          </div>);
      }
});

module.exports = DictFindPage;
