﻿'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
import CodeMap from '../../../../hr/lib/CodeMap';
import { Form, Row, Col, Input, Icon ,Table } from 'antd';
const FormItem = Form.Item;

var EmpJobTable = React.createClass({
	getInitialState : function() {
		return {
			
		}
	},

	mixins: [CodeMap()],

	render : function(){
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
            }
		];

		var recordSet = this.props.ejList;
		return (
            <div style={{padding: '20px 30px 20px 30px'}}>
                <ServiceMsg ref='mxgBox' svcList={['hr_emp_job/retrieveDetail']}/>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={false} size="middle" bordered={Common.tableBorder}/>
            </div>
		);
	}
});

module.exports = EmpJobTable;
