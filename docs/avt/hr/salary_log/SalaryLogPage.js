'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Row, Col, Button, Input, Spin, Table, Icon, Tabs} from 'antd';
import ModalForm from '../../../lib/Components/ModalForm';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var SalaryLogDetail = require('./Components/SalaryLogDetail');
var SalaryLogStore = require('./data/SalaryLogStore.js');
var SalaryLogActions = require('./action/SalaryLogActions');

var SalaryLogPage = React.createClass({
	getInitialState : function() {
		return {
			salaryLogSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
            salaryLogHtml:"",
			salaryLog: {},
            selectKey:'1',
			loading: false,
		}
	},
	mixins: [Reflux.listenTo(SalaryLogStore, "onServiceComplete"), ModalForm('salaryLog')],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve_p'){
	  		var salaryLog = (data.recordSet.length > 0) ? data.recordSet[0] : {};
	  		data.recordSet.map((node, i) => {
                if (node.grossPay === undefined && node.salaryBody !== null) {
                    var salaryBody = eval('(' + node.salaryBody + ')');
                    node.grossPay = salaryBody.grossPay;
                    node.netPay = salaryBody.netPay;
                }
            });
			this.setState({
				loading: false,
				salaryLog: salaryLog,
				salaryLogSet: data,
			});
            this.getHtml(salaryLog)

		}else if(data.operation === 'retrieve_p2'){
            var salaryLogHtml = data.salaryLogHtml;
            this.setState({
                loading: false,
                salaryLogHtml: salaryLogHtml,
            });
        }
	},

	// 第一次加载
    componentDidMount: function () {
        this.initPage()
	},

	getPastHalfYear:function () {
	    var curDate = (new Date()).getTime();
	    var halfYear = 365 / 2 * 24 * 3600 * 1000;
	    var pastResult = curDate - halfYear;
	    var pastDate = new Date(pastResult),
	        pastYear = pastDate.getFullYear(),
	        pastMonth = pastDate.getMonth() + 1,
	        pastDay = pastDate.getDate();

    	return pastYear* 100 + pastMonth;
	},
    initPage:function(){
        if(window.loginData.compUser){
            this.setState({loading: true});
            var filter = {};
            var mouth=Common.getMonth();
            var halfYear=this.getPastHalfYear();
            filter.corpUuid = window.loginData.compUser.corpUuid;
            filter.staffCode = window.loginData.compUser.userCode;
            filter.date1=halfYear+'01';
            filter.date2 = mouth + '31';
            SalaryLogActions.initHrSalaryLog(filter);
        }
    },

	getHtml: function(salaryLog)
    {
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        filter.uuid=salaryLog.uuid;
        SalaryLogActions.retrieveHtmlSalaryLog(filter); 
	},

	onClickDetail:function(salaryLog){
		this.setState({salaryLog: salaryLog});
        if(this.state.selectKey==="1"){
            this.getHtml(salaryLog)
        }
	},
    onTabChange: function (activeKey) {
        if(activeKey==2){
            this.initPage()
        }
        this.setState({ selectKey: activeKey});
    },
	render : function() {  
		var corpUuid= window.loginData.compUser.corpUuid;
        var page1=this.state.salaryLogHtml; 
		const columns = [
                 {
                    title: '员工编号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 140,
                },
                {
                    title: '部门名称',
                    dataIndex: 'deptName',
                    key: 'deptName',
                    width: 140,
                },
                {
                    title: '发放月份',
                    dataIndex: 'salaryMonth',
                    key: 'salaryMonth',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '发薪日期',
                    dataIndex: 'payDate',
                    key: 'payDate',
                    width: 140,
                    render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                },
                {
                    title: '绩效分数',
                    dataIndex: 'performScore',
                    key: 'performScore',
                    width: 140,
                },
                {
                    title: '应发工资',
                    dataIndex: 'grossPay',
                    key: 'grossPay',
                    width: 140,
                },
                {
                    title: '税后工资',
                    dataIndex: 'netPay',
                    key: 'netPay',
                    width: 140,
                },
                {
                    title: '',
                    key: 'action',
                    width: 60,
                    render: (text, record) => (
                        <span>
                        <a href="#" onClick={this.onClickDetail.bind(this, record)} title='详情'><Icon type={Common.iconDetail}/></a>
                        </span>
                    ),
                }
            ];
		var recordSet = this.state.salaryLogSet.recordSet;
		return (
			 <div style={{padding: '24px 30px 30px 30px'}}>
            	<ServiceMsg ref='mxgBox' svcList={['hr-salary-log/retrieve_p']}/>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={false} size="middle" bordered={Common.tableBorder}/>
                 <div className='tab-page' style={{padding:"10px 0 16px 16px"}}>
                    <Tabs ref='insuTabs' defaultActiveKey="1"  onChange={this.onTabChange}>
                        <TabPane tab="工资单" key="1" >
                           <div style={{ height: '100%',width:"600px"}} dangerouslySetInnerHTML={{__html: page1}} />
                        </TabPane>
                        <TabPane tab="详情" key="2">
                           <SalaryLogDetail salaryLog={this.state.salaryLog}/>
                        </TabPane>
                    </Tabs>
                </div>    
            </div>
		);
	}
});

module.exports = SalaryLogPage;