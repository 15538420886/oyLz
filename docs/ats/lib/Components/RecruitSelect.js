import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var RecruitStore = require('../../recruit/data/RecruitStore.js');
var RecruitActions = require('../../recruit/action/RecruitActions');

var RecruitSelect = React.createClass({
	getInitialState : function() {
		return {
			recruitSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false
		}
	},

	mixins: [Reflux.listenTo(RecruitStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
	      this.state.recruitSet = data;
	      this.setState({loading: false});
	  }
	},
	getRecruitNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.recruitSet.recordSet;
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
		this.state.recruitSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

        var filter = {};
        var corp = window.loginData.compUser;
        filter.corpUuid = corp.corpUuid;
        filter.status = '招聘中';
        this.setState({ loading: true });
		RecruitActions.retrieveRecruit(filter);
	},
    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.recruitSet.recordSet;

        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.jobName+'('+lvl.applyDept+')'}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.jobName+'('+lvl.applyDept+')'}</Option>
                    })
                }
            </Select>
        }

		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default RecruitSelect;
