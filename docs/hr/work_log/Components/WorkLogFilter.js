import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
import DictSelect from '../../../lib/Components/DictSelect';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var WorkLogFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			workLog: {
				date1 : '',
				date2 : '',
				baseCity : '',
				chgType : '',
				staffCode : '',
				perName : '',
    			deptName : '',
			},
		}
	},

    mixins: [ModalForm('workLog')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'date1', desc:'生效日期开始', required: false, max: '0'},
            {id: 'baseCity', desc:'归属地', required: false, max: '0'},
            {id: 'date2', desc:'生效日期结束', required: false, max: '0'},
            {id: 'chgType', desc:'变更类型', required: false, max: '0'},
            {id: 'staffCode', desc:'员工编号', required: false, max: '0'},
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            {id: 'deptName', desc:'部门名称', required: false, max: '128'},
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
                                    <Input type="text" name="perName" id="perName" value={this.state.workLog.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="员工编号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.workLog.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.workLog.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout2} label="变更类型" required={false} colon={true} className={layoutItem} help={hints.chgTypeHint} validateStatus={hints.chgTypeStatus}>
                                    <DictSelect name="chgType" id="chgType"  appName='HR系统' optName='薪资调整类型'  value={this.state.workLog.chgType} onSelect={this.handleOnSelected.bind(this, "chgType")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={15}>
                                <FormItem {...formItemLayout} label="入职日期" required={false} colon={true} className={layoutItem}>
                                    <Col span="6">
                                        <FormItem  help={hints.date1Hint} validateStatus={hints.entryDate1Status}>
                                            <DatePicker  style={{width:'100%'}}  name="date1" id="date1" value={this.formatDate(this.state.workLog.date1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date1", Common.dateFormat)}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="2" style={{textAlign: 'center'}}>
                                        到
                                    </Col>
                                    <Col span="6">
                                        <FormItem  help={hints.date2Hint} validateStatus={hints.date2Status}>
                                            <DatePicker  style={{width:'100%'}}  name="date2" id="date2" value={this.formatDate(this.state.workLog.date1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"date1", Common.dateFormat)}/>
                                        </FormItem>
                                    </Col>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});

WorkLogFilter.propTypes = propTypes;
module.exports = WorkLogFilter;
