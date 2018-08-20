import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import DeptTreeSelect from '../../../../hr/lib/Components/DeptTreeSelect';
import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var HrExecutStore = require('../data/HrExecutStore.js');
var HrExecutActions = require('../action/HrExecutActions');

var CreateHrExecutPage = React.createClass({
    getInitialState : function() {
        return {
            hrExecutSet: {},
            loading: false,
            hrExecut: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(HrExecutStore, "onServiceComplete"), ModalForm('hrExecut')],
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
                    hrExecutSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            { id: 'hrCode', desc: '员工编号', required: true, max: 48,},
            { id: 'hrName', desc: 'HR姓名', max: 48,},
            { id: 'hrPhone', desc: '联系电话', max: 48,},
            { id: 'hrEmail', desc: '邮箱', max: 48,},
            { id: 'deptName', desc: '部门名称', max: 48,},
        ];
        // FIXME 输入参数
        this.clear();
    },
    
    clear : function(){
        this.state.hints = {};
        this.state.hrExecut.uuid='';
        this.state.hrExecut.hrCode='';
        this.state.hrExecut.hrName='';
        this.state.hrExecut.hrPhone='';
        this.state.hrExecut.hrEmail='';
        this.state.hrExecut.deptName='';   
        this.state.loading = false;
        if( typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },
    onClickSave : function(){
        var hrExecut = this.state.hrExecut;
        if(Common.formValidator(this, this.state.hrExecut)){
            this.setState({loading: true});
            HrExecutActions.createHrExecut( this.state.hrExecut );
        }
        var hrExeNode = this.refs.DeptTreeName.getHrExeNode();
        if(hrExeNode.deptName === null || hrExeNode.deptName === '' || hrExeNode.deptName === hrExeNode.deptCode){
            hrExecut.deptName = hrExeNode.deptName;
        }
        else{
            hrExecut.deptName = hrExeNode.deptCode+'('+hrExeNode.deptName+')';
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
    onSelectEmpLoyee: function (data) {
        var member = this.state.hrExecut;
        member.corpUuid = window.loginData.compUser.corpUuid;
        member.hrCode = data.staffCode;
        member.hrName = data.perName;
        member.hrEmail	= data.email;
        member.hrPhone = data.phoneno;
        member.deptUuid= data.deptUuid;
        member.deptName= data.deptName;
        this.setState({loading:false});
    }, 
    render : function(){
        var corpUuid = window.loginData.compUser.corpUuid;
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
                    <TabPane tab="增加招聘专员" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['hr_execut/create']}/>
                            <SearchEmployee style={{ padding: '10px 0 16px 32px', width: '600px' }} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee} />
                            <Form layout={layout} style={{width:'600px'}}>
                                <FormItem {...formItemLayout} className={layoutItem} label='员工编号'  required={true} colon={true} help={hints.hrCodeHint} validateStatus={hints.hrCodeStatus}>
                                		<Input type='text' name='hrCode' id='hrCode' value={this.state.hrExecut.hrCode} onChange={this.handleOnChange} disabled={true}/>
                                </FormItem>
                                <FormItem {...formItemLayout} className={layoutItem} label='姓名'  colon={true} help={hints.hrNameHint} validateStatus={hints.hrNameStatus}>
                                		<Input type='text' name='hrName' id='hrName' value={this.state.hrExecut.hrName} onChange={this.handleOnChange} disabled={true}/>
                                </FormItem>
                                <FormItem {...formItemLayout} className={layoutItem} label='电话' colon={true} help={hints.hrPhoneHint} validateStatus={hints.hrPhoneStatus}>
                                		<Input type='text' name='hrPhone' id='hrPhone' value={this.state.hrExecut.hrPhone} onChange={this.handleOnChange} />
                                </FormItem>
                                <FormItem {...formItemLayout} className={layoutItem} label='邮件' colon={true} help={hints.hrEmailHint} validateStatus={hints.hrEmailStatus}>
                                		<Input type='text' name='hrEmail' id='hrEmail' value={this.state.hrExecut.hrEmail} onChange={this.handleOnChange} />
                                </FormItem>
                                <FormItem {...formItemLayout} className={layoutItem} label='负责部门' colon={true} help={hints.deptUuidHint} validateStatus={hints.deptUuidStatus}>
                                        <DeptTreeSelect ref="DeptTreeName" name="deptUuid" id="deptUuid" value={this.state.hrExecut.deptUuid } onSelect={this.handleOnSelected.bind(this,'deptUuid')} />
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

export default CreateHrExecutPage;