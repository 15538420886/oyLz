import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var OrderFilter = React.createClass({
    getInitialState : function(){
        return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

            order: {
                corpUuid:'',
                custName : '',
                ordName : '',
                grpName : '',
                ordType : '',
                delivCity : '',
                ordStage : '',
                beginDate1:'',
                beginDate2:''
            }, 
        }
    },

    mixins: [ModalForm('order', true)],
    componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'custName', desc:'客户名称', required: false, max: '64'},
            {id: 'ordName', desc:'订单名称', required: true, max: '128'},
            {id: 'grpName', desc:'项目群名称', required: false, max: '64'},
            {id: 'ordType', desc:'订单类型', required: false, max: '64'},
            {id: 'delivCity', desc:'交付城市', required: false, max: '64'},
            {id: 'ordStage', desc:'执行阶段', required: false, max: '64'},
            {id: 'beginDate1', desc:'最早开始时间', required: false, max: '24'},
            {id: 'beginDate2', desc:'最晚开始时间', required: false, max: '24'},
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
                <div style={{width:'100%', maxWidth: '800px', height:'100%', float: 'right'}}>
                    <Form layout={layout} style={{width:'100%',padding:'20px 0px'}}>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="客户" required={false} colon={true} className={layoutItem} help={hints.custNameHint} validateStatus={hints.custNameStatus}>
                                    <Input type="text" name="custName" id="custName" value={this.state.order.custName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="订单名称" required={false} colon={true} className={layoutItem} help={hints.ordNameHint} validateStatus={hints.ordNameStatus}>
                                    <Input type="text" name="ordName" id="ordName" value={this.state.order.ordName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                               <FormItem {...formItemLayout} label="项目组" required={false} colon={true} className={layoutItem} help={hints.grpNameHint} validateStatus={hints.grpNameStatus}>
                                    <Input type="text" name="grpName" id="grpName" value={this.state.order.grpName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="订单类型" required={false} colon={true} className={layoutItem} help={hints.ordTypeHint} validateStatus={hints.ordTypeStatus}>
                                    <DictSelect name="ordType" id="ordType" value={this.state.order.ordType} appName='项目管理' optName='订单类型' onSelect={this.handleOnSelected.bind(this, "ordType")}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={24}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="交付城市" required={false} colon={true} className={layoutItem} help={hints.delivCityHint} validateStatus={hints.delivCityStatus}>
                                    <Input type="text" name="delivCity" id="delivCity" value={this.state.order.delivCity } onChange={this.handleOnChange} />
                                </FormItem> 
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="执行阶段" required={false} colon={true} className={layoutItem} help={hints.ordStageHint} validateStatus={hints.ordStageStatus}>
                                    <DictSelect name="ordStage" id="ordStage" value={this.state.order.ordStage} appName='项目管理' optName='订单状态' onSelect={this.handleOnSelected.bind(this, "ordStage")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                               <FormItem {...formItemLayout} label="最早开始" required={false} colon={true} className={layoutItem} help={hints.beginDate1Hint} validateStatus={hints.beginDate1Status}>
                                    <DatePicker style={{width:'100%'}} name="beginDate1" id="beginDate1"  value={this.formatDate(this.state.order.beginDate1, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate1", Common.dateFormat)}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                               <FormItem {...formItemLayout} label="最晚开始" required={false} colon={true} className={layoutItem} help={hints.beginDate2Hint} validateStatus={hints.beginDate2Status}>
                                    <DatePicker style={{width:'100%'}} name="beginDate2" id="beginDate2"  value={this.formatDate(this.state.order.beginDate2, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"beginDate2", Common.dateFormat)}/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
});

OrderFilter.propTypes = propTypes;
module.exports =OrderFilter;
