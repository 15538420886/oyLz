import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var ProjDispFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			projDisp: {
				projName : '',
				beginMonth : '',
				payType : '',
				induType : '',
                projType : '',
                beginDate1 :'',
                beginDate2 :'',
                projCode : '',
                delivArea:'',
                projStatus:'',
                biziType:''
			},
		}
	},

    mixins: [ModalForm('projDisp')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'projCode', desc:'项目编号', required: false, max: '64'},
            {id: 'projName', desc:'项目名称', required: false, max: '128'},
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

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '1000px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'1000px',padding:'20px 0px'}}>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.projNameHint} validateStatus={hints.projNameStatus}>
                                    <Input type="text" name="projName" id="projName" value={this.state.projDisp.projName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="项目编号" required={false} colon={true} className={layoutItem} help={hints.projCodeHint} validateStatus={hints.projCodeStatus}>
                                    <Input type="text" name="projCode" id="projCode" value={this.state.projDisp.projCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="开始月份" required={false} colon={true} className={layoutItem} help={hints.beginMonthHint} validateStatus={hints.beginMonthStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="beginMonth" id="beginMonth"  format={Common.monthFormat} value={this.formatMonth(this.state.projDisp.beginMonth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"beginMonth", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span="6">
                                <FormItem {...formItemLayout} label="业务类型" required={false} colon={true} className={layoutItem} help={hints.biziTypeHint} validateStatus={hints.biziTypeStatus}>
                                    <DictSelect name="biziType" id="biziType" value={this.state.projDisp.biziType } appName='项目管理' optName='业务类型' onSelect={this.handleOnSelected.bind(this, "biziType")}/>
	                            </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span="6">
                                <FormItem {...formItemLayout} label="结算类型" required={false} colon={true} className={layoutItem} help={hints.payTypeHint} validateStatus={hints.payTypeStatus}>
                                    <DictSelect name="payType" id="payType" value={this.state.projDisp.payType} appName='项目管理' optName='订单结算类型' onSelect={this.handleOnSelected.bind(this, "payType")}/>
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="行业类型" required={false} colon={true} className={layoutItem} help={hints.induTypeHint} validateStatus={hints.induTypeStatus}>
                                    <DictSelect name="induType" id="induType" value={this.state.projDisp.induType} appName='项目管理' optName='所属行业' onSelect={this.handleOnSelected.bind(this, "induType")}/>
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="项目类型" required={false} colon={true} className={layoutItem} help={hints.projTypeHint} validateStatus={hints.projTypeStatus}>
                                    <DictSelect name="projType" id="projType" value={this.state.projDisp.projType } appName='项目管理' optName='项目类型' onSelect={this.handleOnSelected.bind(this, "projType")}/>
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="交付区域" required={false} colon={true} className={layoutItem} help={hints.delivAreaHint} validateStatus={hints.delivAreaStatus}>
	                                <DictSelect name="delivArea" id="delivArea" value={this.state.projDisp.delivArea } appName='项目管理' optName='交付区域' onSelect={this.handleOnSelected.bind(this, "delivArea")}/>
	                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});

ProjDispFilter.propTypes = propTypes;
module.exports = ProjDispFilter;
