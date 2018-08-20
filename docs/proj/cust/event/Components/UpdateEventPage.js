import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var EventStore = require('../data/EventStore');
var EventActions = require('../action/EventActions');

var UpdateEventPage = React.createClass({
	getInitialState : function() {
		return {
			eventSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			event: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(EventStore, "onServiceComplete"), ModalForm('event')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  eventSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'eventDate', desc:'发生日期', required: false, max: '128'},
            {id: 'eventType', desc:'事件类型', required: false, max: '128'},
            {id: 'eventTitle', desc:'事件名称', required: false, max: '128'},
	        {id: 'eventBegin', desc:'开始日期', required: false, max: '16'},
	        {id: 'eventEnd', desc:'结束日期', required: false, max: '16'},
	        {id: 'eventBody', desc:'说明', required: false, max: '3600'},
		];
		this.initPage( this.props.event );
	},

	initPage: function(event)
	{
		Utils.copyValue(event, this.state.event);
		this.setState( {loading: false, hints: {}} );
		
		this.state.eventSet.operation='';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.event)){
			this.state.eventSet.operation = '';
			this.setState({loading: true});
			EventActions.updateContEvent( this.state.event );
		}
	},

	goBack:function(){
        this.props.onBack();
    },

	 onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改合同事件" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['cont_event/update']}/>
			            	
                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="发生日期" required={false} colon={true} className={layoutItem} help={hints.eventDateHint} validateStatus={hints.eventDateStatus}>
                                            <DatePicker style={{width:'100%'}} name="eventDate" id="eventDate"  value={this.formatDate(this.state.event.eventDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"eventDate", Common.dateFormat)}/>
										</FormItem>
									</Col>
								
								</Row>
                                <Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="事件类型" required={false} colon={true} className={layoutItem} help={hints.eventTypeHint} validateStatus={hints.eventTypeStatus}>
											<DictSelect name="eventType" id="eventType" value={this.state.event.eventType} appName='项目管理' optName='合同事件类型' onSelect={this.handleOnSelected.bind(this, "eventType")}/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<FormItem {...formItemLayout} label="事件名称" required={false} colon={true} className={layoutItem} help={hints.eventTitleHint} validateStatus={hints.eventTitleStatus}>
		                                <Input type="text" name="eventTitle" id="eventTitle" value={this.state.event.eventTitle } onChange={this.handleOnChange} />
	                                </FormItem>
								</Row>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.eventBeginHint} validateStatus={hints.eventBeginStatus}>
                                            <DatePicker style={{width:'100%'}} name="eventBegin" id="eventBegin"  value={this.formatDate(this.state.event.eventBegin, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"eventBegin", Common.dateFormat)}/>
	                                    </FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout2} label="结束日期" required={false} colon={true} className={layoutItem} help={hints.eventEndHint} validateStatus={hints.eventEndStatus}>
                                            <DatePicker style={{width:'100%'}} name="eventEnd" id="eventEnd"  value={this.formatDate(this.state.event.eventEnd, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"eventEnd", Common.dateFormat)}/>
	                                    </FormItem>
									</Col>
								</Row>
								<Row>
									<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.eventBodyHint} validateStatus={hints.eventBodyStatus}>
		                                <Input type="textarea" name="eventBody" id="eventBody" value={this.state.event.eventBody } onChange={this.handleOnChange} />
	                                </FormItem>
								</Row>
								<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
									<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
								</FormItem>
							</Form>
                        </div>
                    </TabPane>
                </Tabs>
	        </div>
		);
	}
});

export default UpdateEventPage;

