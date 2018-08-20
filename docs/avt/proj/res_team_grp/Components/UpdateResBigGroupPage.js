import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictRadio from '../../../../lib/Components/DictRadio';
import AutoInput from '../../../../lib/Components/AutoInput';
import SearchResMember from '../../../../proj/lib/Components/SearchResMember';
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ResBigGroupStore = require('../data/ResBigGroupStore');
var ResBigGroupActions = require('../action/ResBigGroupActions');

var UpdateResBigGroupPage = React.createClass({
	getInitialState : function() {
		return {
			teamGrpSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			teamGrp: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ResBigGroupStore, "onServiceComplete"), ModalForm('teamGrp')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.setState({
				  modal: false
			  });
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  teamGrpSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'grpCode', desc:'小组编号', required: false, max: '64'},
			{id: 'grpName', desc:'小组名称', required: false, max: '64'},
			{id: 'grpLevel', desc:'小组级别：大组、中组、小组', required: false, max: '24'},
			{id: 'baseCity', desc:'归属地', required: false, max: '64'},
			{id: 'pmCode', desc:'组长编号', required: false, max: '64'},
			{id: 'pmName', desc:'组长姓名', required: false, max: '32'},
			{id: 'grpDesc', desc:'小组说明', required: false, max: '512'},
		];
	},
	
	initPage: function(teamGrp)
	{
		this.state.hints = {};
		Utils.copyValue(teamGrp, this.state.teamGrp);

		this.state.loading = false;
		this.state.teamGrpSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onSelectProj:function(data){
        this.state.teamGrp.pmUuid = data.uuid;
		this.state.teamGrp.pmCode = data.staffCode;
		this.state.teamGrp.pmName = data.perName;
		this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },



	onClickSave : function(){
		if(Common.formValidator(this, this.state.teamGrp)){
			this.state.teamGrpSet.operation = '';
			this.setState({loading: true});
			ResBigGroupActions.updateResTeamGrp( this.state.teamGrp );
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
			labelCol: ((layout=='vertical') ? null : {span: 7}),
			wrapperCol: ((layout=='vertical') ? null : {span: 17}),
		};

		var hints=this.state.hints;
		var corpUuid = window.loginData.compUser.corpUuid;
		return (
			<Modal visible={this.state.modal} width='580px' title="增加组员维护" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['res-team-grp/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
			<Form layout={layout}>
				<Row>
					<Col span='12'>
						<FormItem {...formItemLayout2} label="小组编号" required={true} colon={true} className={layoutItem} help={hints.grpCodeHint} validateStatus={hints.grpCodeStatus}>
							<Input type="text" name="grpCode" id="grpCode" value={this.state.teamGrp.grpCode } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
					<Col span='12'>
						<FormItem {...formItemLayout2} label="小组名称" required={false} colon={true} className={layoutItem} help={hints.grpNameHint} validateStatus={hints.grpNameStatus}>
							<Input type="text" name="grpName" id="grpName" value={this.state.teamGrp.grpName } onChange={this.handleOnChange} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span='12'>
						<FormItem {...formItemLayout2} label="小组级别" required={false} colon={true} className={layoutItem} help={hints.grpLevelHint} validateStatus={hints.grpLevelStatus}>
							<DictRadio name='grpLevel' id='grpLevel' appName='项目管理' optName='小组级别' value={this.state.teamGrp.grpLevel} onChange={this.onRadioChange} />
						</FormItem>
					</Col>
					<Col span='12'>
						<FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
							<AutoInput name='baseCity' id='baseCity' paramName='城市' value={this.state.teamGrp.baseCity } onChange={this.handleOnSelected.bind(this, "baseCity")} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<FormItem {...formItemLayout} label="组长" required={false} colon={true} className={layoutItem} help={hints.pmNameHint} validateStatus={hints.pmNameStatus} style={{marginLeft:'-14px'}}>
						<SearchResMember corpUuid={corpUuid} showError={this.showError} ref='empSearchBox'  type="text"  name="pmName" id="pmName" value={this.state.teamGrp.pmName} onSelectMember={this.onSelectProj}/>
					</FormItem>
				</Row>
				<Row>
					<Col span='12'>
						<FormItem {...formItemLayout2} label="组长编号" required={false} colon={true} className={layoutItem} help={hints.pmCodeHint} validateStatus={hints.pmCodeStatus}>
							<Input type="text" name="pmCode" id="pmCode" value={this.state.teamGrp.pmCode } onChange={this.handleOnChange} disabled={true}/>
						</FormItem>
					</Col>
					<Col span='12'>
						<FormItem {...formItemLayout2} label="组长姓名" required={false} colon={true} className={layoutItem} help={hints.pmNameHint} validateStatus={hints.pmNameStatus}>
							<Input type="text" name="pmName" id="pmName" value={this.state.teamGrp.pmName } onChange={this.handleOnChange} disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<FormItem {...formItemLayout} label="小组说明" required={false} colon={true} className={layoutItem} help={hints.grpDescHint} validateStatus={hints.grpDescStatus} style={{marginLeft:'-12px'}}>
					<Input type="textarea" name="grpDesc" id="grpDesc" value={this.state.teamGrp.grpDesc } onChange={this.handleOnChange} />
				</FormItem>
			</Form>
		</Modal>
		);
	}
});

export default UpdateResBigGroupPage;

