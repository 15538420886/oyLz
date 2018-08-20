﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { withRouter } from 'react-router';
import {Button, Table, Icon, Modal, Input, Spin} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var PoolStore = require('./data/PoolStore.js');
var PoolActions = require('./action/PoolActions');
import CreatePoolPage from './Components/CreatePoolPage';
import UpdatePoolPage from './Components/UpdatePoolPage';
var ProjContext = require('../../ProjContext');

var filterValue = '';
var PoolPage = React.createClass({
	getInitialState : function() {
		return {
			poolSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(PoolStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            poolSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		var corpUuid = window.loginData.compUser.corpUuid;
		this.setState({loading: true});
		this.state.poolSet.operation = '';
		console.log(this.state.poolSet)
		PoolActions.retrieveResPool(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corpUuid = window.loginData.compUser.corpUuid;
		this.setState({loading: true});
		PoolActions.initResPool(corpUuid);
	},

	handleCorpClick: function(res)
    {
    	ProjContext.openGroupResPage(res);
    },

	onClickDelete : function(pool, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的资源池 【'+pool.poolName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, pool)
		});
	},

	onClickDelete2 : function(pool)
	{
		this.setState({loading: true});
		this.state.poolSet.operation = '';
		PoolActions.deleteResPool( pool.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(pool, event){
        this.setState({pool: pool, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },


	render : function() {
		var recordSet = Common.filter(this.state.poolSet.recordSet, filterValue);
        var cardList =
	      	recordSet.map((pool, i) => {
				return <div key={pool.uuid} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} >
						<div className="ant-card-head"><h3 className="ant-card-head-title">{pool.poolName}</h3></div>
						<div className="ant-card-extra">
							<a href="#" onClick={this.onClickUpdate.bind(this, pool)} title='修改'><Icon type={Common.iconUpdate}/></a>
							<span className="ant-divider" />
							<a href="#" onClick={this.onClickDelete.bind(this, pool)} title='删除'><Icon type={Common.iconRemove}/></a>
						</div>
						<div className="ant-card-body" onClick={this.handleCorpClick.bind(this, pool)} title='点击进入公司维护页面' style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>
							<p>
								<span>{pool.poolDesc}</span>
								<Icon type="team" title="小组数量" style={{marginLeft:'10px'}}/> {pool.childCount? pool.childCount : 0}
								<span style={{padding:'0 8px'}}>|</span>
								<Icon type="user" title="成员数量" /> {pool.memberCount? pool.memberCount : 0}
							</p>
						</div>
					</div>
				</div>
	      	});

		var cs = Common.getGridMargin(this);
		var visible = (this.state.action === 'query') ? '' : 'none';
		var contactTable =
			<div className='card-page' style={{padding: cs.padding,display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['res-pool/retrieve', 'res-pool/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
          				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个资源池</div>
                  			<Icon type="plus-circle-o" onClick={this.handleCreate} title='增加资源池' className='toolbar-icon' style={{color: '#108ee9'}}/>
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

    			
          </div>
          	  var page = null;
	          if(this.state.action === 'create'){
	              page = <CreatePoolPage onBack={this.onGoBack}/>;
	          }
	          else if (this.state.action === 'update') {
	              var pool = {};
	              Utils.copyValue(this.state.pool, pool);
	              page = <UpdatePoolPage onBack={this.onGoBack} pool={pool}/>
	          }

	          return (
	              <div style={{width: '100%',height:'100%'}}>
	                   {contactTable}
	                   {page}
	               </div>
	          );
			

     
	}
});

module.exports = PoolPage;
