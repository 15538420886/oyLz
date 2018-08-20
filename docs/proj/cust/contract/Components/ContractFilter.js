import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var ContractFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			contract: {
                corpUuid:'',
				contCode : '',
				contName : '',
				custName : '',
				salName : '',
                marketArea : '',
                delivArea : '',
				signMonth:'',
				contType:'',
				signDate1:'',
				signDate2:''
			},
		}
	},

    mixins: [ModalForm('contract')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
	        {id: 'contCode', desc:'合同编号', required: false, max: '64'},
	        {id: 'contName', desc:'合同名称', required: false, max: '128'},
	        {id: 'custName', desc:'客户名称', required: false, max: '64'},
	        {id: 'salName', desc:'销售姓名', required: false, max: '32'},
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
	                            <FormItem {...formItemLayout2} label="合同编号" required={false} colon={true} className={layoutItem} help={hints.contCodeHint} validateStatus={hints.contCodeStatus}>
		                            <Input type="text" name="contCode" id="contCode" value={this.state.contract.contCode } onChange={this.handleOnChange} />
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
	                            <FormItem {...formItemLayout2} label="合同名称" required={false} colon={true} className={layoutItem} help={hints.contNameHint} validateStatus={hints.contNameStatus}>
		                            <Input type="text" name="contName" id="contName" value={this.state.contract.contName } onChange={this.handleOnChange} />
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
	                            <FormItem {...formItemLayout} label="合同类型" required={false} colon={true} className={layoutItem} help={hints.contTypeHint} validateStatus={hints.contTypeStatus}>
									<DictSelect name="contType" id="contType" value={this.state.contract.contType} appName='项目管理' optName='合同类型' onSelect={this.handleOnSelected.bind(this, "contType")}/>
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
								<FormItem {...formItemLayout} label="签订月份" required={false} colon={true} className={layoutItem} help={hints.signMonthHint} validateStatus={hints.signMonthStatus}>
									<MonthPicker  style={{width:'100%'}}  name="signMonth" id="signMonth"  format={Common.monthFormat} value={this.formatMonth(this.state.contract.signMonth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"signMonth", Common.monthFormat)}/>
	                            </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span="6">
								<FormItem {...formItemLayout2} label="销售姓名" required={false} colon={true} className={layoutItem} help={hints.salNameHint} validateStatus={hints.salNameStatus}>
		                            <Input type="text" name="salName" id="salName" value={this.state.contract.salName } onChange={this.handleOnChange} />
	                            </FormItem>  
                            </Col>
                            <Col className="gutter-row" span="6">
	                            <FormItem {...formItemLayout2} label="客户名称" required={false} colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
		                            <Input type="text" name="custName" id="custName" value={this.state.contract.custName } onChange={this.handleOnChange} />
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span="6">
	                            <FormItem {...formItemLayout} label="销售区域 " required={false} colon={true} className={layoutItem} help={hints.marketAreaHint} validateStatus={hints.marketAreaStatus}>
									<DictSelect name="marketArea" id="marketArea" value={this.state.contract.marketArea} appName='项目管理' optName='销售区域' onSelect={this.handleOnSelected.bind(this, "marketArea")}/>
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span="6">
	                            <FormItem {...formItemLayout} label="交付区域" required={false} colon={true} className={layoutItem} help={hints.delivAreaHint} validateStatus={hints.delivAreaStatus}>
									<DictSelect name="delivArea" id="delivArea" value={this.state.contract.delivArea} appName='项目管理' optName='交付区域' onSelect={this.handleOnSelected.bind(this, "delivArea")}/>
	                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});

ContractFilter.propTypes = propTypes;
module.exports = ContractFilter;
