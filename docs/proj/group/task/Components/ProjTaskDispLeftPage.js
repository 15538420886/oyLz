"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import {  Spin } from 'antd';
var Reflux = require('reflux');
var Utils = require('../../../../public/script/utils');
var Common = require('../../../../public/script/common');
var LeftList = require('../../../../lib/Components/LeftList');
var ProjStore = require('../../../group/proj/data/ProjStore');
var ProjActions = require('../../../group/proj/action/ProjActions');
var ProjContext = require('../../../ProjContext');

var ProjTaskDispLeftPage = React.createClass({
    getInitialState: function () {
        return {
            ProjGrpSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            loading: false,
            selectedTable: null,
        }
    },
   mixins: [Reflux.listenTo(ProjStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            ProjGrpSet: data
        });
      },

    componentDidMount : function(){
       this.state.ProjGrpSet.operation = '';
        this.setState({loading: true});
        var filter={};

        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.parentUuid = ProjContext.selectedGroup.uuid;
        ProjActions.retrieveProjInfoPage( filter );
    },
    //点击行发生的事件
    onRowClick: function(record, index){
        this.props.onSelectProjGrp(record);
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

        var recordSet = this.state.ProjGrpSet.recordSet;

        const {
            ...attributes,
        } = this.props;

        recordSet.map((user, i) => {
            user.listText = user.projCode+'('+user.projName+')';
        });
        return (
             <div  style={{paddingTop: '10px'}}>
                    {
                        this.state.loading
                            ? <Spin  tip="正在努力加载数据...">
                                <LeftList dataSource={recordSet} style={{width: '192px'}} rowText='listText' activeNode ={this.state.selectedRowUuid} onClick={this.onRowClick}  {...attributes} />
                            </Spin>
                            : <LeftList dataSource={recordSet} style={{width: '192px'}} rowText='listText' activeNode ={this.state.selectedRowUuid} onClick={this.onRowClick}  {...attributes} />
                    }
            </div>
           
        );
    }
});

module.exports = ProjTaskDispLeftPage;