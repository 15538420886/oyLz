'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchStaffCodeStore = require('../data/SearchStaffCodeStore');
var SearchStaffCodeActions = require('../action/SearchStaffCodeActions');

var pageRows = 10;
var SearchStaffCodePage = React.createClass({
	getInitialState : function() {
		return {
			staffCodeSet: {
				recordSet: [],
				startPage :1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
            modal: false,
            filter:{},
		}
	},

    mixins: [Reflux.listenTo(SearchStaffCodeStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            staffCodeSet: data
        });
    },

	// 第一次加载
	componentDidMount : function(){
	
	},
    
    handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		SearchStaffCodeActions.retrieveStaffCodePage(this.state.filter,this.state.staffCodeSet.startPage, pageRows);
	},
    
    initStaff: function (corpUuid) {
        this.state.filter.corpUuid = corpUuid;
        SearchStaffCodeActions.retrieveStaffCodePage(this.state.filter, 1, 10);
    },

    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },

	render : function() {
		var recordSet = this.state.staffCodeSet.recordSet;
		const columns = [
             {
                title: '归属地',
                dataIndex: 'baseCity',
                key: 'baseCity',
                width: 140,
            },
            {
                title: '员工编号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 140,
            },
		];

		var pag = {showQuickJumper: true, total:this.state.staffCodeSet.totalRow, pageSize:this.state.staffCodeSet.pageRow,
            current:this.state.staffCodeSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		return (
			<Modal visible={this.state.modal} width='640px' title="员工编号" maskClosable={false} onCancel={this.toggle} footer={null}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
            </Modal >
		);
	}
}); 

module.exports = SearchStaffCodePage;

