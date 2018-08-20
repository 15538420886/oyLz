'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Icon, Modal, Spin, Input } from 'antd';
const Search = Input.Search;
var Common = require('../../public/script/common');
var Context = require('../CampContext');

var Utils = require('../../public/script/utils');
var RoomStore = require('./data/RoomStore.js');
var RoomActions = require('./action/RoomActions');
import CreateRoomPage from './Components/CreateRoomPage';
import UpdateRoomPage from './Components/UpdateRoomPage';

var filterValue = '';
var RoomPage = React.createClass({
	getInitialState : function() {
		return {
			roomSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading:false,
		}
	},

    mixins: [Reflux.listenTo(RoomStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            roomSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		this.state.roomSet.operation = '';
		this.setState({loading: true});

		var build = Context.selectedBuild;
		RoomActions.retrieveHrRoom(build.uuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading:true});
		var build = Context.selectedBuild;
		RoomActions.initHrRoom(build.uuid);
	},

	handleOpenCreateWindow : function(event) {
		var build = Context.selectedBuild;
		this.refs.createWindow.clear(build.uuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(room, event)
	{
		if(room != null){
			this.refs.updateWindow.initPage(room);
			this.refs.updateWindow.toggle();
		}

    	event.stopPropagation();
	},

	onClickDelete : function(room, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的房间 【'+room.roomCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, room)
		});

    	event.stopPropagation();
	},

	onClickDelete2 : function(room)
	{
		this.state.roomSet.operation = '';
		this.setState({loading:true})
		RoomActions.deleteHrRoom( room.uuid );
	},
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	render : function() {
		var campus = Context.selectedCampus;
		var build = Context.selectedBuild;
		var recordSet = Common.filter(this.state.roomSet.recordSet, filterValue);
		
		var cardList =
			recordSet.map((room, i) => {
				return <div key={room.uuid} className='card-div' style={{width: 300}}>
					<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={Context.openSeatPage.bind(Context, room)} title='点击进入工位维护页面'>
						<div className="ant-card-head"><h3 className="ant-card-head-title">{room.roomCode}</h3></div>
						{
							(Context.runMode === 'conf') ?
							<div className="ant-card-extra">
								<a href="#" onClick={this.onClickUpdate.bind(this, room)}>修改</a>
								<span className="ant-divider" />
								<a href="#" onClick={this.onClickDelete.bind(this, room)}>删除</a>
							</div>
							: null
						}
						<div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{room.manager+' (行:'+room.seatRows+', 列:'+room.seatCols+')'}</div>
					</div>
				</div>
	      	})

        var cs = Common.getCardMargin(this);
		return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-room/retrieve', 'hr-room/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
					    	<a key='backCampus' href='#' onClick={Context.goBackCampus.bind(Context)}>{campus.campusName}</a>{' > '}
					    	<a key='backBuild' href='#' onClick={Context.goBackBuild}>{build.buildCode}</a>{' > '}
					    	房间清单
					    	{
					    		(Context.runMode === 'conf') ?
					    		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加房间' className='toolbar-icon' style={{paddingLeft:'8px', cursor:'pointer'}}/>
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
			    
				<CreateRoomPage ref="createWindow" onCreateCallback={this.onCreateCallback}/>
				<UpdateRoomPage ref="updateWindow" onSaveCallback={this.onSaveCallback}/>
			</div>
		);
	}
});

module.exports = RoomPage;
