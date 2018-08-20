'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Badge, Menu, Dropdown, Icon, Modal, Input, Radio} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var HotelStore = require('./data/HotelStore.js');
var HotelActions = require('./action/HotelActions');
var HotelRoomStore = require('./data/HotelRoomStore.js');
var HotelRoomActions = require('./action/HotelRoomActions.js');
import CreateHotelPage from './Components/CreateHotelPage';
import UpdateHotelPage from './Components/UpdateHotelPage';
import RetrieveHotelRoomPage from './Components/RetrieveHotelRoomPage';

var filterValue = '';

var HotelPage = React.createClass({
    getInitialState : function() {
        return {
            hotelSet: {
                recordSet: [],
                errMsg : ''
            },
            hotelRoomSet:{
              recordSet: [],
              errMsg : ''
            },
            loading: false,
            viewType: '1',
            action: 'query',
            hotel: null,
            expandedRowKeys:[]
        }
    },

    mixins: [Reflux.listenTo(HotelStore, "onServiceComplete"),
             Reflux.listenTo(HotelRoomStore, "onServiceComplete1")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            hotelSet: data
        });
    },
    onServiceComplete1: function(data) {
      this.state.hotelSet.recordSet.forEach(function(i){
        if(i.uuid == data.filter.hotelUuid){
          i.childrenList = data.recordSet;

        }
      })
        this.setState({
            loading: false,
            hotelRoomSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
				var corpUuid = window.loginData.compUser.corpUuid;
        HotelActions.retrieveHotel(corpUuid);
        this.setState({
            expandedRowKeys:[]
        }) 
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
				var corpUuid = window.loginData.compUser.corpUuid;
        HotelActions.initHotel(corpUuid);
    },

    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },
    onClickUpdate : function(hotel, event)
    {
        if(hotel != null){
            this.setState({hotel: hotel, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
    onChangeView: function(e) {
  		this.setState({viewType: e.target.value});
  	},

    onClickDelete : function(hotel, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的协议酒店 【'+hotel.hotelName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, hotel)
        });
    },
    onClickDelete2 : function(hotel)
    {
        this.setState({loading: true});
        HotelActions.deleteHotel( hotel.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    onExpand:function(expand,record){
      if(expand){
        this.state.expandedRowKeys.push(record.uuid)
        HotelRoomActions.initHotelRoom(record.uuid);
      }
      else{
        var expandedRowKeys = this.state.expandedRowKeys;
        var len = expandedRowKeys.length;
        for(var i = 0; i < len; i++){
            if(expandedRowKeys[i] === record.uuid){
                expandedRowKeys.splice(i,1)
            }
            this.setState({
                expandedRowKeys:expandedRowKeys
            })
        }
       
      }
    },
		onSearch:function(objList, filterValue){
			if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
					return objList;
			}
			var rs=[];
			objList.map(function(node) {
				if(node.city.indexOf(filterValue)>=0){
						rs.push( node );
				}
			});
			return rs;
		},

    render : function() {
				var recordSet = this.onSearch(this.state.hotelSet.recordSet, filterValue);
        // var recordSet = Common.filter(this.state.hotelSet.recordSet, filterValue);
        const expandedRowRender = (record,index) => {
          const columns = [
            { title: '房型', dataIndex: 'roomType', key: 'roomType' },
            { title: '含早', dataIndex: 'breakfast', key: 'breakfast' },
            { title: '最低价', dataIndex: 'priceLow',key: 'priceLow' },
            { title: '最高价', dataIndex: 'priceHigh', key: 'priceHigh' },
          ];
          const data = this.state.hotelSet.recordSet[index].childrenList;
          return (
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          );

          // return(<div>aaa</div>)
        };
        var columns =[];
        if(this.state.viewType == '1'){
           columns = [
              {
              	title: '名称',
              	dataIndex: 'hotelName',
              	key: 'hotelName',
              	width: 140,
              },
              {
              	title: '城市',
              	dataIndex: 'city',
              	key: 'city',
              	width: 140,
              },
              {
              	title: '地址',
              	dataIndex: 'hotelLoc',
              	key: 'hotelLoc',
              	width: 140,
              },
              {
              	title: '价格',
              	dataIndex: 'basePrice',
              	key: 'basePrice',
              	width: 140,
              },
              {
              	title: '酒店电话',
              	dataIndex: 'phone',
              	key: 'phone',
              	width: 140,
              },
              {
              	title: '星级',
              	dataIndex: 'hotelStar',
              	key: 'hotelStar',
              	width: 140,
              },
              {
                  title: '操作',
                  key: 'action',
                  width: 100,
                  render: (text, record) => (
                      <span>
                      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改协议酒店'><Icon type={Common.iconUpdate}/></a>
                      <span className="ant-divider" />
                      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除协议酒店'><Icon type={Common.iconRemove}/></a>
                      </span>
                  ),
              }
          ];
        }else{
           columns = [
              {
              	title: '名称',
              	dataIndex: 'hotelName',
              	key: 'hotelName',
              	width: 140,
              },
              {
              	title: '客户经理',
              	dataIndex: 'account',
              	key: 'account',
              	width: 140,
              },
              {
              	title: '联系电话',
              	dataIndex: 'mobile',
              	key: 'mobile',
              	width: 140,
              },
              {
              	title: '签约日期',
              	dataIndex: 'signDate',
              	key: 'signDate',
              	width: 140,
              },
              {
              	title: '签约人',
              	dataIndex: 'signName',
              	key: 'signName',
              	width: 140,
              },
              {
              	title: '合作级别',
              	dataIndex: 'coLevel',
              	key: 'coLevel',
              	width: 140,
              },
              {
                  title: '操作',
                  key: 'action',
                  width: 100,
                  render: (text, record) => (
                      <span>
                      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改协议酒店'><Icon type={Common.iconUpdate}/></a>
                      <span className="ant-divider" />
                      <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除协议酒店'><Icon type={Common.iconRemove}/></a>
                      </span>
                  ),
              }
          ];
        }


        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['hotel/retrieve', 'hotel/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加协议酒店" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                            <RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
              								<RadioButton value="1">酒店信息</RadioButton>
              								<RadioButton value="2">签约信息</RadioButton>
              							</RadioGroup>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查询(城市)" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} expandedRowKeys={this.state.expandedRowKeys} rowKey={record => record.uuid} loading={this.state.loading} expandedRowRender={expandedRowRender} onExpand={this.onExpand} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
            </div>
        );

		var formPage = null;
		if(this.state.action === 'create'){
                    // FIXME 输入参数
		    formPage = <CreateHotelPage onBack={this.onGoBack}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateHotelPage onBack={this.onGoBack} hotel={this.state.hotel}/>
		}

		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = HotelPage;
