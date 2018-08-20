'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var BranchStaffStore = require('./data/BranchStaffStore.js');
var BranchStaffActions = require('./action/BranchStaffActions');
import CreateBranchStaffPage from './Components/CreateBranchStaffPage';
import UpdateBranchStaffPage from './Components/UpdateBranchStaffPage';

var filterValue = '';
var BranchStaffPage = React.createClass({
    getInitialState : function() {
        return {
            branchStaffSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading: false,
            branchUuid:'',
            corpUuid:window.loginData.compUser.corpUuid,
        }
    },

    mixins: [Reflux.listenTo(BranchStaffStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            branchStaffSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        this.state.branchStaffSet.operation = '';
        BranchStaffActions.retrieveHrBranchStaff(this.state.branchUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        this.state.branchUuid = this.props.branchUuid;
        BranchStaffActions.initHrBranchStaff(this.props.branchUuid);
    },

    //接受新的props
    componentWillReceiveProps:function(nextProps){
        if(nextProps.branchUuid === this.state.branchUuid){
            return;
        }
        this.state.branchUuid = nextProps.branchUuid;
        this.setState({loading: true});
        //this.state.staffSet.operation = '';
        BranchStaffActions.retrieveHrBranchStaff(nextProps.branchUuid);
    },

    handleOpenCreateWindow : function(event) {
        console.log('this.state', this.state);
        this.refs.createWindow.clear(this.state.corpUuid, this.state.branchUuid);
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(branchStaff, event)
    {
        if(branchStaff != null){
            this.refs.updateWindow.initPage(branchStaff);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(branchStaff, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的公司 【'+branchStaff.perName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, branchStaff)
        });
    },

    onClickDelete2 : function(branchStaff)
    {
        this.setState({loading: true});
        this.state.branchStaffSet.operation = '';
        BranchStaffActions.deleteHrBranchStaff( branchStaff.uuid );
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        //var recordSet = this.state.branchStaffSet.recordSet;
        var recordSet = Common.filter(this.state.branchStaffSet.recordSet, filterValue);

        const columns = [
            {
                        title: '用户姓名',
                        dataIndex: 'perName',
                        key: 'perName',
                        width: 140,
                    },
                   {
                        title: '职位',
                        dataIndex: 'jobTitle',
                        key: 'jobTitle',
                        width: 140,
                    },
                   {
                        title: '电话',
                        dataIndex: 'phoneno',
                        key: 'phoneno',
                        width: 140,
                    },
                   {
                        title: '电子邮箱',
                        dataIndex: 'email',
                        key: 'email',
                        width: 140,
                    },
                   {
                        title: '职务说明',
                        dataIndex: 'jobDesc',
                        key: 'jobDesc',
                        width: 140,
                    },
            {
                title: '',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员信息'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        return (
            <div className='grid-page' style={{padding: '58px 0 0 0'}}>
                <ServiceMsg ref='mxgBox' svcList={['hr-group-staff/retrieve', 'hr-group-staff/remove']}/>
                <div style={{margin: '-58px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加事业群" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
                <CreateBranchStaffPage ref="createWindow"/>
                <UpdateBranchStaffPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = BranchStaffPage;

