import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var TestQuestStore = require('../../param/test_quest/data/TestQuestStore');
var TestQuestActions = require('../../param/test_quest/action/TestQuestActions');

var TestQuestSelect = React.createClass({
	getInitialState : function() {
		return {
			stdjobSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false
		}
	},

	mixins: [Reflux.listenTo(TestQuestStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.stdjobSet = data;
	      this.setState({loading: false});
	  }
	},
	getStdJobNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.stdjobSet.recordSet;
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
		this.state.stdjobSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		var filter = {};
		filter.corpUuid = corpUuid;
		TestQuestActions.retrieveQuestStore(filter);
        
	},
    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.stdjobSet.recordSet;

        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.cateName}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.cateName}</Option>
                    })
                }
            </Select>
        }

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default TestQuestSelect;
