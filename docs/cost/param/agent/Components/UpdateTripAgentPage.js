import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var TripAgentStore = require('../data/TripAgentStore.js');
var TripAgentActions = require('../action/TripAgentActions');

var UpdateTripAgentPage = React.createClass({
    getInitialState : function() {
        return {
            tripAgentSet: {},
            loading: false,
            modal: false,
            tripAgent: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(TripAgentStore, "onServiceComplete"), ModalForm('tripAgent')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'update'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    tripAgentSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            { id: 'agentName', desc: '名称', required: true, max: 64,},
            { id: 'city', desc: '所在城市', required: true, max: 64,},
            { id: 'phone', desc: '代办点电话', required: false, max: 24,},
            { id: 'account', desc: '客户经理', required: false, max: 64,},
            { id: 'mobile', desc: '电话', required: false, max: 24,},
            { id: 'location', desc: '地址', required: false, max: 128,},
            { id: 'memo2', desc: '备注', max: 512,},
        ];
    },

    initPage: function(tripAgent)
    {
        this.state.hints = {};
        Utils.copyValue(tripAgent, this.state.tripAgent);

        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

    onClickSave : function(){
        if(Common.formValidator(this, this.state.tripAgent)){
            this.setState({loading: true});
            TripAgentActions.updateTripAgent( this.state.tripAgent );
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
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints=this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="修改机票代理点信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['trip-agent/update']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} className={layoutItem} label='名称' required={true} colon={true} help={hints.agentNameHint} validateStatus={hints.agentNameStatus}>
                        <Input type='text' name='agentName' id='agentName' value={this.state.tripAgent.agentName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} className={layoutItem} label='地址' required={false} colon={true} help={hints.locationHint} validateStatus={hints.locationStatus}>
                        <Input type='text' name='location' id='location' value={this.state.tripAgent.location} onChange={this.handleOnChange} />
                    </FormItem>
                    <Row type="flex">
                        <Col span={12}>
                    <FormItem {...formItemLayout2} className={layoutItem} label='所在城市' required={true} colon={true} help={hints.cityHint} validateStatus={hints.cityStatus}>
                        <Input type='text' name='city' id='city' value={this.state.tripAgent.city} onChange={this.handleOnChange} />
                    </FormItem>
                        </Col>
                        <Col span={12}>
                    <FormItem {...formItemLayout2} className={layoutItem} label='代办点电话' required={false} colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                        <Input type='text' name='phone' id='phone' value={this.state.tripAgent.phone} onChange={this.handleOnChange} />
                    </FormItem>
                        </Col>
                    </Row>

                    <Row type="flex">
                        <Col span={12}>
                    <FormItem {...formItemLayout2} className={layoutItem} label='客户经理' required={false} colon={true} help={hints.accountHint} validateStatus={hints.accountStatus}>
                        <Input type='text' name='account' id='account' value={this.state.tripAgent.account} onChange={this.handleOnChange} />
                    </FormItem>
                        </Col>
                        <Col span={12}>
                    <FormItem {...formItemLayout2} className={layoutItem} label='电话' required={false} colon={true} help={hints.mobileHint} validateStatus={hints.mobileStatus}>
                        <Input type='text' name='mobile' id='mobile' value={this.state.tripAgent.mobile} onChange={this.handleOnChange} />
                    </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} className={layoutItem} label='备注' required={false} colon={true} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                        <Input type='textarea' name='memo2' id='memo2' value={this.state.tripAgent.memo2} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default UpdateTripAgentPage;