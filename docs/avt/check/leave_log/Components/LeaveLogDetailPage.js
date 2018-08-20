'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Table, Pagination } from 'antd';
var Common = require('../../../../public/script/common');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Utils = require('../../../../public/script/utils');
var LeaveLogDetailStore = require('../data/LeaveLogDetailStore');
var LeaveLogDetailActions = require('../action/LeaveLogDetailActions');

var pageRows = 10;
var newDateArr=[];
var LeaveLogDetailPage = React.createClass({
    getInitialState : function() {
      	return {
            leavelogdetailSet:{
                recordSet: [],
                croupUuid:'',
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading:false,
            userUuid:''
      	}
    },
	mixins: [Reflux.listenTo(LeaveLogDetailStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  this.setState({
	      loading: false,
	      leavelogdetailSet: data
	  });
	},

    componentDidMount : function(){
        this.setState({loading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
        var staffCode = window.loginData.compUser.userCode;
        LeaveLogDetailActions.initLeaveLogDetailInfo(corpUuid,staffCode,newDateArr[5], newDateArr[0]);

    },
    handleQueryClick : function() {
        this.setState({loading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
        var staffCode = window.loginData.compUser.userCode;
        LeaveLogDetailActions.retrieveLeaveLogDetailPage( corpUuid, staffCode, newDateArr[5], newDateArr[0], this.state.leavelogdetailSet.startPage, pageRows);
    },
    onChangePage: function(pageNumber){
        this.state.leavelogdetailSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
	
    render : function() {
	    var recordSet = this.state.leavelogdetailSet.recordSet;
        const columns = [
        {
            title: '假期类型',
		    dataIndex: 'leaveType',
		    key: 'leaveType',
		    width: 140,
            render: (text, record) => (Utils.getOptionName('HR系统', '假期类型', record.leaveType, false, this)),
        },
        
        {
            title: '应记天数',
		    dataIndex: 'accrued',
		    key: 'accrued',
		    width: 140,
        },
        {
            title: '已修天数',
            dataIndex: 'spend',
            key: 'spend',
            width: 140,
        },
        {
            title: '剩余天数',
            dataIndex: 'remnant',
            key: 'remnant',
            width: 140,
        },
        {
            title: '补偿天数',
            dataIndex: 'replacement',
            key: 'replacement',
            width: 140,
        },
        {
            title: '生效日期',
            dataIndex: 'effectDate',
            key: 'effectDate',
            width: 140,
            render: (text, record) => (Common.formatDate(text, Common.dateFormat))
        },
        {
            title: '失效日期',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            width: 140,
            render: (text, record) => (Common.formatDate(text, Common.dateFormat))
        },
        ]
        // 计算时间
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
    var pag = {showQuickJumper: true, total:this.state.leavelogdetailSet.totalRow, pageSize:this.state.leavelogdetailSet.pageRow, current:this.state.leavelogdetailSet.startPage,
        size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
    var cs = Common.getGridMargin(this);
  	return (
		<div className='grid-page' style={{padding: cs.padding, height: '100%',overflowY: 'auto'}}>
			<div style={{margin: cs.margin}}>
		    	<ServiceMsg ref='mxgBox' svcList={['hr-leave/retrieve']} />	
			</div>
			<div style={{padding:"24px 20px 16px 20px"}}>
                <Table columns={columns} dataSource={recordSet}  pagination={pag}  rowKey={record => record.uuid} loading={this.state.loading} size="middle" bordered={Common.tableBorder} />
            </div>
        
        </div>);
    }
});

module.exports = LeaveLogDetailPage;
