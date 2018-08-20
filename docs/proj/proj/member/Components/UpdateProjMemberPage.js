import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ProjCodeMap from '../../../lib/ProjCodeMap';

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var ProjContext = require('../../../ProjContext');

var ProjMemberStore = require('../data/ProjMemberStore.js');
var ProjMemberActions = require('../action/ProjMemberActions');
import SelectProjTeam from '../../../lib/Components/SelectProjTeam';

var UpdateProjMemberPage = React.createClass({
	getInitialState : function() {
		return {
			ProjMemberSet: {
				errMsg : ''
			},
			loading: false,
			modal: false,
			ProjMember: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(ProjMemberStore, "onServiceComplete"), ModalForm('ProjMember'), ProjCodeMap()],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
				  this.goBack();
		  } else{
			  // 失败
			  this.setState({
				  loading: false,
				  ProjMemberSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'manType', desc:'人员类型:员工、实习、外协', required: false, max: '16'},
			{id: 'resLoc', desc:'项目地址', required: false, max: '24'},
			{id: 'projLevel', desc:'客户定级', required: false, max: '64'},
			{id: 'userPrice', desc:'结算单价', required: false, max: '16'},
			{id: 'beginDate', desc:'入组日期', required: false, max: '24'},
			{id: 'beginTime', desc:'入组时间', required: false, max: '24'},
			{id: 'oldteamUuid', desc:'小组UUID', required: false, max: '24'},
			{id: 'teamUuid', desc:'小组UUID', required: false, max: '24'}
		];
		this.initPage( this.props.projMember );
	},
	
	initPage: function(ProjMember)
	{
		Utils.copyValue(ProjMember, this.state.ProjMember);
		this.setState( {loading: false, hints: {}} );
		this.state.ProjMember.oldteamUuid = this.state.ProjMember.teamUuid;
		this.state.ProjMember.teamUuid = '';
		if( typeof(this.refs.mxgBox ) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.ProjMember)){
			this.setState({loading: true});
            this.state.ProjMember.projUuid = ProjContext.selectedProj.uuid;
            this.state.ProjMember.grpUuid = ProjContext.selectedProj.parentUuid;
			this.state.ProjMember.corpUuid = window.loginData.compUser.corpUuid;
			ProjMemberActions.updateProjMember( this.state.ProjMember );
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		
		var hints=this.state.hints;

        var projUuid = ProjContext.selectedProj.uuid;
        var teamName = this.getTeamName(projUuid, this.state.ProjMember.oldteamUuid);

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}></TabPane>
					<TabPane tab="调整小组" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto',width:'100%',}}>
			            	<div style={{width:'100%', maxWidth:'700px'}}>
								<ServiceMsg ref='mxgBox' svcList={['proj-member/update']}/>
								<Form layout={layout}>
									<Row>	
										<Col span="12">	
											<FormItem {...formItemLayout} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
												<Input type="text" name="staffCode" id="staffCode" value={this.state.ProjMember.staffCode } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
												<Input type="text" name="perName" id="perName" value={this.state.ProjMember.perName } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
									</Row>
									<Row>	
										<Col span="12">
											<FormItem {...formItemLayout} label="客户定级" required={false} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
												<Input type="text" name="projLevel" id="projLevel" value={this.state.ProjMember.projLevel } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
										<Col span="12">			
											<FormItem {...formItemLayout} label="结算单价" required={false} colon={true} className={layoutItem} help={hints.userPriceHint} validateStatus={hints.userPriceStatus}>
												<Input type="text" name="userPrice" id="userPrice" value={this.state.ProjMember.userPrice } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
									</Row>	
									<Row>	
										<Col span="12">
											<FormItem {...formItemLayout} label="入组日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
												<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  value={this.formatDate(this.state.ProjMember.beginDate, Common.dateFormat)}  disabled={true} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)} />
											</FormItem>
										</Col>
										<Col span="12">		
											<FormItem {...formItemLayout} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
												<Input type="text" name="beginTime" id="beginTime" value={this.state.ProjMember.beginTime } onChange={this.handleOnChange} disabled={true}/>
											</FormItem>
										</Col>
									</Row>
									<Row>	
										<Col span="12">		
											<FormItem {...formItemLayout} label="原小组" required={false} colon={true} className={layoutItem} help={hints.oldteamUuidHint} validateStatus={hints.oldteamUuidStatus}>
                                                <Input type="text" name="oldteamUuid" id="oldteamUuid" value={teamName} onChange={this.handleOnChange}  disabled={true}/>
											</FormItem>
										</Col>
									</Row>
									<Row>	
										<Col span="12">		
											<FormItem {...formItemLayout} label="新小组" required={true} colon={true} className={layoutItem} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
													<SelectProjTeam  projUuid={ProjContext.selectedProj.uuid} onSelect={this.handleOnSelected.bind(this, "teamUuid")}/>
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

export default UpdateProjMemberPage;

