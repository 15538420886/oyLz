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

var AllowLogFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			allowLog: {
				perName : '',
				staffCode : '',
				applyDate : '',
				baseCity : '',
				allowType : '',
				deptName : '',
                projName : '',
                payDate : '',
			},
		}
	},

    mixins: [ModalForm('allowLog')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '32'},
            {id: 'staffCode', desc:'员工编号', required: false, max: '64'},
            {id: 'applyDate', desc:'填表日期', required: false, max: '16'},
            {id: 'baseCity', desc:'归属地', required: false, max: '128'},
            {id: 'allowType', desc:'报销类型', required: false, max: '32'},
            {id: 'deptName', desc:'部门名称', required: false, max: '128'},
            {id: 'projName', desc:'项目名称', required: false, max: '256'},
            {id: 'payDate', desc:'发放日期', required: false, max: '24'},
		];
	},

	render : function() {
		if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 7}),
			wrapperCol: ((layout=='vertical') ? null : {span: 17}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '1000px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'1000px',padding:'20px 0px'}}>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.allowLog.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout2} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.allowLog.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="填报月份" required={false} colon={true} className={layoutItem} help={hints.applyDateHint} validateStatus={hints.applyDateStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="applyDate" id="applyDate"  format={Common.monthFormat} value={this.formatMonth(this.state.allowLog.applyDate, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"applyDate", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="报销类型" required={false} colon={true} className={layoutItem} help={hints.allowTypeHint} validateStatus={hints.allowTypeStatus}>
                                   <DictSelect name="allowType" id="allowType"  appName='HR系统' optName='报销类型'  value={this.state.allowLog.allowType} onSelect={this.handleOnSelected.bind(this, "allowType")}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={24}>
                            <Col span="6">
                                <FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.allowLog.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem {...formItemLayout2} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                                    <Input type="text" name="deptName" id="deptName" value={this.state.allowLog.deptName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem {...formItemLayout} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
                                    <Input type="text" name="projName" id="projName" value={this.state.allowLog.projName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem {...formItemLayout} label="发放月份" required={false} colon={true} className={layoutItem} help={hints.payDateHint} validateStatus={hints.payDateStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="payDate" id="payDate"  format={Common.monthFormat} value={this.formatMonth(this.state.allowLog.payDate, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"payDate", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>


                </div>
            </div>
	    );
	}
});

AllowLogFilter.propTypes = propTypes;
module.exports = AllowLogFilter;
