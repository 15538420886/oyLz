'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input,Select,Form} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

import DictSelect from '../../../lib/Components/DictSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var TestQuestStore = require('./data/TestQuestStore.js');
var TestQuestActions = require('./action/TestQuestActions');
import CreateTestQuestPage from './Components/CreateTestQuestPage';
import UpdateTestQuestPage from './Components/UpdateTestQuestPage';
import QuestFilePage from './Components/QuestFilePage';

var filterValue = '';
var TestQuestPage = React.createClass({
    getInitialState : function() {
        return {
            questStoreSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
			filter:{},
            action: 'query',
        }
    },

    mixins: [Reflux.listenTo(TestQuestStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            questStoreSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
		var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        TestQuestActions.retrieveQuestStore(filter);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        TestQuestActions.initQuestStore(filter);
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(questStore, event)
    {
        if(questStore != null){
            this.refs.updateWindow.initPage(questStore);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(questStore, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的面试题库 【'+questStore.cateName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, questStore)
        });
    },

    onClickDelete2 : function(questStore)
    {
        this.setState({loading: true});
        TestQuestActions.deleteQuestStore( questStore.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    handleUploadFile:function(event){
        this.refs.uploadFile.toggle();

    },
    onRowClick:function (record){
        this.refs.uploadFile.clear(record);
    },

    onFilterRecord: function(value){
        filterValue = value;
        this.setState({loading: this.state.loading});
    },

    onSearch:function(objList, filterValue){
        if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
            return objList;
        }
        var rs=[];
        objList.map(function(node) {
            if(node.category.indexOf(filterValue)>=0){
                rs.push( node );
            }
        });
        return rs;
    },

    render : function() {
        var recordSet =this.onSearch(this.state.questStoreSet.recordSet, filterValue);

        const columns = [
            {
                title: '类别',
                dataIndex: 'category',
                key: 'category',
                width: 140,
            },
            {
                title: '试卷名称',
                dataIndex: 'cateName',
                key: 'cateName',
                width: 140,
            },
            {
                title: '难易等级',
                dataIndex: 'cateLevel',
                key: 'cateLevel',
                width: 140,
            },
            {
                title: '试卷类型',
                dataIndex: 'cateType',
                key: 'cateType',
                width: 140,
            },
            {
                title: '试卷说明',
                dataIndex: 'cateMemo',
                key: 'cateMemo',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 60,
                render: (text, record) => (
					<span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改面试题库'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除面试题库'><Icon type={Common.iconRemove}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleUploadFile} title='详情'><Icon type='bars'/></a>
                    </span>
                ),
            }
        ];
        var cs = Common.getGridMargin(this);
        return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['quest-store/retrieve', 'quest-store/remove']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加面试题库" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <DictSelect style={{width:'180px'}} name="category" id="category" value={filterValue} appName='招聘管理' optName='岗位类别' onSelect={this.onFilterRecord}/>
						</div>
					</div>
				</div>

				<div className='grid-body'>
					<Table columns={columns} onRowClick={this.onRowClick} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
                <QuestFilePage ref="uploadFile"/>
				<CreateTestQuestPage ref="createWindow"/>
				<UpdateTestQuestPage ref="updateWindow"/>

			</div>
        );
    }
});

module.exports = TestQuestPage;