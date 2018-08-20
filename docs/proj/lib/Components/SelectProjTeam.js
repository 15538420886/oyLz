import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var SelectProjTeamStore = require('../data/SelectProjTeamStore');
var SelectProjTeamActions = require('../action/SelectProjTeamActions');

var SelectProjTeam = React.createClass({
    getInitialState: function () {
		return {
			projTeamSet: {
				recordSet: [],
				errMsg : ''
			},
            loading: false,
            projUuid: '',
		}
	},

	mixins: [Reflux.listenTo(SelectProjTeamStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projTeamSet: data
        });
    },
    getTeamNode: function(value){
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

    componentDidMount: function () {
        this.state.projUuid = this.props.projUuid;

        if (this.props.projUuid) {
            var filter = {};
            filter.projUuid = this.props.projUuid;
            this.setState({ loading: true });
            SelectProjTeamActions.initProjTeam(filter);
        }
    },
    componentWillReceiveProps:function(nextProps){
        if (this.state.projUuid !== nextProps.projUuid) {
            this.state.projTeamSet = {
                recordSet: [],
                errMsg: '',
            };

            this.state.projUuid = nextProps.projUuid;
            if (nextProps.projUuid) {
                var filter = {};
                filter.projUuid = nextProps.projUuid;
                this.setState({ loading: true });
                SelectProjTeamActions.initProjTeam(filter);
            }
        }
	},

	render : function() {
        const data = this.state.projTeamSet.recordSet;
        var box =
            <Select {...this.props}>
                <Option key='-' value=''>--</Option>
			    {data.map(d => <Option key={d.uuid} value={d.uuid}>{d.teamName}</Option>)}
			</Select>
        return this.state.loading ? <Spin>{box}</Spin> : box;
	}
});

export default SelectProjTeam;