import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../lib/Components/DeptTreeSelect';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var EmployeeFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			filter: {
				corpUuid:window.loginData.compUser.corpUuid,
                perName:'',
                staffCode:'',
                baseCity:'',
                deptUuid:'',
                eduDegree:'',
                induYear:'',
                status:'',
                entryMonth:''
			},
		}
	},

    mixins: [ModalForm('filter')],
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            {id: 'staffCode', desc:'员工编号', required: false, max: '0'},
            {id: 'baseCity', desc:'归属地', required: false, max: '0'},
            {id: 'deptUuid', desc:'部门名称', required: false, max: '0'},
            {id: 'eduDegree', desc:'最高学历', required: false, max: '0'},
            {id: 'induYear', desc:'行业经验', required: false, max: '0'},
            {id: 'status', desc:'状态', required: false, max: '0'},
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        var hints=this.state.hints;
	    return (
            <div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.filter.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.filter.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.filter.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptUuidHint} validateStatus={hints.deptUuidStatus}>
                                    <DeptTreeSelect name="deptUuid" id="deptUuid" value={this.state.filter.deptUuid } onSelect={this.handleOnSelected.bind(this, "deptUuid")}  />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="最高学历" required={false} colon={true} className={layoutItem} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                                    <DictSelect name="eduDegree" id="eduDegree" value={this.state.filter.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="行业经验" required={false} colon={true} className={layoutItem} help={hints.induYearHint} validateStatus={hints.induYearStatus}>
                                    <Input type="text" name="induYear" id="induYear" value={this.state.filter.induYear } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.statusHint} validateStatus={hints.statusStatus}>
                                    <DictSelect name="status" id="status" value={this.state.filter.status} appName='HR系统' optName='员工状态' onSelect={this.handleOnSelected.bind(this, "status")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="入职月份" required={false} colon={true} className={layoutItem} help={hints.entryMonthHint} validateStatus={hints.entryMonthStatus}>
									<MonthPicker  style={{width:'100%'}}  name="entryMonth" id="entryMonth" value={this.formatMonth(this.state.filter.entryMonth, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"entryMonth", Common.monthFormat)} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

	    );
	}
});
module.exports = EmployeeFilter;
