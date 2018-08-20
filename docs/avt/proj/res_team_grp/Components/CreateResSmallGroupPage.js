import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import SearchResMember from '../../../../proj/lib/Components/SearchResMember';
var ResSmallGroupStore = require('../data/ResSmallGroupStore');
var ResSmallGroupActions = require('../action/ResSmallGroupActions');

var CreateResSmallGroupPage = React.createClass({
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
			validRules: [],
		}
	},

	mixins: [Reflux.listenTo(ResSmallGroupStore, "onServiceComplete"), ModalForm('teamGrp')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
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
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'phoneno', desc:'电话', required: false, max: '32'},
			{id: 'resStatus', desc:'当前状态：资源池、项目、事务', required: false, max: '32'},
			{id: 'resName', desc:'项目名称', required: false, max: '128'},
		];
	},
	
	clear : function(){
		this.state.hints = {};
		this.state.teamGrp.corpUuid= window.loginData.compUser.corpUuid;
		this.state.teamGrp.poolUuid= this.props.poolUuid;
		this.state.teamGrp.groupUuid= this.props.uuid;
		this.state.teamGrp.staffCode='';
		this.state.teamGrp.perName='';
		this.state.teamGrp.phoneno='';
		this.state.teamGrp.resStatus='';
		this.state.teamGrp.resName='';

		this.state.loading = false;
	    this.state.teamGrpSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onSelectProj:function(data){
        this.state.teamGrp.groupUuid = data.uuid;
		this.state.teamGrp.staffCode = data.staffCode;
		this.state.teamGrp.perName = data.perName;
		this.state.teamGrp.resStatus = data.resStatus;
		this.state.teamGrp.phoneno = data.phoneno;
		this.state.teamGrp.resName = data.resName;
		this.refs.empSearchBox.setValue(data.perName);
        this.setState({
           user:data,
        })
    },


	onClickSave : function(){
		if(Common.formValidator(this, this.state.teamGrp)){
			this.state.teamGrpSet.operation = '';
			this.setState({loading: true});
			this.state.teamGrp.groupUuid = this.props.uuid;
			ResSmallGroupActions.createResTeamGrp( this.state.teamGrp );
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
			labelCol: ((layout=='vertical') ? null : {span: 7}),
			wrapperCol: ((layout=='vertical') ? null : {span: 17}),
		};

		var hints=this.state.hints;
		var corpUuid = window.loginData.compUser.corpUuid;
		return (
			<Modal visible={this.state.modal} width='580px' title="增加小组成员" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['res-member/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<Row>
						<SearchResMember style={{width:'70%',margin:'0 10px 20px 0px',float:'left'}} corpUuid={corpUuid} showError={this.showError} ref='empSearchBox' onSelectMember={this.onSelectProj}/>
						<Button style={{float:'left'}} key="btnClose" size="middle" onClick={this.toggle}>查询</Button>
					</Row>

				   	<FormItem {...formItemLayout} label="员工编号" required={true} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
						<Input type="text" name="staffCode" id="staffCode" value={this.state.teamGrp.staffCode } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
						<Input type="text" name="perName" id="perName" value={this.state.teamGrp.perName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="电话" required={false} colon={true} className={layoutItem} help={hints.phonenoHint} validateStatus={hints.phonenoStatus}>
						<Input type="text" name="phoneno" id="phoneno" value={this.state.teamGrp.phoneno } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="当前状态" required={false} colon={true} className={layoutItem} help={hints.resStatusHint} validateStatus={hints.resStatusStatus}>
						<Input type="text" name="resStatus" id="resStatus" value={this.state.teamGrp.resStatus } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.resNameHint} validateStatus={hints.resNameStatus}>
						<Input type="text" name="resName" id="resName" value={this.state.teamGrp.resName } onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateResSmallGroupPage;

