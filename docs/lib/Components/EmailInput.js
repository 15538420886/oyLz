import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../public/script/utils');
var UiParamStore = require('../../../docs/param/ui-param/data/UiParamStore');
var UiParamActions = require('../../../docs/param/ui-param/action/UiParamActions');

import { AutoComplete, Spin } from 'antd';
const Option1 = AutoComplete.Option;

var EmailInput = React.createClass({
    getInitialState: function () {
        return {
            paramList: [],
            result: [],
            loading: false
        }
    },
    mixins: [Reflux.listenTo(UiParamStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.state.paramList = [];
        if (data.errMsg === '') {
            var list = data.recordSet
            var paramName = '邮件后缀';
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.paramName === paramName) {
                    this.state.paramList = item.paramValue.split('\n');
                    break;
                }
            }
        }

        this.setState({
            loading: false
        });
    },
    componentDidMount: function () {
        this.setState({ loading: true });
        // FIXME 查询条件
        var corpUuid = window.loginData.compUser.corpUuid;
        UiParamActions.retrieveUiParam(corpUuid);
    },

    handleSearch: function (value) {
        let result;
        if (!value || value.indexOf('@') >= 0) {
            result = [];
        } else {
            result = this.state.paramList.map(domain => `${value}@${domain}`);
        }

        this.setState({ result });
    },
    render: function () {
        let result = this.state.result;
        const children = result.map((email) => {
            return <Option1 key={email}>{email}</Option1>;
        });

        return (
            <AutoComplete onSearch={this.handleSearch} placeholder="请输入电子邮箱" {...this.props} >
                {children}
            </AutoComplete>
        );
    }
});

export default EmailInput;
