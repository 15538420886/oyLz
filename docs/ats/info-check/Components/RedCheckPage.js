'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Spin, Tabs } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var InfoCheckLeftStore = require('./../data/InfoCheckLeftStore');
var InfoCheckLeftActions = require('./../action/InfoCheckLeftActions');

var FilessStore = require('./../data/FilessStore');
var FilessActions = require('./../action/FilessActions');

var LeftList = require('../../../lib/Components/LeftList');
import DataPage from './DataPage';

var img = '';
var rightList = [];
var RedCheckPage = React.createClass({
    getInitialState: function () {
        return {
            InfoCheckLeftSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: false,
            disabled: false,
            infoCheck: null,
            record: [],
            click:false
        }
    },

    mixins: [Reflux.listenTo(InfoCheckLeftStore, "onServiceComplete"),
    Reflux.listenTo(FilessStore, "onServiceComplete1")],

    onServiceComplete: function (data) {
        if(data.operation == 'retrieve'){
            this.setState({
                loading: false,
                InfoCheckLeftSet: data,
                click:false
            });
            this.state.selectedRowUuid = data.recordSet[0].uuid;
            this.onRowClick(data.recordSet[0]);
        }    
    },

    onServiceComplete1: function (data) {
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.InfoCheckLeftSet.operation = '';
        this.setState({ loading: true });
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = this.props.infoCheck.staffCode;
        InfoCheckLeftActions.retrieveInfoCheck1(filter);
    },

    //点击行发生的事件
    onRowClick: function (record, index) {
        //图片  
        var uuid = record.uuid;
        img = Utils.hrUrl + 'hr-file/map-down?uuid=' + uuid;
        //数据区
        this.setState({
            infoCheck: record.title,
            record: record,
            click : true
        });
        if (this.refs.dataPage) {
            this.refs.dataPage.initPage(record);
        }
    },

    onClickOk: function () {
        if (this.state.infoCheck == '汇总') {
            var filter = this.props.infoCheck;
            filter.infoStatus = '通过';
            InfoCheckLeftActions.updateHrAttach(filter);
            this.goBack();

        } else {
            var object = {};
            object.filter = window.loginData.compUser.corpUuid;
            object.filter2 = this.props.infoCheck.staffCode;
            object.object = this.state.record;
            object.object.fileStatus = '通过';
            this.state.record.fileStatus = '通过';
            this.setState({
                loading:false
            });
            this.state.selectedRowUuid = this.state.record.uuid;
            this.onRowClick(this.state.record);
            FilessActions.updateFiless(object);

        }
    },

    onClickNo: function () {
        if (this.state.infoCheck == '汇总') {
            var filter = this.props.infoCheck;
            filter.infoStatus = '未通过';
            InfoCheckLeftActions.updateHrAttach(filter);
            this.goBack();
        } else {
            var object = {};
            object.filter = window.loginData.compUser.corpUuid;
            object.filter2 = this.props.infoCheck.staffCode;
            object.object = this.state.record;
            object.object.fileStatus = '未通过';
            this.state.record.fileStatus = '未通过';
            this.setState({
                loading:false
            });
            this.state.selectedRowUuid = this.state.record.uuid;
            this.onRowClick(this.state.record);
            FilessActions.updateFiless(object);
        }

    },

    goBack: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.goBack();
        }
    },

    render: function () {
        var cs = Common.getGridMargin(this, 0);
        var recordSet = this.state.InfoCheckLeftSet.recordSet;
        var arr = ['一寸照','证件-正面','证件-反面','毕业证','学位证','职业证书','语言证书','户口本','工资卡','离职证明','设备信息','汇总'];

        var dataArr = [];
            arr.map((i,a)=>{
                recordSet.map((record,num)=>{
                    if( (record.title).indexOf(i) > -1){ 
                        dataArr.push(record);         
                    }
                })
            })

        if(dataArr.length == 0){
            this.state.loading = false ;
        }

        Utils.copyValue(dataArr, rightList);
        rightList.pop();

        const {
            ...attributes,
        } = this.props;

        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                width: 40,
            },
            {
                title: '状态',
                dataIndex: 'fileStatus',
                key: 'fileStatus',
                width: 40,
            },
        ]

        recordSet.map((info, i) => {
            info.listText = info.title;
        });

        return (
            <div className='grid-page' style={{ padding: '10px' }} >
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="资料检查" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{
                                height: '100%', float: 'left', width: '200px', borderRight: "1px solid #e2e2e2", marginTop: '10px', overflowY: 'auto', overflowX: 'hidden',
                                paddingBottom: '10px'
                            }}>
                                {
                                    this.state.loading 
                                        ? <Spin tip="正在努力加载数据..."> 
                                                <LeftList dataSource={dataArr} style={{ width: '192px' }} rowText='listText' activeNode={this.state.selectedRowUuid} onClick={this.onRowClick}  {...attributes} />             
                                            </Spin>
                                        :  <div>
                                            {
                                                dataArr.length == 0 
                                                ? <div>暂无数据</div>
                                                : <LeftList dataSource={dataArr} style={{ width: '192px' }} rowText='listText' activeNode={this.state.selectedRowUuid} onClick={this.onRowClick}  {...attributes} />
                                            }
                                          </div>  
                                }
                                
                            </div>
                            
                            {   this.state.click
                                ? <div style={{ float: 'right', width: '100%', overflowY: 'auto' }}>
                                        <div style={{ width: '700px', margin: '0 auto' }}>
                                            {
                                                this.state.infoCheck == '汇总' || this.state.infoCheck == '设备信息'
                                                    ? ''
                                                    : <div style={{ width: '100%', textAlign: 'center' }}>
                                                        <img src={img} style={{ width: '700px', height: '400px', margin: '24px 0 0 0' }}></img>
                                                        <p style={{ fontSize: '14px', paddingTop: '15px' }}>当前状态： {this.state.record.fileStatus}</p>
                                                    </div>

                                            }

                                            <div style={{ width: '100%' }}>
                                                {
                                                    this.state.infoCheck == '汇总'
                                                        ? <div className='grid-page' style={{ padding: '20px 0 0 0', width: '700px', margin: '0 auto' }}>
                                                            <Table columns={columns} dataSource={rightList} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered />
                                                        </div>
                                                        : <DataPage ref="dataPage" record={this.state.record} />
                                                }

                                            </div>
                                            <div style={{ float: 'right', paddingTop: '30px' }}>
                                                <Button type="primary" onClick={this.onClickOk}>通过</Button>
                                                <Button type="danger" ghost style={{ marginLeft: '4px' }} onClick={this.onClickNo}>退回</Button>
                                            </div>
                                        </div>
                                    </div>
                                :''   
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = RedCheckPage;
