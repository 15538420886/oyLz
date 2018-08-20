'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');

var Context = require('../AuthContext');
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Utils = require('../../public/script/utils');
var ModuleStore = require('./data/ModuleStore');
var ModuleActions = require('./action/ModuleActions');
import CreateModulePage from './Components/CreateModulePage';
import UpdateModulePage from './Components/UpdateModulePage';

var filterValue = '';
var ModulePage = React.createClass({
    getInitialState : function() {
      	return {
            moduleSet:{
                recordSet: [],
                appUuid:'',
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading:false
      	}
    },
	mixins: [Reflux.listenTo(ModuleStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  this.setState({
	      loading: false,
	      moduleSet: data
	  });
	},

    componentDidMount : function(){
        this.setState({loading: true});
        var appUuid = Context.authApp.uuid;
        ModuleActions.initModuleInfo(appUuid);
    },
    handleOpenCreateWindow : function() {
        var appUuid = Context.authApp.uuid
        this.refs.createWindow.clear(appUuid);
        this.refs.createWindow.toggle();
    },
    handleUpdateClick: function( module , e ) {
        if(module != null) {
            this.refs.updateWindow.initPage( module );
            this.refs.updateWindow.toggle();
        }

        e.stopPropagation();
    },

    handleRemoveClick : function( module ) {
		Modal.confirm({
			title: Common.removeTitle,
			content: '是否删除选中的模块 【'+module.modName+'】',
			okText: Common.removeOkText,
			cancelText: Common.removeCancelText,
			onOk: this.handleRemoveClick2.bind( this, module )
		});
        event.stopPropagation();
    },

    handleRemoveClick2: function( module ) {
        this.setState({loading: true});
        ModuleActions.deleteModuleInfo( module.uuid );
    },

    handleQueryClick: function(){
        this.setState({loading: true});
        ModuleActions.retrieveModuleInfo( Context.authApp.uuid );
    },
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    render : function() {
	  	var recordSet = [];
	    if(filterValue === ''){
	        recordSet = this.state.moduleSet.recordSet;
	    }
	    else{
	        recordSet = Common.filter(this.state.moduleSet.recordSet, filterValue);
	    }

        const columns = [
        {
            title: '分组名称',
            dataIndex: 'modName',
            key: 'modName',
            width: 140,
        },
        {
            title: '分组描述',
            dataIndex: 'modDesc',
            key: 'modDesc',
            width: 200,
        },
        {
            title: '登记人',
            dataIndex: 'regName',
            key: 'regName',
            width: 90,
        },
        {
            title: '登记时间',
            dataIndex: 'regTime',
            key: 'regTime',
            width: 120,
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: ( module, record ) => (
                <span>
                    <a href="#" onClick={this.handleUpdateClick.bind(this, module)} title='修改'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.handleRemoveClick.bind(this, module)} title='删除'><Icon type={Common.iconRemove}/></a>
                </span>
            )
        }
        ]

	var cs = Common.getGridMargin(this);
  	return (
		<div className='grid-page' style={{padding: cs.padding}}>
			<div style={{margin: cs.margin}}>
		    	<ServiceMsg ref='mxgBox' svcList={['auth-app-module/retrieve','auth-app-module/remove']} />

			    <div className='toolbar-table'>
			    	<div style={{float:'left'}}>
	        			<Button icon={Common.iconAdd} type="primary" title="增加模块信息" onClick={this.handleOpenCreateWindow}/>
	        			<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
					</div>
					<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
	                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
	                </div>
				</div>
			</div>
			<div className='grid-body'>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
            </div>
            <UpdateModulePage ref="updateWindow"/>
            <CreateModulePage ref="createWindow"/>
        </div>);
    }
});

module.exports = ModulePage;
