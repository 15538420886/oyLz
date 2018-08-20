'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Radio} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

var ProsStaffStore = require('./data/ProsStaffStore.js');
var ProsStaffActions = require('./action/ProsStaffActions');
import CreateProsStaffPage from './Components/CreateProsStaffPage';
import UpdateProsStaffPage from './Components/UpdateProsStaffPage';
import AtsCodeMap from '../lib/AtsCodeMap';

var filterValue = '';
var ProsStaffPage = React.createClass({
    getInitialState : function() {
        return {
            prosStaffSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            action: 'query',
            prosStaff: null,
						viewType:'1',
        }
    },

    mixins: [Reflux.listenTo(ProsStaffStore, "onServiceComplete"),AtsCodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            prosStaffSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
        var corpUuid = window.loginData.compUser.corpUuid;
        ProsStaffActions.retrieveProsStaff(corpUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
        var corpUuid = window.loginData.compUser.corpUuid;
        ProsStaffActions.initProsStaff(corpUuid);
    },

    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create'});
    },
    onClickUpdate : function(prosStaff, event)
    {
        if(prosStaff != null){
            this.setState({prosStaff: prosStaff, action: 'update'});
        }
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
		onChangeView: function(e) {
  		this.setState({viewType: e.target.value});
  	},

    onClickDelete : function(prosStaff, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的待入职人员信息 【'+prosStaff.perName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, prosStaff)
        });
    },
    onClickDelete2 : function(prosStaff)
    {
        this.setState({loading: true});
        ProsStaffActions.deleteProsStaff( prosStaff.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
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
        var recordSet = Common.filter(this.state.prosStaffSet.recordSet, filterValue);
        var corpUuid = window.loginData.compUser.corpUuid;
				var columns =[];
        if(this.state.viewType == '1'){
        	columns = [
            {
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '性别',
            	dataIndex: 'gender',
            	key: 'gender',
            	width: 140,
            },
            {
            	title: '出生日期',
            	dataIndex: 'birthDate',
            	key: 'birthDate',
            	width: 140,
            },
            {
            	title: '电话',
            	dataIndex: 'phone',
            	key: 'phone',
            	width: 140,
            },
            {
            	title: '电子邮箱',
            	dataIndex: 'email',
            	key: 'email',
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
            	title: '专业',
            	dataIndex: 'profession',
            	key: 'profession',
            	width: 140,
            },
            {
            	title: '行业经验',
            	dataIndex: 'induYears',
            	key: 'induYears',
            	width: 140,
              render: (text, record) => (this.getWorkYear(text)),
            },
						{
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改待入职人员信息'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除待入职人员信息'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            },
					];
				}else {
					columns = [
						{
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '属地',
            	dataIndex: 'baseCity',
            	key: 'baseCity',
            	width: 140,
            },
            {
            	title: '入职部门',
            	dataIndex: 'deptName',
            	key: 'deptName',
            	width: 140,
            },
            {
            	title: '入职岗位',
            	dataIndex: 'jobName',
            	key: 'jobName',
            	width: 140,
            },
            {
            	title: '人员类型',
            	dataIndex: 'staffType',
            	key: 'staffType',
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
            	title: '面试人',
            	dataIndex: 'interPerson',
            	key: 'interPerson',
            	width: 140,
            },
            {
            	title: '入职通知时间',
            	dataIndex: 'noticeTime',
            	key: 'noticeTime',
            	width: 140,
            },
            {
            	title: '预计入职日期',
            	dataIndex: 'expectDate',
            	key: 'expectDate',
            	width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改待入职人员信息'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除待入职人员信息'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];
			}

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['pros-staff/retrieve', 'pros-staff/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加待入职人员信息" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
														<RadioGroup value={this.state.viewType} style={{marginLeft: '16px'}} onChange={this.onChangeView}>
              								<RadioButton value="1">个人信息</RadioButton>
              								<RadioButton value="2">岗位信息</RadioButton>
              							</RadioGroup>
												</div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
            </div>
        );

		var formPage = null;
		if(this.state.action === 'create'){
                    // FIXME 输入参数
		    formPage = <CreateProsStaffPage onBack={this.onGoBack}/>;
		}
		else if (this.state.action === 'update') {
			formPage = <UpdateProsStaffPage onBack={this.onGoBack} prosStaff={this.state.prosStaff}/>
		}

		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = ProsStaffPage;
