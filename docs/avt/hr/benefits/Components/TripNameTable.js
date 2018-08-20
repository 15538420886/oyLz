'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var TripParamStore = require('../../../../hr/biz_trip_param/data/TripParamStore');
var TripParamActions = require('../../../../hr/biz_trip_param/action/TripParamActions');

var TripCityStore = require('../../../../hr/trip_city/data/TripCityStore');
var TripCityActions = require('../../../../hr/trip_city/action/TripCityActions');

var BizTripStore = require('../../../../hr/biz_trip/data/BizTripStore');
var BizTripActions = require('../../../../hr/biz_trip/action/BizTripActions');

var filterValue = '';
var TripNameTable = React.createClass({
    getInitialState : function() {
        return {
            tripParamSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            bizTripSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            loading: false,
            cityMap:{},
            tripName:'',
            trip:{},
            tripUuid:'',
            corpUuid:window.loginData.compUser.corpUuid,
        }
    },

    mixins: [Reflux.listenTo(TripParamStore, "onServiceComplete"),
            Reflux.listenTo(TripCityStore, "onCityComplete"),
            Reflux.listenTo(BizTripStore, "onTripComplete"),
        ],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            tripParamSet: data
        });
    },
    onCityComplete: function(data) {
        var cityMap={};
        data.recordSet.map((city, i)=>{
            cityMap[city.uuid] = city.cityType;
        });

        this.setState({
            cityMap: cityMap
        });
    },
    onTripComplete: function(data) {
        if( data.operation === 'retrieve'){
          this.setState({
              loading: false,
              bizTripSet: data
          });
          this.findList()
      }
    },
    findList:function(){
        var recordSet = this.state.bizTripSet.recordSet;
        if(this.state.tripName!=""){
            recordSet.map((item,i)=>{
                if(this.state.tripName==item.tripName){
                    this.setState({
                      loading: false,
                      trip: item,
                      tripUuid: item.uuid
                    });
                }

            })
        };
        TripParamActions.initHrBizTripParam(this.state.tripUuid);
    },
    getCityType: function(cityUuid){
        var cityType = this.state.cityMap[cityUuid];
        if(cityType === null || cityType === '' || typeof(cityType) === 'undefined'){
            return cityUuid;
        }

        return cityType;
    },


    // 第一次加载
    componentDidMount : function(){
       this.initPage(this.props.tripName);
        var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
        TripCityActions.initHrTripCity(corpUuid);
    },

    componentWillReceiveProps:function(newProps){
       this.initPage( newProps.tripName );
    },
    initPage: function(tripName)
    {
        if(window.loginData.compUser){
            this.setState({loading: true,tripName: tripName});
            var corpUuid = window.loginData.compUser.corpUuid;
            BizTripActions.initHrBizTrip(corpUuid);
        }

    },

    render : function() {
        var recordSet = Common.filter(this.state.tripParamSet.recordSet, filterValue);
        const columns = [
                {
                        title: '城市类型',
                        dataIndex: 'cityType',
                        key: 'cityType',
                        width: 140,
                        render: (text, record) => this.getCityType(record.cityType),
                    },
                   {
                        title: '出差补贴',
                        dataIndex: 'allowance',
                        key: 'allowance',
                        width: 200,
                    },
                   {
                        title: '交通补贴',
                        dataIndex: 'traffic',
                        key: 'traffic',
                        width: 140,
                    },
                   {
                        title: '住宿',
                        dataIndex: 'hotelMemo',
                        key: 'hotelMemo',
                        width: 300,
                    },
        ];

        return (
            <div style={{padding: '10px 30px 30px 30px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle"  bordered={Common.tableBorder}/>
            </div>

        );
    }
});

module.exports = TripNameTable;
