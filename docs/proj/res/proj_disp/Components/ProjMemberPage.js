'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin, Input, Pagination,Form, Tabs} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var ProjMemberStore = require('../data/ProjMemberStore');
var ProjMemberActions = require('../action/ProjMemberActions');

import ProjContext from '../../../ProjContext';

var filterValue = '';
var ProjMemberPage = React.createClass({
    getInitialState : function() {
        return {
            projMemberSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(ProjMemberStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projMemberSet: data
        });
    },

     // 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.status = '1';
        this.state.filter.projUuid = ProjContext.selectedDispProj.uuid;
		ProjMemberActions.retrieveProjMemberPage(this.state.filter);
	},

    // 第一次加载
    componentDidMount : function(){
         this.setState({loading: true});
        this.state.filter.projUuid = ProjContext.selectedDispProj.uuid;
        ProjMemberActions.initProjMember(this.state.filter);
    },
  
    onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    render : function(corpUuid) {
        var recordSet = Common.filter(this.state.projMemberSet.recordSet, filterValue);
        const columns = [
            {
                title: '员工编号',
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
                title: '人员级别',
                dataIndex: 'userLevel',
                key: 'userLevel',
                width: 140,
            },
            {
                title: '客户定级',
                dataIndex: 'projLevel',
                key: 'projLevel',
                width: 140,
            },
            {
                title: '结算单价',
                dataIndex: 'userPrice',
                key: 'userPrice',
                width: 140,
            },
            {
                title: '入组日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '承担角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140,
            },
            {
                title: '技术岗位',
                dataIndex: 'techLevel',
                key: 'techLevel',
                width: 140,
            },
        ];
        
		var contactTable =
			<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto'}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve', 'proj-member/remove']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查询" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>;

        return contactTable;
        
    }
});

module.exports = ProjMemberPage;
