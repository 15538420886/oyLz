import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../lib/Components/DeptTreeSelect';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var LeaveStore = require('../data/LeaveStore');
var LeaveActions = require('../action/LeaveActions');


var SearchEmployee = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],

			leave: {
				corpUuid:window.loginData.compUser.corpUuid,
                perName:'',
                staffCode:'',
                baseCity:'',
                deptUuid:'',
                entryMonth:''
			},
		}
	},

    mixins: [ModalForm('leave')],
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            {id: 'staffCode', desc:'员工编号', required: false, max: '0'},
            {id: 'baseCity', desc:'归属地', required: false, max: '0'},
            {id: 'deptName', desc:'部门名称', required: false, max: '0'},
            {id: 'entryMonth', desc:'入职月份', required: false, max: '0'},
		];
	},

    //属性变化
     componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

	render : function() {
	   if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 3}),
			wrapperCol: ((layout=='vertical') ? null : {span: 21}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};
        var hints=this.state.hints;
	    return (
            <div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '760px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row  gutter={18}>
							<Col className="gutter-row" span={8}>
							</Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.leave.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.leave.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
							<Col className="gutter-row" span={8}>
								<FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
									<Input type="text" name="baseCity" id="baseCity" value={this.state.leave.baseCity } onChange={this.handleOnChange} />
								</FormItem>
							</Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptUuidHint} validateStatus={hints.deptUuidStatus}>
                                    <DeptTreeSelect name="deptUuid" id="deptUuid" value={this.state.leave.deptUuid } onSelect={this.handleOnSelected.bind(this, "deptUuid")}  />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="入职月份" required={false} colon={true} className={layoutItem} help={hints.entryMonthHint} validateStatus={hints.entryMonthStatus}>
									<MonthPicker  style={{width:'100%'}}  name="entryMonth" id="entryMonth" value={this.formatMonth(this.state.leave.entryMonth, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"entryMonth", Common.monthFormat)} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

	    );
	}
});
module.exports = SearchEmployee;
