import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Button, Icon, Input, DatePicker, Tabs, Col, Row, Spin, Upload } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio'; 
import EmailInput from '../../../lib/Components/EmailInput';
var ResumeStore = require('../data/ResumeStore');
var ResumeActions = require('../action/ResumeActions');

var ReviewPage = require('../Components/ReviewPage');
var OtherReviewPage = require('../Components/OtherReviewPage');
var ScoreTabPage = React.createClass({
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
			loading: false,
			resumeMsg:{},
			review:{},
			hints: {},
			validRules: [],
			reqUuid:'',
		}
	},
	mixins: [
			Reflux.listenTo(ResumeStore, "onServiceComplete"),
			ModalForm('resumeMsg')
	],

	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  this.setState({loading: false});
		  }
	  };
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
        	{id: 'perName', desc:'姓名', required: true, max: '24'},
			{id: 'gender', desc:'性别', required: false, max: '24'},
			{id: 'years', desc:'年龄', required: false, max: '24'},
			{id: 'induYear', desc:'工作年限', required: false, max: '24'},
			{id: 'eduDegree', desc:'学历', required: false, max: '24'},
			{id: 'eduCollege', desc:'学校', required: false, max: '24'},
			{id: 'profession', desc:'专业', required: false, max: '32'},
			{id: 'cityName', desc:'城市', required: false, max: '24'},
			{id: 'corpName', desc:'现公司', required: false, max: '24'},
			{id: 'titleName', desc:'现职位', required: false, max: '24'},
			{id: 'phoneno', desc:'电话', required: false, max: '24'},
			{id: 'email', desc:'电子邮件', required: false, max: '24'},
			// {id: 'lastWork', desc:'最近工作', required: false, max: '128'},
			// {id: 'introduce', desc:'自我评价', required: false, max: '128'},
			{id: 'reviewDate', desc:'面试日期', required: false, max: '24'},
			{id: 'induType', desc:'行业类型', required: false, max: '256'},
			{id: 'testDesc', desc:'笔试说明', required: false, max: '24'},
			{id: 'testScore', desc:'笔试评分', required: false, max: '24'},
			{id: 'refCheck', desc:'背景调查', required: false, max: '24'},
			{id: 'evaluate', desc:'综合评价', required: false, max: '24'},
        ];

		this.initPage( this.props.resumeMsg );
	},
	initPage: function(resumeMsg){
		var review=resumeMsg.review;
		this.setState({
			 resumeMsg:resumeMsg,
			 review:review,
			
		});
	},

	beforeUpload: function(file) {
		this.state.resume.docFile = file.name;
		this.state.resume.reqUuid = this.state.reqUuid;
		
		this.setState( {resumeFile: file} );
		return false;
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.resumeMsg)){
			this.setState({ loading: true });
            ResumeActions.updateResume(this.state.resumeMsg)
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
		var tabName=null;
		var staffCode=window.loginData.compUser.userCode;
		var reviewList = this.state.review;
		var page=[];
		var pageMine='';
		var has=true;
		if(reviewList != null){
			for(var i = 0;i<this.state.review.length;i++){
				var rvStaff = reviewList[i].rvStaff;
				var rvName = reviewList[i].rvName;
				if( staffCode != rvStaff ){
					// 员工号不相同 
					var tap=<TabPane tab={rvName+ "的评分"} key={i+3} style={{width: '100%', height: '100%'}}>
	                    <OtherReviewPage onBack={this.goBack} otherReview={reviewList[i]} type ={this.props.type} resumeMsg={this.state.resumeMsg}/>
	                </TabPane>
	             	 // 我的评分
	                var tapMine=<TabPane tab={"我的评分"} key={16} style={{width: '100%', height: '100%'}}>
	                    <ReviewPage onBack={this.goBack} review={null} type ={this.props.type} resumeMsg={this.state.resumeMsg} />
	                </TabPane>
					page.push(tap);
					has?pageMine=tapMine:null;
				}else if(staffCode===rvStaff){
					var tapMine=<TabPane tab={"我的评分"} key={16} style={{width: '100%', height: '100%'}}>
	                    <ReviewPage onBack={this.goBack} review={reviewList[i]} type ={this.props.type} resumeMsg={this.state.resumeMsg} />
	                </TabPane>
					pageMine=tapMine;
					has=false;
				}
			};
		}else{
			var tap=<TabPane tab={"我的评分"} key={14} style={{width: '100%', height: '100%'}}>
	                    <ReviewPage onBack={this.goBack} review={this.state.review} type ={this.props.type} resumeMsg={this.state.resumeMsg} />
	                </TabPane>
					page.push(tap)
		};
		var hints=this.state.hints;
		var form=(
			 <Form layout={layout} style={{margin:'12px 0 0 0'}}>
				<Row>
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
							<Input type="text" name="perName" id="perName" value={this.state.resumeMsg.perName } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                         <FormItem {...formItemLayout2} className={layoutItem} label='性别' colon={true} help={hints.genderHint} validateStatus={hints.genderStatus}>
                            <DictRadio name="gender" id="gender" value={this.state.resumeMsg.gender} appName='简历系统' optName='性别' onChange={this.onRadioChange} />
                        </FormItem>
                    </Col>
                </Row>
                 <Row>
                 	<Col span="12">
                       <FormItem {...formItemLayout2} label="年龄" required={false} colon={true} className={layoutItem} help={hints.yearsHint} validateStatus={hints.yearsStatus}>
							<Input type="text" name="years" id="years" value={this.state.resumeMsg.years } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="工作年限" required={false} colon={true} className={layoutItem} help={hints.induYearHint} validateStatus={hints.induYearStatus}>
							<Input type="text" name="induYear" id="induYear" value={this.state.resumeMsg.induYear } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    
                 </Row>
                  <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="城市" required={false} colon={true} className={layoutItem} help={hints.cityNameHint} validateStatus={hints.cityNameStatus}>
							<Input type="text" name="cityName" id="cityName" value={this.state.resumeMsg.cityName } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='学历' colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                            <DictSelect style={{ width: '100%' }} name="eduDegree" id="eduDegree" value={this.state.resumeMsg.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")} />
                        </FormItem>
                    </Col>
                 </Row>
				<Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="学校" required={false} colon={true} className={layoutItem} help={hints.eduCollegeHint} validateStatus={hints.eduCollegeStatus}>
						<Input type="text" name="eduCollege" id="eduCollege" value={this.state.resumeMsg.eduCollege } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="专业" required={false} colon={true} className={layoutItem} help={hints.professionHint} validateStatus={hints.professionStatus}>
							<Input type="text" name="profession" id="profession" value={this.state.resumeMsg.profession } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                 </Row>

                <Row>
                   
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="现公司" required={false} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
							<Input type="text" name="corpName" id="corpName" value={this.state.resumeMsg.corpName } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                     <Col span="12">
                        <FormItem {...formItemLayout2} label="现职位" required={false} colon={true} className={layoutItem} help={hints.titleNameHint} validateStatus={hints.titleNameStatus}>
							<Input type="text" name="titleName" id="titleName" value={this.state.resumeMsg.titleName } onChange={this.handleOnChange} />
						</FormItem>
					 </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="电话" required={false} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
							<Input type="text" name="phoneno" id="phoneno" value={this.state.resumeMsg.phoneno } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='电子邮箱' required={false} colon={true} help={hints.emailHint} validateStatus={hints.emailStatus}>
                            <EmailInput name="email" id="email" value={this.state.resumeMsg.email} onChange={this.emailOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="自我评价" required={false} colon={true} className={layoutItem} help={hints.introduceHint} validateStatus={hints.introduceStatus}>
					<Input type="textarea" name="introduce" id="introduce" value={this.state.resumeMsg.introduce } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="最近工作" required={false} colon={true} className={layoutItem} help={hints.lastWorkHint} validateStatus={hints.lastWorkStatus}>
					<Input type="textarea" name="lastWork" id="lastWork" value={this.state.resumeMsg.lastWork } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} className={layoutItem} label='行业类型' required={false} colon={true} className={layoutItem} help={hints.induTypeHint} validateStatus={hints.induTypeStatus}>
                            <DictSelect style={{ width: '100%' }} name="induType" id="induType" value={this.state.resumeMsg.induType} appName='招聘管理' optName='行业类型' onSelect={this.handleOnSelected.bind(this, "induType")} />
                 </FormItem>
                  <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="面试日期" required={false} colon={true} className={layoutItem} help={hints.reviewDateHint} validateStatus={hints.reviewDateStatus}>
							<DatePicker  style={{width:'100%'}}  name="reviewDate" id="reviewDate"  format={Common.dateFormat} value={this.formatDate(this.state.resumeMsg.reviewDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"reviewDate", Common.dateFormat)}/>
						</FormItem>
                    </Col>
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="笔试评分" required={false} colon={true} className={layoutItem} help={hints.testScoreHint} validateStatus={hints.testScoreStatus}>
						<Input type="text" name="testScore" id="testScore" value={this.state.resumeMsg.testScore } onChange={this.handleOnChange} />
					</FormItem>
                    </Col>
                </Row>
               <FormItem {...formItemLayout} label="笔试说明" required={false} colon={true} className={layoutItem} help={hints.testDescHint} validateStatus={hints.testDescStatus}>
					<Input type="textarea" name="testDesc" id="testDesc" value={this.state.resumeMsg.testDesc } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="背景调查" required={false} colon={true} className={layoutItem} help={hints.refCheckHint} validateStatus={hints.refCheckStatus}>
					<Input type="text" name="refCheck" id="refCheck" value={this.state.resumeMsg.refCheck } onChange={this.handleOnChange} />
				</FormItem>
				<FormItem {...formItemLayout} label="综合评价" required={false} colon={true} className={layoutItem} help={hints.evaluateHint} validateStatus={hints.evaluateStatus}>
					<Input type="textarea" name="evaluate" id="evaluate" value={this.state.resumeMsg.evaluate } onChange={this.handleOnChange} />
				</FormItem>
				 <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                </FormItem>
			</Form>
		);
		
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onChange={this.onTabChange}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="简历信息" key="2" style={{width: '100%', height: '100%'}}>
                      <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                        <div style={{padding:"8px",height: '100%',overflowY: 'auto'}} >
                          <div style={{width:'100%', maxWidth:'600px'}}>
				        	<ServiceMsg ref='mxgBox' svcList={['hr-resume-log/upload']}/>
				        	{form}
						  </div>
						</div>
					  </div>
                    </TabPane>
                    {page}
                    {pageMine}
                </Tabs>
	        </div>
		);
	}
});


module.exports = ScoreTabPage;