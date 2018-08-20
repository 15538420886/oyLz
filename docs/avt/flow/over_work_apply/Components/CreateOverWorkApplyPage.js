import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col , DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import UserProjSelect from '../../../../proj/lib/Components/UserProjSelect';
import OrdNameSelect from '../../../lib/Components/OrdNameSelect';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import CodeMap from '../../../../hr/lib/CodeMap';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var OverWorkApplyStore = require('../data/OverWorkApplyStore');
var OverWorkApplyActions = require('../action/OverWorkApplyActions');
var dateType='';
var CreateOverWorkApplyPage = React.createClass({
    getInitialState : function() {
        return {
            overWorkApplySet: {},
            loading: false,
            modal: false,
            overWorkApply: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(OverWorkApplyStore, "onServiceComplete"), ModalForm('overWorkApply'),CodeMap()],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'create'){
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
                    overWorkApplySet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            { id: 'beginDate', desc: '开始日期', required: true, max: 64, },
            { id: 'endDate', desc: '结束日期', required: true, max: 64, },
            { id: 'projUuid', desc: '项目名称', required: true, max: 128,},
            { id: 'dateType', desc: '日期类型', max: 64,},
            { id: 'ordUuid', desc: '订单名称', max: 128,},
            { id: 'memo2', desc: '备注', max: 512,},
            { id: 'reason', desc: '加班原因', required: true, max: 512,},
        ];
    },

    clear : function(filter){
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.overWorkApply.uuid='';
        this.state.overWorkApply.filter = filter;
        this.state.overWorkApply.beginDate='';
        this.state.overWorkApply.projUuid='';
        this.state.overWorkApply.flowCode = 'cost.OVERWORK';
        this.state.overWorkApply.endDate='';
        this.state.overWorkApply.dateType='';
        this.state.overWorkApply.ordUuid='';
        this.state.overWorkApply.memo2='';
        this.state.overWorkApply.reason='';
        this.state.overWorkApply.status = '待审批';
        this.state.overWorkApply.applyDay=Common.getToday() + '';
        this.state.overWorkApply.staffCode=window.loginData.compUser.userCode;
        this.state.overWorkApply.corpUuid = window.loginData.compUser.corpUuid;
        this.state.overWorkApply.staffCode = window.loginData.compUser.userCode;
        this.state.overWorkApply.perName = window.loginData.authUser.perName;
        this.state.overWorkApply.proposer = window.loginData.authUser.perName;
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

    onClickSave : function(){
        if(Common.formValidator(this, this.state.overWorkApply)){
            this.setState({loading: true});
            var userProj = this.refs.userProj.getUserProjNode();
            var ordName=this.refs.ordName.getOrdNameNode();
            this.state.overWorkApply.projName = userProj.projName;
            this.state.overWorkApply.pmName = userProj.pmName;
            this.state.overWorkApply.ordName=ordName.ordName;
            this.state.overWorkApply.dateType=dateType;
            OverWorkApplyActions.createOverWorkApply( this.state.overWorkApply );
        }
    },


    dayToString:function(str){
        str=str.toString();
        return str.substr(0,4)+'-'+str.substr(4,2)+'-'+str.substr(6,2);
    },
    getNewDay: function (dateTemp, days) {
        var dateTemp = dateTemp.split("-");
        var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]);
        var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
        var rDate = new Date(millSeconds);
        var year = rDate.getFullYear();
        var month = rDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var date = rDate.getDate();
        if (date < 10) date = "0" + date;
        return (year + "-" + month + "-" + date);
    },
    getDayLength:function (sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
        var  aDate,  oDate1,  oDate2,  iDays
        aDate  =  sDate1.split("-")
        oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
        aDate  =  sDate2.split("-")
        oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
        iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)
        return  iDays
    },
    calculatedDate:function(){
        var startDate=this.state.overWorkApply.beginDate;
        var endDate=this.state.overWorkApply.endDate;
        var arr=[];
        if(startDate&&endDate){
            var dayLength=this.getDayLength(this.dayToString(startDate),this.dayToString(endDate));
            for(var i=0;i<dayLength+1;i++){
                arr.push(this.getNewDay(this.dayToString(startDate),i).replace(/-/g,""));
            }
        }

        if(startDate!==''&&endDate!==''){
            dateType="工作日";
            for(var i=0;i<=dayLength;i++){
                var finalDateType=this.getDateType(String(arr[i]));
                if(finalDateType=='2'){
                    dateType="节假日";
                    break;
                }
                else{
                    if(finalDateType=='1'){
                        dateType="周末";
                    }

                }
            }
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
        this.calculatedDate();
        return (
            <Modal visible={this.state.modal} width='540px' title="加班申请" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['over_work_apply/create']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='开始日期' required={true} colon={true} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.overWorkApply.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='结束日期' required={true} colon={true} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                <DatePicker name='endDate' id='endDate' style={{width:'100%'}} value={this.formatDate(this.state.overWorkApply.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'endDate', Common.dateFormat)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='项目名称' required={true} colon={true} help={hints.projUuidHint} validateStatus={hints.projUuidStatus}>
                                <UserProjSelect ref="userProj" name="projUuid" id="projUuid" value={this.state.overWorkApply.projUuid} onSelect={this.handleOnSelected.bind(this, "projUuid")} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='订单名称' colon={true} help={hints.ordUuidHint} validateStatus={hints.ordUuidStatus}>
                                <OrdNameSelect ref="ordName" name='ordUuid' id='ordUuid' value={this.state.overWorkApply.ordUuid} onSelect={this.handleOnSelected.bind(this, "ordUuid")} projUuid={this.state.overWorkApply.projUuid}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='日期类型' colon={true} help={hints.dateTypeHint} validateStatus={hints.dateTypeStatus}>
                                <Input type='text' name='dateType' id='dateType' value={dateType}  onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='备注' colon={true} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                                <Input type='text' name='memo2' id='memo2'  value={this.state.overWorkApply.memo2} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} className={layoutItem} label='加班原因' required={true} colon={true} help={hints.reasonHint} validateStatus={hints.reasonStatus}>
                        <Input type='textarea' name='reason' id='reason' style={{height: '100px'}} value={this.state.overWorkApply.reason} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateOverWorkApplyPage;