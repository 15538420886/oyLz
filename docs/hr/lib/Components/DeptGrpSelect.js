import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var DeptStore = require('../data/DeptStore');
var DeptActions = require('../action/DeptActions');

var DeptGrpSelect = React.createClass({
    getInitialState: function () {
        return {
            deptSet: {
                recordSet: []
            },
            loading: false
        }
    },

    mixins: [Reflux.listenTo(DeptStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'retrieve') {
            this.state.deptSet = data;
            this.setState({ loading: false });
        }
    },
    getDeptNode: function (value) {
        if (typeof (value) === 'undefined') {
            value = this.props.value;
        }

        if (value === null || value === '' || typeof (value) === 'undefined') {
            return {};
        }

        var nodes = this.state.deptSet.recordSet;
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            if (nodes[i].deptCode === value) {
                return nodes[i];
            }
        }

        return {};
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.deptSet = {
            recordSet: []
        };

        this.setState({ loading: true });
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        DeptActions.initDeptGroup(corpUuid);
    },
    render: function () {
        var recordSet = this.state.deptSet.recordSet;
        var box =
            <Select {...this.props}>
                {
                    recordSet.map((dept, i) => {
                        return <Option key={dept.deptCode} value={dept.deptCode}>{(dept.deptCode === dept.deptName) ? dept.deptCode : dept.deptCode+'-'+dept.deptName}</Option>
                    })
                }
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default DeptGrpSelect;
