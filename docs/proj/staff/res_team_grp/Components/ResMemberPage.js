'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Tabs} from 'antd';
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var ResMemberStore = require('./../data/ResMemberStore');
var ResMemberActions = require('./../action/ResMemberActions');

var ResMemberPage = React.createClass({
    getInitialState : function() {
        return {
            resMemberSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            resMemberSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件'
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.grpCode = this.props.resTeam.grpCode;
        filter.baseCity = this.props.resTeam.baseCity;
        ResMemberActions.retrieveResMember(filter);
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
        var recordSet = this.state.resMemberSet.recordSet ;
        const columns = [
            {
            	title: '员工编号',
            	dataIndex: 'staffCode',
            	key: 'staffCode',
            	width: 120,
            },
            {
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '电话',
            	dataIndex: 'phoneno',
            	key: 'phoneno',
            	width: 120,
            },
            {
            	title: '状态',
            	dataIndex: 'resStatus',
            	key: 'resStatus',
            	width: 120,
            },
            {
            	title: '项目名称',
            	dataIndex: 'resName',
            	key: 'resName',
            	width: 140,
            },
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' >
                <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="组员查询" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div>
                            <ServiceMsg ref='mxgBox' svcList={['res-member/retrieve']}/>
                        </div>
                        <div className='grid-body' style={{paddingTop:'12px'}}>
                            <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                        </div>
                     </TabPane>
                </Tabs>   
            </div>
        );
    }
});

module.exports = ResMemberPage;