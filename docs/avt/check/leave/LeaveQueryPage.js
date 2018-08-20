'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Table, Pagination  } from 'antd';

var Common = require('../../../public/script/common');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
var LeaveQueryStore = require('./data/LeaveQueryStore');
var LeaveQueryActions = require('./action/LeaveQueryActions');

var pageRows = 10;
var newDateArr=[];
var LeaveQueryPage = React.createClass({
    getInitialState : function() {
      	return {
            leaveQuerySet:{
                recordSet: [],
                croupUuid:'',
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading:false,
      	}
    },
	mixins: [Reflux.listenTo(LeaveQueryStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  this.setState({
	      loading: false,
	      leaveQuerySet: data
	  });
	},

    componentDidMount : function(){
        this.setState({loading: true});
       	var corpUuid = window.loginData.compUser.corpUuid;
       	var staffCode = window.loginData.compUser.userCode;
        LeaveQueryActions.initLeaveQueryInfo(corpUuid, staffCode, newDateArr[5], newDateArr[0]);
    },
    handleQueryClick : function() {
        this.setState({loading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
        var staffCode = window.loginData.compUser.userCode;

        LeaveQueryActions.retrieveLeaveQueryPage(corpUuid, staffCode, newDateArr[5], newDateArr[0], this.state.leaveQuerySet.startPage, pageRows);
    },
    onChangePage: function(pageNumber){
        this.state.leaveQuerySet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
    
    
    
    render : function() {
	    var recordSet = this.state.leaveQuerySet.recordSet;
        const columns = [
        {
            title: '假期类型',
		    dataIndex: 'leaveType',
		    key: 'leaveType',
		    width: 140,
        },
        {
            title: '开始日期',
		    dataIndex: 'beginDate',
		    key: 'beginDate',
		    width: 140,
            render: (text, record) => (Common.formatDate(text, Common.dateFormat))
        },
        {
            title: '结束日期',
		    dataIndex: 'endDate',
		    key: 'endDate',
		    width: 140,
            render: (text, record) => (Common.formatDate(text, Common.dateFormat))
        },
        {
            title: '实修天数',
		    dataIndex: 'spend',
		    key: 'spend',
		    width: 140,
        },
        {
            title: '申请日期',
		    dataIndex: 'applyDay',
		    key: 'applyDay',
		    width: 140,
            render: (text, record) => (Common.formatDate(text, Common.dateFormat))
        },
        ]
        //计算时间
        var d = new Date();
        var year = d.getFullYear();
        var mon =  d.getMonth()+1;
        var day = d.getDate()
        if(mon<10){
            mon = "0"+mon;
        }   
        if(day<10){
            day = "0"+day;
        } 
        for(var n=0;n<=5;n++){

            var totalMon = mon-n;
            var newYear;
            var newMon;

            if(totalMon < 1){
            newYear=year - 1;
            newMon = 12 + totalMon;
            }else{
            newYear = year - Math.floor(totalMon/12) ;
            newMon = totalMon % 12;

            }
            var newDate = newYear+""+(newMon>=10?newMon:('0'+newMon))+day;
            newDateArr.push(newDate)            
        }

    var pag = {showQuickJumper: true, total:this.state.leaveQuerySet.totalRow, pageSize:this.state.leaveQuerySet.pageRow, current:this.state.leaveQuerySet.startPage,
        size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
    var cs = Common.getGridMargin(this,0);
  	return (
		<div className='grid-page' style={{padding: cs.padding}}>
			<div style={{margin: cs.margin}}>
		    	<ServiceMsg ref='mxgBox' svcList={['hr-leaveLog/retrieve']} />	
			</div>
            <div className='grid-body' style={{padding: '24px 20px 8px 20px'}}>
                <Table columns={columns} dataSource={recordSet}  pagination={pag}  expandedRowRender={record => <p>{record.reason || '空'}</p>} rowKey={record => record.uuid} loading={this.state.loading} size="middle" bordered={Common.tableBorder} />
            </div>
        </div>);
    }
}); 

module.exports = LeaveQueryPage;
