'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Checkbox, Row, Col, Spin } from 'antd';


var Common = require('../../../public/script/common');
var ChkProjFlowStore = require('../data/ChkProjFlowStore');
var ChkProjFlowStateStore = require('../data/ChkProjFlowStateStore');
var ChkProjActions = require('../action/ChkProjActions');

var ChkProjFlow = React.createClass({
    getInitialState: function () {
        return {
            chkProjFlowSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            flowListSet: {
            },
            retrieveLoading: false,
            saveLoading: false,
            oldFlowListState: false,
            initState: true,
        }
    },
    mixins: [Reflux.listenTo(ChkProjFlowStore, "onServiceComplete1"),
    Reflux.listenTo(ChkProjFlowStateStore, "onServiceComplete2")],
    onServiceComplete1: function (data) {

        this.setState({
            retrieveLoading: false,
            chkProjFlowSet: data
        });
    },
    //判断当前项目组历史记录是否存在值
    onServiceComplete2: function (data) {
        // console.log(data);
        if (data.object) {
            this.state.oldFlowListState = true;
        } else {
            this.state.oldFlowListState = false;
        };
        if (data.operation === 'create' || data.operation === 'update') {
            this.setState({
                saveLoading: false,
                retrieveLoading: false,
                flowListSet: data,
                initState: false,
            });
        }
        if (data.operation === 'find') {
            this.setState({
                retrieveLoading: false,
                flowListSet: data,
                initState: false,
            });
        }

    },

    // 第一次加载
    componentDidMount: function () {
        this.setState({ retrieveLoading: true });
        var corp = window.loginData.compUser;
        var corpUuid = (corp === null) ? '' : corp.corpUuid;
        ChkProjActions.retrieveChkProjFlow(corpUuid);
    },
    //checkbox变化
    onChange: function (e) {
        this.state.flowListSet.object.flowList = e.toString();
        this.setState({
            retrieveLoading: this.state.retrieveLoading,
        });
    },
    //根据历史记录判断是创建还是更新
    onClickSave: function () {
        var createData = {};
        var proj = this.props.chkProjObject;
        createData.corpUuid = proj.corpUuid;
        createData.projUuid = createData.uuid = proj.uuid;
        createData.flowList = this.state.flowListSet.object.flowList;
        createData.projCode = proj.projCode;
        createData.pmName = proj.pmName;
        if (this.props.chkProjObject.parentUuid) {
            createData.grpCode = proj.grpCode;
            createData.grpName = proj.grpName;

            if (this.state.oldFlowListState) {
                ChkProjActions.updateChkProjFlowState(this.state.flowListSet.object);
            }
            else {
                ChkProjActions.createChkProjFlowState(createData);
            }
        }
        else {
            createData.projCode = proj.projCode;
            createData.projName = proj.projName;

            if (this.state.oldFlowListState) {
                ChkProjActions.updateChkProjGrp(this.state.flowListSet.object);
            }
            else {
                ChkProjActions.createChkProjGrp(createData);
            }
        }

        this.setState({
            saveLoading: true,
            retrieveLoading: true,
        });

    },
    onGetProjByUuid: function (uuid) {
        this.setState({
            retrieveLoading: true
        })
        ChkProjActions.getProjByUuid(uuid);
    },
    onRetrieveChkProjFlowState: function (uuid) {
        this.setState({
            retrieveLoading: true
        })
        ChkProjActions.retrieveChkProjFlowState(uuid);
    },


    render: function () {
        const options = this.state.chkProjFlowSet.recordSet ? this.state.chkProjFlowSet.recordSet : [];
        var defaultCheckedList = [];
        //定义初始选中项
        if (this.state.flowListSet.object) {
            if (this.state.flowListSet.object.flowList.match(/,/g)) {
                defaultCheckedList = this.state.flowListSet.object.flowList.split(',');
            } else {
                if (this.state.flowListSet.object.flowList !== "") {
                    defaultCheckedList.push(this.state.flowListSet.object.flowList);
                }
            }
        } else {
            this.state.flowListSet.object = {};
            this.state.flowListSet.object.flowList = '';
        }
        var loading = this.state.retrieveLoading;
        const checkbox = options.map((data, i) => {
            return <div >
                <Checkbox style={{ 'lineHeight': '30px', marginLeft: '10px' }} value={data.uuid} >
                    {data.flowName}
                </Checkbox>
            </div>
        });
        const obj = <div>
            <div style={{ border: '1px solid #e2e2e2', minHeight: '300px' }}>
                <Checkbox.Group onChange={this.onChange} value={defaultCheckedList} disabled={this.state.initState}>
                    {checkbox}
                </Checkbox.Group>
            </div>
        </div>
            ;
        return (
            <div>
                <div style={{padding: '0 0 10px 0'}}>可审批流程：</div>
             {loading ? <Spin>{obj}</Spin> : obj}
                <div style={{ display: 'block', textAlign: 'right', margin: '14px 0 0 0' }}>
                    <Button key="btnOk" type="primary" size="large" onClick={this.onClickSave} loading={this.state.saveLoading}
                        disabled={this.state.initState || (!this.state.flowListSet.object.flowList && !this.state.oldFlowListState)}>
                        保存
              </Button>
                </div>
            </div>

        );
    }

});

module.exports = ChkProjFlow;
