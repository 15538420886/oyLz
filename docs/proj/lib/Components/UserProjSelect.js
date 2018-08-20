import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var Common = require('../../../public/script/common');
var UserProjStore = require('../data/UserProjStore');
var UserProjActions = require('../action/UserProjActions');

var UserProjSelect = React.createClass({
	getInitialState : function() {
		return {
			userProjSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
			loading: false,
			filter:{},
			defaultValue:'',
    }
	},

	mixins: [Reflux.listenTo(UserProjStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
          this.setState({
            loading: false,
            userProjSet: data
        });
	  }
	},
    
	getUserProjNode: function(value){
		if(typeof(value) === 'undefined'){
			value = this.props.value;
		}

		if(value === null || value === '' || typeof(value) === 'undefined'){
			return {};
		}

		var nodes = this.state.userProjSet.recordSet;
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
		this.state.userProjSet = {
			recordSet: [],
			errMsg:'',
			operation:''
		};

		this.setState({loading: true});
        var filter=this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        filter.qryDate = Common.getToday()+'';
        UserProjActions.initUserProj(filter);
	},

    render: function () {
        const {
            required,
			mode,
			value,
			setDefProj,
            ...attributes,
        } = this.props;

        var recordSet = this.state.userProjSet.recordSet;

		var projUuid = value;
		if(mode==='create' && !projUuid && recordSet.length > 0){
			projUuid = recordSet[0].uuid;
			if(setDefProj){
				setDefProj( recordSet[0] );
			}
		}

        var box;
		if (required) {
			box = <Select {...attributes} value={projUuid}>
				{
					recordSet.map((d, i) => {
						return <Option key={d.uuid} value={d.uuid}>{d.projName}</Option>
					})
				}
			</Select>
		}
		else {
			box = <Select {...this.props} value={projUuid}>
				<Option value=''>--</Option>
				{
					recordSet.map((d, i) => {
						return <Option key={d.uuid} value={d.uuid}>{d.projName}</Option>
					})
				}
			</Select>
		}
		
		return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default UserProjSelect;
