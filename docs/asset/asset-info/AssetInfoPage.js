'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Radio} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import DictRadio from '../../lib/Components/DictRadio';

var ProvCorpStore = require('./data/ProvCorpStore.js');
var ProvCorpActions = require('./action/ProvCorpActions');
import CreateProvCorpPage from './Components/CreateProvCorpPage';
import UpdateProvCorpPage from './Components/UpdateProvCorpPage';

var filterValue = '';
var ProvCorpPage = React.createClass({
    getInitialState : function() {
        return {
            provCorpSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ProvCorpStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            provCorpSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(provCorp, event)
    {
        if(provCorp != null){
            this.refs.updateWindow.initPage(provCorp);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(provCorp, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的供应商 【'+provCorp.provName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, provCorp)
        });
    },

    onClickDelete2 : function(provCorp)
    {
        this.setState({loading: true});
        ProvCorpActions.deleteProvCorp( provCorp.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    onRadioChange : function(e){
        this.state.provType = e.target.value;
        this.setState({loading: true});
        // FIXME 查询条件
        var filter = {};
        filter.provType = this.state.provType;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        ProvCorpActions.retrieveProvCorp(filter);
    },

    render : function() {
        var recordSet = Common.filter(this.state.provCorpSet.recordSet, filterValue);

        const columns = [
            {
             title: '名称',
             dataIndex: 'provName',
             key: 'provName',
             width: 140,
            },
            {
            	title: '城市',
            	dataIndex: 'cityName',
            	key: 'cityName',
            	width: 140,
            },
            {
            	title: '合作级别',
            	dataIndex: 'provLevel',
            	key: 'provLevel',
            	width: 140,
            },
            {
            	title: '类别',
            	dataIndex: 'provType',
            	key: 'provType',
            	width: 140,
            },
            {
            	title: '商户类型',
            	dataIndex: 'merchType',
            	key: 'merchType',
            	width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改供应商'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除供应商'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['prov-corp/retrieve', 'prov-corp/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加供应商" onClick={this.handleOpenCreateWindow}/>
                            <DictRadio style={{marginLeft: '24px'}} type='button' name='provType' id='provType' appName='固定资产' optName='供应商类别' value={this.state.provType} onChange={this.onRadioChange} />
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} expandedRowRender={record => <p>{record.provScope}</p>} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateProvCorpPage ref="createWindow" provType={this.state.provType}/>
                <UpdateProvCorpPage ref="updateWindow" provType={this.state.provType}/>
            </div>
        );
    }
});

module.exports = ProvCorpPage;
