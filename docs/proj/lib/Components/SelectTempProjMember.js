import React from 'react';
var Reflux = require('reflux');
import { Modal, Button, Table, Icon } from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

var SearchTempProjMemberStore = require('../data/SearchTempProjMemberStore');
var SearchTempProjMemberActions = require('../action/SearchTempProjMemberActions');

var SelectTempProjMember = React.createClass({
    getInitialState: function () {
        return {
            projMemberSet: {
                filter: {},
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            loading: false,
            selectIndex: -1,
            selectProjMember: {},
            modal: false,
            queryType: '',
        }
    },
    mixins: [Reflux.listenTo(SearchTempProjMemberStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            projMemberSet: data,
            selectIndex: -1,
            selectProjMember: {},
        });
    },

    // 第一次加载
    componentDidMount: function () {
    },
    clear: function (projMemberSet, queryType) {
        this.state.queryType = queryType;
        this.state.projMemberSet = projMemberSet;
        this.state.selectIndex = -1;
        this.state.selectProjMember = {};
    },
    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },
    onSelect: function (record, index) {
        this.props.onSelectMember(record);
        this.toggle();
    },
    onChangePage: function (pageNumber) {
        this.setState({ loading: true });
        this.state.projMemberSet.startPage = pageNumber;
        var filter = this.state.projMemberSet.filter;

        if (this.state.queryType === 'group') {
            SearchTempProjMemberActions.retrieveTempGroupMemberPage(filter, pageNumber, this.state.projMemberSet.pageRow);
        }
        else {
            SearchTempProjMemberActions.retrieveTempProjMemberPage(filter, pageNumber, this.state.projMemberSet.pageRow);
        }
    },

    render: function () {
        const columns = [
            {
                title: '员工编号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 140,
            },
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 100,
            },
            {
                title: '入组日期',
                dataIndex: 'beginDate',
                key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
            },
            {
                title: '承担角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140,
            },
        ];

        var projMemberList = this.state.projMemberSet.recordSet;
        var pag = { showQuickJumper: true, total: this.state.projMemberSet.totalRow, pageSize: this.state.projMemberSet.pageRow, current: this.state.projMemberSet.startPage, size: 'large', onChange: this.onChangePage };
        return (
            <Modal visible={this.state.modal} width='760px' title="选择项目组人员" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
                footer={null}
            >
                <div style={{ padding: '0 8px 0 8px' }}>
                    <ServiceMsg ref='mxgBox' svcList={['hr-projMember/retrieve']} />
                    <Table columns={columns} onRowClick={this.onSelect} dataSource={projMemberList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                </div>
            </Modal>
        );
    }
});

export default SelectTempProjMember;
