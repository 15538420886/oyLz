'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import XlsTempFile from '../../../lib/Components/XlsTempFile';

import DictSelect from '../../../lib/Components/DictSelect';
var StdJobStore = require('./data/StdJobStore');
var StdJobActions = require('./action/StdJobActions');
import CreateStdJobPage from './Components/CreateStdJobPage';
import UpdateStdJobPage from './Components/UpdateStdJobPage';
import BatchStdJobPage from './Components/BatchStdJobPage';

var stdJobFields = [
    { id: 'A', name: 'jobCode', title: '岗位代码' },
    { id: 'B', name: 'category', title: '岗位类别', opts: '#招聘管理.岗位类别' },
    { id: 'C', name: 'jobLevel', title: '岗位级别', opts: '#招聘管理.岗位级别' },
    { id: 'D', name: 'eduDegree', title: '最低学历', opts: '#简历系统.教育背景' },
    { id: 'E', name: 'induYears', title: '工作经验' },
    { id: 'F', name: 'jobDesc', title: '岗位说明' },
    { id: 'G', name: 'jobRequire', title: '岗位要求' },
];

var filterValue = '';
var StdJobPage = React.createClass({
    getInitialState : function() {
        return {
            stdJobSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            stdJob: null,
            filter: {},
        }
    },

    mixins: [Reflux.listenTo(StdJobStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            stdJobSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        StdJobActions.retrieveStdJob(filter);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        StdJobActions.retrieveStdJob(filter);
    },

    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },
    onClickUpdate : function(stdJob, event)
    {
        if(stdJob != null){
            this.setState({stdJob: stdJob, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
        var filter = this.state.filter;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        StdJobActions.retrieveStdJob(filter);
    },

    onClickDelete : function(stdJob, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的岗位信息 【'+stdJob.jobCode+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, stdJob)
        });
    },
    onClickDelete2 : function(stdJob)
    {
        this.setState({loading: true});
        StdJobActions.deleteStdJob( stdJob.uuid );
    },

    onFilterRecord: function(value){
        filterValue = value;
        this.setState({loading: this.state.loading});
    },

    onSearch:function(objList, filterValue){
		if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
				return objList;
		}
		var rs=[];
		objList.map(function(node) {
			if(node.category.indexOf(filterValue)>=0){
					rs.push( node );
			}
		});
		return rs;
    },
    handleTempDown: function (e) {
        this.downXlsTempFile(stdJobFields);
    },
    beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, stdJobFields, file, this.uploadComplete);
        return false;
    },

    uploadComplete: function (errMsg, result) {
        this.setState({ loading: false });
        if (errMsg !== '') {
            Common.errMsg(errMsg);
        }
        else {
            result = result.replace(/}{/g, '},{');
            var list = eval('(' + result + ')');
            if (list) {
                this.refs.batchWindow.clear(list);
                this.refs.batchWindow.toggle();
            }
        }
    },

    expandedRowRender:function(record,index) {
        const columns = [
            { title: '地区', dataIndex: 'jobLocal', key: 'jobLocal', width:140},
            { title: '工作性质', dataIndex: 'jobNature',key: 'jobNature', width:140},
            { title: '工资范围', dataIndex: 'jobSalary', key: 'jobSalary', width:140},
          ];
          const data = this.state.stdJobSet.recordSet[index].other;
          return (
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          );
    },

    getWorkYear: function(value) {
		if(value === undefined || value === null || value === ''){
			return '';
		}
		return value+'年';
	},

    render : function() {
        var recordSet = this.onSearch(this.state.stdJobSet.recordSet, filterValue);
        const columns = [
            {
            	title: '岗位类别',
            	dataIndex: 'category',
            	key: 'category',
            	width: 120,
            },
            {
            	title: '岗位代码',
            	dataIndex: 'jobCode',
            	key: 'jobCode',
            	width: 140,
            },
            {
            	title: '岗位说明',
            	dataIndex: 'jobDesc',
            	key: 'jobDesc',
            	width: 340,
            },
            {
            	title: '岗位级别',
            	dataIndex: 'jobLevel',
            	key: 'jobLevel',
            	width: 100,
            },
            {
            	title: '最低学历',
            	dataIndex: 'eduDegree',
            	key: 'eduDegree',
            	width: 90,
            },
            {
            	title: '工作经验',
            	dataIndex: 'induYears',
            	key: 'induYears',
            	width: 90,
				render: (text, record) => (this.getWorkYear(text)),
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改岗位信息'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除岗位信息'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['stdJob/retrieve', 'stdJob/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加岗位信息" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='批量增加数据' />
                            </Upload>
                        </div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <DictSelect style={{ width:'180px'}} name='category' id='category' appName='招聘管理' optName='岗位类别' value={filterValue} onSelect={this.onFilterRecord} />
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                     <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}  expandedRowRender={this.expandedRowRender}/>
                </div>
            </div>
        );
        
		var formPage = null;
		if(this.state.action === 'create'){
		    formPage = <CreateStdJobPage onBack={this.onGoBack}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateStdJobPage onBack={this.onGoBack} stdJob={this.state.stdJob}/>
		}
		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
                <BatchStdJobPage ref="batchWindow" />
			</div>
		);
    }
});

module.exports = StdJobPage;