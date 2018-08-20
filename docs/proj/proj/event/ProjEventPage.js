'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal,Spin,Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ProjEventStore = require('./data/ProjEventStore');
var ProjEventActions = require('./action/ProjEventActions');
var ProjContext = require('../../ProjContext');
import CreateProjEventPage from './Components/CreateProjEventPage';
import UpdateProjEventPage from './Components/UpdateProjEventPage';

var filterValue = '';
var ProjEventPage = React.createClass({
	getInitialState : function() {
		return {
			projEventSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false
		}
	},

    mixins: [Reflux.listenTo(ProjEventStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projEventSet: data
        });
    },
	handleQueryClick : function(event) {
		var projUuid = ProjContext.selectedProj.uuid;
		this.setState({loading: true});
		ProjEventActions.retrieveProjEvent(projUuid);
	},
	componentDidMount : function(){
		var projUuid = ProjContext.selectedProj.uuid;
		this.setState({loading: true});
		ProjEventActions.initProjEvent(projUuid);
	},	
	onClickUpdate : function(projEvent, event){
		this.setState({projEvent: projEvent, action: 'update'});
    },
	onClickDelete : function(projEvent, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的事务事件',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, projEvent)
		});
	},
	onClickDelete2 : function(projEvent)
	{
		this.setState({loading: true});
		this.state.projEventSet.operation = '';
		ProjEventActions.deleteProjEvent( projEvent.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},
	handleCreate: function(e){
        this.setState({action: 'create'});
    }, 
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function() {
		const columns = [
			{
				title: '日期',
				dataIndex: 'eventDate',
				key: 'eventDate',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},
			{
				title: '类型',
				dataIndex: 'eventType',
				key: 'eventType',
				width: 140,
			},
			{
				title: '开始日期',
				dataIndex: 'eventBegin',
				key: 'eventBegin',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},
			{
				title: '结束日期',
				dataIndex: 'eventEnd',
				key: 'eventEnd',
				width: 140,
				render: (text, record) => (Common.formatDate(text, Common.dateFormat))
			},		
			{
				title: '事件',
				dataIndex: 'eventTitle',
				key: 'eventTitle',
				width: 200,
			},
			{
				title: '相关人',
				dataIndex: 'eventData3',
				key: 'eventData3',
				width: 140,
			},
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改项目组事件'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除项目组事件'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];
		var recordSet = Common.filter(this.state.projEventSet.recordSet, filterValue);
		var visible = (this.state.action === 'query') ? '' : 'none';
		var contactTable =
			<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-event/retrieve', 'proj-event/remove']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加项目事件" onClick={this.handleCreate}/>
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
			  var page = null;
	          if(this.state.action === 'create'){
	              page = <CreateProjEventPage onBack={this.onGoBack}/>;
	          }
	          else if (this.state.action === 'update') {
	              var projEvent = {};
	              Utils.copyValue(this.state.projEvent, projEvent);
	              page = <UpdateProjEventPage onBack={this.onGoBack} projEvent={projEvent}/>
	          }

	          return (
	              <div style={{width: '100%',height:'100%'}}>
	                   {contactTable}
	                   {page}
	               </div>
	          );
	}
});

module.exports = ProjEventPage;

