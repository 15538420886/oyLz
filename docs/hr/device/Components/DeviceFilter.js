import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../lib/Components/DictSelect';
import {Input, Form, Modal, Col, Row, DatePicker} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var DeviceFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			device: {
				perName : '',
				staffCode : '',
				baseCity : '',
				deptUuid : '',
				devName : '',
                devAllow : '',
                expiryDate1 : '',
                expiryDate2 : ''
			},
		}
	},

    mixins: [ModalForm('device')],
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
            {id: 'baseCity', desc:'归属地', required: false, max: '128'},
            {id: 'expiryDate1', desc:'失效日期开始', required: false, max: '0'},
            {id: 'expiryDate2', desc:'失效日期结束', required: false, max: '0'},
            {id: 'devAllow', desc:'设备补贴', required: false, max: '0'},
            {id: 'devName', desc:'设备名称', required: false, max: '0'},
            {id: 'deptUuid', desc:'部门', required: false, max: '0'},
		];
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
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '1000px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%',padding:'20px 0px'}}>
                        <Row>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.device.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.device.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.device.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                                    <Input type="text" name="deptName" id="deptName" value={this.state.device.deptName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="gutter-row" span="6">
                                <FormItem {...formItemLayout} label="设备名称" required={false} colon={true} className={layoutItem} help={hints.devNameHint} validateStatus={hints.devNameStatus}>
                                    <Input type="text" name="devName" id="devName" value={this.state.device.devName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span="6">
                                <FormItem {...formItemLayout} label="补贴金额" required={false} colon={true} className={layoutItem} help={hints.devAllowHint} validateStatus={hints.devAllowStatus}>
                                    <Input type="text" name="devAllow" id="devAllow" value={this.state.device.devAllow } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span="12">
                                <FormItem {...formItemLayout2} label="结束月份">
                                    <Col span="7">
                                        <FormItem label="" required={false} colon={true} className={layoutItem} help={hints.expiryDate1Hint} validateStatus={hints.expiryDate1Status}>
                                            <MonthPicker  style={{width:'100%'}}  name="expiryDate1" id="expiryDate1"  format={Common.monthFormat} value={this.formatMonth(this.state.device.expiryDate1, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"expiryDate1", Common.monthFormat)}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="2" style={{textAlign:'center'}}>
                                        到
                                    </Col>
                                    <Col span="7">
                                        <FormItem label="" required={false} colon={true} className={layoutItem} help={hints.expiryDate2Hint} validateStatus={hints.expiryDate2Status}>
                                            <MonthPicker  style={{width:'100%'}}  name="expiryDate2" id="expiryDate2"  format={Common.monthFormat} value={this.formatMonth(this.state.device.expiryDate2, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"expiryDate2", Common.monthFormat)}/>
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

DeviceFilter.propTypes = propTypes;
module.exports = DeviceFilter;
