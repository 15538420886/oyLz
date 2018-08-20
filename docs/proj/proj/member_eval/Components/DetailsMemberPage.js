import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Form, Row, Col, Modal, Button, Input, Tabs, DatePicker } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var MemberEvalStore = require('../data/MemberEvalStore');
var MemberEvalActions = require('../action/MemberEvalActions');

var DetailsMemberPage = React.createClass({
	getInitialState : function() {
		return {
			loading: false,
			memberEval: {},
			hints: {},
			validRules: []
		}
	},
	mixins: [Reflux.listenTo(MemberEvalStore, "onServiceComplete"), ModalForm('memberEval')],
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
	          });
	      }
	  }
	},
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'evalDate', desc:'评价日期', required: false, max: '24'},
	        {id: 'contribute', desc:'贡献度', required: false, max: '16'},
            {id: 'roleDesc', desc:'职责说明', required: false, max: '3600'},
	        {id: 'evaluate', desc:'评价', required: false, max: '3600'},
		];
		this.initPage(this.props.memberEval)
	},
	initPage:function(memberEval){
		memberEval.evalDate = '' + Common.getToday();
		Utils.copyValue(memberEval, this.state.memberEval);		
		this.setState( {loading: false, hints: {}} );
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},
	showError:function(data){
        console.log(data)
    },
	onClickSave : function(){
		if(!Common.formValidator(this, this.state.memberEval)){
			return;
		};
		this.setState({loading: true});
		MemberEvalActions.updateProjMember( this.state.memberEval );
	},
	goBack:function(){
        this.props.onBack();
    },   
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
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
		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="人员评价" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['proj-member/update']}/>
                           <Form layout={layout} style={{width:'600px',marginTop:'24px'}}>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
											<Input type="text" name="staffCode" id="staffCode" value={this.state.memberEval.staffCode } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
											<Input type="text" name="perName" id="perName" value={this.state.memberEval.perName } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="员工类型" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
											<Input type="text" name="deptName" id="deptName" value={this.state.memberEval.deptName } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.manTypeHint} validateStatus={hints.manTypeStatus}>
											<Input type="text" name="manType" id="manType" value={this.state.memberEval.manType } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="小组名称" required={false} colon={true} className={layoutItem} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
											<Input type="text" name="teamUuid" id="teamUuid" value={this.state.memberEval.teamUuid } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="客户定级" required={false} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
											<Input style={{zIndex:'20'}} type="text" name="projLevel" id="projLevel" value={this.state.memberEval.projLevel } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.userPriceHint} validateStatus={hints.userPriceStatus}>
											<Input type="text" name="userPrice" id="userPrice" value={this.state.memberEval.userPrice } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="入组日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
											<Input type="text" name="beginDate" id="beginDate" value={this.state.memberEval.beginDate } disabled={true}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="离组日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
											<Input type="text" name="endDate" id="endDate" value={this.state.memberEval.endDate } disabled={true}/>
										</FormItem>
									</Col>
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="评价日期" required={false} colon={true} className={layoutItem} help={hints.evalDateHint} validateStatus={hints.evalDateStatus}>
											<DatePicker style={{width:'100%'}} name="evalDate" id="evalDate"  value={this.formatDate(this.state.memberEval.evalDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"evalDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="贡献度" required={false} colon={true} className={layoutItem} help={hints.contributeHint} validateStatus={hints.contributeStatus}>
											<Input type="text" name="contribute" id="contribute" value={this.state.memberEval.contribute } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
								</Row>
                                <Row>
                                    <FormItem {...formItemLayout} label="职责说明" required={false} colon={true} className={layoutItem} help={hints.roleDescHint} validateStatus={hints.roleDescStatus}>
                                        <Input type="textarea" name="roleDesc" id="roleDesc" value={this.state.memberEval.roleDesc } onChange={this.handleOnChange} />
                                    </FormItem>
								</Row>
                                <Row>
                                    <FormItem {...formItemLayout} label="评价" required={false} colon={true} className={layoutItem} help={hints.evaluateHint} validateStatus={hints.evaluateStatus}>
                                        <Input style={{zIndex:'20'}} type="textarea" name="evaluate" id="evaluate" value={this.state.memberEval.evaluate } onChange={this.handleOnChange} />
                                    </FormItem>
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

module.exports = DetailsMemberPage;

