import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import { Form, Modal, Button, Table } from 'antd';

var FntSvcStore = require('../data/FntSvcStore');
var FntSvcActions = require('../action/FntSvcActions');

var SelectAppPage = React.createClass({
    getInitialState: function () {
        return {
            fntSvcSet: {
                errMsg: ''
            },
            loading: false,
            modal: false,
            selectedRows: [],
            selectedRowKeys: [],

            appUuid: '',
            svcList: [],
        }
    },

    mixins: [Reflux.listenTo(FntSvcStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    fntSvcSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
    },

    clear: function (appUuid, fntSvcList, allAppList) {
        var fntSvcMap = {};
        fntSvcList.map((fntSvc, i) => {
            fntSvcMap[fntSvc.svcUuid] = fntSvc;
        });
		
        var svcList = [];
        allAppList.map((app, i) => {
            var fntSvc = fntSvcMap[app.uuid];
            if (fntSvc === null || typeof (fntSvc) === 'undefined') {
                svcList.push(app);
            }
        });

        this.setState({
            appUuid: appUuid,
            svcList: svcList,
            selectedRows: [],
            selectedRowKeys: [],
        });
    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },

    //选项变化
    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },

    onClickSave: function () {
        var batchList = [];
        this.state.selectedRows.map((svc, i) => {
            var fntSvc = {};
            fntSvc.svcUuid = svc.uuid;
            fntSvc.appUuid = this.state.appUuid;
            batchList.push(fntSvc);
        });

        if (batchList.length === 0) {
            this.setState({
                modal: false
            });
        }

        this.setState({ loading: true });
        FntSvcActions.createFntAppSvc(batchList);
    },

    render: function () {
        var recordSet = this.state.svcList;

        const columns = [
            {
                title: '应用名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 140,
            },
            {
                title: '应用编号',
                dataIndex: 'appCode',
                key: 'appCode',
                width: 240,
            }];

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.selectedRows = selectedRows;
            },
            onSelect: (record, selected, selectedRows) => {
                this.state.selectedRows = selectedRows;
            },
        };

        return (
            <Modal visible={this.state.modal} width='760px' title="关联服务" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['fnt_app_svc/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Table style={{ marginBottom: '10px' }} rowSelection={rowSelection} columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} scroll={{ y: 320 }} size="middle" pagination={false} bordered={Common.tableBorder} />
            </Modal>
        );
    }
});

export default SelectAppPage;

