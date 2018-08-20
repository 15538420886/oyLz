import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import DeptTree from '../../dept/Components/DeptTree';
var DeptStaffStore = require('../../dept_staff/data/DeptStaffStore');
var DeptStaffActions = require('../../dept_staff/action/DeptStaffActions');

var SelectDeptStaffPage = React.createClass({
    getInitialState: function () {
        return {
            deptStaffSet: {
                recordSet: [],
                errMsg: ''
            },

            loading: false,
            deptUuid: '',
            modal: false,
        }
    },

    mixins: [Reflux.listenTo(DeptStaffStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            deptStaffSet: data
        });

        if (data.errMsg) {
            Common.infoMsg(data.errMsg);
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },
    onSelectDept: function (dept) {
        if (dept) {
            this.setState({ deptUuid:dept.uuid, loading: true });
            DeptStaffActions.initHrDeptStaff(dept.uuid);
        }
    },
    onRowClick: function (record, index, event) {
        this.props.onSelectStaff(record);

        this.setState({
            modal: !this.state.modal
        });
    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },
    render: function () {
        var recordSet = this.state.deptStaffSet.recordSet;
        const columns = [
            {
                title: '用户姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 90,
            },
            {
                title: '职位',
                dataIndex: 'jobTitle',
                key: 'jobTitle',
                width: 120,
            },
            {
                title: '电子邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 170,
            }
        ];

        return (
            <Modal visible={this.state.modal} width='720px' title="选择部门管理员" maskClosable={false} onCancel={this.toggle} footer={null}>
                <div style={{ display: 'flex', height: '460px' }}>
                    <div className='left-tree' style={{ flex: '0 0 240px', width: '240px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#fcfcfc' }}>
                        <DeptTree onSelectDept={this.onSelectDept} />
                    </div>

                    <div className='left-tree' style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} onRowClick={this.onRowClick} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                    </div>
                </div>
            </Modal >
        );
    }
});

export default SelectDeptStaffPage;

