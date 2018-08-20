﻿'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker, Spin} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import BatchCreateEmpJobPage from './BatchCreateEmpJobPage';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import SearchEmployee from '../../lib/Components/SearchEmployee';
import DictSelect from '../../../lib/Components/DictSelect';
import LevelSelect from '../../lib/Components/LevelSelect';
import JobTreeSelect from '../../lib/Components/JobTreeSelect';

var EmployeeJobStore = require('../data/EmployeeJobStore');
var EmpJobStore = require('../data/EmpJobStore');
var EmpJobActions = require('../action/EmpJobActions');


var CreateEmpJobPage = React.createClass({
	getInitialState : function() {
        return {
            afterChange: this.afterChange,
			empJobSet: {
				operation : '',
				errMsg : ''
			},
            loading: false,
            jobLoading: false,  // 查询最新数据
			empJob:{},
			user:{},
			hints: {},
			validRules:[],
			datas:{},
		}
	},

	mixins: [Reflux.listenTo(EmployeeJobStore, "onServiceComplete"), 
	    Reflux.listenTo(EmpJobStore, "onServiceComplete2"),
	    ModalForm('empJob')],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
				this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              empJobSet: data
	          });
	      }
	  }
	},

    onServiceComplete2: function (data) {
        // console.log('data.recordSet', data.recordSet);
        if (data.recordSet !== null && data.recordSet.length > 0) {
            var empJob = data.recordSet[0];

            this.state.empJob.techLevel = empJob.techLevel;
            this.state.empJob.manLevel = empJob.manLevel;
            this.state.empJob.empType = empJob.empType;
            this.state.empJob.empLevel = empJob.empLevel;
            this.state.empJob.techUuid = empJob.techUuid;
            this.state.empJob.manUuid = empJob.manUuid;
        }

        this.setState({
            jobLoading: false,
        });
	},
    
	// 第一次加载
    componentDidMount : function(){
		this.state.validRules = [
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'empLevel', desc:'员工级别', required: false, max: '0'},
			{id: 'techLevel', desc:'技术级别', required: false, max: '0'},
			{id: 'manLevel', desc:'管理级别', required: false, max: '0'},
			{id: 'manUuid', desc:'管理岗位', required: false, max: '24'},
			{id: 'techUuid', desc:'技术岗位', required: false, max: '24'},
			{id: 'empType', desc:'员工类型', required: false, max: '32'},
			{id: 'approver', desc:'审批人', required: false, max: '24'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'chgReason', desc:'原因', required: false, max: '1024'},
			{id: 'deptName', desc:'部门', required: false, max: '0'},
		];

       this.clear();
    },
	componentWillReceiveProps:function(newProps){
		// this.clear();
	},
	clear : function(){
		this.state.hints = {};
		this.state.empJob.uuid='';
		this.state.empJob.corpUuid = window.loginData.compUser.corpUuid;
		this.state.empJob.userUuid = '';

		this.state.empJob.staffCode = '';
		this.state.empJob.perName='';
		this.state.empJob.empLevel='';
		this.state.empJob.techLevel='';
		this.state.empJob.manLevel='';
		this.state.empJob.manUuid='';
		this.state.empJob.techUuid='';
		this.state.empJob.empType='';
		this.state.empJob.approver='';
		this.state.empJob.effectDate='';
		this.state.empJob.chgReason='';
		this.state.empJob.deptName='';
	},

	onSelectEmpLoyee:function(data){
        this.state.empJob.userUuid = data.uuid;
		this.state.empJob.staffCode = data.staffCode;
        this.state.empJob.perName = data.perName;
        this.state.empJob.deptName = data.deptName;

        // 查询最新数据
        var corpUuid = window.loginData.compUser.corpUuid;
        var filter = { corpUuid: corpUuid, staffCode: data.staffCode };
        EmpJobActions.addHrEmpJob(filter);

        this.setState({
            jobLoading: true,
            user:data,
        });
    },

	showError:function(data){
		console.log(data)
	},

	onClickSave : function(){
		this.setState({ loading: true });
		var empJob = this.state.empJob;

		var techNode = this.refs.techUuidBox.getJobNode();
        // console.log('techNode',techNode)
		if(techNode.jobName === null || techNode.jobName === '' || techNode.jobName === techNode.jobCode){
			empJob.techName = techNode.jobCode;
		}
		else{
            // empJob.techName = techNode.jobCode + '(' + techNode.jobName + ')';
            empJob.techName = techNode.jobName;
		}

		var manNode = this.refs.manUuidBox.getJobNode();
		if(manNode.jobName === null || manNode.jobName === '' || manNode.jobName === manNode.jobCode){
			empJob.manName = manNode.jobCode;
		}
		else{
            // empJob.manName = manNode.jobCode + '(' + manNode.jobName + ')';
            empJob.manName = manNode.jobName;
		}

		EmpJobActions.createHrEmpJob( empJob );
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },
    afterChange: function (id, value) {
        if (id === 'techUuid') {
            var empJob = this.state.empJob;
            //if (!empJob.techLevel) {
                var techNode = this.refs.techUuidBox.getJobNode(value);
                empJob.techLevel = techNode.jobCode;
            //}
        }
        else if (id === 'manUuid') {
            var empJob = this.state.empJob;
            //if (!empJob.manLevel) {
                var manNode = this.refs.manUuidBox.getJobNode(value);
                empJob.manLevel = manNode.jobCode;
            //}
        }
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var boo = this.state.empJob.userUuid? false : true ;
		var hints = this.state.hints;
        var corpUuid = window.loginData.compUser.corpUuid;

        var form = (
            <Form layout={layout} style={{ width: '600px' }} >
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} >
                            <Input type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode} disabled={true} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} >
                            <Input type="text" name="perName" id="perName" disabled={true} value={this.state.user.perName} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} >
                            <Input type="text" name="deptName" id="deptName" disabled={true} value={this.state.user.deptName} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工类型" required={false} colon={true} className={layoutItem} help={hints.empTypeHint} validateStatus={hints.empTypeStatus}>
                            <DictSelect name="empType" id="empType" value={this.state.empJob.empType} appName='HR系统' optName='员工类型' onSelect={this.handleOnSelected.bind(this, "empType")} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="员工级别" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
                            <LevelSelect ref="empLevelBox" name="empLevel" id="empLevel" value={this.state.empJob.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="技术岗位" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
                            <JobTreeSelect ref="techUuidBox" name="techUuid" id="techUuid" value={this.state.empJob.techUuid} onSelect={this.handleOnSelected.bind(this, "techUuid")} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="技术级别" required={false} colon={true} className={layoutItem} help={hints.techLevelHint} validateStatus={hints.techLevelStatus}>
                            <Input type="text" name="techLevel" id="techLevel" value={this.state.empJob.techLevel} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="管理岗位" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
                            <JobTreeSelect ref="manUuidBox" name="manUuid" id="manUuid" value={this.state.empJob.manUuid} onSelect={this.handleOnSelected.bind(this, "manUuid")} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="管理级别" required={false} colon={true} className={layoutItem} help={hints.manLevelHint} validateStatus={hints.manLevelStatus}>
                            <Input type="text" name="manLevel" id="manLevel" value={this.state.empJob.manLevel} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="调整原因" required={false} colon={true} className={layoutItem} help={hints.chgReasonHint} validateStatus={hints.chgReasonStatus}>
                    <Input type="textarea" name="chgReason" id="chgReason" value={this.state.empJob.chgReason} onChange={this.handleOnChange} />
                </FormItem>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approverHint} validateStatus={hints.approverStatus}>
                            <Input type="text" name="approver" id="approver" value={this.state.empJob.approver} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
                            <DatePicker style={{ width: '100%' }} name="effectDate" id="effectDate" value={this.formatDate(this.state.empJob.effectDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "effectDate", Common.dateFormat)} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                </FormItem>
            </Form>
        );

		return (
	        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
	            <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
	                <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
	                </TabPane>
	                <TabPane tab="增加岗位调整信息" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
							<ServiceMsg ref='mxgBox' svcList={['hr_emp_job/create']}/>
							<SearchEmployee style={{padding:'10px 0 16px 32px', width:'600px'}} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee} />
                            {this.state.jobLoading ? <Spin>{form}</Spin> : form}
	                    </div>
	                </TabPane>
                    <TabPane tab="批量调整岗位信息" key="3" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <BatchCreateEmpJobPage/>
                    </TabPane>
            	</Tabs>
        	</div>
		);
	}
});

module.exports = CreateEmpJobPage;
