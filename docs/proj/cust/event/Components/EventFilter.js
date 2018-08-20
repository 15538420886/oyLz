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

var EventFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			event: {
                corpUuid:'',
				contName : '',
				custName : '',
				salName : '',
                eventType : '',
				eventMonth:'',
				eventTitle:'',

			},
		}
	},

    mixins: [ModalForm('event')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'contName', desc:'合同名称', required: false, max: '16'},
            {id: 'custName', desc:'客户名称', required: false, max: '16'},
            {id: 'eventMonth', desc:'发生月份', required: false, max: '128'},
            {id: 'eventType', desc:'类型', required: false, max: '128'},
            {id: 'eventTitle', desc:'事件名称', required: false, max: '128'},
             {id: 'salName', desc:'客户经理', required: false, max: '128'},
        ];
	},

	render : function() {
		if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 9}),
			wrapperCol: ((layout=='vertical') ? null : {span: 15}),
		};

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '1000px', height:'100%', float: 'right'}}>
                    <Form layout={layout} style={{width:'1000px',padding:'20px 0px'}}>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={8}>
	                            <FormItem {...formItemLayout} label="事件名称" required={false} colon={true} className={layoutItem} help={hints.eventTitleHint} validateStatus={hints.eventTitleStatus}>
		                            <Input type="text" name="eventTitle" id="eventTitle" value={this.state.event.eventTitle } onChange={this.handleOnChange} />
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
	                            <FormItem {...formItemLayout} label="类型" required={false} colon={true} className={layoutItem} help={hints.eventTypeHint} validateStatus={hints.eventTypeStatus}>
                                    <DictSelect name="eventType" id="eventType" value={this.state.event.eventType} appName='项目管理' optName='合同事件类型' onSelect={this.handleOnSelected.bind(this, "eventType")}/>
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
	                            <FormItem {...formItemLayout} label="发生月份" required={false} colon={true} className={layoutItem} help={hints.eventMonthHint} validateStatus={hints.eventMonthStatus}>
                                    <MonthPicker  style={{width:'100%'}}  name="eventMonth" id="eventMonth"  format={Common.monthFormat} value={this.formatMonth(this.state.event.eventMonth, Common.monthFormat)} onChange={this.handleOnSelDate.bind(this,"eventMonth", Common.monthFormat)}/>
	                            </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span="8">
								<FormItem {...formItemLayout} label="客户名称" required={false} colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
		                            <Input type="text" name="custName" id="custName" value={this.state.event.custName } onChange={this.handleOnChange} />
	                            </FormItem>  
                            </Col>
                            <Col className="gutter-row" span="8">
	                            <FormItem {...formItemLayout} label="合同名称" required={false} colon={true} className={layoutItem} help={hints.contNameHint} validateStatus={hints.contNameStatus}>
		                            <Input type="text" name="contName" id="contName" value={this.state.event.contName } onChange={this.handleOnChange} />
	                            </FormItem>
                            </Col>
                            <Col className="gutter-row" span="8">
	                            <FormItem {...formItemLayout} label="客户经理 " required={false} colon={true} className={layoutItem} help={hints.salNameHint} validateStatus={hints.salNameStatus}>
									<Input type="text" name="salName" id="salName" value={this.state.event.salName } onChange={this.handleOnChange} />
	                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});

EventFilter.propTypes = propTypes;
module.exports = EventFilter;
