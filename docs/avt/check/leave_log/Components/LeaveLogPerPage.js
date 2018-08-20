'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ModalForm from '../../../../lib/Components/ModalForm';
import { Button, Table, Icon, Input, Modal, Pagination, Form, Row, Col, Spin } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;

var Common = require('../../../../public/script/common');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Utils = require('../../../../public/script/utils');
var LeaveLogPerStore = require('../data/LeaveLogPerStore');
var LeaveLogPerActions = require('../action/LeaveLogPerActions');

var LeaveLogPerPage = React.createClass({
    getInitialState : function() {
      	return {
            leavelogperSet:{
                leavelogper: {},
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading:false,
            leave:{}
      	}
    },

	mixins: [Reflux.listenTo(LeaveLogPerStore, "onServiceComplete")],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve'){
			this.setState({
	            loading: false,
	            leavelogperSet: data
	        });
		}
	},
    componentDidMount : function(){
    	if(window.loginData.compUser){
    		this.setState({loading: true});
	       	var corpUuid = window.loginData.compUser.corpUuid;
	       	var staffCode = window.loginData.compUser.userCode;
	        LeaveLogPerActions.initLeaveLogPerInfo(corpUuid,staffCode);
    	}
        
    },
    

    render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
		// 年假
        var leave = this.state.leavelogperSet.leavelogper;
        var annual = leave.annual ? leave.annual : '' ;
        var pos = annual.indexOf('.');
        if (pos > 0) {
            leave.annual_1 = annual.substr(0, pos);
            leave.annual_2 = annual.substr(pos + 1);
        }
        else {
            leave.annual_1 = annual;
            leave.annual_2 = '0';
        }
        // 调休
        var dayoff = leave.dayoff ?leave.dayoff : '' ;
        var pos = dayoff.indexOf('.');
        if (pos > 0) {
            leave.dayoff_1 = dayoff.substr(0, pos);
            leave.dayoff_2 = dayoff.substr(pos + 1);
        }
        else {
            leave.dayoff_1 = dayoff;
            leave.dayoff_2 = '0';
        }
        
        

		var leavelogper = this.state.leavelogperSet.leavelogper;
	    var obj = this.state.leavelogperSet.leavelogper;
		var hints=this.state.hints;
		var form=(<Form  layout={layout} style={{width:'700px'}}>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="员工姓名" >
							<Input type="text"  name="perName" id="perName" value={this.state.leavelogperSet.leavelogper.perName } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="员工编号" >
							<Input type="text" name="staffCode" id="staffCode" value={this.state.leavelogperSet.leavelogper.staffCode } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem {...formItemLayout2} className={layoutItem} label="公司地点" >
							<Input type="text" name="baseCity" id="baseCity" value={this.state.leavelogperSet.leavelogper.baseCity } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem {...formItemLayout2} className={layoutItem} label="任职部门">
							<Input type="text" name="deptName" id="deptName" value={this.state.leavelogperSet.leavelogper.deptName } readOnly={true} />
						</FormItem>
					</Col>
				</Row>		
				<Row>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} label="年假" required={false} colon={true} className={layoutItem}>
                            <Col className="gutter-row" span={11}>
								<InputGroup compact>
                                	<Input style={{ width:'70%'}} type="text" name="annual_1" id="annual_1" value={leave.annual_1} readOnly={true} />
									<Input style={{ width:'30%',textAlign:'center'}} className="gutter-row" defaultValue="天" readOnly={true}/>
								</InputGroup>
                            </Col>
							<Col span={2}>
							</Col>
                            <Col className="gutter-row" span={11}>
								<InputGroup compact>
                                	<Input style={{ width:'60%'}} type="text" name="annual_2" id="annual_2" value={leave.annual_2} readOnly={true} />
									<Input style={{ width:'40%',textAlign:'center'}} className="gutter-row" defaultValue="小时" readOnly={true}/>
								</InputGroup>
							</Col>	
						</FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
						<FormItem {...formItemLayout} label="调休" required={false} colon={true} className={layoutItem}>
							<Col className="gutter-row" span={11}>
								<InputGroup compact>
									<Input style={{ width:'70%'}} type="text" name="dayoff_1" id="dayoff_1" value={leave.dayoff_1} readOnly={true} />
									<Input style={{ width:'30%',textAlign:'center'}} className="gutter-row" defaultValue="天" readOnly={true}/>
								</InputGroup>
							</Col>
							<Col span={2}>
							</Col>
							<Col className="gutter-row" span={11}>
								<InputGroup compact>
									<Input style={{ width:'60%'}} type="text" name="dayoff_2" id="dayoff_2" value={leave.dayoff_2} readOnly={true} />
									<Input style={{ width:'40%',textAlign:'center'}} className="gutter-row" defaultValue="小时" readOnly={true}/>
								</InputGroup>
							</Col>
						</FormItem>
					</Col>
                </Row>
                <Row>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="婚假" >
							<Input type="text"  name="wedding" id="wedding" value={this.state.leavelogperSet.leavelogper.wedding } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="产假" >
							<Input type="text" name="maternity" id="maternity" value={this.state.leavelogperSet.leavelogper.maternity } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="陪护假" >
							<Input type="text"  name="paternity" id="paternity" value={this.state.leavelogperSet.leavelogper.paternity } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="探亲假" >
							<Input type="text" name="family" id="family" value={this.state.leavelogperSet.leavelogper.family } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="丧假" >
							<Input type="text"  name="funeral" id="funeral" value={this.state.leavelogperSet.leavelogper.funeral } readOnly={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="带薪假" >
							<Input type="text" name="paidLeave" id="paidLeave" value={this.state.leavelogperSet.leavelogper.paidLeave } readOnly={true} />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout} className={layoutItem} label="其他假" >
							<Input type="text"  name="otherLeave" id="otherLeave" value={this.state.leavelogperSet.leavelogper.otherLeave } readOnly={true}/>
						</FormItem>
					</Col>
				</Row>
			</Form>
		);
		return (
			<div style={{padding:"24px 0 16px 20px", height: '100%',overflowY: 'auto'}}>
				<ServiceMsg ref='mxgBox' svcList={['hr-leave/retrieve']}/>
				{this.state.loading ? <Spin>{form}</Spin> : form}
			</div>
		);
	}
});

module.exports = LeaveLogPerPage;
