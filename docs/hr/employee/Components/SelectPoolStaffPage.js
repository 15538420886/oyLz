import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import ResTeamTree from '../../../proj/lib/Components/ResTeamTree';
var ResRoleStore = require('../../../proj/res/role/data/ResRoleStore2');
var ResRoleActions = require('../../../proj/res/role/action/ResRoleActions');

var SelectPoolStaffPage = React.createClass({
    getInitialState: function () {
        return {
            staffSet: {
                recordSet: [],
                errMsg: ''
            },

            loading: false,
            deptUuid: '',
            modal: false,
        }
    },

    mixins: [Reflux.listenTo(ResRoleStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            staffSet: data
        });

        if (data.errMsg) {
            Common.infoMsg(data.errMsg);
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },
    onSelectTeam: function (team) {
        // console.log('team', team)
        if (team) {
            this.setState({ deptUuid: team.uuid, loading: true });
            ResRoleActions.retrieveResTeamStaff(team.uuid);
        }
    },
    onSelectPool: function (pool) {
        // console.log('pool', pool)
        if (pool) {
            this.setState({ deptUuid: pool.uuid, loading: true });
            ResRoleActions.retrieveResPoolStaff(pool.uuid);
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
        var recordSet = this.state.staffSet.recordSet;
        const columns = [
            {
                title: '用户姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 90,
            },
            {
                title: '职位',
                dataIndex: 'roleName',
                key: 'roleName',
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
                        <ResTeamTree onSelect={this.onSelectTeam} onSelectPool={this.onSelectPool}/>
                    </div>

                    <div className='left-tree' style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} onRowClick={this.onRowClick} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                    </div>
                </div>
            </Modal >
        );
    }
});

export default SelectPoolStaffPage;

