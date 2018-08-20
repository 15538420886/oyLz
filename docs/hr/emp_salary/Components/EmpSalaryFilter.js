import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../lib/Components/DictSelect';
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var EmpSalaryFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			empSalary: {
				applyName : '',
				applyDate : '',
				chgMonth : '',
				chgType : '',
				staffCode : '',
				perName : '',
			},
		}
	},

    mixins: [ModalForm('empSalary')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            {id: 'staffCode', desc:'员工号', required: false, max: '0'},
            {id: 'applyName', desc:'申请人', required: false, max: '24'},
            {id: 'applyDate', desc:'申请日期', required: false, max: '16'},
            {id: 'chgMonth', desc:'执行月份', required: false, max: '24'},
            {id: 'chgType', desc:'调整类型', required: false, max: '24'},
		];
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
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'900px',padding:'20px 0px'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.empSalary.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.empSalary.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="申请人" required={false} colon={true} className={layoutItem} help={hints.applyNameHint} validateStatus={hints.applyNameStatus}>
                                    <Input type="text" name="applyName" id="applyName" value={this.state.empSalary.applyName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col span="8">
                                <FormItem {...formItemLayout2} label="申请月份" required={false} colon={true} className={layoutItem} help={hints.applyDateHint} validateStatus={hints.applyDateStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="applyDate" id="applyDate"  format={Common.monthFormat} value={this.formatMonth(this.state.empSalary.applyDate, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"applyDate", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem {...formItemLayout2} label="执行月份" required={false} colon={true} className={layoutItem} help={hints.chgMonthHint} validateStatus={hints.chgMonthStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="chgMonth" id="chgMonth"  format={Common.monthFormat} value={this.formatMonth(this.state.empSalary.chgMonth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"chgMonth", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="调整类型" required={false} colon={true} className={layoutItem} help={hints.chgTypeHint} validateStatus={hints.chgTypeStatus}>
                                   <DictSelect name="chgType" id="chgType"  appName='HR系统' optName='员工状态'  value={this.state.empSalary.chgType} onSelect={this.handleOnSelected.bind(this, "chgType")}/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>


                </div>
            </div>
	    );
	}
});

EmpSalaryFilter.propTypes = propTypes;
module.exports = EmpSalaryFilter;
