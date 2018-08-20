'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import { Button, Form, Row, Col, Input, Icon ,Table, Tabs,Pagination } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var Utils = require('../../../public/script/utils');


var InterviewStore = require('../data/InterviewStore');
var InterviewActions = require('../action/InterviewActions');

var pageRows = 10;
var InterviewTable = React.createClass({
	getInitialState : function() {
		return {
			resumeSet: {
				recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
			},
            action: 'query',
            selectedRowKeys:null,
            resume:{},
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(InterviewStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		if(data.operation === 'batchUpdate'){
           
             if (data.errMsg === '') {
                this.handleQueryClick()
               
            }
        };
        this.setState({
            loading: false,
            resumeSet: data
        });
	},
	// 第一次加载
    componentDidMount : function(){
      this.initPage( this.props.resume );  
	},
    initPage: function(resume)
    {
        Utils.copyValue(resume, this.state.resume);
        if(resume){
            var filter={};
            filter.resumeState = "待面试";
            filter.reqUuid = this.state.resume.uuid;
        //--请求---
       InterviewActions.retrieveResumePage(filter,this.state.resumeSet.startPage,pageRows )
     }
    },
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var filter={};
        filter.resumeState = "待面试";
        filter.reqUuid = this.state.resume.uuid;
        InterviewActions.retrieveResumePage(filter,this.state.resumeSet.startPage,pageRows )
        
    },
    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
    },
    onTalentClick:function(){
    	
        this.props.doAction('talent');
    },
    onChangePage: function(pageNumber){
        this.state.resumeSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onClickUpdate:function(resumeMsg,event){
         if(resumeMsg != null){
           this.props.doAction('score',resumeMsg, this.props.type);
        }
         
    },
    onRecorded:function(){
         // 已录用
        var data={};
        data.resumeState = "已录用";
        data.uuidList = this.state.selectedRowKeys;
        InterviewActions.batchUpdateResume(data);
    },
    onCommunicat:function(){
        // 待沟通
        var data={};
        data.resumeState = "待沟通";
        data.uuidList = this.state.selectedRowKeys;
        InterviewActions.batchUpdateResume(data);
    },
    onUnsuit:function(){
        //不合适
         var data={};
        data.resumeState = "不合适";
        data.uuidList = this.state.selectedRowKeys;
        InterviewActions.batchUpdateResume(data);
    },

	render : function(){
        const columns = [
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 100,
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                width: 90,
            },
            {
                title: '年龄',
                dataIndex: 'years',
                key: 'years',
                width: 90,
            },
            {
                title: '工作经验',
                dataIndex: 'induYear',
                key: 'induYear',
                width: 110,
            },
           {
                title: '学校',
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
                title: '学历',
                dataIndex: 'eduDegree',
                key: 'eduDegree',
                width: 140,
            },
           {
                title: '现单位',
                dataIndex: 'corpName',
                key: 'corpName',
                width: 140,
            },
           {
                title: '面试日期',
                dataIndex: 'reviewDate',
                key: 'reviewDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
            },
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
                    <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改待入职人员信息'><Icon type={Common.iconUpdate}/></a>
                    </span>
                ),
			}
		];
      
		var recordSet = this.state.resumeSet.recordSet;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        var visible = (this.state.action === 'query') ? '' : 'none';
        var btnVisible = (recordSet.length === 0) ? 'none' : '';
        var pag = { showQuickJumper: true, total: this.state.resumeSet.totalRow, pageSize: this.state.resumeSet.pageRow, current: this.state.resumeSet.startPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage };  

		return (
			<div className='grid-body'>
                <div className='toolbar-table' style={{ padding: '0' }}>
                    <div style={{ float: 'left' }}>
                         <Button icon={Common.iconAdd} type="primary" title="转入人才库" onClick={this.onTalentClick}>转入人才库</Button>
                        <Button icon={Common.iconRefresh} title="刷新数据" style={{marginLeft: '4px'}} onClick={this.handleQueryClick} />
                    </div>
                </div>
                
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} rowSelection={rowSelection} expandedRowRender={record => <div><p>{record.introduce}</p><p>{record.lastWork}</p></div>}  pagination={pag} size="middle" bordered={Common.tableBorder}/>
                    <div style={{ margin: '-44px 0 0 0', width: '100%', display: btnVisible }}>
                        <div style={{ float: 'left' }}>
                            <Button key="btnRecorded"  onClick={this.onRecorded} >标记为已录用</Button>
                            <Button key="btnCommunicat" style={{marginLeft: '4px'}} onClick={this.onCommunicat} >标记为待沟通</Button>
                            <Button key="btnUnsuit" style={{marginLeft: '4px'}} onClick={this.onUnsuit} >标记为不合适</Button>
                        </div>
                    </div>
                
            </div>
		);
	}
});

module.exports = InterviewTable;