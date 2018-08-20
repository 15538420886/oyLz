import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var FntRoleStore = require('../../role/data/FntRoleStore');
var FntRoleActions = require('../../role/action/FntRoleActions');

var FntRoleSelect = React.createClass({
    getInitialState: function () {
        return {
            roleSet: {
                recordSet: [],
                errMsg: '',
                operation: ''
            },
            loading: false
        }
    },

    mixins: [Reflux.listenTo(FntRoleStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'retrieve') {
            this.state.roleSet = data;
            this.setState({ loading: false });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.roleSet = {
            recordSet: [],
            errMsg: '',
            operation: ''
        };

        this.setState({ loading: true });
        var appUuid = this.props.appUuid;
        if (appUuid) {
            FntRoleActions.initFntAppRole(appUuid);
        }
    },


    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.roleSet.recordSet;

        var children =
            recordSet.map((role, i) => {
                return <Option key={role.uuid} value={role.roleName}>{role.roleName}</Option>
            });

        children.push(<Option key='*' value='*'>所有用户</Option>);
        var box =
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                {...this.props}
            >
                {children}
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default FntRoleSelect;