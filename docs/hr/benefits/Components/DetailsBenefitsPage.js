'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Form, Button, Table, Icon,  Input, Pagination,Tabs} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var BenefitsActions = require('../action/BenefitsActions');
var EmpBenefitsStore = require('../data/EmpBenefitsStore');
import DetFromPage from './DetFromPage';
import CodeMap from '../../lib/CodeMap';

var DetailsBenefitsPage = React.createClass({
    getInitialState : function() {
        return {
             BenefitsSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },

            loading: false,
        }
    },
    mixins: [Reflux.listenTo(EmpBenefitsStore, "onServiceComplete"),CodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            BenefitsSet: data
        });
    },
  
    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var filter = {userUuid: this.props.userUuid};
         BenefitsActions.retrieveEmpBenefits(filter);
       
    },
 
    onClickDetails : function(benefits, event){
        if(benefits != null){
            this.refs.DetFromPage.initPage(benefits);
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

    render : function(corpUuid) {   
        var corpUuid = window.loginData.compUser.corpUuid;
        const columns = [
                    {
                        title: '基本工资',
                        dataIndex: 'salary',
                        key: 'salary',
                        width: 140,
                    },
                    {
                        title: '绩效工资',
                        dataIndex: 'salary2',
                        key: 'salary2',
                        width: 140,
                    },
                    {
                        title: '生效日期',
                        dataIndex: 'effectDate',
                        key: 'effectDate',
                        width: 140,
                    },
                    {
                        title: '社保基数',
                        dataIndex: 'insuBase',
                        key: 'insuBase',
                        width: 140,
                    },
                    {
                        title: '公积金基数',
                        dataIndex: 'cpfBase',
                        key: 'cpfBase',
                        width: 140,
                    },
                    {
                        title: '社保类型',
                        dataIndex: 'insuName',
                        key: 'insuName',
                        width: 140,
                        render: (text, record) => (this.getInsuName(corpUuid, record.insuName)),
                    },
                    {
                        title: '补贴类型',
                        dataIndex: 'allowName',
                        key: 'allowName',
                        width: 140,
                        render: (text, record) => (this.getAllowName(corpUuid, record.allowName)),
                    },
                    {
                        title: '更多操作',
                        key: 'action',
                        width: 140,
                        render: (text, record) => (
                            <span>
                                <a href="#" onClick={this.onClickDetails.bind(this, record)} title='查看'><Icon type='bars'/></a>
                            </span>
                        ),
                    }
                    ];
        var recordSet = this.state.BenefitsSet.recordSet;       
        return (
             <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="合同详情" key="2" style={{width: '100%', height: '100%'}}>
                        <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                            <div style={{padding: '12px',height: '100%',overflowY: 'auto'}}>
                                <ServiceMsg ref='mxgBox' svcList={['hr-benefits/retrieve']}/>
                            <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle"  bordered={Common.tableBorder}/>    
                            <div  style={{width:'100%',padding:'8px',}}>
                                <DetFromPage ref="DetFromPage" />
                            </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
            
        );
    }
});

module.exports = DetailsBenefitsPage;
