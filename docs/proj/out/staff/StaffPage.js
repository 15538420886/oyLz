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
var StaffStore = require('./data/StaffStore');
var StaffActions = require('./action/StaffActions');
import CreateStaffPage from './Components/CreateStaffPage';
import UpdateStaffPage from './Components/UpdateStaffPage';
import CreateUserPage from './Components/CreateUserPage';
import StaffFilter from './Components/StaffFilter';
import ProjContext from '../../ProjContext';

var pageRows = 10;
var StaffPage = React.createClass({
	getInitialState : function() {
		return {
			staffSet: {
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
			filter:{}
		}
	},

    mixins: [Reflux.listenTo(StaffStore, "onServiceComplete")],
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
                var mp = this.refs.StaffFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.filter = data.filter;
                }
            }
        }
        this.setState({
            loading: false,
            staffSet: data
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter = this.state.filter;
		filter.outUuid = ProjContext.selectedOutCorp.uuid;
		filter.more = (this.state.moreFilter ? '1' : '0');
		StaffActions.retrieveOutStaffPage(filter, this.state.staffSet.startPage,pageRows);
	},

	// 第一次加载
	componentDidMount : function(){
		var outUuid = ProjContext.selectedOutCorp.uuid;
		this.setState({loading: false});
		StaffActions.getCacheData(outUuid);
	},

	handleOpenCreateWindow : function(event) {
		this.setState({action: 'create'});
    },
    nextCreateUser: function (user, job) {
        this.refs.nextWindow.toggle();
        // console.log('nextCreateUser', user, job);
        this.refs.nextWindow.initOutStaff(user, job);
    },

	onClickUpdate : function(staff, event){
		 this.setState({staff: staff, action: 'update'});
	},

	onClickDelete : function(staff, event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的人员',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, staff)
		});
	},

	onClickDelete2 : function(staff){
		this.setState({loading: true});
		this.state.staffSet.operation = '';
		StaffActions.deleteOutStaff( staff.uuid );
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
		var filter = this.refs.StaffFilter.state.filter;
        this.state.filter = filter;
        this.handleQueryClick();
    },
	onChangePage: function(pageNumber){
        this.state.staffSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onGoBack: function(){
        this.setState({action: 'query'});
    },
	
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},

    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },

	getWorkYear: function(value){
		if(value === undefined || value === null || value === ''){
			return '';
		}

		var pos = value.indexOf('.');
		if(pos > 0){
			var y = value.substr(0, pos);
			var m = value.substr(pos+1);
			var y2 = parseInt(y);
			var m2 = parseInt(m);
			if(m2 > 0){
				return '' + y2 + '年' + m2 + '月';
			}
			else{
				return '' + y2 + '年';
			}
		}

		return value + '年';
	},

	render : function() {
		const columns = [
			{
				title: '员工号',
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
				title: '职位',
				dataIndex: 'jobTitle',
				key: 'jobTitle',
				width: 140,
			},
			{
				title: '最高学历',
				dataIndex: 'eduDegree',
				key: 'eduDegree',
				width: 140,
			},
			{
				title: '毕业院校',
				dataIndex: 'eduCollege',
				key: 'eduCollege',
				width: 140,
			},
			{
				title: '工作年限',
				dataIndex: 'workYears',
				key: 'workYears',
				width: 140,
				render: (text, record) => (this.getWorkYear(text)),
			},
			{
                title: '行业经验',
				dataIndex: 'induYears',
				key: 'induYears',
				width: 140,
				render: (text, record) => (this.getWorkYear(text)),
			},
			{
				title: '归属地',
				dataIndex: 'baseCity',
				key: 'baseCity',
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
					</span>
				),
			}
		];

	    var recordSet = this.state.staffSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.staffSet.totalRow, pageSize:this.state.staffSet.pageRow, current:this.state.staffSet.startPage,
        	size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		 var staffTable =
		 	<div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
					<ServiceMsg ref='mxgBox' svcList={['out-staff/retrieve', 'out-staff/remove']}/>
					<StaffFilter  ref="StaffFilter" moreFilter={moreFilter} />
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
                page = <CreateStaffPage onBack={this.onGoBack} funcCreateUser={this.nextCreateUser}/>;
			}
			else if(this.state.action === 'update'){
				page = <UpdateStaffPage onBack={this.onGoBack} staff={this.state.staff}/>
			}

			return (
				<div style={{width: '100%', height: '100%'}}>
					{staffTable}
                    {page}
                    <CreateUserPage ref="nextWindow" />
				</div>
			);
	}
});

module.exports = StaffPage;

