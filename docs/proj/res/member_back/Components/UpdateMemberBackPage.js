import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ProjContext from '../../../ProjContext';

import { Form, Modal, Button, Input, Select, Tabs, DatePicker, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var MemberBackStore = require('../data/MemberBackStore.js');
var MemberBackActions = require('../action/MemberBackActions');

var UpdateMemberBackPage = React.createClass({
	getInitialState : function() {
		return {
			memberBackSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			memberBack: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(MemberBackStore, "onServiceComplete"), ModalForm('memberBack')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              memberBackSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'beginDate', desc:'入组日期', required: true, max:'24'},
            {id: 'beginHour', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
		];
		this.initPage( this.props.memberBack)
	},
	
	initPage: function(memberBack)
	{
		Utils.copyValue(memberBack, this.state.memberBack);
		this.state.memberBack.beginDate = this.state.memberBack.resDate;
		this.state.memberBack.beginHour = this.state.memberBack.resHour;
		this.setState( {loading: false, hints: {}} );
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.memberBack)){
			console.log(this.state.memberBack)
			this.setState({loading: true});
			MemberBackActions.updateResMember( this.state.memberBack );
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

		var obj = this.state.memberBack;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
		var hints=this.state.hints;
	    return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
					<TabPane tab="修改人员回组日期" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{ padding:"24px 0 16px 8px"}}>
			            	<ServiceMsg ref='mxgBox' svcList={['res-member/update']}/>
                            <Form layout={layout} style={{width:'100%', maxWidth:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.memberBack.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.memberBack.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="deptName" id="deptName" value={this.state.memberBack.deptName } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
											<Input style={{zIndex:'2'}} type="text" name="baseCity" id="baseCity" value={this.state.memberBack.baseCity } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="人员类型" required={false} colon={true} className={layoutItem} help={hints.manTypeHint} validateStatus={hints.manTypeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="manType" id="manType" value={this.state.memberBack.manType } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="电话" required={false} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
											<Input style={{zIndex:'2'}} type="text" name="phoneno" id="phoneno" value={this.state.memberBack.phoneno } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
				                    <Col span="12">
				                        <FormItem {...formItemLayout2} label="最高学历" className={layoutItem}>
				                            <Input type="text" name="eduDegree" id="eduDegree" value={this.state.memberBack.eduDegree } disabled={true}/>
				                        </FormItem>
				                    </Col>
				                    <Col span="12">
				                        <FormItem {...formItemLayout2} label="毕业院校" className={layoutItem}>
				                            <Input type="text" name="eduCollege" id="eduCollege" value={this.state.memberBack.eduCollege } disabled={true}/>
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
                                <Row style={{ paddingTop: '16px' }}>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="状态" required={false} colon={true} className={layoutItem} help={hints.resStatusHint} validateStatus={hints.resStatusStatus}>
											<Input style={{zIndex:'2'}} type="text" name="resStatus" id="resStatus" value={this.state.memberBack.resStatus } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.resNameHint} validateStatus={hints.resNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="resName" id="resName" value={this.state.memberBack.resName } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="项目地址" required={false} colon={true} className={layoutItem} help={hints.resLocHint} validateStatus={hints.resLocStatus}>
											<Input style={{zIndex:'2'}} type="text" name="resLoc" id="resLoc" value={this.state.memberBack.resLoc } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="日期" required={false} colon={true} className={layoutItem} help={hints.resDateHint} validateStatus={hints.resDateStatus}>
											<DatePicker style={{width:'100%'}} name="resDate" id="resDate"  format={Common.dateFormat} value={this.formatDate(this.state.memberBack.resDate, Common.dateFormat)} disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="时间" required={false} colon={true} className={layoutItem} help={hints.resHourHint} validateStatus={hints.resHourStatus}>
											<Input type="text" name="resHour" id="resHour" value={this.state.memberBack.resHour} onChange={this.handleOnChange} disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="回组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
											<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.memberBack.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="时间" required={true} colon={true} className={layoutItem} help={hints.beginHourHint} validateStatus={hints.beginHourStatus}>
											<Input type="text" name="beginHour" id="beginHour" value={this.state.memberBack.beginHour} onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
									<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
								</FormItem>
							</Form>
                          
                        </div>
                    </TabPane>
                </Tabs>
	        </div>
	    );
    }
});

export default UpdateMemberBackPage;

