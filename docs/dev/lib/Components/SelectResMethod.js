import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var ServiceStore = require('../../svc/data/ServiceStore');
var ServiceActions = require('../../svc/action/ServiceActions');

var isLoading = false;
var SelectResMethod = React.createClass({
    getInitialState: function () {
		return {
			resMethodSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(ServiceStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        isLoading = false;
        this.setState({
            loading: false,
            resMethodSet: data
        });
    },

	componentWillReceiveProps:function(newProps){
		this.state.resMethodSet = {
			recordSet: [],
			errMsg:'',
			operation:''
        };

        var resUuid = newProps.resUuid;
        if (resUuid) {
            if (!isLoading) {
                isLoading = true;
                ServiceActions.initAppTxn(resUuid);
            }
        }
	},

	render : function() {
        const data = this.state.resMethodSet.recordSet;
        var box =
			<Select {...this.props}>
			    {data.map(d => <Option key={d.uuid} value={d.txnName}>{d.txnName}</Option>)}
			</Select>
        return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default SelectResMethod;