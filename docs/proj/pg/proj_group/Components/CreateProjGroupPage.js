import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Col, Row, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';
import DeptGrpSelect from '../../../../hr/lib/Components/DeptGrpSelect';
import SearchCust from '../../../lib/Components/SearchCust';

var ProjGroupStore = require('../data/ProjGroupStore.js');
var ProjGroupActions = require('../action/ProjGroupActions');

var CreateProjGroupPage = React.createClass({
	getInitialState : function() {
		return {
			projGroupSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			projGroup: {},
			hints: {},
			validRules: [],
		}
	},

	mixins: [Reflux.listenTo(ProjGroupStore, "onServiceComplete"),ModalForm('projGroup')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	          	  loading: false,
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              projGroupSet: data
	          });
	      }
	  }
	},
	
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'custName', desc:'客户名称', required: false, max: '64'},
			{id: 'deptCode', desc:'一级部门', required: false, max: '64'},
			{id: 'grpCode', desc:'编号', required: false, max: '64'},
			{id: 'grpName', desc:'名称', required: true, max: '128'},
			{id: 'grpType', desc:'类型', required: false, max: '32'},
			{id: 'grpDesc', desc:'说明', required: false, max: '3600'},
			{id: 'beginDate', desc:'开始日期', required: false, max: '24'},
			{id: 'grpStatus', desc:'群状态', required: false, max: '64'},
		];
	},
	
	clear : function(proj){
		this.state.hints = {};
		this.state.projGroup.operation = '';
		this.state.projGroup.grpName='';
		this.state.projGroup.grpType='';
		this.state.projGroup.grpDesc='';
		this.state.projGroup.beginDate='';
		this.state.projGroup.endDate='';
		this.state.projGroup.grpStatus='运行';
		this.state.projGroup.orgType='';
		this.state.projGroup.grpCode='';
		this.state.projGroup.deptCode='';
		this.state.projGroup.custName='';
		this.state.projGroup.custCode='';
		this.state.projGroup.custDesc='';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projGroup)){
			this.setState({loading: true});
			this.state.projGroup.operation = '';
			this.state.projGroup.corpUuid = window.loginData.compUser.corpUuid;
			ProjGroupActions.createProjGroup( this.state.projGroup );
		}
	},
	onSelectCust:function(data){ 
        var projGroup = this.state.projGroup;
        projGroup.custCode = data.custCode;
        projGroup.custName = data.custName;
        projGroup.custDesc = data.custDesc;
        this.setState({
        	projGroup:projGroup
        })
	},
	
	render : function(){
		var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        
		var hints = this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加项目群" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['proj_group/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
		   		    <Row>
		                <Col span="24">
		                    <FormItem {...formItemLayout2} className={layoutItem} label="客户" colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
		                        <SearchCust onSelectCust={this.onSelectCust} />
		                    </FormItem>
		                </Col>
		            </Row>
					<Row>
		                <Col span="12">
		                    <FormItem {...formItemLayout} className={layoutItem} label="客户编号" colon={true} className={layoutItem} help={hints.custCodeHint} validateStatus={hints.custCodeStatus}>
		                        <Input type="text" name="custCode" id="custCode"  value={this.state.projGroup.custCode} onChange={this.handleOnChange} readOnly={true} />		       
		                    </FormItem>
		                </Col>
		                <Col span="12">
		                    <FormItem {...formItemLayout} className={layoutItem} label="客户简称" colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
		                        <Input type="text" name="custName" id="custName" value={this.state.projGroup.custName} onChange={this.handleOnChange} readOnly={true}/>
		                    </FormItem>
		                </Col>
		            </Row>
		            <Row>
		                <Col span="24">
		                    <FormItem {...formItemLayout2} className={layoutItem} label="客户名称" colon={true} className={layoutItem} help={hints.custDescHint} validateStatus={hints.custDescStatus}>
		                        <Input type="text" name="custDesc" id="custDesc" value={this.state.projGroup.custDesc} onChange={this.handleOnChange} readOnly={true}/>
		                    </FormItem>
		                </Col>
		            </Row>
		            <Row>
		                <Col span="12">
		                    <FormItem {...formItemLayout} className={layoutItem} label="编号" colon={true} className={layoutItem} help={hints.grpCodeHint} validateStatus={hints.grpCodeStatus}>
		                        <Input type="text" name="grpCode" id="grpCode" value={this.state.projGroup.grpCode} onChange={this.handleOnChange} />
		                    </FormItem>
		                </Col>
		            </Row>
		            <Row>
		                <Col span="24">
		                    <FormItem {...formItemLayout2} className={layoutItem} label="名称" required={true}  colon={true} className={layoutItem} help={hints.grpNameHint} validateStatus={hints.grpNameStatus}>
		                        <Input type="text" name="grpName" id="grpName" value={this.state.projGroup.grpName} onChange={this.handleOnChange} />
		                    </FormItem>
		                </Col>
		            </Row>
		            <Row>
		                <Col span="24">
		                    <FormItem {...formItemLayout2} className={layoutItem} label="说明" colon={true} className={layoutItem} help={hints.grpDescHint} validateStatus={hints.grpDescStatus}>
		                        <Input type="textarea" name="grpDesc" id="grpDesc" value={this.state.projGroup.grpDesc} onChange={this.handleOnChange} />
		                    </FormItem>
		                </Col>
		            </Row>
		            <Row>
		                <Col span="12">
		                    <FormItem {...formItemLayout} className={layoutItem} label="类型" colon={true} className={layoutItem} help={hints.grpTypeHint} validateStatus={hints.grpTypeStatus}>
		                        <DictSelect name="grpType" id="grpType" value={this.state.projGroup.grpType} appName='项目管理' optName='项目群类型' onSelect={this.handleOnSelected.bind(this, "grpType")}/>
		                    </FormItem>
		                </Col>
		                <Col span="12">
		                    <FormItem {...formItemLayout} className={layoutItem} label="业务部门" colon={true} className={layoutItem} help={hints.deptCodeHint} validateStatus={hints.deptCodeStatus}>
                                <DeptGrpSelect name="deptCode" id="deptCode" value={this.state.projGroup.deptCode} onSelect={this.handleOnSelected.bind(this, "deptCode")}/>
		                    </FormItem>
		                </Col>
		            </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout} className={layoutItem} label="状态" colon={true} className={layoutItem} help={hints.grpStatusHint} validateStatus={hints.grpStatusStatus}>
                                <DictSelect name="grpStatus" id="grpStatus" value={this.state.projGroup.grpStatus} appName='项目管理' optName='项目群状态' onSelect={this.handleOnSelected.bind(this, "grpStatus")} />
                            </FormItem>
                        </Col>
		                <Col span="12">
		                    <FormItem {...formItemLayout} className={layoutItem} label="创建日期" colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
		                    	<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  value={this.formatDate(this.state.projGroup.beginDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
		                    </FormItem>
		                </Col>
		            </Row>
				</Form>
			</Modal>
		);
	}
});

export default CreateProjGroupPage;

/*
	<Col span="12">
		<FormItem {...formItemLayout} className={layoutItem} label="组织方式" colon={true} className={layoutItem} help={hints.orgTypeHint} validateStatus={hints.orgTypeStatus}>
		    <DictSelect name="orgType" id="orgType" value={this.state.projGroup.orgType} appName='项目管理' optName='项目群组织方式' onSelect={this.handleOnSelected.bind(this, "orgType")}/>
		</FormItem>
	</Col>
*/
