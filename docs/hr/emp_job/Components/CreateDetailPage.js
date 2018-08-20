﻿'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import { Form, Row, Col, Input, Icon ,Table, Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var EmpJobStore = require('../data/EmpJobStore');
var EmpJobActions = require('../action/EmpJobActions');
import DetailsFromPage from './DetailsFromPage';
import CodeMap from '../../lib/CodeMap';


var CreateDetailPage = React.createClass({
	getInitialState : function() {
		return {
			empJobSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(EmpJobStore, "onServiceComplete"), CodeMap()],
	onServiceComplete: function(data) {
		this.setState({
			loading: false,
			empJobSet: data
		});
	},
	// 第一次加载
   componentDidMount : function(){
        this.setState({loading: true});
        var filter = {userUuid: this.props.userUuid}
        EmpJobActions.retrievePersonEmpJob( filter );
	},
    onClickDetails : function(empJob, event){
        if(empJob != null){
            this.refs.DetailsFromPage.initPage(empJob);
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

	render : function(){
		var corpUuid = window.loginData.compUser.corpUuid;
		const columns = [
			{
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
            },
			{
                title: '员工类型',
                dataIndex: 'empType',
                key: 'empType',
                width: 140,
            },
            {
                title: '员工级别',
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
				width: 140,
				render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='查看'><Icon type="eye-o"/></a>
					</span>
				),
			}
		];

		var recordSet = this.state.empJobSet.recordSet;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="岗位调整详情" key="2" style={{width: '100%', height: '100%'}}>
						<div className='grid-page' style={{padding: '8px 0 0 0'}}>
							<div style={{padding: '12px',height: '100%',overflowY: 'auto'}}>
								<ServiceMsg ref='mxgBox' svcList={['p_emp_job/retrieve']}/>
								<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={false} size="middle" bordered={Common.tableBorder}/>
								<div  style={{width:'100%', maxWidth:'600px',padding:'30px 0 0 8px',}}>
									<DetailsFromPage ref="DetailsFromPage"/>
								</div>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
});

module.exports = CreateDetailPage;
