import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import SearchProjMember from '../../../lib/Components/SearchProjMember';
var ProjContext = require('../../../ProjContext');
var ProjTaskMemberStore = require('../data/ProjTaskMemberStore');
var ProjTaskMemberActions = require('../action/ProjTaskMemberActions');

var CreateProjTaskMemberPage = React.createClass({
	getInitialState : function() {
		return {
			projTaskMemberSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			projTaskMember: {},
			hints: {},
			validRules: [],
            user:{},
		}
	},

	mixins: [Reflux.listenTo(ProjTaskMemberStore, "onServiceComplete"), ModalForm('projTaskMember')],
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
	              projTaskMemberSet: data
	          });
	      }
	  }
	},
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'staffCode', desc:'员工编号', required: true, max: '64'},
            {id: 'perName', desc:'姓名', required: true, max: '32'},
            {id: 'beginDate', desc:'入组日期', required: true, max: '24'},
            {id: 'beginTime', desc:'入组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
            {id: 'roleName', desc:'承担角色', required: false, max: '64'},
            {id: 'manStatus', desc:'状态：入组、离组', required: false, max: '16'},
			{id: 'endDate', desc:'离组日期', required: false, max: '24'},
			{id: 'endTime', desc:'离组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
		];
	},	
	clear : function(taskUuid){
		this.state.hints = {};
		this.state.projTaskMember.uuid='';
		this.state.projTaskMember.taskUuid = taskUuid;
        this.state.projTaskMember.projUuid = ProjContext.selectedProj.uuid;
        this.state.projTaskMember.corpUuid = window.loginData.compUser.corpUuid;

        this.state.projTaskMember.staffCode='';
        this.state.projTaskMember.perName='';
        this.state.projTaskMember.beginDate=''+Common.getToday();
        this.state.projTaskMember.beginTime='09:00';
        this.state.projTaskMember.roleName='';
        this.state.projTaskMember.manStatus='入组';
        this.state.projTaskMember.endDate='';
        this.state.projTaskMember.endTime='';

		this.state.loading = false;
	    this.state.projTaskMemberSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},
	onClickSave : function(){
		if(Common.formValidator(this, this.state.projTaskMember)){
			this.state.projTaskMemberSet.operation = '';
			this.setState({loading: true});
			ProjTaskMemberActions.createProjTaskMember( this.state.projTaskMember );
		}
	},
    onSelectProjTask : function(data){
        this.state.projTaskMember.userUuid = data.userUuid;
        this.state.projTaskMember.staffCode = data.staffCode;
        this.state.projTaskMember.perName = data.perName;
		this.state.projTaskMember.baseCity = data.baseCity;
		this.state.projTaskMember.resName = data.resName;

        this.setState({
            user:data,
        })
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
        var projUuid = ProjContext.selectedProj.uuid;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加人员" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-task-member/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <div style={{borderBottom:'1px solid #ccc',marginBottom:'16px'}}>
                        <SearchProjMember style={{width:'400px',margin:'0 0 15px 22px'}} projUuid={projUuid} showError={this.showError} onSelectMember={this.onSelectProjTask}/>
                    </div>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                <Input disabled={true} type="text" name="staffCode" id="staffCode" value={this.state.projTaskMember.staffCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                <Input disabled={true} type="text" name="perName" id="perName" value={this.state.projTaskMember.perName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.projTaskMember.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                                <Input type="text" name="beginTime" id="beginTime" value={this.state.projTaskMember.beginTime } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                        <Input type="textarea" name="roleName" id="roleName" value={this.state.projTaskMember.roleName } onChange={this.handleOnChange} />
                    </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateProjTaskMemberPage;

