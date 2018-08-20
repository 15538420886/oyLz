'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var InfoCheckStore = require('./data/InfoCheckStore');
var InfoCheckActions = require('./action/InfoCheckActions');

import RedCheckPage from './Components/RedCheckPage';

var filterValue = '';
var InfoCheckPage = React.createClass({
    getInitialState : function() {
        return {
            InfoCheckSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            InfoCheck: null,
			filter:{}
        }
    },

    mixins: [Reflux.listenTo(InfoCheckStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            InfoCheckSet: data
        });
    },
    // 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        InfoCheckActions.retrieveInfoCheck(this.state.filter);
	},
    
    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
		this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
		this.state.filter.infoStatus="未通过";
        // FIXME 查询条件
        InfoCheckActions.retrieveInfoCheck(this.state.filter);
    },

    onClickhandle : function(infoCheck,event)
    {
        this.setState({ infoCheck:infoCheck, action: 'handle'});   
    },

    onGoBack: function(){
        this.setState({action: 'query'});
    },


    onFilterRecord: function(e){
       this.setState({filterValue: e.target.value});
    },

     onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }

        this.handleQueryClick();
    },

    render : function() {
        var recordSet = Common.filter(this.state.InfoCheckSet.recordSet, filterValue);
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
            	title: '日期',
            	dataIndex: 'regDate',
            	key: 'regDate',
            	width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
            	title: '状态',
            	dataIndex: 'infoStatus',
            	key: 'infoStatus',
            	width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickhandle.bind(this, record)} title='操作'><Icon type='bars'/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-attach/retrieve']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                              <Search placeholder="查找" style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} onSearch={this.onSearch}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns}  dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" />
                </div>
            </div>
        );
        
		var page = null;
        if(this.state.action === 'handle'){
			page = <RedCheckPage onBack={this.onGoBack} infoCheck={this.state.infoCheck}/>;
        }

		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}	
				{page}		
			</div>
		);
    }
});

module.exports = InfoCheckPage;