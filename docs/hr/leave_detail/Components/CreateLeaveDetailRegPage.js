import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var LeaveUtil = require('../../leave/LeaveUtil');

import { Form, Button, Input, Select, DatePicker, Row, Col, Tabs, Spin} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../lib/Components/SearchEmployee';
var LeaveDetailRegStore = require('../data/LeaveDetailRegStore');
var LeaveDetailActions = require('../action/LeaveDetailActions');
var LeaveActions = require('../../leave/action/LeaveActions');
import BatchCreateLeavePage from './BatchCreateLeavePage';
var CreateLeaveDetailRegPage = React.createClass({
	getInitialState : function() {
		return {
			detailSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
            leaveLoading: false,
            selectKey: '2',
			leaveType:'',
			leave:{},
			leave2:{},
			detail: {},
            user: {},
			hints: {},
			validRules: [],
		}
	},

	mixins: [Reflux.listenTo(LeaveDetailRegStore, "onServiceComplete"), ModalForm('detail')],
	onServiceComplete: function(data) {
        if( data.operation === 'retrieveLeave'){
		    Utils.copyValue(data.leave, this.state.leave2);

            // 查询休假数量
            this.setState({
                leaveLoading: false,
                leave: data.leave,
            });
        }

        if(data.operation === 'create'){
            if( data.errMsg === ''){
                // 更新缓存数据
                LeaveActions.refreshPage(this.state.leave2);

                // 成功，关闭窗口
                this.goBack();
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    detailSet: data
                });
            }
        }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'leaveType', desc:'假期类型', required: true, max: '32'},
			{id: 'accrued', desc:'应计天数', required: true, max: '16'},
			{id: 'effectDate', desc:'生效日期', required: false, max: '24'},
			{id: 'expiryDate', desc:'失效日期', required: false, max: '24'},
			{id: 'remnant', desc:'剩余天数', required: false, max: '16'},
		];

		this.clear();
	},

    clear: function () {
        var d = new Date();
		this.state.hints = {};
		this.state.detail.uuid='';
		this.state.detail.userUuid = '';
        this.state.detail.leaveType ='dayoff';
		this.state.detail.accrued='';
        this.state.detail.effectDate = ''+(d.getFullYear() * 100 + (d.getMonth() + 1));
        this.state.detail.expiryDate = ''+((1+d.getFullYear()) * 100 + (d.getMonth() + 1));
		this.state.detail.remnant='';
		this.state.detail.spend='0';
		this.state.detail.replacement='0';
		this.state.detail.repAmount='0';

        this.state.leaveType = 'dayoff';
	    this.state.detailSet.operation='';
	    if( typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
        }

        this.state.leave2 = {};
        this.setState({ loading: false });
	},
	onSelectEmpLoyee:function(data){
        this.state.detail.userUuid = data.uuid;
		this.state.detail.staffCode = data.staffCode;
		this.state.detail.perName = data.perName;
		this.state.detail.deptUuid = data.deptUuid;
		this.state.detail.deptName = data.deptName;

        this.setState({
		   leaveLoading:true,
           user:data,
        })

		LeaveDetailActions.retrieveLeave(data.staffCode);
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.detail)){
			this.state.detailSet.operation = '';
			this.setState({loading: true});

			this.state.detail.remnant = this.state.detail.accrued;
			var obj = {
				"leave":this.state.leave2,
				"detail":this.state.detail,
			};

			LeaveDetailActions.createHrLeaveDetailRegWithLeave( obj );
		}
	},

    getRemnant: function (oldValue){
        var accrued = this.state.detail.accrued;
        return LeaveUtil.getRemnant(oldValue, accrued);
	},
	handleOnSelected2 : function(id, value) {
		var oldLeaveType = this.state.leaveType;
		if(oldLeaveType!==""){
			this.state.leave2[oldLeaveType] = this.state.leave[oldLeaveType];
		}

		var remnant1 = this.state.leave[value];
		this.state.leave2[value] = this.getRemnant(remnant1);

		var obj = this.state.detail;
		obj[id] = value;
		Common.validator(this, obj, id);
		this.setState({
			leaveType:value,
		});
	},
    handleOnChange3: function (e) {
        // 明细
        var obj = this.state.detail;
        var msg = LeaveUtil.changeRemnantValue(obj, e.target.id, e.target.value);
        this.state.hints[e.target.id + 'Hint'] = msg;

		var leaveType = this.state.leaveType;
		var remnant1 = this.state.leave[leaveType];
        this.state.leave2[leaveType] = this.getRemnant(remnant1);

        this.setState({
            loading: this.state.loading
        });
	},
    handleOnChange2: function (e) {
        // 汇总
        var obj = this.state.leave2;
        var msg = LeaveUtil.changeRemnantValue(obj, e.target.id, e.target.value);

        this.state.hints[e.target.id + 'Hint'] = msg;
		this.setState({
			loading: this.state.loading
		});
	},
	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
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

        var leaveType = this.state.leaveType;
        var remnant1 = this.state.leave[leaveType];
        var remnant2 = this.state.leave2[leaveType];
        var fields = LeaveUtil.getRemnantFields(this);
        var accruedFields = LeaveUtil.getAccruedFields(this, [9,3,8,4]);
		var corpUuid = window.loginData.compUser.corpUuid;

		var hints=this.state.hints;
        var form =
            <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
				<SearchEmployee style={{padding:'10px 0 16px 40px', width:'600px'}} corpUuid={corpUuid} onSelectEmpLoyee={this.onSelectEmpLoyee}/>
				<Form layout={layout} style={{maxWidth:'600px', width:'100%'}}>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
								<Input style={{zIndex:'2'}} type="text" name="staffCode" id="staffCode" value={this.state.user.staffCode } disabled={true}/>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem {...formItemLayout2} label="员工姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
								<Input style={{zIndex:'2'}} type="text" name="perName" id="perName" value={this.state.user.perName } disabled={true}/>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
							<FormItem {...formItemLayout2} label="任职部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
								<Input style={{zIndex:'2'}} type="text" name="deptName" id="deptName" value={this.state.user.deptName } disabled={true}/>
							</FormItem>
						</Col>
    					<Col span="12">
						</Col>
					</Row>
					<Row style={{margin:'24px 0 0 0'}}>
						<Col span="12">
                            <FormItem {...formItemLayout2} label="假期类型" required={true} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                                <DictSelect name="leaveType" id="leaveType" value={this.state.detail.leaveType} appName='HR系统' optName='假期类型' onSelect={this.handleOnSelected2.bind(this, "leaveType")}/>
                            </FormItem>
						</Col>
    					<Col span="12">
                            <FormItem {...formItemLayout2} label="应计天数" required={true} colon={true} className={layoutItem} help={hints.accruedHint} validateStatus={hints.accruedStatus}>
                                {accruedFields.accruedFields}
                            </FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
                            <FormItem {...formItemLayout2} label="生效日期" required={false} colon={true} className={layoutItem} help={hints.effectDateHint} validateStatus={hints.effectDateStatus}>
                                <MonthPicker  style={{width:'100%'}}  name="effectDate" id="effectDate" value={this.formatMonth(this.state.detail.effectDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"effectDate", Common.monthFormat)} />
                            </FormItem>
						</Col>
    					<Col span="12">
                            <FormItem {...formItemLayout2} label="失效日期" required={false} colon={true} className={layoutItem} help={hints.expiryDateHint} validateStatus={hints.expiryDateStatus}>
                                <MonthPicker  style={{width:'100%'}}  name="expiryDate" id="expiryDate" value={this.formatMonth(this.state.detail.expiryDate, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"expiryDate", Common.monthFormat)} />
                            </FormItem>
						</Col>
					</Row>
                    <FormItem {...formItemLayout} style={{margin:'24px 0 10px 0'}} label="调整前假日" required={false} colon={true} className={layoutItem}>
                        {fields.bfFields}
                    </FormItem>
                    <FormItem {...formItemLayout} label="调整后假日" required={true} colon={true} className={layoutItem} help={hints.remnantHint} validateStatus={hints.remnantStatus}>
                        {fields.afFields}
                    </FormItem>
                    <FormItem style={{textAlign:'right',margin:'12px 0'}} className={layoutItem}>
                        <Button key="btnOK" type="primary" size="large" disabled={leaveType==='' || remnant1===remnant2 || remnant2===''} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                    </FormItem>
                </Form>
            </div>

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-leave-detail/create']}/>
				<Tabs defaultActiveKey="2"   onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="增加带薪休假" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
						{ this.state.leaveLoading ? <Spin>{form}</Spin> : form }
                    </TabPane>
                    <TabPane tab="批量增加假日信息" key="3" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <BatchCreateLeavePage onBack={this.goBack}/>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

module.exports = CreateLeaveDetailRegPage;

