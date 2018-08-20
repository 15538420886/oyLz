import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import SearchProjTask2 from '../../../../proj/lib/Components/SearchProjTask2';
import { Form, Modal, Button, Input, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
var ProjContext = require('../../../../proj/ProjContext');
var ProjInfoTableStore = require('../data/ProjInfoTableStore');
var ProjInfoTableActions = require('../action/ProjInfoTableActions');

var CreateProjInfoPage = React.createClass({
	getInitialState : function() {
		return {
			projInfoSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			projInfo: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProjInfoTableStore, "onServiceComplete"), ModalForm('projInfo')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
          if (data.errMsg === '') {
              var len = data.recordSet.length;
              var obj = data.recordSet[len - 1];
              obj.ordCode = this.state.projInfo.ordCode;
              obj.ordName = this.state.projInfo.ordName;
              obj.itemCode = this.state.projInfo.itemCode;
              obj.itemName = this.state.projInfo.itemName;

	          // 成功，关闭窗口
	          this.setState({
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              projInfoSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'beginDate', desc:'入组日期', required: true, max: '24'},
            {id: 'beginTime', desc:'入组时间', required: false, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
            {id: 'roleName', desc:'承担角色', required: false, max: '64'},
		];
	},
	
	clear : function(){
		this.state.hints = {};
		this.state.projInfo.uuid='';
		this.state.projInfo.corpUuid = window.loginData.compUser.corpUuid;;
        this.state.projInfo.proUuid = this.props.projUuid;
		this.state.projInfo.staffCode = window.loginData.compUser.userCode;
		this.state.projInfo.perName = window.loginData.authUser.perName;
        this.state.projInfo.beginDate=''+Common.getToday();
        this.state.projInfo.beginTime='09:00';
        this.state.projInfo.roleName='';
		this.state.projInfo.manStatus='入组'
		this.state.loading = false;
	    this.state.projInfoSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projInfo)){
			this.state.projInfoSet.operation = '';
			this.setState({loading: true});
			this.state.projInfo.projUuid = this.props.projUuid;
			this.state.projInfo.staffCode = window.loginData.compUser.userCode;
			this.state.projInfo.corpUuid = this.state.projInfo.corpUuid;
			this.state.projInfo.perName = window.loginData.authUser.perName;
       		this.state.projInfo.proUuid = this.props.projUuid;
			ProjInfoTableActions.createProjMember( this.state.projInfo );
		}
	},

	onSelectProjTask : function(data){
		this.state.projInfo.taskUuid = data.uuid;
        this.state.projInfo.staffCode = data.userUuid;
        this.state.projInfo.ordCode = data.ordCode;
        this.state.projInfo.ordName = data.ordName;
		this.state.projInfo.itemCode = data.itemCode;
		this.state.projInfo.itemName = data.itemName;
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
        var projUuid = this.props.projUuid;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加任务" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
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
						<SearchProjTask2 style={{width:'400px',margin:'0 0 15px 22px'}} projUuid={projUuid} showError={this.showError} onSelectProjTask={this.onSelectProjTask} />
                    </div>
                   <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单编号" required={false} colon={true} className={layoutItem} help={hints.ordCodeHint} validateStatus={hints.ordCodeStatus}>
                                <Input type="text" name="ordCode" id="ordCode" disabled={true} value={this.state.projInfo.ordCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单名称" required={false} colon={true} className={layoutItem} help={hints.ordNameHint} validateStatus={hints.ordNameStatus}>
                                <Input type="text" name="ordName" id="ordName" disabled={true} value={this.state.projInfo.ordName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任务编号" required={false} colon={true} className={layoutItem} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
                                <Input type="text" name="itemCode" id="itemCode" disabled={true} value={this.state.projInfo.itemCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任务名称" required={false} colon={true} className={layoutItem} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                <Input type="text" name="itemName" id="itemName" disabled={true} value={this.state.projInfo.itemName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.projInfo.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                                <Input type="text" name="beginTime" id="beginTime" value={this.state.projInfo.beginTime } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                        <Input type="textarea" name="roleName" id="roleName" value={this.state.projInfo.roleName } onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
			</Modal>
		);
	}
});

export default CreateProjInfoPage;

