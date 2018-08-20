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
var CorpStore = require('./data/CorpStore');
var CorpActions = require('./action/CorpActions');
import CreateCorpPage from './Components/CreateCorpPage';
import UpdateCorpPage from './Components/UpdateCorpPage';
import ProjContext from '../../ProjContext';

var filterValue = '';
var CorpPage = React.createClass({
	getInitialState : function() {
		return {
			corpSet: {
				recordSet: [],
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(CorpStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            corpSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		var corpUuid= window.loginData.compUser.corpUuid;
		this.setState({loading: true});
		CorpActions.retrieveOutCorp(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corpUuid= window.loginData.compUser.corpUuid;
		this.setState({loading: true});
		CorpActions.initOutCorp(corpUuid);
	},

	handleOpenCreateWindow : function(event) {
		var corpUuid= window.loginData.compUser.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	handleCorpClick: function(corp, e)
    {
    	if(corp != null){
			ProjContext.openOutCorpPage(corp);
    	}
		e.stopPropagation();
    },

	onClickUpdate : function(corp, event)
	{
		if(corp != null){
			this.refs.updateWindow.initPage(corp);
			this.refs.updateWindow.toggle();
		}
		event.stopPropagation();
	},

	onClickDelete : function(corp, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的外协公司 【'+corp.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, corp)
		});
		event.stopPropagation();
	},

	onClickDelete2 : function(corp)
	{
		this.setState({loading: true});
		CorpActions.deleteOutCorp( corp.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},
    
    render : function() {
        var recordSet = Common.filter(this.state.corpSet.recordSet, filterValue);

        var cardList =
	      	recordSet.map((outCorp, i) => {
				return <div key={outCorp.uuid} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleCorpClick.bind(this, outCorp)}  title='点击进入公司维护页面'>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{outCorp.corpName}</h3></div>
						<div className="ant-card-extra">
							<a href="#" onClick={this.onClickUpdate.bind(this, outCorp)} title='修改'><Icon type={Common.iconUpdate}/></a>
							<span className="ant-divider" />
							<a href="#" onClick={this.onClickDelete.bind(this, outCorp)}  title='删除'><Icon type={Common.iconRemove}/></a>
						</div>
						<div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{outCorp.corpDesc}</div>
					</div>
				</div>
	      	});
	
        var cs = Common.getCardMargin(this);
    	return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['out-corp/retrieve', 'out-corp/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
          				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个公司</div>
                  			<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加外协公司' className='toolbar-icon' style={{color: '#108ee9'}}/>
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

    			<CreateCorpPage ref="createWindow"/>
    			<UpdateCorpPage ref="updateWindow"/>
          </div>);
      }
});

module.exports = CorpPage;

