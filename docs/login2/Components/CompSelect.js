'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Select, Spin} from 'antd';
const Option = Select.Option;

var CompStore = require('./CompStore.js');
var CompActions = require('./CompActions');

var CompSelect = React.createClass({
	getInitialState : function() {
		return {
			compSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false
		}
	},
	mixins: [Reflux.listenTo(CompStore, "onServiceComplete")],
	onServiceComplete: function(data) {
      this.state.compSet = data;
      this.setState({loading: false});

	  var fieldValue = this.props.value;
	  var recordSet = data.recordSet;
		if(data.operation === 'retrieve' && data.errMsg === ''){
			if(recordSet.length > 0){
				//如果本地有  则按照有的  没有则按照第一个
				var corpUuid = window.localStorage.corpUuid;
				if(corpUuid === undefined || corpUuid === ''){
					fieldValue = recordSet[0].corpUuid;
				}else{
					fieldValue = corpUuid;
				}		
				this.props.onLoaded( fieldValue );
				
			}
		}
	},
	loadCorps: function(){
		if(localStorage.corpUuid !== undefined && 
			localStorage.corpUuid !== '' && 
			localStorage.userName !== undefined && 
			localStorage.userName !== '' && 
			this.state.compSet.operation !== 'retrieve')
		{
			//加载option
			this.setState({loading:true});
			CompActions.initCompUser(localStorage.userName);
		}
	},

	// 第一次加载
	loadData : function(userName){
		this.setState({
			compSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: true
		});

		CompActions.initCompUser(userName);
	},

	render : function() {
	    const {
	      value,
	      ...attributes,
	    } = this.props;

		var fieldValue = value;
		var recordSet = this.state.compSet.recordSet;
		var localStorage = window.localStorage;
		

		var opts = recordSet.map((item, i) => {
			return <Option key={item.corpUuid} value={item.corpUuid}>{item.compName}</Option>
		});
		opts.push(<Option key='#' value='#'>个人用户</Option>);

		var sk = (fieldValue === null || fieldValue === '') ?
	      <Select {...attributes} placeholder="选择用户登入的身份">{opts}</Select>
		:
	      <Select {...attributes} value={fieldValue}>{opts}</Select>

		 return this.state.loading ? <Spin>{sk}</Spin> : sk;
	}
});

module.exports = CompSelect;
