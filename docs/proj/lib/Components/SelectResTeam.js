import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var SelectResTeamStore = require('../data/SelectResTeamStore');
var SelectResTeamActions = require('../action/SelectResTeamActions');

var SelectResTeam = React.createClass({
    getInitialState: function () {
        return {
            resTeamSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            poolUuid: '',
        }
    },

    mixins: [Reflux.listenTo(SelectResTeamStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            resTeamSet: data
        });
    },
    getTeamNode: function (value) {
        if (typeof (value) === 'undefined') {
            value = this.props.value;
        }

        if (value === null || value === '' || typeof (value) === 'undefined') {
            return {};
        }

        var nodes = this.state.resTeamSet.recordSet;
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            if (nodes[i].uuid === value) {
                return nodes[i];
            }
        }

        return {};
    },

    componentDidMount: function () {
        this.loadData( this.props.poolUuid );
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.poolUuid !== this.state.poolUuid) {
            this.loadData(newProps.poolUuid);
        }
    },
    loadData: function (poolUuid) {
        this.state.resTeamSet = {
            recordSet: []
        };

        if (poolUuid === null || poolUuid === undefined || poolUuid === '') {
            this.setState({ loading: false, poolUuid: '' });
            return;
        }

        this.setState({ loading: true, poolUuid: poolUuid });

        var filter = {};
        filter.poolUuid = poolUuid;
        SelectResTeamActions.initResTeam(filter);
    },

    render: function () {
        const data = this.state.resTeamSet.recordSet;
        var box =
            <Select {...this.props} >
                <Option key='-' value=''>--</Option>
                {data.map(d => <Option key={d.uuid} value={d.uuid}>{d.teamName}</Option>)}
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default SelectResTeam;