'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import BenefitsTable from './Components/BenefitsTable';
import CodeMap from '../../../hr/lib/CodeMap';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Row, Col, Button, Input, Spin, Tabs} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var  InsuNameForm = require('./Components/InsuNameForm');
var  AllowNameForm = require('./Components/AllowNameForm');
var  TripNameTable = require('./Components/TripNameTable');
var EmployeeSalaryStore = require('./data/BenefitsStore.js');
var BenefitsActions = require('./action/BenefitsActions');


var BenefitsPage = React.createClass({
	getInitialState : function() {
		return {
			benefitsSet: {
				hbu: {},
            	hbList: [],
				operation : '',
				errMsg : ''
			},

            loading: false,
            selectKey: '1',
		}
	},
	mixins: [Reflux.listenTo(EmployeeSalaryStore, "onServiceComplete"),CodeMap()],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve_p'){
			this.setState({
				loading: false,
				benefitsSet: data,
			});
		}
	},

	// 第一次加载
	componentDidMount : function(){
		if(window.loginData.compUser){
			var filter = {};
			filter.staffCode=window.loginData.compUser.userCode;
			filter.corpUuid=window.loginData.compUser.corpUuid;
			this.setState({loading: true});
			BenefitsActions.initHrBenefits(filter);
		}
	},
    onTabChange: function (activeKey) {
        this.setState({ selectKey: activeKey });
	},

	render : function() {
		var corpUuid= window.loginData.compUser.corpUuid;
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 10}),
			wrapperCol: ((layout=='vertical') ? null : {span: 14}),
		};
		var page=<InsuNameForm  insuName={this.getInsuName(corpUuid, this.state.benefitsSet.hbu.insuName)}/>
		const form = <Form layout={layout} style={{width:'100%', maxWidth:'800px'}}>
				<Row>
					<Col span="8">
						<FormItem {...formItemLayout2} label="员工编号" className={layoutItem} >
							<Input type="text" name="staffCode" id="staffCode" value={this.state.benefitsSet.hbu.staffCode } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="任职部门" className={layoutItem} >
							<Input type="text" name="deptName" id="deptName" value={this.state.benefitsSet.hbu.deptName } readOnly={true} />
						</FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem {...formItemLayout2} label="生效日期" className={layoutItem} >
                            <Input type="text" name="effectDate" id="effectDate" value={Common.formatDate(this.state.benefitsSet.hbu.effectDate, Common.dateFormat)} readOnly={true} />
                        </FormItem>
                    </Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem {...formItemLayout2} label="工资卡" className={layoutItem} >
							<Input type="text" name="salaryCard" id="salaryCard" value={this.state.benefitsSet.hbu.salaryCard } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="报销卡" className={layoutItem} >
							<Input type="text" name="reimCard" id="reimCard" value={this.state.benefitsSet.hbu.reimCard } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem {...formItemLayout2} label="基本工资" className={layoutItem} >
							<Input type="text" name="salary" id="salary" value={this.state.benefitsSet.hbu.salary } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="绩效工资" className={layoutItem} >
							<Input type="text" name="salary2" id="salary2" value={this.state.benefitsSet.hbu.salary2 } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="岗位津贴" className={layoutItem} >
							<Input type="text" name="salary3" id="salary3" value={this.state.benefitsSet.hbu.salary3 } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem {...formItemLayout2} label="项目经费" className={layoutItem} >
							<Input type="text" name="salary7" id="salary7" value={this.state.benefitsSet.hbu.salary7 } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="加班补贴基数" className={layoutItem} >
							<Input type="text" name="salary6" id="salary6" value={this.state.benefitsSet.hbu.salary6 } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="笔记本补贴" className={layoutItem} >
							<Input type="text" name="devAllow" id="devAllow" value={this.state.benefitsSet.hbu.devAllow } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem {...formItemLayout2} label="社保基数" className={layoutItem} >
							<Input type="text" name="insuBase" id="insuBase" value={this.state.benefitsSet.hbu.insuBase } readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="公积金基数" className={layoutItem} >
							<Input type="text" name="cpfBase" id="cpfBase" value={this.state.benefitsSet.hbu.cpfBase } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="8">
						<FormItem {...formItemLayout2} label="社保类型" className={layoutItem} >
							<Input type="text" ref="insuName" name="insuName" id="insuName" value={this.getInsuName(corpUuid, this.state.benefitsSet.hbu.insuName)} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="补贴类型" className={layoutItem} >
							<Input type="text" ref="allowName" name="allowName" id="allowName" value={this.getAllowName(corpUuid, this.state.benefitsSet.hbu.allowName)} readOnly={true} />
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem {...formItemLayout2} label="差旅级别" className={layoutItem} >
							<Input type="text" name="tripName" id="tripName" value={this.getTripName(corpUuid, this.state.benefitsSet.hbu.tripName)} readOnly={true} />
						</FormItem>
					</Col>
				</Row>
			</Form>

        var page1 = null;
        var page2 = null;
        var page3 = null;
        if (this.state.selectKey == 1) {
            page1 = <InsuNameForm insuName={this.getInsuName(corpUuid, this.state.benefitsSet.hbu.insuName)} />
        }
        else if (this.state.selectKey == 2) {
            page2 = <AllowNameForm allowName={this.getAllowName(corpUuid, this.state.benefitsSet.hbu.allowName)} />
        }
        else if (this.state.selectKey == 3) {
            page3 = <TripNameTable tripName={this.getTripName(corpUuid, this.state.benefitsSet.hbu.tripName)} />
        }

		return (
			<div>
                <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
					<ServiceMsg ref='mxgBox' svcList={['hr-benefits/retrieve_p', 'hr-benefits/retrieveTable']}/>
					<BenefitsTable hbList={this.state.benefitsSet.hbList} />

					{
						this.state.loading? <Spin>{form}</Spin>:form
					}

	                <div className='tab-page' style={{padding:"10px 0 16px 16px"}}>
                        <Tabs ref='insuTabs' activeKey={this.state.selectKey}  onChange={this.onTabChange}>
	                        <TabPane tab="社保" key="1" >
								{page1}
	                        </TabPane>
	                        <TabPane tab="补贴" key="2">
                                {page2}
	                        </TabPane>
	                        <TabPane tab="差旅" key="3">
                                {page3}
	                        </TabPane>
	                    </Tabs>
	                </div>
				</div>

			</div>
		);
	}
});

module.exports = BenefitsPage;

/*
	<Row>
		<Col span="8">
			<FormItem {...formItemLayout2} label="审批人" className={layoutItem} >
				<Input type="text" name="approver" id="approver" value={this.state.benefitsSet.hbu.approver } readOnly={true} />
			</FormItem>
        </Col>
        <Col span="8">
            <FormItem {...formItemLayout2} label="工资卡银行" className={layoutItem} >
                <Input type="text" name="salaryBank" id="salaryBank" value={this.state.benefitsSet.hbu.salaryBank} readOnly={true} />
            </FormItem>
        </Col>
        <Col span="8">
            <FormItem {...formItemLayout2} label="报销卡银行" className={layoutItem} >
                <Input type="text" name="reimBank" id="reimBank" value={this.state.benefitsSet.hbu.reimBank} readOnly={true} />
            </FormItem>
        </Col>
	</Row>
*/
