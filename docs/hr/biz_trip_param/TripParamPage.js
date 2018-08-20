'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var TripParamStore = require('./data/TripParamStore.js');
var TripParamActions = require('./action/TripParamActions');
import CreateTripParamPage from './Components/CreateTripParamPage';
import UpdateTripParamPage from './Components/UpdateTripParamPage';

var TripCityStore = require('../trip_city/data/TripCityStore.js');
var TripCityActions = require('../trip_city/action/TripCityActions');


var filterValue = '';
var TripParamPage = React.createClass({
	getInitialState : function() {
		return {
			tripParamSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			cityMap:{},
			tripUuid:'',
            corpUuid:window.loginData.compUser.corpUuid,
		}
	},

    mixins: [Reflux.listenTo(TripParamStore, "onServiceComplete"),
		Reflux.listenTo(TripCityStore, "onCityComplete")],
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
	getCityType: function(cityUuid){
		var cityType = this.state.cityMap[cityUuid];
		if(cityType === null || cityType === '' || typeof(cityType) === 'undefined'){
			return cityUuid;
		}

		return cityType;
	},

	// 刷新
	handleQueryClick : function() {
		this.setState({loading: true});
		this.state.tripParamSet.operation = '';
		TripParamActions.retrieveHrBizTripParam(this.state.tripUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		this.state.tripUuid = this.props.tripUuid;
		TripParamActions.initHrBizTripParam(this.props.tripUuid);

		// 加载城市列表
        var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
        TripCityActions.initHrTripCity(corpUuid);
	},

	handleOpenCreateWindow : function() {
		this.refs.createWindow.clear(this.state.corpUuid, this.state.tripUuid);
		this.refs.createWindow.toggle();
	},

	componentWillReceiveProps:function(nextProps){
        if(nextProps.tripUuid === this.state.tripUuid){
            return;
        }

        this.state.tripUuid = nextProps.tripUuid;
        this.setState({loading: true});
        this.state.tripParamSet.operation = '';
        TripParamActions.initHrBizTripParam(nextProps.tripUuid);
    },

	onClickUpdate : function(tripParam, event)
	{
		if(tripParam != null){
			this.refs.updateWindow.initPage(tripParam);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(tripParam, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的额度 【'+tripParam.cityType+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, tripParam)
		});
	},

	onClickDelete2 : function(tripParam)
	{
		this.setState({loading: true});
		this.state.tripParamSet.operation = '';
		TripParamActions.deleteHrBizTripParam( tripParam.uuid );
	},

	onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
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
				title: '',
				key: 'action',
				width: 70,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-biz-trip-param/retrieve', 'hr-biz-trip-param/remove']}/>
				<div style={{margin: '-58px 0 0 0'}}>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加额度" onClick={this.handleOpenCreateWindow} />
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
					</div>
				</div>
					<div className='grid-body'>
						<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle"  bordered={Common.tableBorder}/>
					</div>
				<CreateTripParamPage ref="createWindow"/>
				<UpdateTripParamPage ref="updateWindow"/>
			</div>
		);
	}
});

module.exports = TripParamPage;
