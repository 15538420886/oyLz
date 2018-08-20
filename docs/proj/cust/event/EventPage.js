'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var EventStore = require('./data/EventStore');
var EventActions = require('./action/EventActions');

import CreateEventPage from './Components/CreateEventPage';
import UpdateEventPage from './Components/UpdateEventPage';
import EventFilter from './Components/EventFilter';

var pageRows = 10;
var EventPage = React.createClass({
	getInitialState : function() {
		return {
			eventSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			event: null,

			loading: false,
			moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(EventStore, "onServiceComplete")],
    onServiceComplete: function(data) {
    	 if(data.operation === 'cache'){
            var ff = data.filter.contCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.contName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.EventFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.event = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            eventSet: data
        });
    },
    
    // 第一次加载
	componentDidMount : function(){
		EventActions.getCacheData();
	},

	// 刷新
	handleQueryClick : function(events) {
		this.setState({loading: true});
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		EventActions.retrieveContEventPage(this.state.filter, this.state.eventSet.startPage, pageRows);
	},

	showMoreFilter: function(events){
        this.setState({moreFilter: !this.state.moreFilter});
    },

    onChangePage: function(pageNumber){
        this.state.eventSet.startPage = pageNumber;
        this.handleQueryClick();
    },

    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },

    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },

    onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;

        this.state.filter.contName = filterValue;

        this.handleQueryClick();
    },

    onMoreSearch: function(){
        var filter = this.refs.EventFilter.state.event;
        if(filter.eventMonth !== null && filter.eventMonth !== ''){
        	filter.eventDate1  = filter.eventMonth + '01';
        	filter.eventDate2  = filter.eventMonth + '31';
        } else {
            filter.eventDate1 = '';
            filter.eventDate2 = '';
        }
        this.state.filter = filter;
        this.handleQueryClick();
    },

	onClickDelete : function(event, events){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的合同事件 【'+event.contName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, event)
		});
	},

	onClickDelete2 : function(event){
		this.setState({loading: true});
		this.state.eventSet.operation = '';
		EventActions.deleteContEvent( event.uuid );
	},

    handleAppClick: function(event){
        EventContext.openContEventPage(event);
    },


	handleCreate: function(e){
        this.setState({action: 'create'});
    },

    onClickUpdate : function(event, events){
        this.setState({event: event, action: 'update'});
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
            	title: '合同名称',
            	dataIndex: 'contName',
            	key: 'contName',
            	width: 140,
      		},
      		{
            	title: '事件',
            	dataIndex: 'eventTitle',
            	key: 'eventTitle',
            	width: 140,
      		},
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改合同事件'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除合同事件'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var recordSet = this.state.eventSet.recordSet;
        console.log(recordSet);
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.eventSet.totalRow, pageSize:this.state.eventSet.pageRow,
                current:this.state.eventSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		 var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['cont_event/retrieve', 'cont_event/remove']}/>
                <EventFilter ref="EventFilter" moreFilter={moreFilter}/>

                <div style={{margin: '8px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加合同事件" onClick={this.handleCreate}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    {
                        moreFilter ?
                        <div style={{textAlign:'right', width:'100%'}}>
                            <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
                            <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                        </div>:
                        <div style={{textAlign:'right', width:'100%'}}>
                            <Search placeholder="查询(合同名称)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                            <Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
                        </div>
                    }
                    </div>
                </div>
                <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                </div>
             </div>;

          var page = null;
          if(this.state.action === 'create'){
              page = <CreateEventPage onBack={this.onGoBack}/>;
          }
          else if(this.state.action === 'update'){
              page = <UpdateEventPage onBack={this.onGoBack} event={this.state.event}/>
          }

          return (
              <div style={{width: '100%',height:'100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
    }
});

module.exports = EventPage;

