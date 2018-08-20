"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var LeftList = require('../../../lib/Components/LeftList');

var TableListPage = React.createClass({
    getInitialState: function () {
        return {
            recordSet: [],
            loading: false,
            selectedTable: null,
        }
    },
    refresh: function () {
        this.state.selectedTable = null;

        var app = window.devApp;
        var url = app.dbSchema;
        var pos = url.indexOf('}');
        if (pos > 0) {
            var host = url.substr(1, pos - 1);
            url = Utils[host] + 'scan/tables';

            var self = this;
            this.setState({ loading: true });
            Utils.doCreateService(url, {}).then(function (result) {
                var recordSet = [];
                self.setState({ loading: false });
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    var str = result.object;
                    var obj = eval('(' + str + ')');
                    
                    var newkey = Object.keys(obj).sort();
                    var newObj = {};
                    for (var i = 0; i < newkey.length; i++) {
                        newObj[newkey[i]] = obj[newkey[i]];
                    }
                    obj = newObj;
                    for (var name in obj) {
                        try {
                            var t = { name: name, table: obj[name] };
                            recordSet.push(t);
                        } catch (E) {
                        }
                    }

                  self.setState({ recordSet: recordSet})
                }
                else {
                    self.refs.mxgBox.showError("处理错误[" + result.errCode + "][" + result.errDesc + "]");
                }
            }, function (value) {
                self.setState({ loading: false });
                self.refs.mxgBox.showError("调用服务错误");
            });
        }
    },
    componentDidMount: function () {
        this.refresh();
    },
    handleTableClick: function (table) {
        if (table != null) {
            this.state.selectedTable = table;
            this.props.onSelectTable(table);
        }
        else {
            this.state.selectedTable = null;
        }
    },
    render: function () {
        const {
            onSelectTable,
            ...attributes,
        } = this.props;

        var recordSet = this.state.recordSet;
        return (
            <LeftList dataSource={recordSet} rowText='name' rowKey='name' onClick={this.handleTableClick} {...attributes} />
        );
    }
});

module.exports = TableListPage;
