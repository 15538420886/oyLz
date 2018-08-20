'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var HotelRoomStore = require('../data/HotelRoomStore.js');
var HotelRoomActions = require('../action/HotelRoomActions');
import CreateHotelRoomPage from './CreateHotelRoomPage';
import UpdateHotelRoomPage from './UpdateHotelRoomPage';

var filterValue = '';
var HotelRoomPage = React.createClass({
    getInitialState : function() {
        return {
            hotelRoomSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(HotelRoomStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            hotelRoomSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
        var hotelUuid = this.props.uuid;
        HotelRoomActions.retrieveHotelRoom(hotelUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var hotelUuid = this.props.uuid;
        HotelRoomActions.initHotelRoom(hotelUuid);
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(hotelRoom, event)
    {
        if(hotelRoom != null){
            this.refs.updateWindow.initPage(hotelRoom);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(hotelRoom, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的房间类型 【'+hotelRoom.roomType+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, hotelRoom)
        });
    },

    onClickDelete2 : function(hotelRoom)
    {
        this.setState({loading: true});
        HotelRoomActions.deleteHotelRoom( hotelRoom.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        var recordSet = Common.filter(this.state.hotelRoomSet.recordSet, filterValue);

        const columns = [
            {
            	title: '房型',
            	dataIndex: 'roomType',
            	key: 'roomType',
            	width: 140,
            },
            {
            	title: '早餐',
            	dataIndex: 'breakfast',
            	key: 'breakfast',
            	width: 140,
              render: (text, record) => (
                <span>{text == "1"?"含早":"不含"}</span>

              ),
            },
            {
            	title: '最低价格',
            	dataIndex: 'priceLow',
            	key: 'priceLow',
            	width: 140,
            },
            {
            	title: '最高价格',
            	dataIndex: 'priceHigh',
            	key: 'priceHigh',
            	width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改房间类型'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除房间类型'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hotel_room/retrieve', 'hotel_room/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加房间类型" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateHotelRoomPage ref="createWindow" hotelUuid={this.props.uuid}/>
                <UpdateHotelRoomPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = HotelRoomPage;
