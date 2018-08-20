import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictSelect from '../../../../lib/Components/DictSelect';
import SelectPool from '../../../lib/Components/SelectPool';

import { Form, Modal, Button, Input, Select, Tabs, DatePicker, Row, Col, Checkbox } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchResMember from '../../../lib/Components/SearchResMember';
var ProjStore = require('../data/ProjStore.js');
var ProjActions = require('../action/ProjActions');

var UpdateProjPage = React.createClass({
	getInitialState : function() {
		return {
			projSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			proj: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProjStore, "onServiceComplete"), ModalForm('proj')],
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
				  projSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'projCode', desc:'项目编号', required: false, max: '64'},
			{id: 'projName', desc:'项目名称', required: true, max: '128'},
			{id: 'beginDate', desc:'开始日期', required: false, max: '24'},
			{id: 'biziType', desc:'业务类型', required: false, max: '32'},
			{id: 'payType', desc:'结算类型', required: false, max: '32'},
            { id: 'induType', desc:'资源池内项目', required: false, max: '32'},
			{id: 'projType', desc:'项目类型', required: false, max: '32'},
			{id: 'delivArea', desc:'交付区域', required: false, max: '64'},
			{id: 'projStatus', desc:'项目状态', required: false, max: '64'},
			{id: 'techArch', desc:'技术框架', required: false, max: '512'},
			{id: 'manMonth', desc:'预估人月', required: false, max: '16'},
            { id: 'projAmount', desc: '项目金额', required: false, max: '16' },
            { id: 'beginTime', desc: '上班时间', required: false, max: '16', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式[hh:mm]错误' },
            { id: 'endTime', desc: '下班时间', required: false, max: '16', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式[hh:mm]错误' },
			{id: 'projLoc', desc:'项目地址', required: false, max: '128'},
			{id: 'endDate', desc:'结束日期', required: false, max: '24'},
			{id: 'pmName', desc:'项目经理姓名', required: false, max: '32'},
			{id: 'projStage', desc:'执行阶段', required: false, max: '64'},
			{id: 'projDesc', desc:'项目说明', required: false, max: '3600'},
			{id: 'manDemand', desc:'人员要求', required: false, max: '3600'},
        ];
        
		this.initPage( this.props.proj );
	},
    componentWillReceiveProps: function (newProps) {
		// this.initPage( newProps.proj );
	},
	
	initPage: function(proj)
    {
		Utils.copyValue(proj, this.state.proj);
        
        if (this.refs.empSearchBox !== undefined) {
            this.refs.empSearchBox.setValue(proj.pmName);
        }

        this.setState({ loading: false, hints: {} });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
	},

	onSelectProj:function(data){
        this.state.proj.pmUuid = data.uuid;
		this.state.proj.pmCode = data.staffCode;
        this.state.proj.pmName = data.perName;
        this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },

    onClickSave: function () {
        if (this.state.proj.induType !== '1') {
            this.state.proj.contUuid = '';
        }

		if(Common.formValidator(this, this.state.proj)){
			this.state.projSet.operation = '';
			this.setState({loading: true});
			ProjActions.updateProjInfo( this.state.proj );
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

        var hints = this.state.hints;
        var corpUuid = window.loginData.compUser.corpUuid
        var boPool = (this.state.proj.induType !== '1');

		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改项目组" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['proj_info/update']}/>

                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="项目编号" required={false} colon={true} className={layoutItem} help={hints.projCodeHint} validateStatus={hints.projCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="projCode" id="projCode" value={this.state.proj.projCode } onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
								</Row>
								
                                <FormItem {...formItemLayout} label="项目名称" required={true} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
									<Input style={{zIndex:'2'}} type="text" name="projName" id="projName" value={this.state.proj.projName } onChange={this.handleOnChange}/>
								</FormItem>
                                <Row>
                                    <Col span="4">
                                    </Col>
                                    <Col span="8">
                                        <FormItem {...formItemLayout2} label="" required={false} colon={true} className={layoutItem} help={hints.induTypeHint} validateStatus={hints.induTypeStatus}>
                                            <Checkbox name="induType" id="induType" checked={this.state.proj.induType === '1'} onChange={this.handleCheckBox}>资源池内部项目组</Checkbox>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="资源池" required={false} colon={true} className={layoutItem} help={hints.contUuidHint} validateStatus={hints.contUuidStatus} >
                                            <SelectPool ref='poolBox' corpUuid={corpUuid} name="contUuid" id="contUuid" value={this.state.proj.contUuid} onSelect={this.handleOnSelected.bind(this, "contUuid")} disabled={boPool}/>
                                        </FormItem>
                                    </Col>
                                </Row>

								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="业务类型" required={false} colon={true} className={layoutItem} help={hints.biziTypeHint} validateStatus={hints.biziTypeStatus}>
											<DictSelect name="biziType" id="biziType" value={this.state.proj.biziType} appName='项目管理' optName='业务类型' onSelect={this.handleOnSelected.bind(this, "biziType")}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结算类型" required={false} colon={true} className={layoutItem} help={hints.payTypeHint} validateStatus={hints.payTypeStatus}>
                                            <DictSelect name="payType" id="payType" value={this.state.proj.payType} appName='项目管理' optName='订单结算类型' onSelect={this.handleOnSelected.bind(this, "payType")}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="项目类型" required={false} colon={true} className={layoutItem} help={hints.projTypeHint} validateStatus={hints.projTypeStatus}>
                                            <DictSelect name="projType" id="projType" value={this.state.proj.projType} appName='项目管理' optName='项目类型' onSelect={this.handleOnSelected.bind(this, "projType")} />
                                        </FormItem>
									</Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="项目地址" required={false} colon={true} className={layoutItem} help={hints.projLocHint} validateStatus={hints.projLocStatus}>
                                            <Input type="text" name="projLoc" id="projLoc" value={this.state.proj.projLoc} onChange={this.handleOnChange} />
                                        </FormItem>
									</Col>
								</Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="项目经理" required={false} colon={true} className={layoutItem} help={hints.pmNameHint} validateStatus={hints.pmNameStatus}>
                                            <SearchResMember corpUuid={corpUuid} type="text" ref='empSearchBox' name="pmName" id="pmName" value={this.state.proj.pmName} onSelectMember={this.onSelectProj} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="项目状态" required={false} colon={true} className={layoutItem} help={hints.projStatusHint} validateStatus={hints.projStatusStatus} >
                                            <DictSelect name="projStatus" id="projStatus" value={this.state.proj.projStatus} appName='项目管理' optName='项目群状态' onSelect={this.handleOnSelected.bind(this, "projStatus")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="上班时间" required={false} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus} >
                                            <Input type="text" name="beginTime" id="beginTime" value={this.state.proj.beginTime} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="下班时间" required={false} colon={true} className={layoutItem} help={hints.endTimeHint} validateStatus={hints.endTimeStatus} >
                                            <Input type="text" name="endTime" id="endTime" value={this.state.proj.endTime} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
		                                    <DatePicker  style={{width:'100%'}}  name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.proj.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
		                                </FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结束日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
		                                    <DatePicker  style={{width:'100%'}}  name="endDate" id="endDate"  format={Common.dateFormat} value={this.formatDate(this.state.proj.endDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"endDate", Common.dateFormat)}/>
		                                </FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="项目说明" required={false} colon={true} className={layoutItem} help={hints.projDescHint} validateStatus={hints.projDescStatus} >
									<Input type="textarea" name="projDesc" id="projDesc" value={this.state.proj.projDesc} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

export default UpdateProjPage;

/*
    <FormItem {...formItemLayout} label="技术框架" required={false} colon={true} className={layoutItem} help={hints.techArchHint} validateStatus={hints.techArchStatus} >
        <Input type="textarea" name="techArch" id="techArch" value={this.state.proj.techArch} onChange={this.handleOnChange} />
    </FormItem>
	<Row>
		<Col span="12">
			<FormItem {...formItemLayout2} label="交付区域" required={false} colon={true} className={layoutItem} help={hints.delivAreaHint} validateStatus={hints.delivAreaStatus}>
				<DictSelect name="delivArea" id="delivArea" value={this.state.proj.delivArea} appName='项目管理' optName='交付区域' onSelect={this.handleOnSelected.bind(this, "delivArea")}/>
			</FormItem>
		</Col>
		<Col span="12">
            <FormItem {...formItemLayout2} label="执行阶段" required={false} colon={true} className={layoutItem} help={hints.projStageHint} validateStatus={hints.projStageStatus}>
                <Input type="text" name="projStage" id="projStage" value={this.state.proj.projStage} onChange={this.handleOnChange} />
            </FormItem>
		</Col>
	</Row>
    <FormItem {...formItemLayout} label="人员要求" required={false} colon={true} className={layoutItem} help={hints.manDemandHint} validateStatus={hints.manDemandStatus}>
		<Input type="textarea" name="manDemand" id="manDemand" value={this.state.proj.manDemand} onChange={this.handleOnChange} style={{height: '100px'}}/>
	</FormItem>
    <FormItem {...formItemLayout2} label="行业类型" required={false} colon={true} className={layoutItem} help={hints.induTypeHint} validateStatus={hints.induTypeStatus}>
        <DictSelect name="induType" id="induType" value={this.state.proj.induType} appName='项目管理' optName='所属行业' onSelect={this.handleOnSelected.bind(this, "induType")} />
    </FormItem>
*/

