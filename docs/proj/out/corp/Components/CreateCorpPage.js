import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';

import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var CorpStore = require('../data/CorpStore.js');
var CorpActions = require('../action/CorpActions');

var CreateCorpPage = React.createClass({
	getInitialState : function() {
		return {
			corpSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			corp: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(CorpStore, "onServiceComplete"), ModalForm('corp')],
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
	              corpSet: data
	          });
	      }
	  }
	},

	// 第一次加载

	componentDidMount : function(){
	    this.state.validRules = [
            { id: 'memberUuid', desc: '会员编号', required: false, max: '24'},
		    {id: 'corpCode', desc:'公司编号', required: true, max: '64'},
		    {id: 'corpName', desc:'公司名称', required: true, max: '64'},
		    {id: 'corpDesc', desc:'公司描述', required: false, max: '3000'},
		    {id: 'corpLoc', desc:'公司地址', required: false, max: '256'},
		    {id: 'corpLevel', desc:'公司级别', required: false, max: '16'},
		    {id: 'corpType', desc:'外协类型', required: false, max: '32'}
        ];
	},
	clear : function(corpUuid){
		this.state.hints = {};
		this.state.corp.corpUuid = corpUuid;
		this.state.corp.memberUuid='';
		this.state.corp.corpCode='';
		this.state.corp.corpName='';
		this.state.corp.corpDesc='';
		this.state.corp.corpLoc='';
		this.state.corp.corpLevel='';
		this.state.corp.corpType='项目';

		this.state.loading = false;
	    this.state.corpSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.corp)){
			this.setState({loading: true});
			CorpActions.createOutCorp( this.state.corp );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout3 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};


		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加外协公司" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['out-corp/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>

				<Form layout={layout}>
                    <FormItem {...formItemLayout} label="会员查询" required={false} colon={true} className={layoutItem} help={hints.memberUuidHint} validateStatus={hints.memberUuidStatus}>
						<Input type="text" name="memberUuid" id="memberUuid" value={this.state.corp.memberUuid } onChange={this.handleOnChange} placeholder="根据名称查询"/>
					</FormItem>
					<FormItem {...formItemLayout} label="公司编号" required={true} colon={true} className={layoutItem} help={hints.corpCodeHint} validateStatus={hints.corpCodeStatus}>
						<Input type="text" name="corpCode" id="corpCode" value={this.state.corp.corpCode } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="公司名称" required={true} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
						<Input type="text" name="corpName" id="corpName" value={this.state.corp.corpName } onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} label="公司说明" required={false} colon={true} className={layoutItem} help={hints.corpDescHint} validateStatus={hints.corpDescStatus}>
						<Input type="textarea" name="corpDesc" id="corpDesc" value={this.state.corp.corpDesc } onChange={this.handleOnChange} style={{height:'80px'}}/> 
					</FormItem>
					<FormItem {...formItemLayout} label="所在城市" required={false} colon={true} className={layoutItem} help={hints.corpLocHint} validateStatus={hints.corpLocStatus}>
						<Input type="text" name="corpLoc" id="corpLoc" value={this.state.corp.corpLoc } onChange={this.handleOnChange} />
					</FormItem>
					<Row>
						<Col span="12">
                            <FormItem {...formItemLayout3} label="外协类型" required={false} colon={true} className={layoutItem} help={hints.corpTypeHint} validateStatus={hints.corpTypeStatus} >
								<DictSelect name="corpType" id="corpType" value={this.state.corp.corpType} appName='项目管理' optName='外协类型' onSelect={this.handleOnSelected.bind(this, "corpType")}/>
							</FormItem>
						</Col>	
						<Col span="12">
							<FormItem {...formItemLayout3} label="信用评分" required={false} colon={true} className={layoutItem} help={hints.corpLevelHint} validateStatus={hints.corpLevelStatus}>
								<Input type="text" name="corpLevel" id="corpLevel" value={this.state.corp.corpLevel } onChange={this.handleOnChange} />
							</FormItem>
						</Col>	
					</Row>
				</Form>

			</Modal>
		);
	}
});

export default CreateCorpPage;

