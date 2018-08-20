import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var StdJobStore = require('../../param/std_job/data/StdJobStore');
var StdJobActions = require('../../param/std_job/action/StdJobActions');

var StdJobSelect = React.createClass({
    getInitialState: function () {
        return {
            stdJobSet: {
                recordSet: [],
                errMsg: '',
            },
            loading: false,
            category: '',
            recordSetArr: []
        }
    },

    mixins: [Reflux.listenTo(StdJobStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'retrieve') {
            this.setState({
                loading: false,
                stdJobSet: data
            });
        }
    },

    getStdJobNode: function (value) {
        if (typeof (value) === 'undefined') {
            value = this.props.value;
        }

        if (value === null || value === '' || typeof (value) === 'undefined') {
            return {};
        }

        var nodes = this.state.stdJobSet.recordSet;
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
        this.state.stdJobSet = {
            recordSet: [],
            errMsg: '',
        };

        this.state.category = this.props.category;
        if (this.state.category) {
            var filter = {};
            var corp = window.loginData.compUser;
            filter.corpUuid = corp.corpUuid;
            filter.category = this.state.category;
            this.setState({ loading: true });
            StdJobActions.retrieveStdJob(filter);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.state.category !== nextProps.category) {
            this.state.stdJobSet = {
                recordSet: [],
                errMsg: '',
            };

            this.state.category = nextProps.category;
            if (nextProps.category) {
                var filter = {};
                var corp = window.loginData.compUser;
                filter.corpUuid = corp.corpUuid;
                filter.category = this.state.category;
                this.setState({ loading: true });
                StdJobActions.retrieveStdJob(filter);
            }
        }
    },

    handleJobCodeChange: function (value, category) {
        var corpUuid = window.loginData.compUser.corpUuid;
        var node = this.getStdJobNode(value);
        var jobCode = node.jobCode;
        this.state.jobCode = jobCode;

        var recordSet = this.state.stdJobSet.recordSet;

        var stdJobArr = {};
        for (var i = 0; i < recordSet.length; i++) {
            if (recordSet[i].category == category && recordSet[i].uuid == value) {
                stdJobArr = recordSet[i];
                // console.log('stdJobArr', stdJobArr)
                break;
            }
        };
        if (stdJobArr.length != 0) {
            return stdJobArr;
        }
    },

    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var category = this.props.category;

        var recordSetArr = [];
        var recordSet = this.state.stdJobSet.recordSet;

        recordSet.map(function (item, i) {
            if (item.category == category) {
                recordSetArr.push(item)
            }
        })

        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSetArr.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.jobCode}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSetArr.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.jobCode}</Option>
                    })
                }
            </Select>
        }

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default StdJobSelect;
