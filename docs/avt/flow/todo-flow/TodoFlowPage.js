'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input } from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import CodeMap from '../../../hr/lib/CodeMap';
var TodoFlowStore = require('./data/TodoFlowStore');
var TodoFlowActions = require('./action/TodoFlowActions');
import SelectFlow from './Components/SelectFlow';
import ChkFlowPage from './Components/ChkFlowPage';


var TodoFlowPage = React.createClass({
	getInitialState : function() {
		return {
			flowSet: {
				recordSet: [],
				operation : '', 
				errMsg : ''
			},
			loading: false,
			obj:{},
			action: 'query',
			filterValue:''   
		}
	},

    mixins: [Reflux.listenTo(TodoFlowStore, "onServiceComplete"),CodeMap()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            flowSet: data 
        });
    },
    
	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var sixtyDay = this.getPastSixtyDay();
		var day = Common.getToday()
		var filter={};
		filter.nextUserStaffCode = window.loginData.compUser.userCode;
		filter.corpUuid = window.loginData.compUser.corpUuid;
		filter.applyDate1 = sixtyDay;
		filter.applyDate2 = day;
		filter.flowUuid = this.state.filterValue;
		
		TodoFlowActions.retrieveChkFlowPage(filter );
	}, 
    
	// 第一次加载
    componentDidMount: function () {
        var sixtyDay = this.getPastSixtyDay();
        var day = Common.getToday()

        var filter = {};
        filter.nextUserStaffCode = window.loginData.compUser.userCode;
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.applyDate1 = sixtyDay;
        filter.applyDate2 = day;

        this.setState({ loading: true });
        TodoFlowActions.initChkFlow(filter);
	},

	getPastSixtyDay:function () {
	    var curDate = (new Date()).getTime();
	    var sixtyDay = 60 * 24 * 3600 * 1000;
	    var pastResult = curDate - sixtyDay;
	    var pastDate = new Date(pastResult),
	        pastYear = pastDate.getFullYear(),
	        pastMonth = pastDate.getMonth() + 1,
	        pastDay = pastDate.getDate();
    	return pastYear* 10000 + pastMonth*100 +pastDay;
	},

	onGoBack: function () {
        this.setState({ action: 'query' });
    },

	onClickFlow:function(data){
		this.setState({action: 'chk', obj: data});
	
	}, 

	handleOnSelectedFlow:function(value){
		this.state.filterValue = value;
        this.handleQueryClick();
	},

    onFilterRecord: function(e){
		this.setState({filterValue: e.target.value});
	},


	render : function() {
		var corpUuid = window.loginData.compUser.corpUuid;
		var recordSet = this.state.flowSet.recordSet;
		const columns = [
        		{
        		    title: '流程名称',
        		    dataIndex: 'flowName',
        		    key: 'flowName',
        		    width: 140,
  		        },
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
        		    title: '部门',
        		    dataIndex: 'deptName',
        		    key: 'deptName',
        		    width: 140,
  		        },
  		       {
        		    title: '归属地',
        		    dataIndex: 'baseCity',
        		    key: 'baseCity',
        		    width: 140,
  		        },
  		       {
        		    title: '申请人',
        		    dataIndex: 'applyName',
        		    key: 'applyName',
        		    width: 140,
  		        },
  		       {
                    title: '申请日期',
        		    dataIndex: 'applyDate',
        		    key: 'applyDate',
        		    width: 140,
        		    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
  		        },
  		       {
        		    title: '催办日期',
        		    dataIndex: 'remindDate',
        		    key: 'remindDate',
        		    width: 140,
        		    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
  		        },
  		        {
					title: '更多操作',
					key: 'action',
					width: 100,
					render: (text, record) => (
						<span>
						<a href="#" onClick={this.onClickFlow.bind(this, record)} ><Icon type="bars"/></a>
						</span>
					),
				}
      		]
 		var page=null;
		var cs = Common.getGridMargin(this); 
		var visible = (this.state.action === 'query') ? '' : 'none';

         var table = 
            <div className='grid-page' style={{padding: cs.padding, display: visible }}>
            	<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['chk-flow/findThree']}/>
					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
							<SelectFlow placeholder="选择" style={{ textAlign: 'left', width: Common.searchWidth }} corpUuid={corpUuid} value={this.state.filterValue} onSelect={this.handleOnSelectedFlow} />
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					  <Table columns={columns} dataSource={recordSet}  rowKey={record => record.uuid} loading={this.state.loading} expandedRowRender={record => <div><p>{record.eventDesc}</p></div>}  pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
            </div>
        if(this.state.action === 'chk'){
            page = (<ChkFlowPage onBack={this.onGoBack} obj={this.state.obj} />)
        }
		return (
			<div >
				{table}
				{page}
			</div>
		);
	}
}); 

module.exports = TodoFlowPage;

