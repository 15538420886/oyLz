'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Icon, Modal, Spin, Input } from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var Context = require('../CampContext');

var CampusStore = require('../../auth/campus/data/CampusStore.js');
var CampusActions = require('../../auth/campus/action/CampusActions');
import CreateCampusPage from '../../auth/campus/Components/CreateCampusPage';
import UpdateCampusPage from '../../auth/campus/Components/UpdateCampusPage';

var filterValue = '';
var CampusPage = React.createClass({
  getInitialState : function() {
      return {
        campusSet: {
            recordSet: [],
  			startPage : 0,
  			pageRow : 0,
  			totalRow : 0,
  			operation : '',
  			errMsg : ''
        },
        loading: false,
      }
  },

    mixins: [Reflux.listenTo(CampusStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            campusSet: data
        });
    },

  // 刷新
  handleQueryClick : function(event) {
        this.state.campusSet.operation = '';
        this.setState({loading: true});
		CampusActions.retrieveAuthCampus();
  },

  // 第一次加载
  componentDidMount : function(){
        this.state.campusSet.operation = '';
        this.setState({loading: true});
		CampusActions.initAuthCampus();
  },

  handleOpenCreateWindow : function(event) {
  	this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },

    handleUpdateClick: function(campus, e)
    {
    	if(campus != null){
      		this.refs.updateWindow.initPage(campus);
        	this.refs.updateWindow.toggle();
    	}

    	e.stopPropagation();
    },

    handleRemoveClick : function(campus, event)
    {
    	Modal.confirm({
    		title: Common.removeTitle,
    		content: '是否删除选中的园区 【'+campus.campusName+'】',
    		okText: Common.removeOkText,
    		cancelText: Common.removeCancelText,
    		onOk: this.handleRemoveClick2.bind(this, campus)
    	});

    	event.stopPropagation();
    },

    handleRemoveClick2: function(campus)
    {
        this.state.campusSet.operation = '';
        this.setState({loading: true});
    	CampusActions.deleteAuthCampus( campus.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

  render : function() {
        var recordSet = Common.filter(this.state.campusSet.recordSet, filterValue);

	    var cardList =
	        recordSet.map((campus, i) => {
	            return <div key={campus.uuid} className='card-div' style={{width: 300}}>
	                <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={Context.openBuildPage.bind(Context, campus, 'conf')} title='点击进入工位维护页面'>
	                    <div className="ant-card-head"><h3 className="ant-card-head-title">{campus.campusName}</h3></div>
	                    <div className="ant-card-extra">
                            <a href="#" onClick={this.handleUpdateClick.bind(this, campus)} title='修改'><Icon type={Common.iconUpdate} /></a>
	                        <span className="ant-divider" />
                            <a href="#" onClick={this.handleRemoveClick.bind(this, campus)} title='删除'><Icon type={Common.iconRemove} /></a>
	                    </div>
	                    <div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{campus.campusLoc}</div>
	                </div>
	            </div>
	        });

        var cs = Common.getCardMargin(this);
		return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-campus/retrieve', 'auth-campus/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
          				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个园区</div>
                  			<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加园区' className='toolbar-icon' style={{paddingLeft:'8px', cursor:'pointer'}}/>
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

				<CreateCampusPage ref="createWindow"/>
				<UpdateCampusPage ref="updateWindow"/>
	      </div>);
  }
});

module.exports = CampusPage;
