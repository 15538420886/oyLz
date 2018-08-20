"use strict";

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import ModalForm from '../../../lib/Components/ModalForm';
import { Table, Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
import TxnTree from '../../txn/Components/TxnTree'

var TxnTreeStore = require('../../txn/data/TxnTreeStore');
var TxnActions = require('../../txn/action/TxnActions');
var FuncTxnStore = require('../data/FuncTxnStore');
var FuncTxnActions = require('../action/FuncTxnActions');

var SelectFuncPage = React.createClass({
    getInitialState : function() {
        return {
            txnSet: {
                recordSet:[],
  		    	operation : '',
  		    	errMsg : ''
            },
    	    modal: false,
            loading: false, //table
            loading1: false,//点击确定
            funcUuid:'',
            functxn: [],
            txnMap: {},
            recordSet: [],  // 过滤后的原子交易
            selectedRows:[],
            selectedRowKeys:[],
        }
    },
    mixins: [Reflux.listenTo(FuncTxnStore, "onServiceComplete"), 
        Reflux.listenTo(TxnTreeStore, "onLoadTxnComplete"), 
        ModalForm('')],

    onLoadTxnComplete: function(data) {
        if(this.state.modal && data.operation === 'retrieve'){
            if( data.errMsg === ''){
                var self = this;
                this.state.recordSet = [];
                data.recordSet.map((code, i)=>{
                    var flag = self.state.txnMap[code.txnCode];
                    if( flag === null || typeof(flag) === 'undefined' ){
                        this.state.recordSet.push( code );
                    }
                });
            }

            // 成功
            this.setState({
                loading: false,
            });
        }
    },
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'batchCreate'){
            if( data.errMsg === ''){
                // 成功
                this.setState({
                    loading1: false,
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading1: false
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function() {

    },
 
    clear : function(funcUuid,txnCode) {
        var self = this;
        this.state.txnMap = {};
        this.state.recordSet = [];
        txnCode.map((code, i)=>{
            self.state.txnMap[code] = 1;
        });
        

        this.state.selectedRows = [];
        this.state.selectedRowKeys = [];
        this.state.funcUuid = funcUuid;

        // 清空选中的节点
        if(typeof(this.refs.txnTree) !== 'undefined'){
            this.refs.txnTree.initTree();
        }

        this.state.txnSet.operation = '';
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
          	this.refs.mxgBox.clear();
        }
    },
    
    //选项变化
    onSelectChange : function(selectedRowKeys){
        this.setState({selectedRowKeys:selectedRowKeys });
        var functxn = [];
        var txnSet = this.state.recordSet;
        txnSet.map((data,index)=>{
            for(var i = 0; i < selectedRowKeys.length; i++){
                if(data.uuid === selectedRowKeys[i]){
                    data.funcUuid = this.state.funcUuid;
                    functxn.push(data)
                }
            }
        });
        this.state.functxn = functxn;
    },
    //保存  确定
    onClickSave : function() {
        this.setState({loading1: true});
        this.state.txnSet.operation = '';
        FuncTxnActions.selectFuncinfo( this.state.functxn );
    },
    onSelectRes: function(resUuid){
        this.state.txnSet.operation = '';
        this.setState({loading: true});
        TxnActions.initTreeInfo( resUuid );
    },
    render : function() {
        const columns = [
        {
            title: '功能代码',
            dataIndex: 'txnCode',
            key: 'txnCode',
            width: 200,
        },
        {
            title: '功能名称',
            dataIndex: 'txnName',
            key: 'txnName',
            width: 200,
        }
        ]

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.selectedRows = selectedRows;
            },
            onSelect: (record, selected, selectedRows) => {
                this.state.selectedRows = selectedRows;
            },
        };

        var recordSet = this.state.recordSet;
        return (
            <Modal visible={this.state.modal} width='740px' title="增加分组参数" style={{overflowY:'auto'}} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-app-select/create']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading1}>确定</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                </div>
                ]}>
                <div style={{height:'400px'}}>
                    <div style={{borderRight: '1px solid #e2e2e2', width:'200px', height:'100%', float:'left', overflowY:'auto', overflowX:'hidden'}}>
                        <TxnTree ref='txnTree' onSelect={this.onSelectRes}/>
                    </div>
                    <div style={{height:'100%',overflow:'hidden'}}>
                        <div style={{height:'100%', overflowY:'auto', overflowX:'hidden', padding:'0 12px 0 12px'}}>
                            <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid}  rowSelection={rowSelection} loading={this.state.loading} size='middle' pagination={false} bordered={Common.tableBorder} />
                        </div>
                    </div>
                </div>
            </Modal>
          );
        }
    });

export default SelectFuncPage;
