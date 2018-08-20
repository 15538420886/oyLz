'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Input, Modal, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ServiceForm from '../../svc/Components/ServiceForm';
import InputFields from '../../svc/Components/InputFields';
import OutputFields from '../../svc/Components/OutputFields';
import PathContext from '../PathContext'
import InterfaceList from './InterfaceList';
var PageDesignStore = require('../../page/data/PageDesignStore');
var PageDesignActions = require('../../page/action/PageDesignActions');

var InterfacePage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            activeKey: '1',
            resUuid: '',
        }
    },

    mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (data.operation === 'updateFields' && this.state.loading) {
            this.setState({
                loading: false,
            });

            if (data.errMsg === '') {
                Common.succMsg('添加成功');
            }
            else {
                Common.warnMsg(data.errMsg);
            }
        }
    },

    componentDidMount: function () {
    },

    onSelectModule: function (data) {
        this.refs.serviceForm.loadData(data);
        this.setState({ resUuid: data.uuid });
    },

    onClickTab: function (key) {
        this.setState({ activeKey: key });
    },
    //增加到字段表
    onClickAddInput: function () {
        var selRows = [];
        selRows = this.refs.inputFieldsForm.getSelectedRows();
        if (selRows.length === 0) {
            Common.infoMsg('请选择至少一个字段')
            return;
        } else {
            this.addFields(selRows);
        }
    },

    onClickAddOutput: function () {
        var selRows = [];
        selRows = this.refs.outputFieldsForm.getSelectedRows();
        if (selRows.length === 0) {
            Common.infoMsg('请选择至少一个字段')
            return;
        } else {
            this.addFields( selRows );
        }
    },

    addFields: function (selRows) {
        var resNode = PathContext.pageRes;

        var fields = [];
        var fieldMap = {};
        var src = resNode.fields;
        if (src !== null && src !== undefined) {
            src.map((node, i) => {
                fieldMap[node.id] = node;
                fields.push(node);
            });
        }

        selRows.map((node, i) => {
            var id = node.fieldName;
            var field = fieldMap[id];
            if (field === null || field === undefined) {
                var field = {};
                fieldMap[id] = field;

                // 生成对象
                field.id = id;
                field.desc = node.fieldDesc;
                field.max = node.fieldLength;
                field.required = (node.notNull === 'true') ? '1' : '0';
                field.type = 'text';
                field.showCode = '0';
                fields.push(field);
            }
        });

        this.setState({ loading: true });
        PageDesignActions.updateFields(PathContext.selectedRes.resName, fields)
    },


    render: function () {
        var inputPage = null;
        var outputPage = null;
        if (this.state.activeKey === '2') {
            inputPage = (
                <div style={{ float: 'left', height: '100%', margin: '-28px 10px 20px 24px' }}>
                    <InputFields ref="inputFieldsForm" resUuid={this.state.resUuid} />
                </div>
            );
        }
        else if (this.state.activeKey === '3') {
            outputPage = (
                <div style={{ float: 'left', height: '100%', margin: '-28px 10px 20px 24px' }}>
                    <OutputFields ref="outputFieldsForm" resUuid={this.state.resUuid} />
                </div>
            );
        }

        var cs = Common.getGridMargin(this, 0);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['app-txn/retrieve']} />
                </div> 
                <div style={{ height: '100%'}}>
                    <InterfaceList ref='apiList' caption='请选择接口' width='220px' onSelectModule={this.onSelectModule} >
                        <ServiceMsg ref='mxgBox' svcList={['devService/retrieve']} />
                        <div style={{overflowY:'auto'}}>
                            <Tabs activeKey={this.state.activeKey} onChange={this.onClickTab} tabBarStyle={{ paddingLeft: '16px' }} style={{ width: '100%', height: '100%', padding: '10px 0 0' }}>
                                <TabPane tab="接口信息" key="1" style={{ width: '100%', height: '100%' }}>
                                    <div style={{ margin: '10px 10px 20px 24px',width:'560px' }}>
                                        <ServiceForm ref="serviceForm" />
                                    </div>
                                </TabPane>
                                <TabPane tab="输入参数" key="2" style={{ width: '100%', height: '100%' }}>
                                    <div style={{ position: 'relative', top: '0', left: '94px' }}>
                                        <Button key="add" type="primary" size="middle" onClick={this.onClickAddInput}>增加到字段表</Button>
                                    </div>
                                    {inputPage}
                                </TabPane>
                                <TabPane tab="输出参数" key="3" style={{ width: '100%', height: '100%' }}>
                                    <div style={{ position: 'relative', top: '0', left: '94px' }}>
                                        <Button key="add2" type="primary" size="middle" onClick={this.onClickAddOutput}>增加到字段表</Button>
                                    </div>
                                    {outputPage}
                                </TabPane>
                            </Tabs>
                        </div>
                        
                    </InterfaceList>
                </div>
            </div>
        );
    }
});

module.exports = InterfacePage;
