import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ProjContext from '../../../ProjContext';
import CodeMap from '../../../../hr/lib/CodeMap';

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var DispOrderStore = require('../data/DispOrderStore');
var DispOrderActions = require('../action/DispOrderActions');
import SearchResMember from '../../../lib/Components/SearchResMember';

var UpdateProjMemberPage = React.createClass({
	getInitialState : function() {
		return {
			projMemberSet: {
				errMsg : ''
			},
			loading: false,
			projMember: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(DispOrderStore, "onServiceComplete"), ModalForm('projMember'), CodeMap()],
	onServiceComplete: function(data) {
		if(data.operation === 'retrieveResMeb'){
			if(data.dispMeb) {
				this.state.projMember.eduDegree = data.dispMeb.eduDegree;
		  		this.state.projMember.baseCity = data.dispMeb.baseCity;
		  		this.state.projMember.deptName = data.dispMeb.deptName;
		  		this.state.projMember.eduCollege = data.dispMeb.eduCollege;
		  		this.state.projMember.eduDegree = data.dispMeb.eduDegree;
				this.state.projMember.induBegin = data.dispMeb.induBegin;
				this.state.projMember.phoneno = data.dispMeb.phoneno;
				this.state.projMember.workBegin = data.dispMeb.workBegin;
				this.state.projMember.userLevel = data.dispMeb.empLevel;
				this.state.projMember.techUuid = data.dispMeb.techUuid;
				this.state.projMember.manUuid = data.dispMeb.manUuid;
				this.state.projMember.techName = data.dispMeb.techName;
				this.state.projMember.manName = data.dispMeb.manName;
				this.state.projMember.userCost = data.dispMeb.userCost;
		  
		  		this.setState({
             		loading: false,
             		projMemberSet: data,
          		});
			}
	  } else if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  projMemberSet: data
			  });
		  }
	  }
	},


	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'userPrice', desc: '结算单价', required: true, max: '24' },
			{ id: 'dispLoc', desc: '出发地', required: false, max: '24' },
			{ id: 'projLevel', desc: '客户定级', required: true, max: '24' },
			{ id: 'planDate', desc: '考勤开始日期', required: true, max: '24' },
           	{ id: 'planTime', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];
		this.initPage( this.props.projMember);
	},

	initPage: function(projMember){
		Utils.copyValue(projMember, this.state.projMember);
		this.setState( {loading: false, hints: {}});
        this.state.projMember.beginDate = Common.getToday()+'';
        this.state.projMember.beginTime = '09:00';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
		 DispOrderActions.retrieveResMeb(this.props.projMember.staffCode);
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projMember)){
            this.state.projMember.grpUuid = ProjContext.selectedDispProj.parentUuid;
			DispOrderActions.updateDispOrder( this.state.projMember );
		}
	},

	goBack:function(){
        this.props.onBack();
    },

	 onTabChange:function(activeKey){
        if(activeKey === '1'||activeKey === '2'){
            this.props.onBack(activeKey);
        }
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		var hints=this.state.hints;
		var corpUuid = window.loginData.compUser.corpUuid;
		var dispType = this.state.projMember.dispType === undefined ? '1' : this.state.projMember.dispType;
        var workYears = ProjContext.getDisplayWorkYears(this.state.projMember.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(this.state.projMember.induBegin);
		var userLevel = this.getLevelName(corpUuid, this.state.projMember.userLevel);
		
	    return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="5"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" disabled='true' style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="调度指令" key="2" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="人员筹备" key="3" disabled='true' style={{ width: '100%', height: '100%' }}>
                    </TabPane>
					<TabPane tab="项目组成员" key="4"  disabled='true' style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="人员调度修改" key="5" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['proj-disp/update','proj-disp/retrieveMember']}/>
							<Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="员工编号" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="staffCode" id="staffCode" value={this.state.projMember.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="perName" id="perName" value={this.state.projMember.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="任职部门" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="deptName" id="deptName" value={this.state.projMember.deptName } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="baseCity" id="baseCity" value={this.state.projMember.baseCity } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="人员类型" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="manType" id="manType" value={this.state.projMember.manType } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="电话" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="phoneno" id="phoneno" value={this.state.projMember.phoneno } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="最高学历" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="eduDegree" id="eduDegree" value={this.state.projMember.eduDegree } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="毕业院校" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="eduCollege" id="eduCollege" value={this.state.projMember.eduCollege } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="工龄" required={false} colon={true} className={layoutItem}>
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
                                        <FormItem {...formItemLayout} label="行业经验" required={false} colon={true} className={layoutItem}>
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
										<FormItem {...formItemLayout} label="人员级别" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="userLevel" id="userLevel" value={userLevel} disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="成本" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="userCost" id="userCost" value={this.state.projMember.userCost } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="技术级别" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="techLevel" id="techLevel" value={this.state.projMember.techLevel } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="管理级别" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="manLevel" id="manLevel" value={this.state.projMember.manLevel } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="技术岗位" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="techUuid" id="techUuid" value={this.state.projMember.techName } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="管理岗位" required={false} colon={true} className={layoutItem}>
											<Input type="text" name="manUuid" id="manUuid" value={this.state.projMember.manName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="客户定级" required={true} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
											<Input type="text" name="projLevel" id="projLevel" value={this.state.projMember.projLevel} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="结算单价" required={true} colon={true} className={layoutItem} help={hints.userPriceHint} validateStatus={hints.userPriceStatus}>
											<Input type="text" name="userPrice" id="userPrice" value={this.state.projMember.userPrice} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="派遣类型" required={false} colon={true} className={layoutItem}>
											<DictRadio name="dispType" id="dispType" value={dispType} appName='项目管理' optName='派遣类型' onChange={this.onRadioChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="出发地" required={false} colon={true} className={layoutItem} help={hints.dispLocHint} validateStatus={hints.dispLocStatus}>
											<Input type="text" name="dispLoc" id="dispLoc" value={this.state.projMember.dispLoc} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout} label="考勤开始日期" required={true} colon={true} className={layoutItem} help={hints.planDateHint} validateStatus={hints.planDateStatus}>
											<DatePicker style={{width:'100%'}} name="planDate" id="planDate"  format={Common.dateFormat} value={this.formatDate(this.state.projMember.planDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"planDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="时间" required={true} colon={true} className={layoutItem} help={hints.planTimeHint} validateStatus={hints.planTimeStatus}>
											<Input type="text" name="planTime" id="planTime" value={this.state.projMember.planTime} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
									<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
								</FormItem>
							</Form>;
                        </div>
                    </TabPane>
                </Tabs>
	        </div>
	    );
	}
});

export default UpdateProjMemberPage;

