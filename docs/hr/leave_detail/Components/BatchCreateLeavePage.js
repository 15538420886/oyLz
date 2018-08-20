import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var LeaveUtil = require('../../leave/LeaveUtil');

import { Form, Button, Input, Select, Row, Col, Tabs, Spin, Table, Icon, Upload} from 'antd';
const TabPane = Tabs.TabPane;

var LeaveDetailRegStore = require('../data/LeaveDetailRegStore');
var LeaveDetailActions = require('../action/LeaveDetailActions');
var LeaveActions = require('../../leave/action/LeaveActions');
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';

var BatchCreateLeavePage = React.createClass({
	getInitialState : function() {
		return {
           	batch:[],
           	day:[],
           	hours:[],
           	day1:[],
           	hours1:[],
           	hAfter:[],
           	loading: false,
		}
	},
	mixins: [Reflux.listenTo(LeaveDetailRegStore, "onServiceComplete"), XlsTempFile()],
	onServiceComplete: function(data) {
		 if( data.operation === 'batch-create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		
	},
	
	getRemnant: function (oldValue,accrued){  
        return LeaveUtil.getRemnant(oldValue, accrued);
	},
	getCount:function(batch){
		var dayAfter=[];
		var hoursAfter=[];
		var dayAgo=[];
		var hoursAgo=[];	
		var dayArr=[];
		batch.map((date,i)=>{
			var day =date[date.leaveType];
			if(day===null){
				day='0';
				dayArr.push(day)
			}else{
				dayArr.push(day)				
			};	
			var accrued='';
			var date1=date.accrued_1;
            var date2=date.accrued_2;
            date1===null?date1="0":date1;
            date2===null?date2="0":date2;

            date2==="0"||date2===0?accrued=date1:accrued=date1+"."+date2;
            var result=this.getRemnant(day,accrued)
			var pos = dayArr[i].indexOf('.');
			var pos1 = result.indexOf('.');		
			
	        if (pos >= 0 ) {
	        	var dArr=dayArr[i]	    
	            var di = dArr.substr(0, pos);
	            var df = dArr.substr(pos+1); 
	            if(pos1>=0){
	            	var dA = result.substr(0, pos1);
	           		var hA = result.substr(pos1+1);
	            }else{
	            	var dA = result;
	           		var hA ="0";
	            };
	           
           		dayAfter.push(dA);
            	hoursAfter.push(hA);
            	dayAgo.push(di);
	            hoursAgo.push(df);
	           
	        }else{
	        	var dArr=dayArr[i];       	
	           	if(pos1>=0){
	            	var dA = result.substr(0, pos1);
	           		var hA = result.substr(pos1+1);
	            }else{
	            	var dA = result;
	           		var hA ="0";
	            };
	            
           		dayAfter.push(dA);
		        hoursAfter.push(hA);
	        	dayAgo.push(dArr);
	        	hoursAgo.push("0");
	                	  
	        }
			
		});	
		this.setState({
			batch: batch,
			day:dayAgo,
			day1:dayAfter,
			hours:hoursAgo,
			hours1:hoursAfter,
		});	
	},
	
	handleBatchCreate : function(){
		var batchArr=[];
		
		var batch=this.state.batch;
		var leaveTypeDay='';
		var changeTyle={};
		var leaveMap={};
		batch.map((date,i)=>{
			var day =date[date.leaveType];
			
			var accrued='';
			var date1=date.accrued_1;
            var date2=date.accrued_2;
            date1===null?date1="0":date1;
            date2===null?date2="0":date2; 
            date2==="0"||date2===0?accrued=date1:accrued=date1+"."+date2;
            var result=this.getRemnant(day,accrued);
          
			var pos1 = result.indexOf('.'); 
			
            if(pos1>=0){
            	var dA = result.substr(0, pos1);
           		var hA = result.substr(pos1+1);
           		leaveTypeDay=dA+"."+hA;
            }else{
            	leaveTypeDay=result;
            };
          		
	       
	        // 发送数据  
			var leave={};
			var detail={};
			var str='';
			var uuid=date.uuid;
			if(leaveMap[uuid]){
				var mapObj=leaveMap[uuid];
				 Utils.copyValue(leaveMap[uuid], leave);
				 leave[date.leaveType]=leaveTypeDay;
				 mapObj[date.leaveType]=leaveTypeDay;

			}else{
				leaveMap[uuid]={};
				leave.corpUuid=date.corpUuid;
				leave.uuid=date.uuid;
				leave.annual=date.annual;	
				leave.wedding=date.wedding;	
				leave.maternity	=date.maternity;
				leave.paternity	=date.paternity;
				leave.dayoff=date.dayoff;
				leave.family=date.family;	
				leave.funeral=date.funeral;	
				leave.paidLeave=date.paidLeave;	
				leave.otherLeave=date.otherLeave;	
				
				leave[date.leaveType]=leaveTypeDay;
				Utils.copyValue(leave, leaveMap[uuid]);

			}

			detail.userUuid=leave.uuid;
			detail.leaveType=date.leaveType;
			date2==="0"?str=date1:str=date1+"."+date2;

			detail.accrued=str;
			detail.remnant=str;
			detail.spend='0';
			detail.replacement='0';
			detail.repAmount='';
			detail.limitDay='';
			detail.expiryMemo='';
			detail.memo2='';
			detail.effectDate=date.effectDate;
			detail.expiryDate=date.expiryDate;
			detail.status='1'
			
			var obj = {
				"leave":leave,
				"detail":detail,
			};
			batchArr.push(obj);
		});
		LeaveDetailActions.batchCreateLeaveDetailReg( batchArr );	
		this.setState({
		   loading:true
        })
	},

	goBack:function(){
        this.props.onBack();
    },
    handleTempDown: function(e){ 
        this.downXlsTempFile(XlsConfig.leaveDetailFields);
    },
    uploadComplete: function(errMsg, result){     
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }
        else{
            // 显示批量增加页面
            this.setState({batch: result.list});
            var batch=result.list;
            this.getCount(batch);
        }
    },   
    beforeUpload: function(file) {    
        this.setState({ loading: true, batch: [] });
        var url = Utils.hrUrl+'hr-leave-detail/upload-xls';
        var data={corpUuid: window.loginData.compUser.corpUuid};
        this.uploadXlsFile(url, data, XlsConfig.leaveDetailFields, file, this.uploadComplete);
        return false;
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    }, 

	render : function(){
		var recordSet = this.state.batch;

		var hours1 =this.state.hours1;
		var hours  =this.state.hours;
		var day =this.state.day;
		var day1 =this.state.day1;		
		var disabled =( recordSet.length === 0 );
				
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
                title: '休假类型',
                dataIndex: 'leaveType',
                key: 'leaveType',
                width: 120,
                render: (text, record) => (Utils.getOptionName('HR系统', '假期类型', record.leaveType, false, this)),
            },
            {
                title: '应计天数',
                dataIndex: 'accrued_1',
                key: 'accrued_1',
                width: 120,
            },
            {
                title: '小时',
                dataIndex: 'accrued_2',
                key: 'accrued_2',
                width: 120,
            },
             {
                title: '调整前假日',
                key: 'date1',
                width: 120,
				render:  (text, record,index) => (day[index] ),
            },
            {
                title: '小时',
                key: 'date2',
                width: 120,
				render:  (text, record,index) => (hours[index]),
            },
            {
                title: '调整后假日',
                key: 'date3',
                width: 120,
				render:  (text, record,index) => (isNaN(day1[index])?0:day1[index])
            },
            {
                title: '小时',
                key: 'date4',
                width: 120,
				render:  (text, record,index) => (isNaN(hours1[index])?0:hours1[index]),
            },
           
		];   
		
        var table =			
         	<div style={{padding: '8px 0 0 0', height: '100%',width:'100%',overflowY: 'auto'}}>
         		<Button style={{ margin: '3px 20px 8px 22px'}} key="btnOK" type="primary"  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>
	           	<div style={{width:'100%', padding: '0 18px 8px 20px'}}>
	                    <Table columns={columns} dataSource={recordSet} rowKey={(record , index)=> index} loading={this.state.loading} size="middle"  pagination={false} bordered={Common.tableBorder}/>
	             </div>
           </div>  
               
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-leave-detail/batch-create']}/>
				 <div className='toolbar-table'>
                    <div style={{ float: 'left' }}>
                        <Button icon='save' type="primary" title="批量增加假日信息" onClick={this.handleBatchCreate} disabled={disabled} >批量增加假日信息</Button>
                        <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                        <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{ marginLeft: '4px' }}>
                            <Button icon="upload" title='上传文件, 需要用户确认后才会保存到数据库'/>
                        </Upload>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={(record , index)=> index} loading={this.state.loading} size="middle"  pagination={false} bordered={Common.tableBorder}/>
                </div>

	        </div>
		);
	}
});

export default BatchCreateLeavePage;