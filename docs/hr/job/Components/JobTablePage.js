'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Input, Modal, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import XlsTempFile from '../../../lib/Components/XlsTempFile';

var JobStore = require('../data/JobStore.js');
var JobActions = require('../action/JobActions'); 
import CreateJobPage from './CreateJobPage';
import UpdateJobPage from './UpdateJobPage';
import BatchJobPage from './BatchJobPage';
import JobFactorPage from '../../job_factor/JobFactorPage';

var jobFields = [
    { id: 'A', name: 'workType', title: '工种' },
    { id: 'B', name: 'jobCode', title: '岗位编码' },
    { id: 'C', name: 'jobName', title: '岗位名称' },
    { id: 'D', name: 'unitTime', title: '结算单位', opts: '#HR系统.结算单位' },
    { id: 'E', name: 'unitPrice', title: '结算单价' },
    { id: 'F', name: 'unitCost', title: '平均成本' },
];

var JobTablePage = React.createClass({
	getInitialState : function() {
		return {
			jobSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
            selectedWork: {},
            workTypeMap: {},    // 工种，用于批量导入
		}
	},

    mixins: [Reflux.listenTo(JobStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            jobSet: data
        });
    },

	// 刷新
	handleQueryClick : function(event) {
		var work = this.state.selectedWork;
		this.setState({loading: true});
		this.state.jobSet.operation = '';
		JobActions.retrieveHrJob( work.corpUuid, work.uuid );
	},

	// 第一次加载
	componentDidMount : function(){
		var work = this.state.selectedWork;
		if(!work.corpUuid || !work.uuid){
			return;
		}
		this.setState({loading: true});
		JobActions.initHrJob( work.corpUuid, work.uuid );
	},

    loadJobInfor: function (work, workSet){
		this.state.jobSet.operation = '';
		this.setState({loading: true});
        this.state.selectedWork = work;

        // 岗位对照表
        this.state.workTypeMap = {};
        var len2 = workSet.length;
        for (var i = 0; i < len2; i++) {
            var w = workSet[i];
            this.state.workTypeMap[w.workName] = w.uuid;
        }

    	JobActions.initHrJob( work.corpUuid, work.uuid );
	},

	handleOpenCreateWindow : function(event) {
		var work = this.state.selectedWork;
		this.refs.createWindow.clear( work.corpUuid, work.uuid );
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(job, event)
	{
		if(job != null){
			this.refs.updateWindow.initPage(job);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(job, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的岗位 【'+job.jobName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, job)
		});
	},

	onClickDelete2 : function(job)
	{
		this.setState({loading: true});
		this.state.jobSet.operation = '';
		JobActions.deleteHrJob( job.uuid );
	},

	handleSelectClick : function(job, event)
	{
		this.refs.jobFactorPage.loadFactor( job.workUuid, job.uuid );
		this.refs.jobFactorPage.clear( job.corpUuid, job.workUuid, job.uuid );
		this.refs.jobFactorPage.toggle();
    },
    handleTempDown: function (e) {
        this.downXlsTempFile(jobFields);
    },
    beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, jobFields, file, this.uploadComplete);
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

                // 岗位编号
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    var job = list[i];
                    var workUuid = this.state.workTypeMap[job.workType];
                    if (!workUuid) {
                        alert('没有找到工种[' + job.workType + ']');
                        return;
                    }

                    job.workUuid = workUuid;
                }

                this.refs.batchWindow.clear(list);
                this.refs.batchWindow.toggle();
            }
        }
    },

	render : function() {
		var recordSet = this.state.jobSet.recordSet;
		var workUuid = this.state.selectedWork.uuid;
		var isSelected = (typeof workUuid !== 'undefined');
		const columns = [
			{
				title: '岗位编码',
				dataIndex: 'jobCode',
				key: 'jobCode',
				width: 120,
			},
			{
				title: '岗位名称',
				dataIndex: 'jobName',
				key: 'jobName',
				width: 120,
			},
			{
				title: '结算单位',
				dataIndex: 'unitTime',
				key: 'unitTime',
				width: 120,
				render: (text, record) => (Utils.getOptionName('HR系统', '结算单位', record.unitTime, true, this)),
			},
			{
				title: '结算单价',
				dataIndex: 'unitPrice',
				key: 'unitPrice',
				width: 120,
			},
			{
				title: '平均成本',
				dataIndex: 'unitCost',
				key: 'unitCost',
				width: 120,
			},
			{
				title: '',
				key: 'action',
				width: 140,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改岗位信息'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除岗位'><Icon type={Common.iconRemove}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.handleSelectClick.bind(this, record)} title='指标维护'><Icon type="setting"/></a>
					</span>
				),
			}
		];
		var cs = Common.getGridMargin(this, 0);
		return (
			<div className='grid-page' style={{padding: '58px 0 0 0'}}>
				<div style={{margin: '-58px 0 0 0'}}>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} disabled={!isSelected} type="primary" title="增加人员" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} disabled={!isSelected} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            <Button icon='download' disabled={!isSelected} title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" disabled={!isSelected} title='批量增加数据' />
                            </Upload>
						</div>							
					</div>
				</div>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-job/retrieve', 'hr-job/remove']}/>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateJobPage ref="createWindow"/>
				<UpdateJobPage ref="updateWindow"/>
                <JobFactorPage ref="jobFactorPage" />
                <BatchJobPage ref="batchWindow" />
			</div>
		);
	}
});

module.exports = JobTablePage;
