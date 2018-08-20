import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var FlowRoleStore = require('../../flow_role/data/FlowRoleStore');
var FlowRoleActions = require('../../flow_role/action/FlowRoleActions');

var RoleSelect = React.createClass({
	getInitialState : function() {
		return {
			levelSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false,
			filter:{},
		}
	},

	mixins: [Reflux.listenTo(FlowRoleStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.levelSet = data;
	      this.setState({loading: false});
	  }
	},
	getLevelNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.levelSet.recordSet;
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
		this.state.levelSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
/*		var corp = window.loginData.compUser;
		var corpUuid=(corp === null) ? '' : corp.corpUuid;*/
        var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        FlowRoleActions.initFlowRole(filter);
	},
    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.levelSet.recordSet;

        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.roleName}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.roleName}</Option>
                    })
                }
            </Select>
        }

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default RoleSelect;
