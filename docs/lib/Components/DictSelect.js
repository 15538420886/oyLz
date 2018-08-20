import React from 'react';
var Utils = require('../../public/script/utils');

import { Select, Spin } from 'antd';
const Option = Select.Option;

var DictSelect = React.createClass({
    getInitialState: function () {
        return {
            opts: [],
            loading: false
        }
    },

    showOptions: function (opts) {
        var values = opts.codeData;
        if (values === null || typeof (values) === 'undefined') {
            values = [];
        }

        this.setState({
            opts: values,
            loading: false
        });
    },
    componentWillMount: function () {
        const {
            appName,
            optName,
        } = this.props;

        this.state.loading = true;
        Utils.loadOptions(appName, optName, this.showOptions);
    },
    selectMultiValue: function (value) {
        if (this.props.onSelect) {
            var inputValue = this.props.value;
            var arr = inputValue ? inputValue.split(',') : [];
            arr.push(value);
            inputValue = arr.join(',');

            this.props.onSelect(inputValue);
        }
    },

    deselectMultiValue: function (value) {
        if (this.props.onSelect) {
            var inputValue = this.props.value;
            var arr = inputValue ? inputValue.split(',') : [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    arr.splice(i, 1);
                    break;
                }
            }

            inputValue = arr.join(',');
            this.props.onSelect(inputValue);
        }
    },

    render: function () {
        const {
            appName,
            optName,
            showCode,
            required,
            mode,
            onSelect,
            value,
            ...attributes,
        } = this.props;

        var opts;
        if (showCode) {
            opts = this.state.opts.map((item, i) => {
                return <Option key={item.codeValue} value={item.codeValue}>{item.codeValue}-{item.codeDesc}</Option>
            });
        }
        else {
            opts = this.state.opts.map((item, i) => {
                return <Option key={item.codeValue} value={item.codeValue}>{item.codeDesc}</Option>
            });
        }

        var obj;
        if (mode === 'multiple') {
            var list = value ? value.split(',') : [];
            obj =
                <Select mode="multiple" value={list} onSelect={this.selectMultiValue} onDeselect={this.deselectMultiValue} {...attributes}>
                    {opts}
                </Select>
        }
        else {
            if (required) {
                obj = <Select value={value} onSelect={onSelect} {...attributes}>
                    {opts}
                </Select>
            }
            else {
                obj = <Select value={value} onSelect={onSelect} {...attributes}>
                    <Option value=''>--</Option>
                    {opts}
                </Select>
            }
        }

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
});

export default DictSelect;
