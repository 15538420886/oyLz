﻿'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Row, Col, Input, Icon ,Table } from 'antd';
const FormItem = Form.Item;

var EmpSalaryTable = React.createClass({
	getInitialState : function() {
		return {
	
		}
	},
 
	render : function(){
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
        ];

		var recordSet = this.props.hesList;
		return (
            <div style={{padding: '20px 30px 20px 30px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={false} size="middle" bordered={Common.tableBorder}/>
            </div>
		);
	}
});

module.exports = EmpSalaryTable;
