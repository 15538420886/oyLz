'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Context = require('../../AuthContext');
var Common = require('../../../public/script/common');
import { Table, Button, Icon, Modal, Spin , Tabs} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Utils = require('../../../public/script/utils');

var FuncTableStore = require('../data/FuncTableStore');
var FuncTableActions = require('../action/FuncTableActions');

import CreateFuncTablePage from './CreateFuncTablePage';

var FuncTablePage = React.createClass({
    getInitialState : function() {
        return {
            funcTableSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading: false,
            roleUuid: '',
        }
    },
	mixins: [Reflux.listenTo(FuncTableStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		this.setState({
			loading: false,
			funcTableSet: data
		});
	},

    componentDidMount : function(){
        this.setState({loading: true, roleUuid:this.props.roleUuid});
        FuncTableActions.initFuncTableInfo(this.props.roleUuid);
    },
    loadData: function(roleUuid){
    	this.setState({loading: true, roleUuid:roleUuid});
    	FuncTableActions.retrieveFuncTableInfo(roleUuid);
    },

    handleOpenCreateWindow: function(){
    	this.refs.createWindow.clear(this.state.roleUuid);
        this.refs.createWindow.toggle();
    },
    
    handleRemoveClick : function(func) {
        Modal.confirm({
          title: Common.removeTitle,
          content: '是否删除选中的角色 【'+func.funcName+'】' ,
          okText: Common.removeOkText,
          cancelText: Common.removeCancelText,
          onOk: this.handleRemoveWindow2.bind( this, func )
        });
        
        event.stopPropagation();
    },
    handleRemoveWindow2: function(func){
        this.setState({loading: true});
        FuncTableActions.deleteFuncTableInfo( func.uuid );
    },
   
    render : function() {
	    const columns = [
	    {
	        title: '功能代码',
	        dataIndex: 'funcCode',
	        key: 'funcCode',
	        width: 140,
	    },
	    {
	        title: '功能名称',
	        dataIndex: 'funcName',
	        key: 'funcName',
	        width: 140,
	    },
	    {
	        title: '',
	        key: 'action',
	        width: 40,
	        render: (text, func) => (
	            <span>
	                <a href="#" onClick={this.handleRemoveClick.bind(this, func)} title='移除'><Icon type={Common.iconRemove}/></a>
	            </span>
	        ),
	    }
	    ];
	    
	    var recordSet = this.state.funcTableSet.recordSet;
	  	var title = '角色【'+Context.role.roleDesc + '】包含 ' + recordSet.length + ' 个功能';
	    return (
	        <div className='grid-page' style={{padding: '58px 0 0 0'}}>
	            <div style={{margin: '-58px 0 0 0'}}>
	            	<div className='toolbar-table'>
	            		<div style={{paddingTop:'8px', paddingRight:'8px', display: 'inline'}}>{title}</div>
	            		<Button icon={Common.iconAdd} type="primary" title="增加功能"  onClick={this.handleOpenCreateWindow} style={{marginLeft: '8px'}}/>
	            	</div>
	            </div>
	            <div className='grid-body'>
	                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
	            </div>
	            <CreateFuncTablePage ref="createWindow"/>
	        </div>
	    );
    }
});

module.exports = FuncTablePage;


