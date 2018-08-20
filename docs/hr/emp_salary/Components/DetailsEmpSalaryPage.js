'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin, Input, Pagination,Form, Tabs} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var PerSalaryStore = require('../data/PerSalaryStore');
var EmpSalaryActions = require('../action/EmpSalaryActions');
import DetailEmpSalary from './DetailEmpSalary';

var DetailsEmpSalaryPage = React.createClass({
    getInitialState : function() {
        return {
            empSalarySet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },

            loading: false,
        }
    },

    mixins: [Reflux.listenTo(PerSalaryStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            empSalarySet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var filter = {userUuid: this.props.userUuid}
        EmpSalaryActions.retrievePerSalary( filter );
    },
    onClickDetails : function(empSalary, event){
        if(empSalary != null){
            this.refs.DetailEmpSalary.initPage(empSalary);
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
        const columns = [
            {
                        title: '部门',
                        dataIndex: 'deptName',
                        key: 'deptName',
                        width: 140,
                    },
                   {
                        title: '调前薪水',
                        dataIndex: 'befSalary',
                        key: 'befSalary',
                        width: 140,
                    },
                   {
                        title: '调后薪水',
                        dataIndex: 'aftSalary',
                        key: 'aftSalary',
                        width: 140,
                    },
                   {
                        title: '申请日期',
                        dataIndex: 'applyDate',
                        key: 'applyDate',
                        width: 140,
                        render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                    },
                   {
                        title: '执行月份',
                        dataIndex: 'chgMonth',
                        key: 'chgMonth',
                        width: 140,
                        render: (text, record) => (Common.formatMonth(text, Common.monthFormat)),
                    },
                   {
                        title: '调整类型',
                        dataIndex: 'chgType',
                        key: 'chgType',
                        width: 140,
                        render: (text, record) => (Utils.getOptionName('HR系统', '薪资调整类型', record.chgType, false, this)),
                    },
            {
                title: '更多操作',
                key: 'action',
                width: 70,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='查看'><Icon type='bars'/></a>
                    </span>
                ),
            }
        ];

        var recordSet = this.state.empSalarySet.recordSet;
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="调薪记录详情" key="2" style={{width: '100%', height: '100%'}}>
                        <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                            <div style={{padding: '12px',height: '100%',overflowY: 'auto'}}>
                                <ServiceMsg ref='mxgBox' svcList={['hr-emp-salary/retrieve1']}/>
                               <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
                               <div  style={{width:'640px',padding:'20px 0 12px 0'}}>
                                   <DetailEmpSalary ref="DetailEmpSalary"/>
                               </div>
                           </div>
                       </div>
                   </TabPane>
               </Tabs>
           </div>
        );
    }
});

module.exports = DetailsEmpSalaryPage;
