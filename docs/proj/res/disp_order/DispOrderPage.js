'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin, Input, Pagination,Form, Tabs} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var DispOrderStore = require('./data/DispOrderStore');
var DispOrderActions = require('./action/DispOrderActions');

import ProjContext from '../../ProjContext';
import CodeMap from '../../../hr/lib/CodeMap';

var filterValue = '';
var DispOrderPage = React.createClass({
    getInitialState : function() {
        return {
            dispOrderSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(DispOrderStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            dispOrderSet: data
        });
    },

     // 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.filter.status = '1';
        this.state.filter.poolUuid = ProjContext.selectedPool.uuid;
        this.state.filter.projUuid = ProjContext.selectedDispProj.uuid;
		DispOrderActions.retrieveDispOrderPage(this.state.filter);
	},

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: false});
        var projUuid = ProjContext.selectedDispProj.uuid;
		DispOrderActions.getCacheData(projUuid);
    },
    
    onClickDelete : function(projMember, event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的事件 【'+projMember.perName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, projMember)
		});
	},

	onClickDelete2 : function(projMember){
		this.setState({loading: true});
		this.state.dispOrderSet.operation = '';
		DispOrderActions.deleteDispOrder( projMember.uuid );
	},

    onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    handleCreate : function(event) {
		this.props.doAction('create-disp');
	},

    onClickUpdate : function(projMember, event){
        this.props.doAction('update-disp', projMember);
    },

    render : function(corpUuid) {
        var recordSet = Common.filter(this.state.dispOrderSet.recordSet, filterValue);
        var corpUuid = window.loginData.compUser.corpUuid;
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
                title: '类型',
                dataIndex: 'manType',
                key: 'manType',
                width: 140,
            },
            {
                title: '人员级别',
                dataIndex: 'userLevel',
                key: 'userLevel',
                width: 140,
                render: (text, record) => (this.getLevelName(corpUuid, record.userLevel)),
            },
            {
                title: '调度人',
                dataIndex: 'dispatcher',
                key: 'dispatcher',
                width: 140,
            },
            {
                title: '调度日期',
                dataIndex: 'applyTime',
                key: 'applyTime',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '计划入组',
                dataIndex: 'planDate',
                key: 'planDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
            {
                title: '项目名称',
                dataIndex: 'projName',
                key: 'projName',
                width: 140,
            },
            
            {
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改调度指令'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除调度指令'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
        ];
        
		var contactTable =
			<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto'}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-disp/retrieve', 'proj-disp/remove']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加人员调度" onClick={this.handleCreate}/>
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

module.exports = DispOrderPage;
