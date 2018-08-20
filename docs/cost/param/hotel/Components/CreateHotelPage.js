import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Button, Input, Select, Tabs, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var HotelStore = require('../data/HotelStore.js');
var HotelActions = require('../action/HotelActions');

var CreateHotelPage = React.createClass({
    getInitialState : function() {
        return {
            hotelSet: {},
            loading: false,
            hotel: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(HotelStore, "onServiceComplete"), ModalForm('hotel')],
    onServiceComplete: function(data) {
        if(data.operation === 'create'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.goBack();
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    hotelSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            { id: 'hotelLoc', desc: '地址', max: 128,},
            { id: 'basePrice', desc: '价格', max: 16,},
            { id: 'phone', desc: '酒店电话', max: 24,},
            { id: 'hotelStar', desc: '星级', max: 12,},
            { id: 'hotelName', desc: '名称', required: true, max: 64,},
            { id: 'city', desc: '城市', max: 64,},
            { id: 'county', desc: '区县', max: 64,},
            { id: 'account', desc: '客户经理', max: 24,},
            { id: 'mobile', desc: '联系电话', max: 24,},
            { id: 'signDate', desc: '签约日期', max: 24,},
            { id: 'signName', desc: '签约人', max: 24,},
            { id: 'coLevel', desc: '协议级别', max: 24,},
            { id: 'memo2', desc: '备注', max: 512,},
        ];
        // FIXME 输入参数
        this.clear();
    },

    clear : function(filter){
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.hotel.uuid='';
        this.state.hotel.filter = filter;
        this.state.hotel.hotelLoc='';
        this.state.hotel.basePrice='';
        this.state.hotel.phone='';
        this.state.hotel.hotelStar='';
        this.state.hotel.hotelName='';
        this.state.hotel.city='';
        this.state.hotel.county='';
        this.state.hotel.account='';
        this.state.hotel.mobile='';
        this.state.hotel.signDate='';
        this.state.hotel.signName='';
        this.state.hotel.coLevel='';
        this.state.hotel.memo2='';

        this.state.loading = false;
        if( typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

    onClickSave : function(){
        if(Common.formValidator(this, this.state.hotel)){
            this.setState({loading: true});
            this.state.hotel.corpUuid = window.loginData.compUser.corpUuid;
            HotelActions.createHotel( this.state.hotel );
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

    render : function(){
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
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="增加协议酒店" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['hotel/create']}/>
                            <Form layout={layout} style={{width:'600px'}}>
                              <FormItem {...formItemLayout} className={layoutItem} label='名称' required={true} colon={true} help={hints.hotelNameHint} validateStatus={hints.hotelNameStatus}>
                                  <Input type='text' name='hotelName' id='hotelName' value={this.state.hotel.hotelName} onChange={this.handleOnChange} />
                              </FormItem>
                              <FormItem {...formItemLayout} className={layoutItem} label='地址' colon={true} help={hints.hotelLocHint} validateStatus={hints.hotelLocStatus}>
                                  <Input type='text' name='hotelLoc' id='hotelLoc' value={this.state.hotel.hotelLoc} onChange={this.handleOnChange} />
                              </FormItem>
                              <Row>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='城市' colon={true} help={hints.cityHint} validateStatus={hints.cityStatus}>
                                    <Input type='text' name='city' id='city' value={this.state.hotel.city} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem {...formItemLayout2} className={layoutItem} label='区县' colon={true} help={hints.countyHint} validateStatus={hints.countyStatus}>
                                      <Input type='text' name='county' id='county' value={this.state.hotel.county} onChange={this.handleOnChange} />
                                    </FormItem>
                                </Col>
                              </Row>
                              <Row>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='价格' colon={true} help={hints.basePriceHint} validateStatus={hints.basePriceStatus}>
                                    <Input type='text' name='basePrice' id='basePrice' value={this.state.hotel.basePrice} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='星级' colon={true} help={hints.hotelStarHint} validateStatus={hints.hotelStarStatus}>
                                    <Input type='text' name='hotelStar' id='hotelStar' value={this.state.hotel.hotelStar} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                              </Row>
                                <FormItem {...formItemLayout} className={layoutItem} label='酒店电话' colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                                    <Input style={{ width: '40%' }} type='text' name='phone' id='phone' value={this.state.hotel.phone} onChange={this.handleOnChange} />
                                </FormItem>
                              <Row>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='客户经理' colon={true} help={hints.accountHint} validateStatus={hints.accountStatus}>
                                      <Input type='text' name='account' id='account' value={this.state.hotel.account} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='联系电话' colon={true} help={hints.mobileHint} validateStatus={hints.mobileStatus}>
                                      <Input type='text' name='mobile' id='mobile' value={this.state.hotel.mobile} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                              </Row>
                              <Row>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='签约人' colon={true} help={hints.signNameHint} validateStatus={hints.signNameStatus}>
                                      <Input type='text' name='signName' id='signName' value={this.state.hotel.signName} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                                <Col span="12">
                                  <FormItem {...formItemLayout2} className={layoutItem} label='签约日期' colon={true} help={hints.signDateHint} validateStatus={hints.signDateStatus}>
                                      <Input type='text' name='signDate' id='signDate'  value={this.state.hotel.signDate} onChange={this.handleOnChange} />
                                  </FormItem>
                                </Col>
                              </Row>
                              <FormItem {...formItemLayout} className={layoutItem} label='协议级别' colon={true} help={hints.coLevelHint} validateStatus={hints.coLevelStatus}>
                                <DictSelect style={{ width: '40%' }} name="coLevel" id="coLevel" value={this.state.hotel.coLevel} appName='报销管理' optName='酒店协议级别' onSelect={this.handleOnSelected.bind(this, "coLevel")}/>
                              </FormItem>
                              <FormItem {...formItemLayout} className={layoutItem} label='备注' colon={true} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                                  <Input type="textarea" style={{height:'80px'}} name='memo2' id='memo2' placeholder={this.state.hotel.memo2} onChange={this.handleOnChange} />
                              </FormItem>
                                <FormItem style={{textAlign:'right',margin:'4px 0'}} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

export default CreateHotelPage;
