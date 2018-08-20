import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var SelectPoolStore = require('../data/SelectPoolStore');
var SelectPoolActions = require('../action/SelectPoolActions');

var SelectPool = React.createClass({
    getInitialState: function () {
        return {
            poolSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            corpUuid: '',
        }
    },

    mixins: [Reflux.listenTo(SelectPoolStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            poolSet: data
        });
    },
    getPoolNode: function (value) {
        if (typeof (value) === 'undefined') {
            value = this.props.value;
        }

        if (value === null || value === '' || typeof (value) === 'undefined') {
            return {};
        }

        var nodes = this.state.poolSet.recordSet;
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            if (nodes[i].uuid === value) {
                return nodes[i];
            }
        }

        return {};
    },

    // 第一次加载
    componentDidMount: function () {
        this.loadData(this.props.corpUuid);
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.corpUuid !== this.state.corpUuid) {
            this.loadData(newProps.corpUuid);
        }
    },
    loadData: function (corpUuid) {
        this.state.poolSet = {
            recordSet: []
        };

        if (corpUuid === null || corpUuid === undefined || corpUuid === '') {
            this.setState({ loading: false, corpUuid: '' });
            return;
        }

        this.setState({ loading: true, corpUuid: corpUuid });

        var filter = {};
        filter.corpUuid = corpUuid;
        SelectPoolActions.initPool(filter);
    },

    render: function () {
        const data = this.state.poolSet.recordSet;

        var box =
            <Select {...this.props}>
                <Option key='-' value=''>--</Option>
                {data.map(d => <Option key={d.uuid} value={d.uuid}>{d.poolName}</Option>)}
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default SelectPool;