import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
import CodeMap from '../../../../hr/lib/CodeMap';
var Common = require('../../../../public/script/common');

import { Form, Button, Input, Select, Tabs, Row, Col, Spin, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
var ResMemberStore = require('../data/ResMemberStore.js');
var ResMemberActions = require('../action/ResMemberActions');
var ProjContext = require('../../../ProjContext');

var CreateResMemberPage = React.createClass({
	getInitialState : function() {
		return {
			resMemberSet: {
				empJob : {},
				errMsg : ''
			},
			loading: false,
			resMember: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), ModalForm('resMember'),CodeMap()],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieveEmpJob'){
		  this.state.resMember.empLevel = data.empJob.empLevel;
		  this.state.resMember.techLevel = data.empJob.techLevel;
		  this.state.resMember.manLevel = data.empJob.manLevel;
		  this.state.resMember.techUuid = data.empJob.techUuid;
		  this.state.resMember.techName = data.empJob.techName;
		  this.state.resMember.manUuid = data.empJob.manUuid;
		  this.state.resMember.manName = data.empJob.manName;
		  this.state.resMember.manType = (data.empJob.empType == '员工') ? '员工' : '实习';
          this.state.resMember.resStatus = '资源池';

		  this.setState({
             loading: false,
             resMemberSet: data,
          });

	  }else if(data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              resMemberSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'userCost', desc:'核算成本', required: false, max: '32'},
			{id: 'beginDate', desc:'入池日期', required: true, max:'24'},
            {id: 'beginHour', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
		];
	},
	
	clear : function(){
		this.state.hints = {};
		this.state.resMember = {};

		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

    onSelectEmpLoyee: function (data) {
        var member = this.state.resMember;
        member.poolUuid = ProjContext.selectedPool.uuid;
        member.corpUuid = window.loginData.compUser.corpUuid;
		member.teamUuid = this.props.team.uuid;
        member.userUuid = data.uuid;
		member.userId = data.userId;
		member.staffCode = data.staffCode;
		member.perName = data.perName;
		member.deptName = data.deptName;
		member.baseCity = data.baseCity;
        member.phoneno = data.phoneno;
        member.email = data.email;
		member.eduDegree = data.eduDegree;
		member.eduCollege = data.eduCollege;
		member.workYears = data.workYears;
        member.workBegin = ProjContext.calcBeginMonth(data.entryDate, data.workYears);
		member.induYears = data.induYears;
        member.induBegin = ProjContext.calcBeginMonth(data.entryDate, data.induYears);
		member.beginDate = Common.getToday() + '';
		
		member.poolCode = ProjContext.selectedPool.poolCode;
		member.poolName = ProjContext.selectedPool.poolName;
        member.poolLoc = '';
        member.status = '在岗';
        member.resLoc = data.baseCity;

		member.beginDate = Common.getToday()+'';
        member.beginHour = '09:00';

        this.setState({loading:true});
		ResMemberActions.retrieveEmpJob(data.uuid);
    },
	showError : function(data){
        console.log(data)
    },
    
    onClickSave: function () {
        var member = this.state.resMember;
        member.resUuid = member.poolUuid;
        member.resName = member.poolName;
        member.resDate = member.beginDate;
        member.resHour = member.beginHour;
        
		this.setState({ loading: true });
        ResMemberActions.createResMember(member );
	},

	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function() {
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

		var hints=this.state.hints;
        var boo = this.state.resMember.userUuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;

		var obj = this.state.resMember;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
		var form = 
			<Form layout={layout} style={{width:'600px'}}>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工编号" className={layoutItem}>
							<Input type="text" name="staffCode" id="staffCode" value={this.state.resMember.staffCode } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="姓名" className={layoutItem}>
							<Input type="text" name="perName" id="perName" value={this.state.resMember.perName } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="任职部门" className={layoutItem}>
							<Input type="text" name="deptName" id="deptName" value={this.state.resMember.deptName } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="归属地" className={layoutItem}>
							<Input type="text" name="baseCity" id="baseCity" value={this.state.resMember.baseCity } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="人员类型" className={layoutItem}>
							<Input type="text" name="manType" id="manType" value={this.state.resMember.manType } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="电话" className={layoutItem}>
							<Input type="text" name="phoneno" id="phoneno" value={this.state.resMember.phoneno } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="最高学历" className={layoutItem}>
							<Input type="text" name="eduDegree" id="eduDegree" value={this.state.resMember.eduDegree } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="毕业院校" className={layoutItem}>
							<Input type="text" name="eduCollege" id="eduCollege" value={this.state.resMember.eduCollege } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="工龄" className={layoutItem}>
							<Col span='11'>
								<Input type="text" name="workYears_1" id="workYears_1" value={workYears.y} addonAfter ="年" onChange={this.handleOnChange2} disabled={true} />
							</Col>
							<Col span='2'>
							</Col>
							<Col span='11'>
								<Input type="text" name="workYears_2" id="workYears_2" value={workYears.m} addonAfter ="月" onChange={this.handleOnChange2} disabled={true} />
							</Col>
				
						</FormItem>
					</Col>
					<Col span="12">
                        <FormItem {...formItemLayout2} label="行业经验" className={layoutItem}>
							<Col span='11'>
								<Input type="text" name="induYears_1" id="induYears_1" value={induYears.y} addonAfter ="年" onChange={this.handleOnChange2} disabled={true} />
							</Col>
							<Col span='2'>
							</Col>
							<Col span='11'>
								<Input type="text" name="induYears_2" id="induYears_2" value={induYears.m} addonAfter ="月" onChange={this.handleOnChange2} disabled={true} />
							</Col>
						
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工级别" className={layoutItem}>
							<Input type="text" name="empLevel" id="empLevel" value={this.getLevelName(corpUuid, this.state.resMember.empLevel) } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="技术级别" className={layoutItem}>
							<Input type="text" name="techLevel" id="techLevel" value={this.state.resMember.techLevel } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="管理级别" className={layoutItem}>
							<Input type="text" name="manLevel" id="manLevel" value={this.state.resMember.manLevel } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="技术岗位" className={layoutItem}>
							<Input type="text" name="techUuid" id="techUuid" value={this.state.resMember.techName } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="管理岗位" className={layoutItem}>
							<Input type="text" name="manUuid" id="manUuid" value={this.state.resMember.manName } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="入池日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
							<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.resMember.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="时间" required={true} colon={true} className={layoutItem} help={hints.beginHourHint} validateStatus={hints.beginHourStatus}>
							<Input type="text" name="beginHour" id="beginHour" value={this.state.resMember.beginHour} onChange={this.handleOnChange}/>
						</FormItem>
					</Col>
				</Row>
				<FormItem {...formItemLayout} label="核算成本" required={false} colon={true} className={layoutItem} help={hints.userCost} validateStatus={hints.userCost} >
					<Input type="text" name="userCost" id="userCost" value={this.state.resMember.userCost} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
					<Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
					<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
				</FormItem>
			</Form>;

	    return (
            <div style={{ padding: "8px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['res-member/create']} />
                <SearchEmployee style={{ padding: '10px 0 16px 32px', width: '600px' }} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee} />
                {
                    this.state.loading ? <Spin>{form}</Spin> : form
                }
            </div>
	    );
    }
}); 

export default CreateResMemberPage;