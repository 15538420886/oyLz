'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker, Spin} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var AllowLogStore = require('../data/AllowLogStore.js');
var AllowLogActions = require('../action/AllowLogActions');

var AllowDetail = React.createClass({
    getInitialState : function() {
        return {
            allowLogSet: {
                operation : '',
                errMsg : ''
            },
            allowLog: {},
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(AllowLogStore, "onServiceComplete"), ModalForm('allowLog')],
    onServiceComplete: function(data) {
      if(data.operation === 'retrieve'){
            this.setState({
                loading: false,
                allowLogSet: data
            });
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.initPage(this.props.allowLog);
    },

    componentWillReceiveProps:function(newProps){
         this.initPage( newProps.allowLog );
    },

    initPage: function(allowLog)
    {
        Utils.copyValue(allowLog, this.state.allowLog);
    },

    render : function() {
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
        var form=(
               <Form layout={layout} style={{width:'100%', maxWidth:'700px'}}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="任职部门" >
                                <Input style={{zIndex:'2'}} type="text" name="deptName" id="deptName" value={this.state.allowLog.deptName } readOnly={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="报销类型" >
                                <Input type="text"  name="allowType" id="allowType" value={Utils.getOptionName('HR系统', '报销类型',this.state.allowLog.allowType, true, this)} readOnly={true}/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="填表日期" >
                                <Input type="text" name="applyDate" id="applyDate"  value={Common.formatDate(this.state.allowLog.applyDate, Common.dateFormat) } readOnly={true}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="项目编号" >
                                <Input type="text" name="projCode" id="projCode" value={this.state.allowLog.projCode} readOnly={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="项目名称"  >
                                <Input type="text" name="projName" id="projName" value={this.state.allowLog.projName} readOnly={true}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="报销事项"  >
                                <Input type="text" name="allowDesc" id="allowDesc" value={this.state.allowLog.allowDesc} readOnly={true}/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="费用日期" >
                                <Col span="10">
                                    <FormItem  >
                                        <Input type="text" name="beginDate" id="beginDate"  value={Common.formatDate(this.state.allowLog.beginDate, Common.dateFormat) } readOnly={true} />
                                    </FormItem>
                                </Col>
                                <Col span="4" style={{textAlign: 'center'}}>
                                    到
                                </Col>
                                <Col span="10">
                                    <FormItem className={layoutItem} >
                                         <Input type="text" name="endDate" id="endDate"  value={Common.formatDate(this.state.allowLog.endDate, Common.dateFormat) } readOnly={true} />
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="报销金额" >
                                <Input type="text"  name="payAmount" id="payAmount"   value={this.state.allowLog.payAmount} readOnly={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="发票张数" >
                                <Input type="text" name="memo2" id="memo2"  value={this.state.allowLog.memo2} readOnly={true}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} className={layoutItem} label="报销说明" >
                        <Input type="textarea" name="payMemo" id="payMemo" value={this.state.allowLog.payMemo} style={{height: '100px'}} readOnly={true}/>
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="发放日期" >
                                <Input type="text" name="payDate" id="payDate"  value={Common.formatDate(this.state.allowLog.payDate, Common.dateFormat) }  readOnly={true}/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label="银行卡号" >
                                <Input type="text" name="bankCard" id="bankCard"  value={this.state.allowLog.bankCard} readOnly={true}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>)

        var hints=this.state.hints;
        return (
            <div style={{padding:"20px 0 16px 0", height: '100%',overflowY: 'auto'}}>
                {this.state.loading ? <Spin>{form}</Spin> : form}
            </div>
        );
    }
});

module.exports = AllowDetail;

/*
<Row>
    <Col span="12">
        <FormItem {...formItemLayout2} className={layoutItem} label="审批人" >
            <Input type="text" name="approve" id="approve"  value={this.state.allowLog.approve} readOnly={true}/>
        </FormItem>
    </Col>
    <Col span="12">
        <FormItem {...formItemLayout2} className={layoutItem} label="审批日期" >
                <Input type="text" name="approveDay" id="approveDay"  value={Common.formatDate(this.state.allowLog.approveDay, Common.dateFormat) }  readOnly={true}/>

        </FormItem>
    </Col>
</Row>
*/
