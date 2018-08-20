'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Form, Row, Col, Input, Button, Icon ,Table, DatePicker, Modal, Pagination} from 'antd';
import DictSelect from '../../lib/Components/DictSelect';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var EmployeeJobStore = require('./data/EmployeeJobStore');
var EmpJobActions = require('./action/EmpJobActions');
import CreateEmpJobPage from './Components/CreateEmpJobPage';
import UpdateEmpJobPage from './Components/UpdateEmpJobPage';
import MoreEmpJobPage from './Components/MoreEmpJobPage';
import CreateDetailPage from './Components/CreateDetailPage';
import CodeMap from '../lib/CodeMap';


var pageRows = 10;
var EmpJobPage = React.createClass({
	getInitialState : function() {
		return {
			empJobSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
            action: 'query',
            empJob: null,

            loading: false,
            moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(EmployeeJobStore, "onServiceComplete"), CodeMap()],
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
                var mp = this.refs.MoreEmpJobPage;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.empJob = this.state.filter;
                }
            }
        }

        this.setState({
            loading: false,
            empJobSet: data
        });
    },
	// 第一次加载
	componentDidMount : function(){
		EmpJobActions.getCacheData();
	},
	handleQueryClick : function() {
		this.setState({loading: true});
		this.state.filter.status = '1';
		this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
		this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		EmpJobActions.retrieveHrEmpJobPage(this.state.filter, this.state.empJobSet.startPage, pageRows);
	},
    showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.empJobSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
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
    onMoreSearch: function(){
        this.state.filter = this.refs.MoreEmpJobPage.state.empJob;
        this.handleQueryClick();
    },
	onClickDelete : function(empJob, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的岗位',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, empJob)
		});
	},

	onClickDelete2 : function(empJob)
	{
		this.setState({loading: true});
		this.state.empJobSet.operation = '';
		EmpJobActions.deleteHrEmpJob( empJob.uuid );
	},
    handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickDetails:function(empJob, event){
        this.setState({empJob: empJob, action: 'detail'});
    },
    onClickUpdate : function(empJob, event){
        this.setState({empJob: empJob, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },

	render : function(corpUuid) {
		var corpUuid = window.loginData.compUser.corpUuid;

		const columns = [
			{
                title: '员工编号',
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
                title: '员工类型',
                dataIndex: 'empType',
                key: 'empType',
                width: 140,
				render: (text, record) => (Utils.getOptionName('HR系统', '员工类型', record.empType, false, this)),
            },
            {
                title: '员工级别',
                dataIndex: 'empLevel',
                key: 'empLevel',
                width: 140,
                render: (text, record) => (this.getLevelName(corpUuid, record.empLevel)),
            },
            {
                title: '技术级别',
                dataIndex: 'techLevel',
                key: 'techLevel',
                width: 140,
            },
            {
                title: '管理级别',
                dataIndex: 'manLevel',
                key: 'manLevel',
                width: 140,
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
				width: 110,
				render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改岗位信息'><Icon type={Common.iconUpdate}/></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除岗位信息'><Icon type={Common.iconRemove}/></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDetails.bind(this, record)} title='岗位信息详情'><Icon type="bars"/></a>
					</span>
				),
			}
		];


		var recordSet = this.state.empJobSet.recordSet;
		var moreFilter = this.state.moreFilter;
		var visible = (this.state.action === 'query') ? '' : 'none';
		var pag = {showQuickJumper: true, total:this.state.empJobSet.totalRow, pageSize:this.state.empJobSet.pageRow, current:this.state.empJobSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
		var contactTable =
			<div className='grid-page' style={{overflow: 'hidden', display:visible}}>
				<div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr_emp_job/retrieve', 'hr_emp_job/remove']}/>
					<MoreEmpJobPage ref="MoreEmpJobPage" moreFilter={moreFilter}/>

					<div style={{margin: '8px 0 0 0'}}>
						<div className='toolbar-table'>
							<div style={{float:'left'}}>
								<Button icon={Common.iconAdd} type="primary" title="增加岗位" onClick={this.handleCreate}/>
								<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							</div>
						  {
								moreFilter ?
								<div style={{textAlign:'right', width:'100%'}}>
									<Button  title="查询" onClick={this.onMoreSearch} >查询</Button>
									<Button style={{marginLeft:'8px'}} title="快速条件" onClick={this.showMoreFilter} >快速条件</Button>
								</div>:
								<div style={{textAlign:'right', width:'100%'}}>
									 <Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
									<Button style={{marginLeft:'8px'}} title="更多条件" onClick={this.showMoreFilter}>更多条件</Button>
								</div>
							}
						</div>
					</div>
					<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
						<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={pag} size="middle" bordered={Common.tableBorder}/>
					</div>
				</div>
			</div>

         var page = null;
         if(this.state.action === 'create'){
             page = <CreateEmpJobPage onBack={this.onGoBack}/>;
         }
         else if(this.state.action === 'detail'){
             page =<CreateDetailPage onBack={this.onGoBack} userUuid={this.state.empJob.userUuid}/>
         }
         else if(this.state.action === 'update'){
             page = <UpdateEmpJobPage onBack={this.onGoBack} empJob={this.state.empJob}/>
         }

         return (
             <div style={{width: '100%', height: '100%'}}>
                 {contactTable}
                 {page}
             </div>
         );
	}
});

module.exports = EmpJobPage;
