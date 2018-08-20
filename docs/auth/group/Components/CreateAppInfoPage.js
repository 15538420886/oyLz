import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Modal, Button, Input, Table } from 'antd';
var AppActions = require('../../app/action/AppActions');
var AppStore = require('../../app/data/AppStore');
var AppGroupActions = require('../../appGroup/action/AppGroupActions');
var AppGroupStore = require('../../appGroup/data/AppGroupStore');

var CreateAppInfoPage = React.createClass({
    getInitialState : function() {
        return {
            appInfoSet: {
                recordSet: [],
                errMsg : '',
                operation : '',
            },
            appGroupSet: {
                recordSet: [],
                errMsg : '',
                operation : '',
            },

            recordSet: [],
            selectedRows:[],
            selectedRowKeys:[],
            loading: false,
            modal:false,
            groupUuid : ''
        }
    },

    mixins: [Reflux.listenTo(AppStore, "onAppComplete"), Reflux.listenTo(AppGroupStore, "onGroupComplete")],
    onAppComplete: function(data) {
        if(this.state.modal && (data.operation === 'batchUpdate' || data.operation === 'retrieve')){
            if( data.errMsg === ''){
                if(data.operation === 'batchUpdate'){
                    this.setState({
                        modal: false
                    });
                }
                else{
                    var loading = (this.state.appGroupSet.operation === '');
                    this.state.appInfoSet = data;
                    var appSet = this.getEmptyRows();
                    this.setState({
                        loading: loading,
                        recordSet: appSet
                    });
                }
            }
            else{
                // 失败
                var loading = false;
                if(data.operation !== 'batchUpdate'){
                    loading = (this.state.appGroupSet.operation === '');
                }

                this.setState({
                    loading: loading,
                    appInfoSet: data
                });
            }
        }
    },
    onGroupComplete: function(data) {
        if(this.state.modal && data.operation === 'retrieve'){
            //console.log(this);
            var loading = (this.state.appInfoSet.operation === '');
            if( data.errMsg === ''){
                this.state.appGroupSet = data;
                var appSet = this.getEmptyRows();
                this.setState({
                    loading: loading,
                    recordSet: appSet
                });
            }
            else{
                // 失败
                this.setState({
                    loading: loading,
                    appGroupSet: data
                });
            }
        }
    },
    getEmptyRows: function(){
        var groupSet = this.state.appGroupSet.recordSet;
        var appSet = this.state.appInfoSet.recordSet;
        if(groupSet === null || typeof(groupSet) === 'undefined' ||
            appSet === null || typeof(appSet) === 'undefined' )
        {
            return [];
        }

        var groupMap = {};
        groupSet.map((node, i) => {
            groupMap[node.uuid] = node;
        });

        var recordSet=[];
        appSet.map((node, i) => {
            var g = groupMap[node.groupUuid];
            if(g === null || typeof(g) === 'undefined'){
                recordSet.push( node );
            }
        });

        return recordSet;
    },

    // 第一次加载
    componentDidMount : function(){
    },

    //选项变化
    onSelectChange : function(selectedRowKeys){
      this.setState({selectedRowKeys:selectedRowKeys });
    },

    clear : function(groupUuid){
        this.state.groupUuid = groupUuid;
        this.state.selectedRows = [];
        this.state.selectedRowKeys = [];

        this.state.loading = false;
        this.state.appInfoSet.operation='';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }

        AppActions.initAuthAppInfo();
        AppGroupActions.initAuthAppGroup();
    },

    toggle : function(){
        this.setState({
          modal: !this.state.modal
        });
    },

    // 添加App
    onClickAddApp: function(groupUuid){
        //对选中列表进行处理
        var addApp = {};
        addApp.groupUuid = this.state.groupUuid;
        addApp.listUuid = [];
        this.state.selectedRows.map((selected,i) => {
            if(selected.uuid){
                addApp.listUuid.push(selected.uuid)
            }
        })

        this.state.appInfoSet.operation = '';
        this.setState({loading: true});
        AppActions.batchUpdate( addApp );
    },

    render : function(){
        var recordSet = this.state.recordSet;

        const columns = [
        {
          title: '应用名称',
          dataIndex: 'appName',
          key: 'appName',
          width: 140,
        },
        {
            title: '应用编号',
            dataIndex: 'appCode',
            key: 'appCode',
            width: 140,
        },
        {
          title: '参数说明',
          dataIndex: 'appDesc',
          key: 'appDesc',
          width: 200,
        }];

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

        return (
            <Modal visible={this.state.modal}  width='760px' title="关联App" maskClosable={false} onOk={this.onClickAddApp} onCancel={this.toggle}
              footer={[
                <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-app-info/get-by-groupUuid','auth-app-info/batch-update']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickAddApp}>关联</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
               </div>
                ]}
              >
              <Table style={{marginBottom:'10px'}} rowSelection={rowSelection} columns={columns} dataSource={recordSet}  rowKey={record => record.uuid} loading={this.state.loading} scroll={{y:320}} size="middle" pagination={false} bordered />
          </Modal>
        );
    }
});

export default CreateAppInfoPage;
