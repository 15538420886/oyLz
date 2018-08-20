import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var BizTripStore = require('../../biz_trip/data/BizTripStore.js');
var BizTripActions = require('../../biz_trip/action/BizTripActions');

var TripSelect = React.createClass({
	getInitialState : function() {
		return {
			tripSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false
		}
	},

	mixins: [Reflux.listenTo(BizTripStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.tripSet = data;
	      this.setState({loading: false});
	  }
	},
	getTripNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.tripSet.recordSet;
		var len = nodes.length;
		for(var i=0; i<len; i++){
			if(nodes[i].uuid === value){
				return nodes[i];
			}
		}

		return {};
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.tripSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		BizTripActions.initHrBizTrip(corpUuid);
	},
	render : function(){
		var recordSet = this.state.tripSet.recordSet;
		var box =
			<Select {...this.props}>
			{
				recordSet.map((trip, i) => {
					return <Option key={trip.uuid} value={trip.uuid}>{trip.tripName}</Option>
				})
			}
			</Select>

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default TripSelect;
