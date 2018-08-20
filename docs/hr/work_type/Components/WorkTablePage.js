'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal ,Input, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import XlsTempFile from '../../../lib/Components/XlsTempFile';

var WorkTypeStore = require('../data/WorkTypeStore.js');
var WorkTypeActions = require('../action/WorkTypeActions');
import CreateWorkTypePage from './CreateWorkTypePage';
import UpdateWorkTypePage from './UpdateWorkTypePage';
import BatchWorkTypePage from './BatchWorkTypePage';

var workTypeFields = [
    { id: 'A', name: 'workType', title: '职业类型', opts: '#HR系统.职业类型' },
    { id: 'B', name: 'workDomain', title: '条线名称', opts: '#HR系统.条线名称' },
    { id: 'C', name: 'workName', title: '工种名称' },
    { id: 'D', name: 'workDesc', title: '工种说明' },
];

var filterValue = '';
var WorkTablePage = React.createClass({
	getInitialState : function() {
		return {
			workTypeSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(WorkTypeStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            workTypeSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function() {
		var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		this.state.workTypeSet.operation = '';
		WorkTypeActions.retrieveHrWorkType(corpUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.setState({loading: true});
		WorkTypeActions.initHrWorkType(corpUuid);
	},

	handleOpenCreateWindow : function() {
		var corp = window.loginData.compUser;
        var corpUuid=(corp === null) ? '' : corp.corpUuid;
		this.refs.createWindow.clear(corpUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(workType , event)
	{
		if(workType != null){
			this.refs.updateWindow.initPage(workType);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(workType, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的管理 【'+workType.workType+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, workType)
		});
	},

	onClickDelete2 : function(workType)
	{
		this.setState({loading: true});
		this.state.workTypeSet.operation = '';
		WorkTypeActions.deleteHrWorkType( workType.uuid );
	},	
	
    //选择功能
    handleSelectClick: function(workType){
        this.props.selectsRole(workType);
    },

	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

    handleTempDown: function (e) {
        this.downXlsTempFile(workTypeFields);
    },
    beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, workTypeFields, file, this.uploadComplete);
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
	render : function() {
		var recordSet = Common.filter(this.state.workTypeSet.recordSet, filterValue);
		const columns = [
		{
				title: '职业类型',
				dataIndex: 'workType',
				key: 'workType',
				width: 140,
			},
			{
				title: '条线名称',
				dataIndex: 'workDomain',
				key: 'workDomain',
				width: 140,
			},
			{
				title: '工种名称',
				dataIndex: 'workName',
				key: 'workName',
				width: 140,
			},
			{
				title: '工种说明',
				dataIndex: 'workDesc',
				key: 'workDesc',
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
					<span className="ant-divider" />
					<a href="#" onClick={this.handleSelectClick.bind(this, record)} title='指标维护'><Icon type="setting"/></a>
                </span>
              ),
            }
		];
		
		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-work-type/retrieve', 'hr-work-type/remove']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加管理" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                                <Button icon="upload" title='批量增加数据' />
                            </Upload>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
							<Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord} />
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading }  pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
				
				<CreateWorkTypePage ref="createWindow"/>
                <UpdateWorkTypePage ref="updateWindow" />
                <BatchWorkTypePage ref="batchWindow" />
			</div>
		);
	}
});

module.exports = WorkTablePage;

