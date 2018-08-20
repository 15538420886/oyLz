'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { withRouter } from 'react-router'
import { Table, Button, Icon, Input, Spin, Modal } from 'antd';
const Search = Input.Search;
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var AppGroupStore = require('./data/AppGroupStore.js');
var AppGroupActions = require('./action/AppGroupActions');
import CreateAppGroupPage from './Components/CreateAppGroupPage';

var filterValue = '';
var AppGroupPage2 = React.createClass({
    getInitialState : function() {
        return {
            appGroupSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            validRules: [],
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(AppGroupStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            appGroupSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.state.appGroupSet.operation = '';
        this.setState({loading: true});
        AppGroupActions.retrieveAuthAppGroup();
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.appGroupSet.operation = '';
        this.setState({loading: true});
        AppGroupActions.initAuthAppGroup();
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    /*点击卡片页，跳转到修改页面*/
    handleAppGroupClick:function(appGroup, e)
    {
        if(appGroup != null){
            this.props.router.push({
                pathname: '/auth/GroupPage/',
                query: {
                    appGroup: JSON.stringify(appGroup),
                },
                state: { fromDashboard: true }
            });
        }
        e.stopPropagation();
    },

    handleUpdateClick:function(appGroup, e)
    {
        if(appGroup != null){
            this.refs.updateWindow.initPage(appGroup);
            this.refs.updateWindow.toggle();
        }
        e.stopPropagation();
    },
    handleRemoveClick:function(appGroup, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的应用组 【'+appGroup.groupName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.handleRemoveClick2.bind(this, appGroup)
        });

        event.stopPropagation();
    },
    handleRemoveClick2 : function(appGroup)
    {
        this.state.appGroupSet.operation = '';
        this.setState({loading: true});
        AppGroupActions.deleteAuthAppGroup( appGroup.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        var recordSet = [];
        if(filterValue === ''){
            recordSet = this.state.appGroupSet.recordSet;
        }
        else{
            recordSet = Common.filter(this.state.appGroupSet.recordSet, filterValue);
        }
        
        var cardList =
            recordSet.map((appGroup, i) => {
                return <div key={appGroup.uuid} className='card-div' style={{width: 300}}>
                    <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleAppGroupClick.bind(this, appGroup)} title='点击修改APP组信息'>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{appGroup.groupName}</h3></div>
                        <div className="ant-card-extra">
							<a href="#" onClick={this.handleAppGroupClick.bind(this, appGroup)} title='修改'><Icon type={Common.iconUpdate}/></a>
							<span className="ant-divider" />
							<a href="#" onClick={this.handleRemoveClick.bind(this, appGroup)} title='删除'><Icon type={Common.iconRemove}/></a>
                        </div>
                        <div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{appGroup.groupDesc}</div>
                    </div>
                </div>
            });

		var cs = Common.getCardMargin(this);
        return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-app-group/retrieve','auth-app-group/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
	      				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个APP组</div>
	                  		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加APP组' className='toolbar-icon' style={{color: '#108ee9'}}/>
	                  		<Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
          				</div>
          				<div style={{textAlign:'right', width:'100%'}}>
                              <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                          </div>
          			</div>
                </div>
                
                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
                }
                <CreateAppGroupPage ref="createWindow"/>
            </div>
        );
    }
});

var AppGroupPage = withRouter(AppGroupPage2);
module.exports = AppGroupPage;
