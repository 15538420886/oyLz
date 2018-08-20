'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../../hr/lib/Components/DeptTreeSelect';
import DictSelect from '../../../lib/Components/DictSelect';

var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var RecruitFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			recruit: {
                jobCode:'',
                jobCity:'',
                applyDept:'',
                hrPerson:'',
                status:'',
                applyMouth:''
			},
		}
	},

    mixins: [ModalForm('recruit')],
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'jobCode', desc:'岗位类别', required: false, max: '0'},
            {id: 'jobCity', desc:'城市', required: false, max: '0'},
            {id: 'applyDept', desc:'部门', required: false, max: '0'},
            {id: 'hrPerson', desc:'人力专员', required: false, max: '0'},
            {id: 'status', desc:'状态', required: false, max: '0'},
            {id: 'applyMouth', desc:'日期', required: false, max: '0'}
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
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="岗位类别" required={false} colon={true} className={layoutItem} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
                                    <Input type="text" name="jobCode" id="jobCode" value={this.state.recruit.jobCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="城市" required={false} colon={true} className={layoutItem} help={hints.jobCityHint} validateStatus={hints.jobCityStatus}>
                                    <Input type="text" name="jobCity" id="jobCity" value={this.state.recruit.jobCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.applyDeptHint} validateStatus={hints.applyDeptStatus}>
                                    <Input type="text" name="applyDept" id="applyDept" value={this.state.recruit.applyDept } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="人力专员" required={false} colon={true} className={layoutItem} help={hints.hrPersonHint} validateStatus={hints.hrPersonStatus}>
                                    <Input type="text" name="hrPerson" id="hrPerson" value={this.state.recruit.hrPerson } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.statusHint} validateStatus={hints.statusStatus}>
                                    <DictSelect name="status" id="status" value={this.state.recruit.status} appName='招聘管理' optName='招聘需求状态' onSelect={this.handleOnSelected.bind(this, "status")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="日期" required={false} colon={true} className={layoutItem} help={hints.applyMouthHint} validateStatus={hints.applyMouthStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="applyMouth" id="applyMouth"  format={Common.monthFormat} value={this.formatMonth(this.state.recruit.applyMouth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"applyMouth", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

	    );
	}
});


module.exports = RecruitFilter;
