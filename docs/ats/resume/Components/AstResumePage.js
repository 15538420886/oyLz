import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Button, Icon, Input, DatePicker, Tabs, Col, Row, Spin, Upload } from 'antd';
const FormItem = Form.Item;

const TabPane = Tabs.TabPane;
import DictSelect from '../../../lib/Components/DictSelect';
import DictRadio from '../../../lib/Components/DictRadio'; 
import EmailInput from '../../../lib/Components/EmailInput';

var AstResumeStore = require('../data/AstResumeStore');
var AstResumeActions = require('../action/AstResumeActions');
var AstResumePage = React.createClass({ 
	getInitialState : function() {
		return {
			loading: false,
			talentObj: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [
			Reflux.listenTo(AstResumeStore, "onServiceComplete"),
			ModalForm('talentObj')
	],

	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
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
			{id: 'perName', desc:'姓名',required: true, max: '24'},
			{id: 'gender', desc:'性别', max: '24'},
			{id: 'years', desc:'年龄', max: '24'},
			{id: 'induYear', desc:'工作年限', max: '24'},
			{id: 'cityName', desc:'城市',max: '24'},
			{id: 'eduDegree', desc:'学历',max: '24'},
			{id: 'corpName', desc:'现公司', max: '24'},
			{id: 'titleName', desc:'现职位',  max: '24'},
			{id: 'phoneno', desc:'电话',  dataType: 'mobile', max: '24'},
			{ id: 'email', desc: '电子邮箱',  dataType: 'email', max: 64, },
			{id: 'evaluate', desc:'综合评价',  max: '24'},
		];

		this.clear();
	},
	
	clear:function(){
		this.state.hints = {};
		this.state.talentObj.perName='';
		this.state.talentObj.gender='';
		this.state.talentObj.years='';
		this.state.talentObj.induYear='';
		this.state.talentObj.cityName='';
		this.state.talentObj.eduDegree='';
		this.state.talentObj.corpName='';
		this.state.talentObj.titleName='';
		this.state.talentObj.phoneno='';
		this.state.talentObj.email='';
		this.state.talentObj.evaluate='';
		this.setState({
            loading: false
        });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
	},
	emailOnChange: function (value) {
        var obj = this.state.talentObj;
        obj.email = value;
        Validator.validator(this, obj, 'email');
        this.setState({
            loading: this.state.loading
        });
    },
	onClickSave : function(){
		if(!Common.formValidator(this, this.state.talentObj)){
			return;
		};
        this.setState({ loading: true });
        AstResumeActions.createAstResume(this.state.talentObj)
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
		var form=(
			<Form layout={layout} style={{margin:'12px 0 0 0'}}>
                <Row>
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="姓名" required={true} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
							<Input type="text" name="perName" id="perName" value={this.state.talentObj.perName } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                         <FormItem {...formItemLayout2} className={layoutItem} label='性别' colon={true} help={hints.genderHint} validateStatus={hints.genderStatus}>
                            <DictRadio name="gender" id="gender" value={this.state.talentObj.gender} appName='简历系统' optName='性别' onChange={this.onRadioChange} />
                        </FormItem>
                    </Col>
                </Row>
                 <Row>
                 	<Col span="12">
                       <FormItem {...formItemLayout2} label="年龄" required={false} colon={true} className={layoutItem} help={hints.yearsHint} validateStatus={hints.yearsStatus}>
							<Input type="text" name="years" id="years" value={this.state.talentObj.years } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="工作年限" required={false} colon={true} className={layoutItem} help={hints.induYearHint} validateStatus={hints.induYearStatus}>
							<Input type="text" name="induYear" id="induYear" value={this.state.talentObj.induYear } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    
                 </Row>
                  <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="城市" required={false} colon={true} className={layoutItem} help={hints.cityNameHint} validateStatus={hints.cityNameStatus}>
							<Input type="text" name="cityName" id="cityName" value={this.state.talentObj.cityName } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='学历' colon={true} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                            <DictSelect style={{ width: '100%' }} name="eduDegree" id="eduDegree" value={this.state.talentObj.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")} />
                        </FormItem>
                    </Col>
                 </Row>
                <Row>
                   
                    <Col span="12">
                       <FormItem {...formItemLayout2} label="现公司" required={false} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
							<Input type="text" name="corpName" id="corpName" value={this.state.talentObj.corpName } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                     <Col span="12">
                        <FormItem {...formItemLayout2} label="现职位" required={false} colon={true} className={layoutItem} help={hints.titleNameHint} validateStatus={hints.titleNameStatus}>
							<Input type="text" name="titleName" id="titleName" value={this.state.talentObj.titleName } onChange={this.handleOnChange} />
						</FormItem>
					 </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout2} label="电话" required={false} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
							<Input type="text" name="phoneno" id="phoneno" value={this.state.talentObj.phoneno } onChange={this.handleOnChange} />
						</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout2} className={layoutItem} label='电子邮箱' required={false} colon={true} help={hints.emailHint} validateStatus={hints.emailStatus}>
                            <EmailInput name="email" id="email" value={this.state.talentObj.email} onChange={this.emailOnChange} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="综合评价" required={false} colon={true} className={layoutItem} help={hints.evaluateHint} validateStatus={hints.evaluateStatus}>
					<Input type="textarea" name="evaluate" id="evaluate" value={this.state.talentObj.evaluate } onChange={this.handleOnChange} />
				</FormItem>
				 <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                </FormItem>
			</Form>
		);

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onTabClick={this.goBack}  tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="转入人才库" key="2" style={{width: '100%', height: '100%'}}>
                      <div className='grid-page' style={{padding: '8px 0 0 0'}}>
                        <div style={{padding:"8px",height: '100%',overflowY: 'auto'}} >
                          <div style={{width:'100%', maxWidth:'600px'}}>
				        	<ServiceMsg ref='mxgBox' svcList={['ast-resume/create']}/>
				        	{form}
						  </div>
						</div>
					  </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});


module.exports = AstResumePage;