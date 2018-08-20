import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var HrExecutStore = require('../../param/hr_person/data/HrExecutStore');
var HrExecutActions = require('../../param/hr_person//action/HrExecutActions');

var HrPersonSelect = React.createClass({
	getInitialState : function() {
		return {
			HrPersonSelect : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false
		}
	},

	mixins: [Reflux.listenTo(HrExecutStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.HrPersonSelect = data;
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

		var nodes = this.state.HrPersonSelect.recordSet;
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
		this.state.HrPersonSelect = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;
		var filter = {};
		filter.corpUuid = corpUuid;
		HrExecutActions.retrieveHrExecut(filter);
        
	},
    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.HrPersonSelect.recordSet;

        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.hrName}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.hrName}</Option>
                    })
                }
            </Select>
        }

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default HrPersonSelect;
