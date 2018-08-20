import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { AutoComplete, Spin } from 'antd';

var SearchProjGroupStore = require('../data/SearchProjGroupStore');
var SearchProjGroupActions = require('../action/SearchProjGroupActions');

var ProjGroupSelect = React.createClass({
    getInitialState: function () {
        return {
            projGroupSet: {
                recordSet: []
            },
            loading: false,
            oldValue: '',
            filterValue: '',
        }
    },

    mixins: [Reflux.listenTo(SearchProjGroupStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projGroupSet: data
        });
    },

    getProjGroup: function (value) {
        if (value === null || value === '' || typeof (value) === 'undefined') {
            return null;
        }

        var nodes = this.state.projGroupSet.recordSet;
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
            if (nodes[i].grpName === value) {
                return nodes[i];
            }
        }

        return null;
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.projGroupSet = {
            recordSet: []
        };

        this.setState({ loading: true, oldValue: this.props.value, filterValue: this.props.value });

        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        SearchProjGroupActions.initProjGroup(filter);
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.value !== this.state.oldValue) {
            this.setState({ oldValue: newProps.value, filterValue: newProps.value });
        }
    },
    handleOnChange: function (value) {
        this.setState({
            filterValue: value
        });

        var onChange = this.props.onTextChange;
        if (onChange !== undefined && onChange !== null) {
            onChange( value );
        }
    },

    handleSearch: function (value) {
        this.setState({
            filterValue: value
        });
    },
    onSelect: function (value) {
        var grp = this.getProjGroup(value);
        if (grp === null) {
            return;
        }

        var onSelectGroup = this.props.onSelectGroup;
        if (onSelectGroup !== undefined && onSelectGroup !== null) {
            onSelectGroup(grp);
        }
    },
    render: function () {
        const {
            value,
            onSelectGroup,
            ...attributes,
        } = this.props;

        var dataSource = [];
        const data = this.state.projGroupSet.recordSet;
        var filterValue = this.state.filterValue;
        if (filterValue === null || filterValue === '' || filterValue === undefined) {
            data.map(d => dataSource.push(d.grpName));
        }
        else {
            data.map((node, i) => {
                if (node.grpName.indexOf(filterValue) >= 0) {
                    dataSource.push(node.grpName);
                }
            });
        }

        // console.log('dataSource', dataSource, filterValue, data)
        var box =
            <AutoComplete
                dataSource={dataSource}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                placeholder=""
                value={this.state.filterValue}
                onChange={this.handleOnChange}
                {...attributes}
            />;

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default ProjGroupSelect;
