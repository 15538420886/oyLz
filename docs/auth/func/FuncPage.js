'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

var Context = require('../AuthContext');
import FuncTree from './Components/FuncTree';
var Common = require('../../public/script/common');
import { Table, Button, Icon, Modal, Spin } from 'antd';
import ServiceMsg from '../../lib/Components/ServiceMsg';
var FuncStore = require('./data/FuncStore');
var FuncActions = require('./action/FuncActions');
var FuncTxnStore = require('./data/FuncTxnStore');
var FuncTxnActions = require('./action/FuncTxnActions');

import SelectFuncPage from './Components/SelectFuncPage';
import CreateFuncPage from './Components/CreatFuncPage';
import UpdataFuncPage from './Components/UpdateFuncPage';

var FuncPage = React.createClass({
    getInitialState : function() {
        return {
            funcTxnSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading: false,
            uuid:'',
            funcUpdate:'',
            funcCreate:{},
    
            isSure1 : true,
            isSure2 : true,
            isSure3 : true,
        }
    },
    
	mixins: [Reflux.listenTo(FuncTxnStore, "onServiceComplete"), Reflux.listenTo(FuncStore, "onFuncComplete")],
	onServiceComplete: function(data) {
	  this.setState({
	      loading: false,
	      funcTxnSet: data
	  });
	},
	onFuncComplete: function(data) {
	  this.setState({
	      loading: false
	  });
	},

    componentDidMount : function(){
    	this.setState({loading: true});
        FuncActions.initFuncInfo(Context.authApp.uuid);
    },
    handleQueryClick : function(){
    	this.setState({loading: true});
        FuncTxnActions.retrieveFuncTxnInfo( this.state.uuid );
    },
    
    onSelectRes: function(appUuid, modUuid, modName, key){
		var isSure1=true;
		var isSure2=true;
		var isSure3=true;
		
        if(appUuid){
            if(key === 'update'){
                //修改  modName:待修改的数据
                this.setState({loading: true});
                this.state.uuid = modName.uuid;
                this.state.funcUpdate = modName
                
                FuncTxnActions.initFuncTxnInfo(modName.uuid);
                isSure2=false;
                isSure3=false;
            }
            else{
                //增加  modName为弹出框 模块名称(不可修改)
                this.state.funcCreate = {
                    appUuid : appUuid,
                    modUuid : modUuid,
                    modName : modName
                }
                
                this.state.funcTxnSet.recordSet = [];
    			isSure1=false;
            }
        }
        
        this.setState({
            isSure1: isSure1,
            isSure2: isSure2,
            isSure3: isSure3
        });
    },
    
    //选择原子功能
    handleOpenSelectWindow: function(){
	    var txnList = [];
	    var recordSet = this.state.funcTxnSet.recordSet;
	    recordSet.map((data,index)=>{
	        txnList.push(data.txnCode)
	    });
	    
        this.refs.selectWindow.clear(this.state.uuid, txnList);
        this.refs.selectWindow.toggle();
    },
    //增加
    handleOpenCreateWindow: function(){
        this.refs.createWindow.clear(this.state.funcCreate);
        this.refs.createWindow.toggle();
    },
    // 修改
    handleOpenUpdateWindow: function(){
        this.refs.updateWindow.initPage(this.state.funcUpdate);
        this.refs.updateWindow.toggle();
    },
    //删除
    handleRemoveWindow : function() {
        var func = this.state.funcUpdate
        var funcTxnLen = this.state.funcTxnSet.recordSet.length;
    
        Modal.confirm({
          title: Common.removeTitle,
          //判断删除的信息下是否有内容
          content: funcTxnLen === 0 ? '是否删除选中的功能 【'+func.funcName+'】' 
          	: '是否删除选中的功能 【'+func.funcName+'】及其所属的所有内容',
          okText: Common.removeOkText,
          cancelText: Common.removeCancelText,
          onOk: this.handleRemoveWindow2.bind( this, func )
        });
        
        event.stopPropagation();
    },
    handleRemoveWindow2: function(func){
    	//this.setState({loading: true});
        FuncActions.deleteFuncInfo( func.uuid );
        this.state.funcTxnSet.recordSet = [];
    },
    //移除
    onClickRemove : function( functxn ) {
        Modal.confirm({
          title: Common.removeTitle,
          content: '是否移除选中的交易 【'+functxn.txnCode+'】',
          okText: Common.removeOkText,
          cancelText: Common.removeCancelText,
          onOk: this.RemoveClick2.bind( this, functxn )
        });
        event.stopPropagation();
    },

    RemoveClick2: function( functxn ) {
        this.setState({loading: true});
        FuncTxnActions.deleteFuncTxnInfo( functxn.uuid );
    },
    render : function() {
	    const columns = [
	    {
	        title: '交易代码',
	        dataIndex: 'txnCode',
	        key: 'txnCode',
	        width: 200,
	    },
	    {
	        title: '交易描述',
	        dataIndex: 'txnName',
	        key: 'txnName',
	        width: 200,
	    },
	    {
	        title: '',
	        key: 'action',
	        width: 60,
	        render: (text, record) => (
	            <span>
	                <a href="#" onClick={this.onClickRemove.bind(this, record)}>移除</a>
	            </span>
	        ),
	    }
	    ]

	    var recordSet = this.state.funcTxnSet.recordSet;
	    
	    var isSure1 = this.state.isSure1;
	    var isSure2 = this.state.isSure2;
	    var isSure3 = this.state.isSure3;
	  	var cs = Common.getGridMargin(this, 0);
	    return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['auth-app-func/retrieve','auth-app-func/remove']}/>
				</div>
	            <div style={{overflow:'hidden', height:'100%'}}>
	                <div style={{borderRight: '1px solid #e2e2e2', width:'220px', height:'100%', float:'left', overflowY:'auto', overflowX:'hidden'}}>
		                <div className='grid-page' style={{padding: '44px 0 0 0'}}>
		                    <div style={{margin: '-44px 0 0 0'}}>
			                    <div style={{padding: '16px 0 0 8px'}}>
			                        <Button icon={Common.iconAdd} title="增加功能" type="primary" disabled={isSure1} onClick={this.handleOpenCreateWindow}/>
			                        <Button icon='edit' title="修改功能" type="primary" disabled={isSure2} onClick={this.handleOpenUpdateWindow} style={{marginLeft: '4px'}}/>
			                        <Button icon='delete' title="删除功能" disabled={isSure2} onClick={this.handleRemoveWindow} style={{marginLeft: '4px'}}/>
			                    </div>
			                </div>
			                <div style={{height:'100%', overflow:'auto'}}>
			                	<FuncTree onSelect={this.onSelectRes} style={{paddingLeft: '4px'}}/>
			                </div>
			            </div>
	                    <CreateFuncPage ref="createWindow"/>
	                    <UpdataFuncPage ref="updateWindow"/>
	                </div>
	                <div style={{height:'100%', overflow:'hidden'}}>
		                <div className='grid-page' style={{padding: '58px 0 0 0'}}>
		                    <div style={{margin: '-58px 0 0 0'}}>
		                        <div className='toolbar-table' >
		                            <Button icon={Common.iconAdd} disabled={isSure3}  onClick={this.handleOpenSelectWindow} type="primary" title='选择原子功能'/>
		                            <Button icon={Common.iconRefresh} disabled={isSure3}  onClick={this.handleQueryClick} title='刷新数据' style={{marginLeft:'4px'}}/>
		                        </div>
		                    </div>
	                        <div className='grid-body'>
	                        	<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size='middle' pagination={false} bordered={Common.tableBorder} />
	                        </div>
		                </div>
		                <SelectFuncPage ref='selectWindow'/>
		            </div>
	            </div>
	        </div>
	    );
    }
});

ReactMixin.onClass(FuncPage, Reflux.connect(FuncTxnStore, 'funcTxnSet'));
module.exports = FuncPage;


