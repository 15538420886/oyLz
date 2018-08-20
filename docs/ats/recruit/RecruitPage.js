'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input,Radio} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var RecruitStore = require('./data/RecruitStore');
var RecruitActions = require('./action/RecruitActions');
import CreateRecruitPage from './Components/CreateRecruitPage';
import UpdateRecruitPage from './Components/UpdateRecruitPage';
import RecruitFilter from './Components/RecruitFilter';
import AtsCodeMap from '../lib/AtsCodeMap';

var RecruitPage = React.createClass({
    getInitialState : function() {
        return {
            recruitSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
			viewType: '1',
            action: 'query',
            recruit: null,

			moreFilter: false,
			filterValue: '',
			filter: {},
        }
    },

    mixins: [Reflux.listenTo(RecruitStore, "onServiceComplete"),AtsCodeMap()],
    onServiceComplete: function(data) {
    	console.log(data)
		if(data.operation === 'cache'){
            var ff = data.filter.jobCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.jobCode;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.RecruitFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.filter = data.filter;
                }
            }
        }
        this.setState({
            loading: false,
            recruitSet: data
        });
    },

	// 第一次加载
	componentDidMount : function(){
		 this.setState({loading: true});
        // FIXME 查询条件
		var filter = this.state.filter;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
        RecruitActions.retrieveRecruit(filter);
	},

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
		var filter = this.state.filter;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
        RecruitActions.retrieveRecruit(filter);
    },

	handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },

	onChangeView: function(e) {
		this.setState({viewType: e.target.value});
	},

    onClickUpdate : function(recruit, event)
    {
        if(recruit != null){
            this.setState({recruit: recruit, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

    onClickDelete : function(recruit, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的招聘需求 【'+recruit.jobName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, recruit)
        });
    },

    onClickDelete2 : function(recruit)
    {
        this.setState({loading: true});
        RecruitActions.deleteRecruit( recruit.uuid );
    },

    onFilterRecord: function(e){
        this.setState( {filterValue: e.target.value} );
    },

	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

	onSearch:function(objList, filterValue){
		if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
				return objList;
		}
		var rs=[];
		objList.map(function(node) {
			if(node.jobName.indexOf(filterValue)>=0){
				rs.push( node );
			}
		});
		return rs;
	},

	onSearch3:function(){
		var filter = this.refs.RecruitFilter.state.recruit;
		if(filter.applyMouth !== null && filter.applyMouth !== ''){
        	filter.applyDate1 = filter.applyMonth + '01';
        	filter.applyDate2 = filter.applyMonth + '31';
        } else {
            filter.applyDate1 = '';
            filter.applyDate2 = '';
        }
       
        this.state.filter = filter;
        this.handleQueryClick();
        
    },

	onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },

	expandedRowRender:function(record,index) {
        const columns = [
            { title: '日期', dataIndex: 'logDate', key: 'logDate', width:140, render: (text, record) => (Common.formatDate(text, Common.dateFormat))},
            { title: '渠道', dataIndex: 'channel', key: 'channel', width:140},
            { title: '简历数量', dataIndex: 'resumeCount',key: 'resumeCount', width:140},
			{ title: '面试数量', dataIndex: 'interCount', key: 'interCount', width:140},
            { title: '录用人数', dataIndex: 'recruCount',key: 'recruCount', width:140},
          ];
          const data = this.state.recruitSet.recordSet[index].perFormLog;
          return (
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          );
    },

    render : function() {
		var recordSet = this.onSearch(this.state.recruitSet.recordSet, this.state.filterValue);
		var moreFilter = this.state.moreFilter;
		var corpUuid = window.loginData.compUser.corpUuid;

		var opCol = {
			title: '操作',
			key: 'action',
			width: 90,
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
				</span>
			),
		};
		var columns = [];
		if(this.state.viewType === '1'){
			columns = [
				{
					title: '岗位名称',
					dataIndex: 'jobName',
					key: 'jobName',
					width: 140,
				},
				{
					title: '城市',
					dataIndex: 'jobCity',
					key: 'jobCity',
					width: 100,
				},
				{
					title: '标准代码',
					dataIndex: 'jobCode',
					key: 'jobCode',
					width: 220,
                    render: (text, record) => (record.category+'>'+record.jobLevel),  // this.getJobCodeName(corpUuid, record.jobCode)
				},
				{
					title: '人数',
					dataIndex: 'applyCount',
					key: 'applyCount',
					width: 100,
				},
				{
					title: '部门',
					dataIndex: 'applyDept',
					key: 'applyDept',
					width: 140,
				},
				{
					title: '招聘原因',
					dataIndex: 'reasons',
					key: 'reasons',
					width: 140,
				},
				{
					title: '申请日期',
					dataIndex: 'applyDate',
					key: 'applyDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '到岗时间',
					dataIndex: 'deadDate',
					key: 'deadDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '优先级',
					dataIndex: 'priority',
					key: 'priority',
					width: 140,
				},
				opCol
			]
		}
		else if(this.state.viewType === '2'){
       	 	columns = [
				{
					title: '岗位名称',
					dataIndex: 'jobName',
					key: 'jobName',
					width: 140,
				},
				{
					title: '工作城市',
					dataIndex: 'jobCity',
					key: 'jobCity',
					width: 140,
				},
				{
					title: '最低学历',
					dataIndex: 'eduDegree',
					key: 'eduDegree',
					width: 140,
                },
                {
                    title: '工作经验',
                    dataIndex: 'induYears',
                    key: 'induYears',
                    width: 140,
                },
				{
					title: '出差要求',
					dataIndex: 'outJob',
					key: 'outJob',
					width: 140,
				},
				{
					title: '薪资范围',
					dataIndex: 'jobSalary',
					key: 'jobSalary',
					width: 140,
				},
				{
					title: '人员类型',
					dataIndex: 'personType',
					key: 'personType',
					width: 140,
				},
				{
					title: '行业类型',
					dataIndex: 'induType',
					key: 'induType',
					width: 140,
				},
				{
					title: '工作性质',
					dataIndex: 'jobNature',
					key: 'jobNature',
					width: 140,
				},
				opCol
			];
		}
		else if(this.state.viewType === '3'){
			columns = [
				{
					title: '岗位名称',
					dataIndex: 'jobName',
					key: 'jobName',
					width: 140,
				},
				{
					title: '申请单编号',
					dataIndex: 'applyCode',
					key: 'applyCode',
					width: 140,
				},
				{
					title: '需求提出人',
					dataIndex: 'applyName',
					key: 'applyName',
					width: 140,
				},
				{
					title: '面试官',
					dataIndex: 'interviewer',
					key: 'interviewer',
					width: 140,
				},
				{
					title: '人力专员',
					dataIndex: 'hrPerson',
					key: 'hrPerson',
					width: 140,
					render: (text, record) => (this.getHrPersonName(corpUuid, record.hrPerson)),
				},
				{
					title: '投放渠道',
					dataIndex: 'delivChannel',
					key: 'delivChannel',
					width: 140,
				},
				{
					title: '投放日期',
					dataIndex: 'delivDate',
					key: 'delivDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat))
				},
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					width: 140,
				},
				opCol
        	];
		}

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['recruit/retrieve', 'recruit/remove']}/>
					<RecruitFilter  ref="RecruitFilter" moreFilter={moreFilter} />
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加招聘需求" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
								<RadioButton value="1">基本信息</RadioButton>
								<RadioButton value="2">招聘要求</RadioButton>
								<RadioButton value="3">其他信息</RadioButton>
							</RadioGroup>
						</div>
						{
								moreFilter ?
									<div style={{textAlign:'right', width:'100%'}}>
										<Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{marginRight:'8px'}}>查询</Button>
										<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
									</div>
									:
									<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search placeholder="查询" style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} onSearch={this.onSearch}  />
										<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
									</div>
						}
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} expandedRowRender={this.expandedRowRender}/>
                </div>
            </div>
        );

		var formPage = null;
		if(this.state.action === 'create'){
                    // FIXME 输入参数
		    formPage = <CreateRecruitPage onBack={this.onGoBack}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateRecruitPage onBack={this.onGoBack} recruit={this.state.recruit}/>
		}

		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = RecruitPage;
