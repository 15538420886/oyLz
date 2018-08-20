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


var CommunicateStore = require('../data/CommunicateStore');
var CommunicateActions = require('../action/CommunicateActions');

var pageRows = 10;
var CommunicateTable = React.createClass({
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
            selectedRowKeys:null,
            action: 'query',
            resume:{},
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(CommunicateStore, "onServiceComplete")],
	onServiceComplete: function(data) {
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
        filter.resumeState = "待沟通";
        filter.reqUuid = this.state.resume.uuid;
        //--请求---
       
       CommunicateActions.retrieveResumePage(filter,this.state.resumeSet.startPage,pageRows )
     }
    },
    handleQueryClick : function(event) {
        this.setState({loading: true});
        var filter={};
         filter.resumeState = "待沟通";
        filter.reqUuid = this.state.resume.uuid;
        CommunicateActions.retrieveResumePage(filter,this.state.resumeSet.startPage,pageRows )
        
    },

    onSelectChange: function (selectedRowKeys) {
        this.setState({ selectedRowKeys: selectedRowKeys });
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
           this.props.doAction('score',resumeMsg,this.props.type);
        }

    },
    onUnsuit:function(){
        //不合适
         var data={};
        data.resumeState = "不合适";
        data.uuidList = this.state.selectedRowKeys;
        CommunicateActions.batchUpdateResume(data);
    },
    onWaitInterview:function(){
        //待面试
         var data={};
        data.resumeState = "待面试";
        data.uuidList = this.state.selectedRowKeys;
        CommunicateActions.batchUpdateResume(data);
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
                title: '收录日期',
                dataIndex: 'regDate',
                key: 'regDate',
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
        
        var btnVisible = (recordSet.length === 0) ? 'none' : '';
        var pag = {showQuickJumper: true, total:this.state.resumeSet.totalRow, pageSize:this.state.resumeSet.pageRow, current:this.state.resumeSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
           
		return (
			<div className='grid-body'>
                <div className='toolbar-table' style={{ padding: '0' }}>
                    <div style={{ float: 'left' }}>
                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} />
                         
                    </div>
                </div>

               <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} rowSelection={rowSelection} expandedRowRender={record => <div><p>{record.introduce}</p><p>{record.lastWork}</p></div>}  pagination={pag} size="middle" bordered={Common.tableBorder}/>
               <div style={{ margin: '-44px 0 0 0', width: '100%', display: btnVisible }}>
                        <div style={{ float: 'left' }}>
                            <Button key="btnUnsuit" onClick={this.onUnsuit} >标记为不合适</Button>
                            <Button key="btnWaitInterview" style={{marginLeft: '4px'}} onClick={this.onWaitInterview} >标记为待面试</Button>
                        </div>
                    </div>
              
            </div>
		);
	}
});

module.exports = CommunicateTable;