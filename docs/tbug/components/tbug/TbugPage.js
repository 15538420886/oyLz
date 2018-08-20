﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Input, Upload, Radio, message} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var TmBugStore = require('./data/TmBugStore.js');
var TmBugActions = require('./action/TmBugActions');
import CreateTmBugPage from './Components/CreateTmBugPage';
import ShowEnclosurePage from './Components/ShowEnclosurePage';
import ShowDetailPage from './Components/ShowDetailPage';
import UpdateTmBugPage from './Components/UpdateTmBugPage';
import RecruitFilter from './Components/RecruitFilter';
import XlsTempFile from '../../../lib/Components/XlsTempFile';	
import XlsDown from '../../../lib/Components/XlsDown';





var TBugPage = React.createClass({
	getInitialState : function() {
		return {
			tmBugSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			selectedRows:[],//多选，单选
			moreFilter: false,
			loading: false,
			filterValue :"",
			filter: {},
		}
	},

    mixins: [Reflux.listenTo(TmBugStore, "onServiceComplete"),XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            tmBugSet: data
		});
		this.state.moreFilter = 0;
		if(this.state.moreFilter){
			var mp = this.refs.RecruitFilter;
		}
    },
    
	// 刷新
	handleQueryClick : function(event) {
		var filter = this.state.filter;
		this.setState({loading: true});
		this.state.tmBugSet.operation = '';
		TmBugActions.retrieveTmBug(filter);
	},

	// 第一次加载
	componentDidMount : function(){
		var filter = this.state.filter;
		//更多
		filter.more = (this.state.moreFilter ? '1' : '0');
		this.setState({loading: true});
		filter.procStatus = 'all';
		TmBugActions.initTmBug(filter);
	},

	handleOpenCreateWindow : function(event) {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	},

	handleOpenEnclosureWindow :function(tmBug,event) {

		if(tmBug != null){
			this.refs.showEnclosure.initPage(tmBug);
			this.refs.showEnclosure.toggle();
		}
	},

	handleOpenDetailWindow: function (tmBug, event) {
		
		if (tmBug != null) {
			this.refs.showDetail.init(tmBug);
			this.refs.showDetail.toggle();
		}
	},

	onClickUpdate : function()
	{
		var tmBug = this.state.selectedRows;
		if(tmBug != null && tmBug.length == 1){
			this.refs.updateWindow.initPage(tmBug[0]);
			this.refs.updateWindow.toggle();
		} else if(tmBug.length >1){
			message.error('仅支持编辑单条删除');
		} else {
			message.error('请先选中要编辑的缺陷');
		}
	},

	onClickDelete : function()
	{
		var tmBug = this.state.selectedRows;
		if(tmBug != null && tmBug.length == 1){
			Modal.confirm({
				title: '删除确认',
				content: '是否删除选中的缺陷管理信息 【'+tmBug[0].uuid+'】',
				okText: '确定',
				cancelText: '取消',
				onOk: this.onClickDelete2.bind(this, tmBug[0])
			});
		} else if (tmBug.length > 1) {
			message.error('仅支持单条缺陷删除');
		} else {
			message.error('请先选中要删除的缺陷');
		}
	},
	xlsExport: function() {
		const tmBugTable = [
			{ id: 'A', name: 'bugCode', title: '缺陷编码' },
			{ id: 'B', name: 'bugName', title: '缺陷名称' },
			{ id: 'C', name: 'bugStat', title: '缺陷状态' },
			{ id: 'D', name: 'bugResponsible', title: '当前处理人' },
			{ id: 'E', name: 'deteUser', title: '发现人' },
			{ id: 'F', name: 'deteDate', title: '发现日期' },
			{ id: 'G', name: 'bugSeverity', title: '严重程度' },
			{ id: 'H', name: 'bugChance', title: '重现概率' },
			{ id: 'I', name: 'bugDesp', title: '缺陷描述' },
			{ id: 'J', name: 'updateDate', title: '更新时间' },
		];
		var data = [];
        var recordSet = this.state.tmBugSet.recordSet;
		recordSet.map((recordSet, i) => {
			var r = {};
			r.bugCode = recordSet.bugCode;
			r.bugName = recordSet.bugName;
			r.bugStat = recordSet.bugStat;
			r.bugResponsible = recordSet.bugResponsible;
			r.deteUser = recordSet.deteUser;
			r.deteDate = recordSet.deteDate;
			r.bugSeverity = recordSet.bugSeverity;
			r.bugChance = recordSet.bugChance;
			r.bugDesp = recordSet.bugDesp;
			r.updateDate = recordSet.updateDate;
			data.push(r);
		});
		this.downXlsTempFile2(tmBugTable, data, this.refs.xls);
	},
	retweet:function() {
		message.warning("功能尚未开放");
	},
	rollback:function(){
		message.warning("功能尚未开放");
	},
	save:function() {
		message.warning("功能尚未开放");
	},
	onClickDelete2 : function(tmBug)
	{
		this.setState({loading: true});
		this.state.tmBugSet.operation = '';
		TmBugActions.deleteTmBug( tmBug.uuid );
	},
	onSearch:function(e) {
		var val = e;
		if (val == undefined || val == null || val == ''){
			this.setState({ loading: this.state.loading});
		}else{
			console.log(val,this.state.filterValue);
			this.setState({ loading: this.state.loading, filterValue: val });
		}
		
	},
	onFilterRecord: function(e){
		this.setState({loading: this.state.loading,filterValue:e.target.value});
	},
	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
	},
	onChangeView:function(e) {
		var View = e.target.value;
		var filter = {};
		switch (View) {
			case "1":
				filter.procStatus = "undo";
				this.state.filter.procStatus = "undo";
				TmBugActions.initTmBug(filter);
				break;
			case "2":
				filter.procStatus = "self";
				this.state.filter.procStatus = "self";
				TmBugActions.initTmBug(filter);
				break;
			default:
				filter.procStatus = "all";
				this.state.filter.procStatus = "all";
				TmBugActions.initTmBug(filter);
				break;
		}
	},
	//更多条件查询
	onSearch3:function(){
		this.setState({loading: true});
		//类型
		var procStatus = this.state.filter.procStatus;
		TmBugActions.moreTmBug(this.refs.RecruitFilter.state.recruit,procStatus);
	},
	//清空
	onClear:function(){
		var recruit = {};
		recruit.procStatus = this.state.filter.procStatus;
		this.refs.RecruitFilter.setState({
			recruit:recruit
		});
	},
	render : function() {
		var recordSet = Common.filter(this.state.tmBugSet.recordSet, this.state.filterValue);
		var corpUuid = window.loginData.compUser.corpUuid;
		
		var fileOp = [];
		var radioGroup = [];
		radioGroup.push(
			<RadioGroup style={{marginLeft: '16px',display:"inline-block"}} onChange={this.onChangeView}>
					<RadioButton value="1">待处理</RadioButton>
					<RadioButton value="2">我的全部</RadioButton>
					<RadioButton value="3">所有缺陷</RadioButton>
			</RadioGroup>
		)
		
		var moreFilter = this.state.moreFilter;
		var columns = [
				{
					title: '附件',
					key: 'Enclosure',
					width: 100,
					render:(text, record)=> (
						<img style={{ width: "30px" }} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" onClick={this.handleOpenEnclosureWindow.bind(this, record)}/>
					)
				  },
				  {
					title: '缺陷编码',
					dataIndex: 'bugCode',
					key: 'bugCode',
					width: 140,
				  },
				 {
					title: '缺陷名称',
					dataIndex: 'bugName',
					key: 'bugName',
					width: 300,
					 render: (text, record) => (
						 <a onClick={this.handleOpenDetailWindow.bind(this, record)}>{text}-点击查看详情</a>
					 )
				  },
				 {
					title: '缺陷描述',
					dataIndex: 'bugDesp',
					key: 'bugDesp',
					width: 300,
				  },
				 {
					title: '缺陷状态',
					dataIndex: 'bugStat',
					key: 'bugStat',
					width: 140,
				  },
				 {
					title: '严重程度',
					dataIndex: 'bugSeverity',
					key: 'bugSeverity',
					width: 140,
				  },
				 {
					title: '重现概率',
					dataIndex: 'bugChance',
					key: 'bugChance',
					width: 140,
				  },
				 {
					title: '所属系统',
					dataIndex: 'sysId',
					key: 'sysId',
					width: 140,
				  },
				 {
					title: '模块名称',
					dataIndex: 'mdlId',
					key: 'mdlId',
					width: 200,
				  },
				 {
					title: '发现人',
					dataIndex: 'deteUser',
					key: 'deteUser',
					width: 100,
				  },
				 {
					title: '发现日期',
					dataIndex: 'deteDate',
					key: 'deteDate',
					width: 200,
				  },
				 {
					title: '当前处理人',
					dataIndex: 'bugResponsible',
					key: 'bugResponsible',
					width: 160,
				  },
				 {
					title: '更新时间',
					dataIndex: 'updateDate',
					key: 'updateDate',
					width: 200,
				  },
			];

		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.state.selectedRows = selectedRows;
			}
		};

		function onShowSizeChange(current, pageSize) {
			console.log(current + "" + pageSize);
		};
		var Pagination = {
			showSizeChanger:true,
			onShowSizeChange:onShowSizeChange,
			showQuickJumper:true

		}
		var cs = Common.getGridMargin(this);
		return (
			<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['tm-bug/retrieve', 'tm-bug/remove']}/>
					<RecruitFilter  ref="RecruitFilter" moreFilter={moreFilter} />
					<div className='toolbar-table' style={{display:"flex",justifyContent:"space-between"}}>
						<div>
							<Button icon={Common.iconAdd} type="primary" title="增加缺陷管理信息" onClick={this.handleOpenCreateWindow}/>
							<Button icon={Common.iconUpdate}  title="修改缺陷管理信息" onClick={this.onClickUpdate} style={{marginLeft: '4px'}}/>
							<Button icon={Common.iconRemove}  title="删除缺陷管理信息" onClick={this.onClickDelete} style={{marginLeft: '4px'}}/>
							<Button icon="retweet"  title="扭转缺陷管理信息" onClick={this.retweet} style={{marginLeft: '4px'}}/>
							<Button icon="rollback"  title="撤回缺陷管理信息" onClick={this.rollback} style={{marginLeft: '4px'}}/>
							<Button icon={Common.iconRefresh}  title="刷新缺陷管理信息" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							<Button icon="save"  title="记录缺陷管理信息"  onClick={this.save} style={{marginLeft: '4px'}}/>
							<Button icon='download' title="导出缺陷管理信息" onClick={this.xlsExport} style={{ marginLeft: '4px' }} />
						</div>
						<div>
							{radioGroup}
						</div>
						<div>
							{
								moreFilter ?
									<div style={{textAlign:'right', width:'100%'}}>
										<Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{marginRight:'4px'}}>查询</Button>
										<Button title="清空" onClick={this.onClear} style={{ marginRight: '4px' }}>清空</Button>
										<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
									</div>
									:
									<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search placeholder="查询" placeholder="查询(编号/名称)" style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} onSearch={this.onSearch}  />
										<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
									</div>
							}
						</div>
					</div>
				</div>
				<div className='grid-body'>
					<Table  rowSelection={rowSelection} columns={columns}  dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  bordered={Common.tableBorder} pagination={Pagination}/>
				</div>

				<CreateTmBugPage ref="createWindow"/>
				<ShowEnclosurePage ref="showEnclosure"/>
				<ShowDetailPage ref="showDetail"/>
				<UpdateTmBugPage ref="updateWindow"/>
				<XlsDown ref='xls' />
			</div>
		);
	}
});

module.exports = TBugPage;

