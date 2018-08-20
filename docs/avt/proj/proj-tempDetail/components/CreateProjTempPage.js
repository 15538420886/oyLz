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
var ProjTempTableStore = require('../data/ProjTempTableStore');
var ProjTempDetailActions = require('../action/ProjTempDetailActions');

var CreateProjTempPage = React.createClass({
	getInitialState : function() {
		return {
			projTempSet: {
				errMsg : ''
			},
			loading: false,
			modal: false,
			projTemp: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProjTempTableStore, "onServiceComplete"), ModalForm('projTemp')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
          if (data.errMsg === '') {
              var len = data.recordSet.length;
              var obj = data.recordSet[len - 1];
              obj.ordCode = this.state.projTemp.ordCode;
              obj.ordName = this.state.projTemp.ordName;
              obj.itemCode = this.state.projTemp.itemCode;
              obj.itemName = this.state.projTemp.itemName;

	          // 成功，关闭窗口
	          this.setState({
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              projTempSet: data
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
		this.state.projTemp.uuid='';
		this.state.projTemp.corpUuid = window.loginData.compUser.corpUuid;;
        this.state.projTemp.proUuid = this.props.projUuid;
		this.state.projTemp.staffCode = window.loginData.compUser.userCode;
		this.state.projTemp.perName = window.loginData.authUser.perName;
        this.state.projTemp.beginDate=''+Common.getToday();
        this.state.projTemp.beginTime='09:00';
        this.state.projTemp.roleName='';
		this.state.projTemp.manStatus='入组'
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projTemp)){
			this.setState({loading: true});
			this.state.projTemp.projUuid = this.props.projUuid;
			this.state.projTemp.staffCode = window.loginData.compUser.userCode;
			this.state.projTemp.perName = window.loginData.authUser.perName;
			this.state.projTemp.corpUuid = this.state.projTemp.corpUuid;
       		this.state.projTemp.proUuid = this.props.projUuid;
			ProjTempDetailActions.createProjTemp( this.state.projTemp );
		}
	},

	onSelectProjTask : function(data){
		this.state.projTemp.taskUuid = data.uuid;
        this.state.projTemp.staffCode = data.userUuid;
        this.state.projTemp.ordCode = data.ordCode;
        this.state.projTemp.ordName = data.ordName;
		this.state.projTemp.itemCode = data.itemCode;
		this.state.projTemp.itemName = data.itemName;
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
                                <Input type="text" name="ordCode" id="ordCode" disabled={true} value={this.state.projTemp.ordCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="订单名称" required={false} colon={true} className={layoutItem} help={hints.ordNameHint} validateStatus={hints.ordNameStatus}>
                                <Input type="text" name="ordName" id="ordName" disabled={true} value={this.state.projTemp.ordName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任务编号" required={false} colon={true} className={layoutItem} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
                                <Input type="text" name="itemCode" id="itemCode" disabled={true} value={this.state.projTemp.itemCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="任务名称" required={false} colon={true} className={layoutItem} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                <Input type="text" name="itemName" id="itemName" disabled={true} value={this.state.projTemp.itemName } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
								<DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.projTemp.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入组时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                                <Input type="text" name="beginTime" id="beginTime" value={this.state.projTemp.beginTime } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                        <Input type="textarea" name="roleName" id="roleName" value={this.state.projTemp.roleName } onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
			</Modal>
		);
	}
});

export default CreateProjTempPage;

