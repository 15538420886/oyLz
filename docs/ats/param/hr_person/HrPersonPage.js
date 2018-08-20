'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var HrExecutStore = require('./data/HrExecutStore');
var HrExecutActions = require('./action/HrExecutActions');
import CreateHrExecutPage from './Components/CreateHrExecutPage';


var filterValue = '';
var HrExecutPage = React.createClass({
    getInitialState : function() {
        return {
            hrExecutSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            hrExecut: null,
			filter:{},
        }
    },

    mixins: [Reflux.listenTo(HrExecutStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            hrExecutSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
		var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        HrExecutActions.retrieveHrExecut(filter);
    },

    // 第一次加载
    componentDidMount : function(){
         this.setState({loading: true});
	    var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        HrExecutActions.initHrExecut(filter);
    },

    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },
    onClickUpdate : function(hrExecut, event)
    {
        if(hrExecut != null){
            this.setState({hrExecut: hrExecut, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    onClickDelete : function(hrExecut, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的人力专员管理 【'+hrExecut.hrName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, hrExecut)
        });
    },
    onClickDelete2 : function(hrExecut)
    {
        this.setState({loading: true});
        HrExecutActions.deleteHrExecut( hrExecut.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        var recordSet = Common.filter(this.state.hrExecutSet.recordSet, filterValue);

        const columns = [
            {
            	title: '员工号',
            	dataIndex: 'hrCode',
            	key: 'hrCode',
            	width: 140,
            },
            {
            	title: '姓名',
            	dataIndex: 'hrName',
            	key: 'hrName',
            	width: 140,
            },
            {
            	title: '电话',
            	dataIndex: 'hrPhone',
            	key: 'hrPhone',
            	width: 140,
            },
            {
            	title: '邮件',
            	dataIndex: 'hrEmail',
            	key: 'hrEmail',
            	width: 140,
            },
            {
            	title: '负责部门',
            	dataIndex: 'deptName',
            	key: 'deptName',
            	width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span style={{marginLeft:'5px'}}>
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人力专员管理'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr_execut/retrieve', 'hr_execut/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加招聘专员" onClick={this.handleOpenCreateWindow}/>
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
            </div>
        );
        
		var formPage = null;
		if(this.state.action === 'create'){
                    // FIXME 输入参数
		    formPage = <CreateHrExecutPage onBack={this.onGoBack}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateHrExecutPage onBack={this.onGoBack} hrExecut={this.state.hrExecut}/>
		}
		
		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = HrExecutPage;