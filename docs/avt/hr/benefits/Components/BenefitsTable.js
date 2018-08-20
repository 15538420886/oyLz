﻿'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
import CodeMap from '../../../../hr/lib/CodeMap';
import { Form, Row, Col, Input, Icon ,Table } from 'antd';
const FormItem = Form.Item;

var BenefitsTable = React.createClass({
	getInitialState : function() {
		return {
			
		}
	},
	mixins: [CodeMap()],
	
	render : function(){
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
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
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
        ];

		var recordSet = this.props.hbList;
		return (
            <div style={{padding: '10px 30px 30px 30px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={false} size="middle" bordered={Common.tableBorder}/>
            </div>
		);
	}
});

module.exports = BenefitsTable;
