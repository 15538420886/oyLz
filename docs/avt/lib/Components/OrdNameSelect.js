import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var Common = require('../../../public/script/common');
var ProjInfoTableStore = require('../../proj/proj-info/data/ProjInfoTableStore');
var ProjInfoTableActions = require('../../proj/proj-info/action/ProjInfoTableActions');

var OrdNameSelect = React.createClass({
    getInitialState: function () {
        return {
            projInfoTableSet: {
                recordSet: [],
                errMsg: '',
            },
            loading: false,
            projUuid: ''
        }
    },

    mixins: [Reflux.listenTo(ProjInfoTableStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'user-task') {
            this.state.projInfoTableSet = data;
            this.setState({ loading: false });
        }
    },
    getOrdNameNode: function (value) {
        if (typeof (value) === 'undefined') {
            value = this.props.value;
        }

        if (value === null || value === '' || typeof (value) === 'undefined') {
            return {};
        }

        var nodes = this.state.projInfoTableSet.recordSet;
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            if (nodes[i].uuid === value) {
                return nodes[i];
            }
        }

        return {};
    },

    // 第一次加载
    componentWillReceiveProps: function (newProps) {
        if (newProps.projUuid === this.state.projUuid) {
            return;
        }

        this.state.projInfoSet = {
            recordSet: [],
            errMsg: '',
        };

        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        if (!corpUuid) {
            return;
        }

        this.state.projUuid = newProps.projUuid;
        this.setState({ loading: true });

        var filter = {};
        filter.staffCode = window.loginData.compUser.userCode;
        filter.corpUuid = corpUuid;
        filter.projUuid = newProps.projUuid;
        ProjInfoTableActions.retrieveProjMember(filter);
    },

    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.projInfoTableSet.recordSet;
        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.ordName}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.ordName}</Option>
                    })
                }
            </Select>
        }

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default OrdNameSelect;
