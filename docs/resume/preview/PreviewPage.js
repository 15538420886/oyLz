'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import { withRouter, browserHistory } from 'react-router'
import Context from '../resumeContext';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Upload, Form, Input, Row, Col} from 'antd';
const FormItem = Form.Item;
var Common = require('../../public/script/common');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import DictRadio from '../../lib/Components/DictRadio';
var ResumeStore = require('../resume/data/ResumeStore');
var ResumeActions = require('../resume/action/ResumeActions');
var Utils = require('../../public/script/utils');

var PreviewPage2 = React.createClass({
	getInitialState : function() {
		return {
			homeSet: {
				person: {},
				resumeID: '',
				operation:'',
				errMsg: ''
			},
			radioValue:'',
			fileList: [],
			fileName:'',
			moreFilter:false,
		}
	},
	handleGo : function(path)
	{
		this.props.router.push({
		pathname: path,
		state: { fromDashboard: true }
		});
	},

	mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		
		if(data.operation!=="noResume"){
			this.setState({
				loading: false,
				homeSet: data
			});
		}
	},
	componentDidMount : function(){
		var app=Context.resumeApp;
		var userId=this.props.userId;
		this.setState({loading: true});
		if(app.id){
			ResumeActions.getResumeByID(app.id);
		}else{
			var id = window.loginData.authUser.userId;
			ResumeActions.getResumeByIdCode(id);
			if(userId){
				ResumeActions.getResumeByIdCode(userId);
			}
		}
	},

	uploadComplete: function(errMsg){
		this.setState({loading: false});
		if(errMsg !== ''){
			Common.errMsg(errMsg)
		}
	},

	handleUpload: function(file) {
		// 提交请求
		const { fileList } = this.state;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('files[]', file);
		});

		var obj = Context.resumeApp.idCode;
		if( this.state.radioValue ==='智联个人'){
			// 个人上传
			var url = Utils.resumeUrl+'resPerson/create-resume'
		}else{
			// 企业上传
			var url = Utils.resumeUrl+'resPerson/create-resume2'
		}
		
		var self = this;
		Utils.doUploadService(url, obj, fileList).then(function (result) {
			var errMsg = '';
			var resData = null;
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				resData = result.object;
				var idCode = result.object.idCode;
				ResumeActions.getResumeByIdCode(idCode);
			}
			else{
				errMsg = "导入数据错误["+result.errCode+"]["+result.errDesc+"]";
			}
			self.uploadComplete(errMsg, resData);
		}, function(value){
			var errMsg = "上传文件错误";
			self.uploadComplete(errMsg, null);
		});
		return false;	
	},

	beforeUpload: function(file) {
		this.state.fileName = file.name;
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
	},

	onRadioChange: function(e){
		var radioValue = e.target.value;
		this.state.radioValue = radioValue;
	},

	openUpload: function(e){
		this.setState({moreFilter: !this.state.moreFilter});
	},

	cancelUpload: function(){
		this.state.moreFilter = false;
		this.setState({moreFilter:this.state.moreFilter});
	},

	render : function() {
		var person = this.state.homeSet.person;
		var moreFilter = this.state.moreFilter;

		// 个人介绍
		var introListMap = person.introList? person.introList : [];
		const introList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								introListMap.map((item, i) => {
									return <div className="introList">
												<div className="tdPdl"   >{item.introName}</div>
												<p className="rightContent">{item.intro}</p>
											</div>
								})
							}</tbody></table></dd>
		);
		// 个人评价
		var reviewListMap = person.reviewList? person.reviewList : [];
		const reviewList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{

								reviewListMap.map((item, i) => {
									return <div>
												<div className="tdPdl">{item.reName}</div>
												<div className="rightContent"><p>{item.review}</p></div>
											</div>
								})

							}</tbody></table></dd>
		);
		// 其他信息
		var otherListMap = person.otherList? person.otherList : [];
		const otherList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								otherListMap.map((item, i) => {
									return <tr className="otherList">
												<td className="tdPdl"  >{item.infoType}</td>
												<td>{item.infoData1}</td>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 教育背景
		var eduListMap = person.eduList? person.eduList : [];
		const eduList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								eduListMap.map((item, i) => {
									return <tr style={{height:'60px',lineHeight:'60px'}}>
												<td className="tdPdl"  >{item.schName}</td>
												<td style={{width: '15%'}}>{item.deptName}</td>
												<td style={{width: '15%'}}>{item.qualName}</td>
												<td style={{width: '15%'}}>{item.studType}</td>
												<td style={{width: '15%'}}>{item.beginDate +" ~ "+ item.endDate}</td>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 工作经历
		var peCompListMap = person.peCompList? person.peCompList : [];
		const peCompList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								peCompListMap.map((item, i) => {
									return <tr className="peCompList">
												<div className="rightContent">
													<p><b style={{fontSize:'14px'}}>{item.compName}</b><span className="ant-divider" />{item.compLoc}</p>
													<p>{item.beginDate +" ~ "+item.endDate}</p>
													<p>{item.deptName}<span className="ant-divider" />{item.workRole}<span className="ant-divider" />汇报对象：{item.director}<span className="ant-divider" />下属员工：{item.subCount}</p>
													<p><label>工作内容：</label><div>{item.workCont}</div></p>
													<p><label>工作业绩：</label><div>{item.achieve}</div></p>
													<p><label>离职原因：</label><div>{item.leavReason}</div></p>
													<p><label className="inline">见证人：</label><p><span>{item.witness}</span><span style={{marginLeft:'10px'}}>{item.wPhone}</span></p></p>
												</div>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 项目经历
		var peProjListMap = person.peProjList? person.peProjList : [];
		const peProjList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								peProjListMap.map((item, i) => {
									return <tr className="peProjList">
												<div className="rightContent">
													<p><b style={{fontSize:'14px'}}>{item.beginDate +" ~ "+item.endDate +"   "}{item.projName}</b><span className="ant-divider" />{item.projRole}<span className="ant-divider" />{item.language}</p>
													<p>{item.custName}<span className="ant-divider" /><p>{item.custType}</p></p>
													<p><label>技术架构：</label><div>{item.framework}</div></p>
													<p><label>技能要求：</label><div>{item.skills}</div></p>
													<p><label>项目简介：</label><div>{item.projDesc}</div></p>
													<p><label>项目内容：</label><div>{item.workCont}</div></p>
													<p><label className="inline">见证人：</label><p><span>{item.witness}</span><span style={{marginLeft:'10px'}}>{item.wPhone}</span></p></p>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 培训经历
		var trainListMap = person.trainList? person.trainList : [];
		const trainList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								trainListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
												<p>{item.beginDate +" ~ "+item.endDate}</p>
													<p>{item.trainComp}<span className="ant-divider" />{item.trainCourse}<span className="ant-divider" />{item.trainType}<span className="ant-divider" />{item.trainCert}</p>
													<p>{item.trainCont}</p>
												</div>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 开发技能
		var techSkillListMap = person.techSkillList? person.techSkillList : [];
		const techSkillList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								techSkillListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.skName}</td>
													<td className="rightContent">
														<p>{item.skLevel}<span className="ant-divider" />{item.skTime}<span className="ant-divider" />{item.skHonor}</p>
													</td>
												</div>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 项目技能
		var projSkillListMap = person.projSkillList? person.projSkillList : [];
		const projSkillList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								projSkillListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.skName}</td>
													<td className="rightContent">
														<p>{item.skType}<span className="ant-divider" />{item.skLevel}<span className="ant-divider" />{item.skTime}<span className="ant-divider" />{item.skHonor}</p>
														<p>{item.custNames}</p>
														<p>{item.skDesc}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 证书
		var certListMap = person.certList? person.certList : [];
		const certList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								certListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.certName}</td>
													<td className="rightContent">
														<p>{item.endDate}<span className="ant-divider" />{item.certScore}</p>
														<p>{item.certDesc}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 语言能力
		var langListMap = person.langList? person.langList : [];
		const langList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								langListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.langName}</td>
													<td className="rightContent">
														<p>听说：{item.oralLevel}<span className="ant-divider" />读写：{item.readLevel}<span className="ant-divider" />{item.workLang}<span className="ant-divider" />{item.studyLang}</p>
														<p>证书：{item.langCert}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 其他技能
		var otherSkillListMap = person.otherSkillList? person.otherSkillList : [];
		const otherSkillList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								otherSkillListMap.map((item, i) => {
									return <tr className="otherSkillList">
												<div className="rightContent">
													<p>{item.skName}</p>
													<p>{item.skLevel}<span className="ant-divider" />{item.skTime}</p>
													<p className="normal">{item.skHonor}</p>
												</div>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 奖学金
		var honorListMap = person.honorList? person.honorList : [];
		const honorList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								honorListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.schName}</td>
													<td className="rightContent">
														<p>{item.hoLevel+"/"+item.hoLevel2}<span className="ant-divider" />{item.endDate}</p>
														<p>{item.hoDesc}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 在校奖励
		var honor2ListMap = person.honor2List? person.honor2List : [];
		const honor2List = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								honor2ListMap.map((item, i) => {
									return <tr>
										<div className="boxAlign">
												<td className="tdPdl">{item.schName}</td>
												<td className="rightContent">
													<p>{item.hoLevel}<span className="ant-divider" />{item.endDate}</p>
													<p>{item.hoDesc}</p>
												</td>
											</div>
										</tr>
								})
							}</tbody></table></dd>
		);
		// 奖励记录
		var workHonorListMap = person.workHonorList? person.workHonorList : [];
		const workHonorList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								workHonorListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.hoName}</td>
													<td className="rightContent">
														<p>{item.hoLevel}<span className="ant-divider" />{item.beginDate}</p>
														<p>{item.memo2}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 学校实践
		var pracListMap = person.pracList? person.pracList : [];
		const pracList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								pracListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.pracName}</td>
													<td className="rightContent">
														<p>{item.beginDate} ~ {item.endDate}</p>
														<p>{item.pracDesc}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 开源作品
		var wsProjListMap = person.wsProjList? person.wsProjList : [];
		const wsProjList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								wsProjListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.projName}</td>
													<td className="rightContent">
														<p>项目简介：{item.projDesc}</p>
														<p>个人职责：{item.workCont}</p>
														<p>{item.projUrl}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);
		// 公开论文
		var wsThesisListMap = person.wsThesisList? person.wsThesisList : [];
		const wsThesisList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								wsThesisListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.title}</td>
													<td className="rightContent">
														<p>{item.journal}<span className="ant-divider" />{item.isbn}<span className="ant-divider" />{item.honor}</p>
														<p>论文摘要：{item.summary}</p>
														<p>参与内容：{item.workCont}</p>
														<p>{item.thesisUrl}</p>
													</td>
												</div>
											</tr>
								})

							}</tbody></table></dd>
		);
		// 网上作品
		var wsIssueListMap = person.wsIssueList? person.wsIssueList : [];
		const wsIssueList = (<dd><table style={{width:'100%',tableLayout:'fixed'}}><tbody>
							{
								wsIssueListMap.map((item, i) => {
									return <tr>
												<div className="boxAlign">
													<td className="tdPdl">{item.title}</td>
													<td className="rightContent">
														<p>{item.summary}</p>
														<p>{item.issueUrl}</p>
													</td>
												</div>
											</tr>
								})
							}</tbody></table></dd>
		);

		var layout='vertical';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
			labelCol: ((layout=='horizontal') ? null : {span: 3}),
			wrapperCol: ((layout=='horizontal') ? null : {span: 19}),
		};

		return (
			<div style={{width: '100%', height:'100%', overflow:'auto'}}>
			<div style={{width: '980px',margin:'20px auto', padding:'0 20px'}}>
                <div className="summary" ng-cloak ng-if="person.peName">
					<p className="align-right">
						{person.gender}<span className="ant-divider" />{person.bhDate }<span className="ant-divider" />户口：{person.hkLoc}<span className="ant-divider" />现居住于：{person.hkLoc}
					</p>
					<p className="align-right">
						{person.workDate}开始工作<span className="ant-divider" />{person.workYears}
					</p>
					<p className="align-right">
						{person.country}<span className="ant-divider" />{person.marital}<span className="ant-divider" />{person.national}<span className="ant-divider" />{person.political}
					</p>
					<p className="align-right">
						{person.phoneNo}
					</p>
					<p className="align-right">
						{person.email}
					</p>
					<h1>{person.peName}						
						<a href="#" className="revise" style={{marginTop:'6px'}} onClick={this.handleGo.bind(this, '/resume2/ResumePage/')} title='修改个人信息'><Icon type={Common.iconUpdate}/></a>	
						<a style={{float:'right'}}  title="导入简历" onClick={this.openUpload} moreFilter={moreFilter}>
							<Icon style={{fontSize:'13px',color:'blue'}} type="upload"  />
						</a>			
					</h1>
					<div style={{width:'600px',margin:'60px auto 20px',border:'1px solid #ccc',paddingLeft:'50px'}} hidden={(moreFilter) ? false : true}>
						<b style={{fontSize:'16px',display:'block',margin:'20px 0 20px -22px'}}>上传个人简历</b>	
						<Form layout={layout}>
							<FormItem {...formItemLayout} label="简历来源:" colon={true} >
								<DictRadio layout='vertical' appName='简历系统' optName='简历文件来源' onChange={this.onRadioChange}/>
							</FormItem>
							<FormItem {...formItemLayout} label="人员文件:" colon={true} >
								<div>
									<Input type="text" value={this.state.fileName} style={{width:'274px'}} />
									<Upload beforeUpload={this.beforeUpload} style={{marginLeft:'6px'}}>
										<Button>
											<Icon type="upload" /> 选择文件
										</Button>
									</Upload>
								</div>
							</FormItem>
							<FormItem style={{textAlign:'right',width:'456px',margin:'4px 0 16px'}} required={false} colon={true} className={layoutItem}>
								<Button style={{marginRight:'6px'}} size="middle" type="primary" onClick={this.handleUpload} disabled={this.state.fileList.length === 0}>上传文件</Button>
								<Button key="btnClose" size="middle" hidden={false}	 onClick={this.cancelUpload}>取消</Button>
							</FormItem>
						</Form>
					</div>					
				</div>
				<dl className="detail">
					{introListMap.length? <dt className="homeHead" >个人介绍<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/perIntro/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{introList}
					{reviewListMap.length? <dt className="homeHead" >个人评价<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/perAss/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{reviewList}
					{otherListMap.length? <dt className="homeHead" >其他信息<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/otherInfor/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{otherList}
					{eduListMap.length? <dt className="homeHead" >教育背景<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/education/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{eduList}
					{peCompListMap.length? <dt className="homeHead" >工作经历<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/peComp/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{peCompList}
					{peProjListMap.length? <dt className="homeHead" >项目经历<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/peProj/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{peProjList}
					{trainListMap.length? <dt className="homeHead" >培训经历<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/train/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{trainList}
					{techSkillListMap.length? <dt className="homeHead" >开发技能<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/techSkill/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{techSkillList}
					{projSkillListMap.length? <dt className="homeHead" >项目技能<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/projSkill/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{projSkillList}
					{certListMap.length? <dt className="homeHead" >证书<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/cert/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{certList}
					{langListMap.length? <dt className="homeHead" >语言能力<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/lang/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{langList}
					{otherSkillListMap.length? <dt className="homeHead" >其他技能<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/otherSkill/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{otherSkillList}
					{honorListMap.length? <dt className="homeHead" >奖学金<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/eduHonor/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{honorList}
					{honor2ListMap.length? <dt className="homeHead" >在校奖励<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/schHonor/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{honor2List}
					{workHonorListMap.length? <dt className="homeHead" >奖励记录<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/workHonor/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{workHonorList}
					{pracListMap.length? <dt className="homeHead" >学校实践<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/schPrac/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{pracList}
					{wsProjListMap.length? <dt className="homeHead" >开源作品<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/wsProj/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{wsProjList}
					{wsThesisListMap.length? <dt className="homeHead" >公开论文<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/wsThesis/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{wsThesisList}
					{wsIssueListMap.length? <dt className="homeHead" >网上作品<a href="#" className="revise"  onClick={this.handleGo.bind(this, '/resume2/wsIssue/')} title='修改'><Icon type={Common.iconUpdate}/></a></dt>:''}
					{wsIssueList}
				</dl>
			</div>
			</div>
		);
	}
});
var PreviewPage = withRouter(PreviewPage2);
module.exports = PreviewPage;
