'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';
import { Form, Row, Col, Input, Icon ,Table } from 'antd';
const FormItem = Form.Item;


var ContactTablePage = React.createClass({
	getInitialState : function() {
		return {

		}
	},

	render : function(){
		
		const columns = [
            {
                title: '合同编号',
                dataIndex: 'contCode',
                key: 'contCode',
                width: 140,
            },
			{
                title: '岗位',
                dataIndex: 'jobName',
                key: 'jobName',
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
                title: '失效日期',
                dataIndex: 'expiryDate',
                key: 'expiryDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '签订日期',
                dataIndex: 'signDate',
                key: 'signDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
        ];

		var recordSet = this.props.hcList;
		return (
            <div style={{padding: '20px 32px 20px 28px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.props.loading} pagination={false}  size="middle"  bordered={Common.tableBorder}/>
            </div>
		);
	}
});

module.exports = ContactTablePage;
