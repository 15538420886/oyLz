import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var SelectFlowStore = require('../data/SelectFlowStore');
var SelectFlowActions = require('../action/SelectFlowActions');

var SelectFlow = React.createClass({
    getInitialState: function () {
        return {
            flowSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            corpUuid: '',
        }
    },

    mixins: [Reflux.listenTo(SelectFlowStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            flowSet: data
        });
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
        this.state.flowSet = {
            recordSet: []
        };

        if (corpUuid === null || corpUuid === undefined || corpUuid === '') {
            this.setState({ loading: false, corpUuid: '' });
            return;
        }

        this.setState({ loading: true, corpUuid: corpUuid });

        var filter = {};
        filter.corpUuid = corpUuid;
        SelectFlowActions.initFlow(filter); 
    },

    render: function () {
        const data = this.state.flowSet.recordSet;
        var box =
            <Select {...this.props}>
                <Option key='-' value=''>--</Option>
                {data.map(d => <Option key={d.uuid} value={d.uuid}>{d.flowName}</Option>)}
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default SelectFlow;