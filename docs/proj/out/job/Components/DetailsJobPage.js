'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Form, Button, Table, Icon, Modal, Spin, Input, Pagination,Tabs,DatePicker} from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var OutJobStore = require('../data/OutJobStore');
var JobActions = require('../action/JobActions');
import DetailsFromPage from './DetailsFromPage';
import ModalForm from '../../../../lib/Components/ModalForm';
import CodeMap from '../../../../hr/lib/CodeMap';

var DetailsJobPage = React.createClass({
    getInitialState : function() {
        return {
            jobSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },

            loading: false,
        }
    },

    mixins: [Reflux.listenTo(OutJobStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            jobSet: data
        });
    },
    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var filter = {userUuid: this.props.userUuid}
        JobActions.retrieveOutJobDetail( filter );
    },
    onClickDetails : function(job, event){
        if(job != null){
            this.refs.DetailsFromPage.initPage(job);
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
     var corpUuid = window.loginData.compUser.corpUuid;
     const columns = [
      {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
          },
       {
                title: '结算单价',
                dataIndex: 'userCost',
                key: 'userCost',
                width: 140,
            },
        {
                title: '级别',
                dataIndex: 'empLevel',
                key: 'empLevel',
                width: 140,
                render: (text, record) => (this.getLevelName(corpUuid, record.empLevel)),
            },
        {
                title: '技术级别',
                dataIndex: 'techLevel',
                key: 'techLevel',
                width: 140,
            },
        {
                title: '管理级别',
                dataIndex: 'manLevel',
                key: 'manLevel',
                width: 140,
            },
        {
                title: '技术岗位',
                dataIndex: 'techName',
                key: 'techUuid',
                width: 140,
            },
        {
                title: '管理岗位',
                dataIndex: 'manName',
                key: 'manUuid',
                width: 140,
            },     		        
            {
                title: '更多操作',
                key: 'action',
                width: 80,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='查看'><Icon type='eye-o'/></a>
                    </span>
                ),
            }
        ];

        var recordSet = this.state.jobSet.recordSet;
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="岗位调整信息" key="2" style={{width: '100%', height: '100%'}}>
                        <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                            <div style={{padding: '12px',height: '100%',overflowY: 'auto'}}>
                                <ServiceMsg ref='mxgBox' svcList={['out-job/retrieve-records']}/>
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

module.exports = DetailsJobPage;
