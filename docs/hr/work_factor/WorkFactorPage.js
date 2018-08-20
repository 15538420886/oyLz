'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Input, Modal, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import XlsTempFile from '../../lib/Components/XlsTempFile';
var WorkFactorStore = require('./data/WorkFactorStore.js');
var WorkFactorActions = require('./action/WorkFactorActions');
import CreateWorkFactorPage from './Components/CreateWorkFactorPage';
import UpdateWorkFactorPage from './Components/UpdateWorkFactorPage';
import BatchWorkFactorPage from './Components/BatchWorkFactorPage';

var factorFields = [
    { id: 'A', name: 'kpiName', title: '指标名称' },
    { id: 'B', name: 'kpiWeight', title: '指标权重' },
    { id: 'C', name: 'kpiValues', title: '指标选值' },
    { id: 'D', name: 'kpiDesc', title: '指标说明' },
];

var filterValue = '';
var WorkFactorPage = React.createClass({
	getInitialState : function() {
		return {
			workFactorSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
			workUuid: '',
			corpUuid:window.loginData.compUser.corpUuid,
		}
	},

    mixins: [Reflux.listenTo(WorkFactorStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            workFactorSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.workFactorSet.operation = '';
		WorkFactorActions.retrieveHrWorkFactor(this.state.workUuid);		
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		this.state.workUuid = this.props.workhUuid;
		WorkFactorActions.initHrWorkFactor(this.props.workUuid);
	},

	//接受新的props
	componentWillReceiveProps:function(nextProps){
		if(nextProps.workUuid === this.state.workUuid){
			return;
		}
		this.state.workUuid = nextProps.workUuid;
		this.setState({loading: true});
		this.state.workFactorSet.operation = '';
		WorkFactorActions.retrieveHrWorkFactor(nextProps.workUuid);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear(this.state.corpUuid, this.state.workUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(workFactor, event)
	{
		if(workFactor != null){
			this.refs.updateWindow.initPage(workFactor);
			this.refs.updateWindow.toggle();
		}
    },
    handleTempDown: function (e) {
        this.downXlsTempFile(factorFields);
    },
    beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid, workUuid: this.props.workUuid };
        this.uploadXlsFile(url, data, factorFields, file, this.uploadComplete);
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
                this.refs.batchWindow.clear(list, this.props.workUuid);
                this.refs.batchWindow.toggle();
            }
        }
    },

	onClickDelete : function(workFactor, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的管理  【'+workFactor.kpiName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, workFactor)
		});
	},

	onClickDelete2 : function(workFactor)
	{
		this.setState({loading: true});
		this.state.workFactorSet.operation = '';
		WorkFactorActions.deleteHrWorkFactor( workFactor.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
		var recordSet = Common.filter(this.state.workFactorSet.recordSet, filterValue);

		const columns = [
			{
				title: '指标名称',
				dataIndex: 'kpiName',
				key: 'kpiName',
				width: 140,
			},
			{
				title: '指标权重',
				dataIndex: 'kpiWeight',
				key: 'kpiWeight',
				width: 140,
			},
			{
				title: '指标说明',
				dataIndex: 'kpiDesc',
				key: 'kpiDesc',
				width: 140,
			},
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='移除'><Icon type={Common.iconRemove}/></a>
				</span>
				),
			}
		];
		
		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-work-factor/retrieve', 'hr-work-factor/remove']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加资源" onClick={this.handleOpenCreateWindow} />
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='批量增加数据' />
                            </Upload>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}}  value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
				<CreateWorkFactorPage ref="createWindow"/>
                <UpdateWorkFactorPage ref="updateWindow" />
                <BatchWorkFactorPage ref="batchWindow" />
			</div>
		);
	}
});

module.exports = WorkFactorPage;
