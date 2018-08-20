'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import ProjContext from '../../../ProjContext';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
import LevelSelect from '../../../../hr/lib/Components/LevelSelect';
import JobTreeSelect from '../../../../hr/lib/Components/JobTreeSelect';

import { Form, Modal, Button, Input, Select,Tabs,Col,Row,DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchOutStaff from '../../../lib/Components/SearchOutStaff';
var JobStore = require('../data/JobStore');
var JobActions = require('../action/JobActions');

var CreateJobPage = React.createClass({
	getInitialState : function() {
		return {
			jobSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			job: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(JobStore, "onServiceComplete"),ModalForm('job')],
	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	         this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              jobSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'userCost', desc:'结算单价', required: false, max: '32'},
			{id: 'empLevel', desc:'员工级别', required: false, max: '32'},
			{id: 'techLevel', desc:'技术级别', required: false, max: '32'},
			{id: 'manLevel', desc:'管理级别', required: false, max: '32'},
			{id: 'techUuid', desc:'技术岗位', required: false, max: '24'},
			{id: 'manUuid', desc:'管理岗位', required: false, max: '24'},
			{id: 'chgReason', desc:'原因', required: false, max: '1024'},
			{id: 'approver', desc:'审批人', required: false, max: '24'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'}
		];
		this.clear();
	},
	
	clear : function(){
		this.state.hints = {};
		this.state.job.uuid='';
		this.state.job.corpUuid = '';
		this.state.job.outUuid= ProjContext.selectedOutCorp.uuid;
	
		this.state.job.userCost='';
		this.state.job.empLevel='';
		this.state.job.techLevel='';
		this.state.job.manLevel='';
		this.state.job.techUuid='';
		this.state.job.manUuid='';
		this.state.job.chgReason='';
		this.state.job.approver='';
		this.state.job.effectDate='';
		
		if(this.refs.JobPage !== undefined){
			this.refs.JobPage.clear();
		}

		this.state.loading = false;
		this.state.jobSet.operation = '';
	    if( typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.job)){
			this.state.jobSet.operation = '';
			this.setState({loading: true});
			var job = this.state.job;
			job.corpUuid =  window.loginData.compUser.corpUuid;
			job.outUuid = ProjContext.selectedOutCorp.uuid;

			var techNode = this.refs.techUuidBox.getJobNode();
			if(techNode.jobName === null || techNode.jobName === '' || techNode.jobName === techNode.jobCode){
				job.techName = techNode.jobCode;
			}
			else{
				job.techName = techNode.jobCode+'('+techNode.jobName+')';
			}

			var manNode = this.refs.manUuidBox.getJobNode();
			if(manNode.jobName === null || manNode.jobName === '' || manNode.jobName === manNode.jobCode){
				job.manName = manNode.jobCode;
			}
			else{
				job.manName = manNode.jobCode+'('+manNode.jobName+')';
			}


			JobActions.createOutJob( job );
		}
	},

	goBack:function(){
        this.props.onBack();
    },

	 onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	onSelectOutStaff:function(data){
        this.state.job.userUuid = data.uuid;
		this.state.job.perName = data.perName;
		this.state.job.staffCode = data.staffCode;

        this.setState({
            user:data,
        })
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		const formItemLayout1 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		var corpUuid = window.loginData.compUser.corpUuid;


		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}></TabPane>
					<TabPane tab="增加岗位调整信息" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"16px 0 16px 8px", height: '100%',width:'100%',overflowY: 'auto'}}>
							<div style={{width:'100%', maxWidth:'600px'}}>
							<ServiceMsg ref='mxgBox' svcList={['out-job/create']}/>
							<SearchOutStaff style={{padding:'10px 0 16px 32px', width:'600px'}} corpUuid={corpUuid} showError={this.showError} onSelectStaff={this.onSelectOutStaff}/>	
								<Form layout={layout}>
									<Row>
										<Col span="12">
											<FormItem {...formItemLayout} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
												<Input type="text" name="staffCode" id="staffCode" value={this.state.job.staffCode } onChange={this.handleOnChange} disabled={true} />
											</FormItem>
										</Col>		
										<Col span="12">	
											<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
												<Input type="text" name="perName" id="perName" value={this.state.job.perName } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>		
									</Row>	
									<Row>
										<Col span="12">
											<FormItem {...formItemLayout} label="员工级别" required={true} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
												<LevelSelect  name="empLevel" id="empLevel" value={this.state.job.empLevel }  onSelect={this.handleOnSelected.bind(this, "empLevel")} />
											</FormItem>
										</Col>
										<Col span="12">	
											<FormItem {...formItemLayout} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.userCostHint} validateStatus={hints.userCostStatus}>
												<Input type="text" name="userCost" id="userCost" value={this.state.job.userCost } onChange={this.handleOnChange} />
											</FormItem>
										</Col>	
									</Row>	
									<Row>
										<Col span="12">		
											<FormItem {...formItemLayout} label="技术级别" required={false} colon={true} className={layoutItem} help={hints.techLevelHint} validateStatus={hints.techLevelStatus}>
												<Input type="text" name="techLevel" id="techLevel" value={this.state.job.techLevel } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="管理级别" required={false} colon={true} className={layoutItem} help={hints.manLevelHint} validateStatus={hints.manLevelStatus}>
												<Input type="text" name="manLevel" id="manLevel" value={this.state.job.manLevel } onChange={this.handleOnChange} />
											</FormItem>
										</Col>	
									</Row>	
									<Row>	
										<Col span="12">	
											<FormItem {...formItemLayout} label="技术岗位" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
												<JobTreeSelect ref="techUuidBox" type="text" name="techUuid" id="techUuid" value={this.state.job.techUuid } onSelect={this.handleOnSelected.bind(this, "techUuid")} />
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="管理岗位" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
												<JobTreeSelect ref="manUuidBox"  type="text" name="manUuid" id="manUuid" value={this.state.job.manUuid } onSelect={this.handleOnSelected.bind(this, "manUuid")} />
											</FormItem>
										</Col>	
									</Row>
									<Row>
											<FormItem {...formItemLayout1} label="调整原因" required={false} colon={true} className={layoutItem} help={hints.chgReasonHint} validateStatus={hints.chgReasonStatus}>
												<Input type="textarea" name="chgReason" id="chgReason" value={this.state.job.chgReason } onChange={this.handleOnChange} style={{height: '100px'}}/>
											</FormItem>
									</Row>
									<Row>	
										<Col span="12">			
											<FormItem {...formItemLayout} label="审批人" required={false} colon={true} className={layoutItem} help={hints.approverHint} validateStatus={hints.approverStatus}>
												<Input type="text" name="approver" id="approver" value={this.state.job.approver } onChange={this.handleOnChange} />
											</FormItem>
										</Col>
										<Col span="12">	
											<FormItem {...formItemLayout} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
												<DatePicker   style={{width:'100%'}} name="effectDate" id="effectDate"  value={this.formatDate(this.state.job.effectDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.dateFormat)}/>
											</FormItem>
										</Col>	
									</Row>
								</Form>
								<Form layout={layout}>
									<FormItem style={{textAlign:'right',padding:'4px 0'}} required={false} colon={true} className={layoutItem}>
										<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading} disabled={false}>保存</Button>{' '}
										<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
									</FormItem>
								</Form>	
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
});

export default CreateJobPage;

