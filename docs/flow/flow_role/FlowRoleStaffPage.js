'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var FlowRoleStaffStore = require('./data/FlowRoleStaffStore.js');
var FlowRoleStaffActions = require('./action/FlowRoleStaffActions');
import CreateFlowRoleStaffPage from './Components/CreateFlowRoleStaffPage';

var filterValue = '';
var FlowRoleStaffPage = React.createClass({
    getInitialState : function() {
        return {
            FlowRoleStaffSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            FlowRoleStaff: {},
            addDisale:true,
            RefreshDisale:true,
        }
    },

    mixins: [Reflux.listenTo(FlowRoleStaffStore, "onServiceComplete"),],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            FlowRoleStaffSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 
        var corpUuid = window.loginData.compUser.corpUuid;
        FlowRoleStaffActions.retrieveFlowRoleStaff(corpUuid);
    },

    // 第一次加载
    componentDidMount : function(){
     //   this.setState({loading: true});
        // FIXME 查询条件
       // FlowRoleStaffActions.initFlowRoleStaff();
    },

    initPage:function(record){
        this.setState({FlowRoleStaff:record});
        if(record.roleLevel=='项目群'||record.roleLevel=='项目组'||record.roleLevel=='项目群组'){
             this.setState({addDisale: true,RefreshDisale:true});
        }else{
            this.setState({addDisale: false,RefreshDisale:false});
        }
        
    },

    handleOpenCreateWindow : function(event) { 
        this.setState({action: 'create', FlowRoleStaff:this.state.FlowRoleStaff });
    },

    onClickUpdate : function(FlowRoleStaff, event)
    {
        if(FlowRoleStaff != null){
            this.setState({FlowRoleStaff: FlowRoleStaff, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    onClickDelete : function(FlowRoleStaff, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的 【'+FlowRoleStaff.orgName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, FlowRoleStaff)
        });
    },
    onClickDelete2 : function(FlowRoleStaff)
    {
        this.setState({loading: true});
        var staff = this.state.FlowRoleStaff.staff;
        staff.splice(staff.indexOf(FlowRoleStaff),1);
        var staff = this.state.FlowRoleStaff.staff;
        FlowRoleStaffActions.updateFlowRole2(this.state.FlowRoleStaff);
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    render : function() {
        var recordSet = this.state.FlowRoleStaff.staff;
        const columns = [
            {
            	title: '机构',
            	dataIndex: 'orgName',
            	key: 'orgName',
            	width: 140,
            },
            {
            	title: '工号',
            	dataIndex: 'staffCode',
            	key: 'staffCode',
            	width: 140,
            },
            {
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '属地',
            	dataIndex: 'baseCity',
            	key: 'baseCity',
            	width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span style={{marginLeft:'5px'}}>         
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['flow_role/retrieve', 'flow_role/remove']}/>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button  icon={Common.iconAdd} disabled={this.state.addDisale} type="primary" title="增加流程角色" onClick={this.handleOpenCreateWindow} />
                            <Button icon={Common.iconRefresh}  disabled={this.state.RefreshDisale}title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

            </div>
        );
        
		var formPage = null;
		if(this.state.action === 'create'){
		    formPage = <CreateFlowRoleStaffPage onBack={this.onGoBack} flowRoleStaff={this.state.FlowRoleStaff}/>;
		}
		
		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = FlowRoleStaffPage;