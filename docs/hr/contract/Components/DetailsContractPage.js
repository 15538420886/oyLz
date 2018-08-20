'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Form, Button, Table, Icon, Modal, Spin, Input, Pagination,Tabs} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var EmpContactStore = require('../data/EmpContactStore');
var ContractActions = require('../action/ContractActions');
import DetailsFromPage from './DetailsFromPage';


var DetailsContractPage = React.createClass({
    getInitialState : function() {
        return {
            contractSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },

            loading: false,
        }
    },

    mixins: [Reflux.listenTo(EmpContactStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            contractSet: data
        });
    },
    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var filter = {userUuid: this.props.userUuid}
        ContractActions.retrieveEmpContract( filter );
    },
    onClickDetails : function(contract, event){
        if(contract != null){
            this.refs.DetailsFromPage.initPage(contract);
        }
    },
    goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

    render : function() {
        const columns = [
            {
                title: '合同编号',
                dataIndex: 'contCode',
                key: 'contCode',
                width: 140,
            },
            {
                title: '签订日期',
                dataIndex: 'signDate',
                key: 'signDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '失效日期',
                dataIndex: 'expiryDate',
                key: 'expiryDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: 'HR人员',
                dataIndex: 'hrName',
                key: 'hrName',
                width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 80,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='查看'><Icon type='bars'/></a>
                    </span>
                ),
            }
        ];

        var recordSet = this.state.contractSet.recordSet;
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="合同详情" key="2" style={{width: '100%', height: '100%'}}>
                        <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                            <div style={{padding: '12px',height: '100%',overflowY: 'auto'}}>
                                <ServiceMsg ref='mxgBox' svcList={['emp_contract/retrieve']}/>
                                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle"  bordered={Common.tableBorder}/>
                                <div  style={{width:'100%',padding:'20px 0 0 8px',}}>
                                    <DetailsFromPage ref="DetailsFromPage" />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = DetailsContractPage;
