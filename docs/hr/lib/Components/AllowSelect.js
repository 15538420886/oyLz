import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var AllowanceStore = require('../../allowance/data/AllowanceStore.js');
var AllowanceActions = require('../../allowance/action/AllowanceActions');

var AllowSelect = React.createClass({
	getInitialState : function() {
		return {
			allowanceSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false
		}
	},

	mixins: [Reflux.listenTo(AllowanceStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.allowanceSet = data;
	      this.setState({loading: false});
	  }
	},
	getAllowNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.allowanceSet.recordSet;
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
		this.state.allowanceSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		AllowanceActions.initHrAllowance(corpUuid);
	},
	render : function(){
		var recordSet = this.state.allowanceSet.recordSet;
		var box =
			<Select {...this.props}>
			{
				recordSet.map((allow, i) => {
					return <Option key={allow.uuid} value={allow.uuid}>{allow.allowName}</Option>
				})
			}
			</Select>;

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default AllowSelect;
