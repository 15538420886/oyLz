import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../public/script/utils');
var UiParamStore = require('../../../docs/param/ui-param/data/UiParamStore');
var UiParamActions = require('../../../docs/param/ui-param/action/UiParamActions');

import {AutoComplete, Spin} from 'antd';

var AutoInput = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            paramList: [],
        }
    },
    mixins: [Reflux.listenTo(UiParamStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.state.paramList = [];
        if (data.errMsg === '') {
            var list = data.recordSet
            var paramName = this.props.paramName;
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
    componentDidMount : function(){
		 this.setState({loading: true});
        // FIXME 查询条件
		var corpUuid = window.loginData.compUser.corpUuid;
        UiParamActions.retrieveUiParam(corpUuid);
	},
   
    render: function () {
        const {
            paramName,
            ...attributes,
        } = this.props;

        return (
            <AutoComplete dataSource={this.state.paramList} filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1} {...attributes}/>
        );
    }
});

export default AutoInput;
