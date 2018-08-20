'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var JobSalaryStore = require('../data/JobSalaryStore');
var JobSalaryActions = require('../action/JobSalaryActions');
import CreateJobSalaryPage from './CreateJobSalaryPage';
import UpdateJobSalaryPage from './UpdateJobSalaryPage';

var filterValue = '';
var JobSalaryPage = React.createClass({
    getInitialState : function() {
        return {
            jobSalarySet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            updateSalaryLocal:'',
            delSalaryLocal:'',
            filter:{},
        }
    },

    mixins: [Reflux.listenTo(JobSalaryStore, "onServiceComplete")],
    onServiceComplete: function(data) {
         this.setState({
            loading: false,
            jobSalarySet: data,
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        JobSalaryActions.retrieveStdJob(filter);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var stdJob = this.props.stdJob;
        var stdJobUuid= stdJob.uuid;
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        JobSalaryActions.retrieveStdJob(filter,stdJobUuid);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(jobSalary, event)
    {
        if(jobSalary != null){
            this.refs.updateWindow.initPage(jobSalary);
            this.state.updateSalaryLocal = jobSalary.jobLocal;
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(jobSalary, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的工资信息 【'+jobSalary.jobLocal+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, jobSalary)
        });
    },

    onClickDelete2 : function(jobSalary)
    {
        this.setState({loading: true});
        this.state.delSalaryLocal = jobSalary.jobLocal;
        var stdJob = this.props.stdJob;
        var stdJobUuid= stdJob.uuid;
        var filterObj = {};
        filterObj.filter = stdJobUuid;
        filterObj.object = jobSalary.jobLocal;
        JobSalaryActions.deleteStdJob(filterObj);
    },

    render : function() {
        var recordSet = this.state.jobSalarySet.recordSet;
        var stdJob = this.props.stdJob;
        var stdJobUuid= stdJob.uuid;
        if(this.state.jobSalarySet.object && this.state.jobSalarySet.operation=='update') {
            var jobLocal = this.state.updateSalaryLocal;
            var object = this.state.jobSalarySet.object;
            recordSet.map(function(item,index){
                if(item.jobLocal == jobLocal) {
                    recordSet.splice(index,1,object);
                }
            })
        }
        if(this.state.jobSalarySet.object && this.state.jobSalarySet.operation=='remove') {
            var jobLocal = this.state.delSalaryLocal;
            var object = this.state.jobSalarySet.object;
            recordSet.map(function(item,index){
                if(item.jobLocal == jobLocal) {
                    recordSet.splice(index,1);
                }
            })
        }

        const columns = [
            {
            	title: '地区',
            	dataIndex: 'jobLocal',
            	key: 'jobLocal',
            	width: 140,
            },
            {
            	title: '工作性质',
            	dataIndex: 'jobNature',
            	key: 'jobNature',
            	width: 140,
            	render: (text, record) => (Utils.getOptionName('招聘管理', '工作性质', text, false, this)),
            },
            {
            	title: '工资范围',
            	dataIndex: 'jobSalary',
            	key: 'jobSalary',
            	width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改工资范围'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除工资范围'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['stdJob/retrieve', 'stdJob/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加工资信息" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateJobSalaryPage ref="createWindow" stdJobUuid = {stdJobUuid}/>
                <UpdateJobSalaryPage ref="updateWindow" stdJobUuid = {stdJobUuid}/>
            </div>
        );
    }
});

module.exports = JobSalaryPage;