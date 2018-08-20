'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Upload} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var StatMachineStore = require('./data/StatMachineStore.js');
var StatMachineActions = require('./action/StatMachineActions');
import CreateStatMachinePage from './Components/CreateStatMachinePage';
import UpdateStatMachinePage from './Components/UpdateStatMachinePage';
import XlsTempFile from '../../../lib/Components/XlsTempFile';	
import XlsDown from '../../../lib/Components/XlsDown';


var filterValue = '';

const statMachineTable = [
	{ id: 'A', name: 'statmCode', title: '状态机编码'},
	{ id: 'B', name: 'statmName', title: '状态机名称'},
	{ id: 'C', name: 'statmDesp', title: '状态机描述'},
	{ id: 'D', name: 'objType', title: '对象类型'},
	{ id: 'E', name: 'activeStat', title: '状态'},
	{ id: 'F', name: 'showVer', title: '版本号'},
	{ id: 'G', name: 'updateDate', title: '更新时间'},
	{ id: 'H', name: 'updateUser', title: '更新人'},
];

var StatMachinePage = React.createClass({
	getInitialState : function() {
		return {
			statMachineSet: {
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

    mixins: [Reflux.listenTo(StatMachineStore, "onServiceComplete"),XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            statMachineSet: data
		});
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		this.state.statMachineSet.operation = '';
		StatMachineActions.retrieveStatMachine();
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		StatMachineActions.retrieveStatMachine();
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(statMachine, event)
	{
		if(statMachine != null){
			this.refs.updateWindow.initPage(statMachine);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(statMachine, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的状态机管理 【'+statMachine.uuid+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, statMachine)
		});
	},

	onClickDelete2 : function(statMachine)
	{
		this.setState({loading: true});
		this.state.statMachineSet.operation = '';
		StatMachineActions.deleteStatMachine( statMachine.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},
	handleSelectClick: function (Tstate) {
		this.props.selectsRole(Tstate);
	},

	xlsExport: function() {
		var data = [];
        var recordSet = this.state.statMachineSet.recordSet;
		// recordSet.map((recordSet, i) => {
		// 	var r = {};
		// 	r.statmCode = recordSet.statmCode;
		// 	r.statmName = recordSet.statmName;
		// 	r.statmDesp = recordSet.statmDesp;
		// 	r.objType = recordSet.objType;
		// 	r.activeStat = recordSet.activeStat;
		// 	r.showVer = recordSet.showVer;
		// 	r.updateDate = recordSet.updateDate;
		// 	r.updateUser = recordSet.updateUser;
		// 	data.push(r);
		// });
		this.downXlsTempFile2(statMachineTable, data, this.refs.xls);
	},
	uploadComplete: function(errMsg){
		this.setState({loading: false});
		if(errMsg !== ''){
			Common.infoMsg(errMsg);
		}
		Common.infoMsg("upload successful");
		StatMachineActions.retrieveStatMachine();
	},
	beforeUpload: function(file) {
		var logininfo = window.loginData;
		if(logininfo.userId === ''){
			MsgActions.showError("请登录");
			return false;
		}
		this.setState({loading: true});
		var url = Utils.tbugUrl+'/stat-machine/upload-xls';
        var data = { corpUuid: logininfo.compUser.corpUuid, deptUuid: logininfo.compUser.deptUuid};
		this.uploadXlsFile(url, data, statMachineTable, file, this.uploadComplete);
		return false;
    },
	render : function() {
		var recordSet = Common.filter(this.state.statMachineSet.recordSet, filterValue);
		var corpUuid = window.loginData.compUser.corpUuid;

		var fileOp = [];
			fileOp.push(<Button  type="primary" icon='download' title="导出模板" onClick={this.xlsExport} style={{marginLeft: '4px'}}/>);
			fileOp.push(
				<Upload name='file' action='/posts/'   style={{marginLeft: '4px'}} beforeUpload={this.beforeUpload}>
					<Button  type="primary" icon="upload"/>
				</Upload>);
		
		var opCol = {
			title: '操作',
			key: 'action',
			width: 90,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改状态机管理'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除状态机管理'><Icon type={Common.iconRemove}/></a>
                    <span className="ant-divider" />
					<a href="#" onClick={this.handleSelectClick.bind(this, record)} title='状态维护'><Icon type={Common.iconUser} /></a>
				</span>
			),
		}; 
        const columns = [
            {
                    title: '状态机编码',
                    dataIndex: 'statmCode',
                    key: 'statmCode',
                    width: 140,
                  },
                 {
                    title: '状态机名称',
                    dataIndex: 'statmName',
                    key: 'statmName',
                    width: 140,
                  },
                 {
                    title: '状态机描述',
                    dataIndex: 'statmDesp',
                    key: 'statmDesp',
                    width: 140,
                  },
                 {
                    title: '对象类型',
                    dataIndex: 'objType',
                    key: 'objType',
                    width: 140,
                  },
                 {
                    title: '状态',
                    dataIndex: 'activeStat',
                    key: 'activeStat',
                    width: 140,
                  },
                 {
                    title: '版本号',
                    dataIndex: 'showVer',
                    key: 'showVer',
                    width: 140,
                  },
                 {
                    title: '更新时间',
                    dataIndex: 'updateDate',
                    key: 'updateDate',
                    width: 140,
                  },
                 {
                    title: '更新人',
                    dataIndex: 'updateUser',
                    key: 'updateUser',
                    width: 140,
                  },
                  opCol
        ]

		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['stat-machine/retrieve', 'stat-machine/remove']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加状态机管理" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconRefresh}  type="primary" title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							{fileOp}
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} bordered={Common.tableBorder}/>
				</div>

				<CreateStatMachinePage ref="createWindow"/>
				<UpdateStatMachinePage ref="updateWindow"/>
				<XlsDown ref='xls' />
			</div>
		);
	}
});

module.exports = StatMachinePage;

