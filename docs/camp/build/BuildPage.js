'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Icon, Modal, Spin, Input } from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');
var Context = require('../CampContext');

var Utils = require('../../public/script/utils');
var BuildStore = require('./data/BuildStore.js');
var BuildActions = require('./action/BuildActions');
import CreateBuildPage from './Components/CreateBuildPage';
import UpdateBuildPage from './Components/UpdateBuildPage';

var filterValue = '';
var BuildPage = React.createClass({
	getInitialState : function() {
		return {
			buildSet: {
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

    mixins: [Reflux.listenTo(BuildStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            buildSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		this.state.buildSet.operation = '';
		this.setState({loading: true});

		var campus = Context.selectedCampus;
		BuildActions.retrieveHrBuild(campus.uuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.buildSet.operation = '';
		this.setState({loading: true});

		var campus = Context.selectedCampus;
		BuildActions.initHrBuild(campus.uuid);
	},

	handleOpenCreateWindow : function(event) {
		var campus = Context.selectedCampus;
		this.refs.createWindow.clear(campus.uuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(build, event)
	{
		if(build != null){
			this.refs.updateWindow.initPage(build);
			this.refs.updateWindow.toggle();
		}

    	event.stopPropagation();
	},

	onClickDelete : function(build, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的楼宇 【'+build.buildCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, build)
		});

    	event.stopPropagation();
	},

	onClickDelete2 : function(build)
	{
        this.state.buildSet.operation = '';
        this.setState({loading: true});
		BuildActions.deleteHrBuild( build.uuid );
	},
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	render : function() {
		var campus = Context.selectedCampus;
		var recordSet = Common.filter(this.state.buildSet.recordSet, filterValue);
		
	    var cardList =
			recordSet.map((build, i) => {
				return <div key={build.uuid} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={Context.openRoomPage.bind(Context, build)} title='点击进入房间维护页面'>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{build.buildCode}</h3></div>
						{
							(Context.runMode === 'conf') ?
							<div className="ant-card-extra">
								<a href="#" onClick={this.onClickUpdate.bind(this, build)}>修改</a>
								<span className="ant-divider" />
								<a href="#" onClick={this.onClickDelete.bind(this, build)}>删除</a>
							</div>
							: null
						}
						<div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{build.address}</div>
					</div>
				</div>
			})

        var cs = Common.getCardMargin(this);
		return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-build/retrieve', 'hr-build/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
          		    		<a key='backCampus' href='#' onClick={Context.goBackCampus.bind(Context)}>{campus.campusName}</a>{' > '}
					    	楼宇清单
					    	{
					    		(Context.runMode === 'conf') ?
					    		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加楼宇' className='toolbar-icon' style={{paddingLeft:'8px', cursor:'pointer'}}/>
					    		: null
					    	}
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

				<CreateBuildPage ref="createWindow"/>
				<UpdateBuildPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = BuildPage;
