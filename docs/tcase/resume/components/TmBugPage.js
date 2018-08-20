import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col, Upload,Icon, message} from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const Option = Select.Option;

var QueryStore = require('../data/TmCaseStore');
var QueryActions = require('../action/TmCaseActions');
var TmBugPage = React.createClass({
	getInitialState : function() {
		return {
			tmBugSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			tmBug: {},
			hints: {},
			validRules: [],
			thisTmBug:'',
			casecode:''
			
		}
	},

	mixins: [Reflux.listenTo(QueryStore, "onServiceComplete"), ModalForm('tmBug')],
	onServiceComplete: function(data) {
		
		this.setState({
			thisTmBug:data.tmBugList
		})
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
				  tmBugSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'bugName', desc:'缺陷名称', required: true, max: '255'},
			{id: 'sysId', desc:'所属系统', required: true, max: '255'},
			{id: 'caseCode', desc:'案例编码', required: false, max: '255'},
			{id: 'bugType', desc:'缺陷类型', required: false, max: '255'},
			{id: 'bugSeverity', desc:'严重程度', required: false, max: '255'},
			{id: 'bugPriorty', desc:'优先级', required: true, max: '255'},
			{id: 'bugChance', desc:'重现概率', required: false, max: '255'},
			{id: 'prjId', desc:'所属项目', required: false, max: '255'},
			{id: 'bugResponsible', desc:'当前处理人', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '512'},
			{id: 'bugDesp', desc:'缺陷描述', required: false, max: '512'},
		];
	},
	
	initPage: function(tmBug,casecode)
	{
		console.log(tmBug,casecode)
		QueryActions.bugList(tmBug,casecode);
//		QueryActions.bugList(tmBug);
		this.state.hints = {};
		Utils.copyValue(tmBug, this.state.tmBug);
		
		this.state.loading = false;
		this.state.tmBugSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.tmBug)){
			this.state.tmBugSet.operation = '';
			this.setState({loading: true});
			QueryActions.updateTmBug( this.state.tmBug );
		}
	},
	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
		const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4}),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='640px' title="缺陷管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['tm-bug/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			   
			  ]}
			>
		   		<Form layout={layout}>
				   <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="缺陷名称" required={true} colon={true} className={layoutItem} help={hints.bugNameHint} validateStatus={hints.bugNameStatus}>
								<Input type="text" name="bugName" id="bugName" value={this.state.thisTmBug.bugName } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="所属系统" required={true} colon={true} className={layoutItem} help={hints.sysIdHint} validateStatus={hints.sysIdStatus}>
								<Input type="text" name="sysId" id="sysId" value={this.state.thisTmBug.sysId } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout}  label="案例编码" required={true} colon={true} className={layoutItem} help={hints.caseCodeHint} validateStatus={hints.caseCodeStatus}>
								<Input type="text"  readOnly={true} name="caseCode" id="caseCode" value={this.state.thisTmBug.caseCode } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="缺陷类型" required={true} colon={true} className={layoutItem} help={hints.bugTypeHint} validateStatus={hints.bugTypeStatus}>
								<Input type="text" name="bugType" id="bugType" value={this.state.thisTmBug.bugType } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="严重程度" required={true} colon={true} className={layoutItem} help={hints.bugSeverityHint} validateStatus={hints.bugSeverityStatus}>
								<Input type="text" name="bugSeverity" id="bugSeverity" value={this.state.thisTmBug.bugSeverity } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="优先级" required={true} colon={true} className={layoutItem} help={hints.bugPriortyHint} validateStatus={hints.bugPriortyStatus}>
								<Input type="text" name="bugPriorty" id="bugPriorty" value={this.state.thisTmBug.bugPriorty } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="重现概率" required={true} colon={true} className={layoutItem} help={hints.bugChanceHint} validateStatus={hints.bugChanceStatus}>
								<Input type="text" name="bugChance" id="bugChance" value={this.state.thisTmBug.bugChance } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="所属项目" required={true} colon={true} className={layoutItem} help={hints.prjIdHint} validateStatus={hints.prjIdStatus}>
								<Input type="text" name="prjId" id="prjId" value={this.state.thisTmBug.prjId } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="当前处理人" required={true} colon={true} className={layoutItem} help={hints.bugResponsibleHint} validateStatus={hints.bugResponsibleStatus}>
								<Input type="text" name="bugResponsible" id="bugResponsible" value={this.state.thisTmBug.bugResponsible } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="备注" required={true} colon={true} className={layoutItem} help={hints.remarkHint} validateStatus={hints.remarkStatus}>
								<Input type="text" name="remark" id="remark" value={this.state.thisTmBug.remark } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>

					<FormItem {...formItemLayout2} label="缺陷描述" required={true} colon={true} className={layoutItem} help={hints.bugDespHint} validateStatus={hints.bugDespStatus}>
							<Input type="textarea" name="bugDesp" id="bugDesp" value={this.state.thisTmBug.bugDesp } onChange={this.handleOnChange} style={{ height: '100px' }} placeholder="请输入描述信息" />
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default TmBugPage;

