import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var ProjStore = require('../data/ProjStore');
var ProjActions = require('../action/ProjActions');

var ProjInfoSelect = React.createClass({
    getInitialState: function () {
        return {
            projSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            parentUuid: '',
        }
    },

    mixins: [Reflux.listenTo(ProjStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projSet: data
        });
    },
    getProjNode: function (value) {
        if (typeof (value) === 'undefined') {
            value = this.props.value;
        }

        if (value === null || value === '' || typeof (value) === 'undefined') {
            return {};
        }

        var nodes = this.state.projSet.recordSet;
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            if (nodes[i].uuid === value) {
                return nodes[i];
            }
        }

        return {};
    },

    componentDidMount: function () {
        this.loadData(this.props.parentUuid );
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.parentUuid !== this.state.parentUuid) {
            this.loadData(newProps.parentUuid);
        }
    },
    loadData: function (parentUuid) {
        this.state.projSet = {
            recordSet: []
        };

        if (parentUuid === null || parentUuid === undefined || parentUuid === '') {
            this.setState({ loading: false, parentUuid: '' });
            return;
        }

        this.setState({ loading: true, parentUuid: parentUuid });

        var filter = {status:'1'};
        filter.parentUuid = parentUuid;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        ProjActions.initProj(filter);
    },

    render: function () {
        const data = this.state.projSet.recordSet;
        var box =
            <Select {...this.props} >
                <Option key='-' value=''>--</Option>
                {data.map(d => <Option key={d.uuid} value={d.uuid}>{d.projName}</Option>)}
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default ProjInfoSelect;
