'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ModalForm from '../../../../lib/Components/ModalForm';
import { Form, Row, Col, Input, Icon ,Table } from 'antd';
const FormItem = Form.Item;

var WorkTablePage = React.createClass({
	getInitialState : function() {
		return {
			
		}
	},

	render : function(){
		 const columns = [
            {
                title: '变更类型',
                dataIndex: 'chgType',
                key: 'chgType',
                width: 140,
                render: (text, record) => (Utils.getOptionName('HR系统', '薪资调整类型', record.chgType, true, this)),
            },
           {
                title: '调前说明',
                dataIndex: 'befMemo',
                key: 'befMemo',
                width: 140,
            },
           {
                title: '调后说明',
                dataIndex: 'aftMemo',
                key: 'aftMemo',
                width: 140,
            },
           {
                title: '生效日期',
                dataIndex: 'effectDate',
                key: 'effectDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
        ];

		var recordSet = this.props.hwlList;
		return (
            <div style={{padding: '20px 30px 20px 30px'}}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle"  bordered={Common.tableBorder}/>
            </div>
		);
	}
});

module.exports = WorkTablePage;
