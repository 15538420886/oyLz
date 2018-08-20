import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
import QuickFill from '../../../lib/Components/QuickFill';

import { Form, Modal, Button, Input, Select ,DatePicker,Tabs,Col,Row} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import SearchEmployee from '../../lib/Components/SearchEmployee';
import DictSelect from '../../../lib/Components/DictSelect';
var ContractStore = require('../data/ContractStore');
var ContractActions = require('../action/ContractActions');

var CreateContractPage = React.createClass({
	getInitialState : function() {
		return {
			contractSet: {
				operation : '',
				errMsg : ''
			},

			loading: false,
			contract: {},
			user:{},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ContractStore, "onServiceComplete"), ModalForm('contract')],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
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
			{id: 'staffCode', desc:'员工编号', required: false, max: '64'},
			{id: 'perName', desc:'姓名', required: false, max: '32'},
			{id: 'contCode', desc:'合同编号', required: false, max: '128'},
			{id: 'contVer', desc:'合同版本', required: false, max: '64'},
			{id: 'signDate', desc:'签订日期', required: false, max: '24'},
			{id: 'jobName', desc:'签订岗位', required: false, max: '64'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'expiryDate', desc:'失效日期', required: false, max: '24'},
			{id: 'signLoc', desc:'签订地点', required: false, max: '128'},
			{id: 'signType', desc:'签订方式：现场、邮寄', required: false, max: '12'},
			{id: 'hrName', desc:'HR人员', required: false, max: '24'},
		];

		this.clear();
	},

	handleKeyDown: function (e) {
		if (73 == e.keyCode && e.ctrlKey && e.altKey) {
			var w = this.refs.QuickFillWindow;
			if (w) {
				w.initPage(this.state.validRules);
				w.toggle();
			}
		}
	},

	clear : function(){

		window.addEventListener('keydown', this.handleKeyDown);

		this.state.hints = {};
		this.state.contract.uuid='';
		this.state.contract.corpUuid = window.loginData.compUser.corpUuid;
		this.state.contract.userUuid = '';

		this.state.contract.staffCode='';
		this.state.contract.perName='';
		this.state.contract.contCode='';
		this.state.contract.jobName='';
		this.state.contract.signDate='';
		this.state.contract.effectDate='';
		this.state.contract.expiryDate='';
		this.state.contract.hrName='';
		this.state.contract.signLoc='';
		this.state.contract.signType='';
		this.state.contract.contVer='';
		this.state.contract.status='1';

		this.state.loading = false;
	    if( typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},
	onSelectEmpLoyee:function(data){
        this.state.contract.userUuid = data.uuid;
		this.state.contract.staffCode = data.staffCode;
		this.state.contract.perName = data.perName;

        this.setState({
            user:data,
        })
    },
	showError:function(data){
        console.log(data)
    },
	onClickSave : function(){
		this.setState({ loading: true });
		ContractActions.createHrContract( this.state.contract );
	},
	goBack:function(){
		window.removeEventListener('keydown', this.handleKeyDown);
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.goBack();
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		var boo = this.state.contract.userUuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
                    <TabPane tab="增加合同#" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"16px 0 16px 8px", height: '100%',width:'100%',overflowY: 'auto'}}>
							<div style={{width:'100%', maxWidth:'600px'}}>
				        	<ServiceMsg ref='mxgBox' svcList={['hr_contract/create']}/>
                            <SearchEmployee style={{padding:'10px 0 16px 32px', width:'600px'}} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee}/>

					 		<Form layout={layout}>
								<FormItem {...formItemLayout} label="员工号"  required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
									<Input type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode } disabled={true} />
								</FormItem>
								<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
									<Input type="text" name="perName" id="perName" value={this.state.user.perName } disabled={true} />
								</FormItem>
								<FormItem {...formItemLayout} label="合同编号" required={false} colon={true} className={layoutItem} help={hints.contCodeHint} validateStatus={hints.contCodeStatus}>
									<Input type="text" name="contCode" id="contCode" value={this.state.contract.contCode } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="合同版本" required={false} colon={true} className={layoutItem} help={hints.contVerHint} validateStatus={hints.contVerStatus}>
									<Input type="text" name="contVer" id="contVer" value={this.state.contract.contVer } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="岗位" required={false} colon={true} className={layoutItem} help={hints.jobNameHint} validateStatus={hints.jobNameStatus}>
									<Input type="text" name="jobName" id="jobName" value={this.state.contract.jobName } onChange={this.handleOnChange} />
								</FormItem>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="签订日期" required={false} colon={true} className={layoutItem} help={hints.signDateHint} validateStatus={hints.signDateStatus}>
											<DatePicker style={{width:'100%'}} name="signDate" id="signDate"  value={this.formatDate(this.state.contract.signDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"signDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="HR人员" required={false} colon={true} className={layoutItem} help={hints.hrNameHint} validateStatus={hints.hrNameStatus}>
											<Input type="text" name="hrName" id="hrName" value={this.state.contract.hrName } onChange={this.handleOnChange} />
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
											<DatePicker   style={{width:'100%',zIndex:'2'}} name="effectDate" id="effectDate"  value={this.formatDate(this.state.contract.effectDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="失效日期" required={false} colon={true} className={layoutItem} help={hints.expiryDateHint} validateStatus={hints.expiryDateStatus}>
											<DatePicker style={{width:'100%'}} name="expiryDate" id="expiryDate"  value={this.formatDate(this.state.contract.expiryDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"expiryDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="签订地点" required={false} colon={true} className={layoutItem} help={hints.signLocHint} validateStatus={hints.signLocStatus}>
									<Input type="text" name="signLoc" id="signLoc" value={this.state.contract.signLoc } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="签订方式" required={false} colon={true} className={layoutItem} help={hints.signTypeHint} validateStatus={hints.signTypeStatus}>
									<DictSelect name="signType" id="signType" value={this.state.contract.signType}  appName='HR系统' optName='签订方式' onSelect={this.handleOnSelected.bind(this, "signType")}/>
								</FormItem>
								 <FormItem style={{textAlign:'right',padding:'4px 0'}} required={false} colon={true} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading} disabled={boo}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
							</Form>
							<QuickFill ref='QuickFillWindow' self={this} object='contract' />
						</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
});

module.exports = CreateContractPage;
