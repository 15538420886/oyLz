'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal,Spin,Input,Pagination} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var JobStore = require('./data/JobStore');
var JobActions = require('./action/JobActions');
import CreateJobPage from './Components/CreateJobPage';
import UpdateJobPage from './Components/UpdateJobPage';
import DetailsJobPage from './Components/DetailsJobPage';

import JobFilter from './Components/JobFilter';
import ProjContext from '../../ProjContext';
import CodeMap from '../../../hr/lib/CodeMap';

var pageRows = 10;
var JobPage = React.createClass({
	getInitialState : function() {
		return {
			jobSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			moreFilter: false,
			filterValue:'',
			job:null,
			filter:{}
		}
	},

    mixins: [Reflux.listenTo(JobStore, "onServiceComplete"), CodeMap()],
    onServiceComplete: function(data) {
		 if(data.operation === 'cache'){
            var ff = data.filter.staffCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.perName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.JobFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.filter = data.filter;
                }
            }
        }
        this.setState({
            loading: false,
            jobSet: data
        });
    },

	// 第一次加载
	componentDidMount : function(){
		JobActions.getCacheData();
	},
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter = this.state.filter;
		filter.outUuid = ProjContext.selectedOutCorp.uuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
		JobActions.retrieveOutJobPage(filter, this.state.jobSet.startPage,pageRows);
	},

	
	handleOpenCreateWindow : function(event) {
		this.setState({action: 'create'});
	},

	onClickDelete : function(job, event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的人员',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, job)
		});
	},

	onClickDelete2 : function(job){
		this.setState({loading: true});
		JobActions.deleteOutJob( job.uuid );
	},

	onFilterRecord: function(e){
		 this.setState( {filterValue: e.target.value} );
	},

	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },

	onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }

        this.handleQueryClick();
    },

	onSearch3:function(){
		var filter = this.refs.JobFilter.state.filter;
        this.state.filter = filter;
        this.handleQueryClick();
    },

	onChangePage: function(pageNumber){
        this.state.jobSet.startPage = pageNumber;
        this.handleQueryClick();
    },

	onGoBack: function(){
        this.setState({action: 'query'});
    },
	
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

	onClickUpdate : function(job, event){
		 this.setState({job: job, action: 'update'});
	},

   onClickDetails:function(job, event){
        this.setState({job: job , action: 'detail'});
    },

    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },


	render : function() {
		var corpUuid = window.loginData.compUser.corpUuid;
		const columns = [
			{
					title: '员工号',
					dataIndex: 'staffCode',
					key: 'staffCode',
					width: 140,
			},
			{
					title: '员工',
					dataIndex: 'perName',
					key: 'perName',
					width: 140,
			},
			{
					title: '结算单价',
					dataIndex: 'userCost',
					key: 'userCost',
					width: 140,
      		 },
			{
					title: '生效日期',
					dataIndex: 'effectDate',
					key: 'effectDate',
					width: 140,
					render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
			},
			{
					title: '级别',
					dataIndex: 'empLevel',
					key: 'empLevel',
					width: 140,
					render: (text, record) => (this.getLevelName(corpUuid, record.empLevel)),
      		 },
      		 {
					title: '技术岗位',
					dataIndex: 'techName',
					key: 'techUuid',
					width: 140,
      		  },
      		  {
            		title: '管理岗位',
            	    dataIndex: 'manName',
            		key: 'manUuid',
            		width: 140,
      		   },	
				{
					title: '更多操作',
					key: 'action',
					width: 100,
					render: (text, record) => (
						<span>
						<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员'><Icon type={Common.iconUpdate}/></a>
						<span className="ant-divider" />
						<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员'><Icon type={Common.iconRemove}/></a>
						<span className="ant-divider" />
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='详情'><Icon type='bars'/></a>
						</span>
					),
				}
		];

	    var recordSet = this.state.jobSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.jobSet.totalRow, pageSize:this.state.jobSet.pageRow, current:this.state.jobSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		 var JobTable =
		 	<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
					<ServiceMsg ref='mxgBox' svcList={['out-job/retrieve', 'out-job/remove']}/>
					<JobFilter  ref="JobFilter" moreFilter={moreFilter} />
					<div style={{margin: '8px 0 0 0'}}>
						<div className='toolbar-table'>
							<div style={{float:'left'}}>
								<Button icon={Common.iconAdd} type="primary" title="增加人员" onClick={this.handleOpenCreateWindow}/>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							</div>
							{
								moreFilter ?
									<div style={{textAlign:'right', width:'100%'}}>
										<Button title="查询" onClick={this.onSearch3} loading={this.state.loading} style={{marginRight:'8px'}}>查询</Button>
										<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
									</div>
									:
									<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} onSearch={this.onSearch}  />
										<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
									</div>
							}
						</div>
					</div>	
					<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
						<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
					</div>
			</div>

			var page = null;
			if(this.state.action === 'create'){
				page = <CreateJobPage onBack={this.onGoBack}/>
			}
			else if(this.state.action === 'detail'){
               page = <DetailsJobPage onBack={this.onGoBack} userUuid={this.state.job.userUuid}/>
           }
			else if(this.state.action === 'update'){
				page = <UpdateJobPage onBack={this.onGoBack} job={this.state.job}/>
			}

			return (
				<div style={{width: '100%', height: '100%'}}>
					{JobTable}
					{page}
				</div>
			);
	}
});

module.exports = JobPage;

