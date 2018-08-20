import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var EntryLocActions = require('../../param/entry_loc/action/EntryLocActions')
var EntryLocStore= require('../../param/entry_loc/data/EntryLocStore');

var EntryLocSelect = React.createClass({
    getInitialState : function() {
        return {
            entryLocSet : {
                recordSet: [],
                errMsg:'',
                operation:''
            },
            loading: false
        }
    },

    mixins: [Reflux.listenTo(EntryLocStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.operation === 'retrieve'){
            this.state.entryLocSet = data;
            this.setState({loading: false});
        }
    },
    getEntryLocNode: function(value){
        if(typeof(value) === 'undefined'){
            value = this.props.value;
        }

        if(value === null || value === '' || typeof(value) === 'undefined'){
            return {};
        }

        var nodes = this.state.entryLocSet.recordSet;
        var len = nodes.length;
        for(var i=0; i<len; i++){
            if(nodes[i].uuid === value){
                return nodes[i];
            }
        }

        return {};
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.corpLocSet = {
            recordSet: [],
            errMsg:'',
            operation:''
        };

        this.setState({loading: true});
        var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
        var filter = {};
        filter.corpUuid = corpUuid;
        EntryLocActions.retrieveEntryLoc(filter);

    },
    render: function () {
        const {
            required,
            ...attributes,
        } = this.props;

        var recordSet = this.state.entryLocSet.recordSet;

        var box;
        if (required) {
            box = <Select {...this.props}>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.locName}</Option>
                    })
                }
            </Select>
        }
        else {
            box = <Select {...this.props}>
                <Option value=''>--</Option>
                {
                    recordSet.map((lvl, i) => {
                        return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.locName}</Option>
                    })
                }
            </Select>
        }

        return this.state.loading ? <Spin>{box}</Spin> : box;
    }
});

export default EntryLocSelect;
