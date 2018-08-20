import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var ContractStore = require('../data/ContractStore');
var ContractActions = require('../action/ContractActions');

var UpdateContractPage = React.createClass({
	getInitialState : function() {
		return {
			contractSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			contract: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ContractStore, "onServiceComplete"), ModalForm('contract')],
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
				  contractSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'custName', desc:'客户名称', required: false, max: '64'},
			{id: 'contCode', desc:'合同编号', required: false, max: '64'},
			{id: 'contType', desc:'合同类型', required: false, max: '64'},
			{id: 'contName', desc:'合同名称', required: true, max: '128'},
			{id: 'contAmount', desc:'合同金额', required: false, max: '16'},
			{id: 'purchase', desc:'采购金额', required: false, max: '16'},
			{id: 'salName', desc:'销售姓名', required: false, max: '32'},
			{id: 'manMonth', desc:'预估人月', required: false, max: '16'},
			{id: 'signDate', desc:'签订日期', required: false, max: '24'},
			{id: 'endDate', desc:'结束日期', required: false, max: '24'},
			{id: 'beginDate', desc:'开始日期', required: false, max: '24'},
			{id: 'contStage', desc:'执行阶段', required: false, max: '64'},

		];
		this.initPage( this.props.contract );
	},

	initPage: function(contract)
	{
		Utils.copyValue(contract, this.state.contract);
		this.setState( {loading: false, hints: {}} );
		
		this.state.contractSet.operation='';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.contract)){
			this.state.contractSet.operation = '';
			this.setState({loading: true});
			ContractActions.updateProjContract( this.state.contract );
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
					<TabPane tab="修改合同" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['proj_contract/update']}/>
			            	
                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<FormItem {...formItemLayout} label="客户名称" required={false} colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
										<Input type="text" name="custName" id="custName" value={this.state.contract.custName } onChange={this.handleOnChange} disabled={true}/>
									</FormItem>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="合同编号" required={false} colon={true} className={layoutItem} help={hints.contCodeHint} validateStatus={hints.contCodeStatus}>
											<Input type="text" name="contCode" id="contCode" value={this.state.contract.contCode } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
								</Row>
								<Row>
									<FormItem {...formItemLayout} label="合同名称" required={true} colon={true} className={layoutItem} help={hints.contNameHint} validateStatus={hints.contNameStatus}>
										<Input type="text" name="contName" id="contName" value={this.state.contract.contName } onChange={this.handleOnChange} />
									</FormItem>
								</Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="合同类型" required={false} colon={true} className={layoutItem} help={hints.contTypeHint} validateStatus={hints.contTypeStatus}>
                                            <DictSelect name="contType" id="contType" value={this.state.contract.contType} appName='项目管理' optName='合同类型' onSelect={this.handleOnSelected.bind(this, "contType")} />
                                        </FormItem>
                                    </Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="合同金额" required={false} colon={true} className={layoutItem} help={hints.contAmountHint} validateStatus={hints.contAmountStatus}>
											<Input type="text" name="contAmount" id="contAmount" value={this.state.contract.contAmount } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="采购金额" required={false} colon={true} className={layoutItem} help={hints.purchaseHint} validateStatus={hints.purchaseStatus}>
											<Input type="text" name="purchase" id="purchase" value={this.state.contract.purchase } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="预估人月" required={false} colon={true} className={layoutItem} help={hints.manMonthHint} validateStatus={hints.manMonthStatus}>
											<Input type="text" name="manMonth" id="manMonth" value={this.state.contract.manMonth } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="销售姓名" required={false} colon={true} className={layoutItem} help={hints.salNameHint} validateStatus={hints.salNameStatus}>
											<Input type="text" name="salName" id="salName" value={this.state.contract.salName } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="签订日期" required={false} colon={true} className={layoutItem} help={hints.signDateHint} validateStatus={hints.signDateStatus}>
											<DatePicker style={{width:'100%'}} name="signDate" id="signDate"  value={this.formatDate(this.state.contract.signDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"signDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
											<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  value={this.formatDate(this.state.contract.beginDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结束日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
											<DatePicker style={{width:'100%'}} name="endDate" id="endDate"  value={this.formatDate(this.state.contract.endDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<FormItem {...formItemLayout} label="执行阶段" required={false} colon={true} className={layoutItem} help={hints.contStageHint} validateStatus={hints.contStageStatus}>
                                        <DictSelect name="contStage" id="contStage" value={this.state.contract.contStage} appName='项目管理' optName='合同状态' onSelect={this.handleOnSelected.bind(this, "contStage")} />
									</FormItem>
								</Row>
								<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

export default UpdateContractPage;

