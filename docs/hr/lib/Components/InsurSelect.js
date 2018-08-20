import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var InsuranceStore = require('../../insurance/data/InsuranceStore.js');
var InsuranceActions = require('../../insurance/action/InsuranceActions');

var InsurSelect = React.createClass({
	getInitialState : function() {
		return {
			insuranceSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false
		}
	},

	mixins: [Reflux.listenTo(InsuranceStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'get-by-corp_uuid'){
	      this.state.insuranceSet = data;
	      this.setState({loading: false});
	  }
	},
	getInsurNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.insuranceSet.recordSet;
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
		this.state.insuranceSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		InsuranceActions.initHrInsurance(corpUuid);
	},
	render : function(){
		var recordSet = this.state.insuranceSet.recordSet;
		var box =
			<Select {...this.props}>
			{
				recordSet.map((insur, i) => {
					return <Option key={insur.uuid} value={insur.uuid}>{insur.insuName}</Option>
				})
			}
			</Select>

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default InsurSelect;
