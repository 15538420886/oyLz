import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Tabs, DatePicker, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var BiziMemberStore = require('../data/BiziMemberStore.js');
var BiziMemberActions = require('../action/BiziMemberActions');

var UpdateBiziMemberPage = React.createClass({
	getInitialState : function() {
		return {
			biziMemberSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			biziMember: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(BiziMemberStore, "onServiceComplete"), ModalForm('biziMember')],
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
				  biziMemberSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'endDate', desc:'离组日期', required: true, max: '24'},
			{id: 'endTime', desc:'离组时间', required: true, max: '24',pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式[hh:mm]错误'},
		];
		this.initPage( this.props.biziMember )
	},
	
	initPage: function(biziMember)
	{
		if(biziMember.endDate === "#"){
			biziMember.endDate =''+Common.getToday();
			biziMember.endTime = '18:00';
			Utils.copyValue(biziMember, this.state.biziMember);
		}else{
			Utils.copyValue(biziMember, this.state.biziMember);
		}
		
		
		this.setState( {loading: false, hints: {}} );
		if(  typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.biziMember)){
			this.setState({loading: true});
			BiziMemberActions.updateBiziProjMember( this.state.biziMember );
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

		var hints=this.state.hints;
	    return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
					<TabPane tab="人员离组/修改" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{ padding:"24px 0 16px 8px"}}>
			            	<ServiceMsg ref='mxgBox' svcList={['bizi-proj-member/update']}/>
                            <Form layout={layout} style={{width:'100%', maxWidth:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.biziMember.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.biziMember.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工类型" required={false} colon={true} className={layoutItem} help={hints.manTypeHint} validateStatus={hints.manTypeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="manType" id="manType" value={this.state.biziMember.manType } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
											<Input style={{zIndex:'2'}} type="text" name="baseCity" id="baseCity" value={this.state.biziMember.baseCity } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="公司" required={false} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
									<Input type="text" name="corpName" id="corpName" value={this.state.biziMember.corpName } disabled={true}/>
								</FormItem>
								<FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
									<Input type="text" name="deptName" id="deptName" value={this.state.biziMember.deptName } disabled={true}/>
								</FormItem>
                                <Row style={{ paddingTop: '16px' }}>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="入组日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
											<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.biziMember.beginDate, Common.dateFormat)} disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
											<Input type="text" name="beginTime" id="beginTime" value={this.state.biziMember.beginTime} disabled={true}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="离组日期" required={true} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
											<DatePicker style={{width:'100%'}} name="endDate" id="endDate"  format={Common.dateFormat} value={this.formatDate(this.state.biziMember.endDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"endDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
                                        <FormItem {...formItemLayout2} label="离组时间" required={true} colon={true} className={layoutItem} help={hints.endTimeHint} validateStatus={hints.endTimeStatus}>
											<Input type="text" name="endTime" id="endTime" value={this.state.biziMember.endTime} onChange={this.handleOnChange}/>
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

export default UpdateBiziMemberPage;
