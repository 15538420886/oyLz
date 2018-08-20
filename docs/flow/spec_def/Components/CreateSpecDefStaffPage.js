import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col,Tabs,Spin} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../hr/lib/Components/SearchEmployee';
import SearchResMember from '../../../proj/lib/Components/SearchResMember';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var SpecDefStore = require('../data/SpecDefStore.js');
var SpecDefActions = require('../action/SpecDefActions');

var CreateSpecDefStaffPage = React.createClass({
	getInitialState : function() {
		return {
			specDefSet: {},
			loading: false,
			specDef: {},
			hints: {},
			validRules: [],
            specDefStaff:{},
		}
	},

	mixins: [Reflux.listenTo(SpecDefStore, "onServiceComplete"), ModalForm('specDef')],
	onServiceComplete: function(data) {
		if(data.operation === 'update'){
     
			 if( data.errMsg === ''){
                // 成功，关闭窗口    
                   this.goBack();
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    specDefSet: data
                });
            }
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'staffCode', desc: '员工编号', max: 24,},
			{ id: 'perName', desc: '员工姓名', max: 24,},
			{ id: 'baseCity', desc: '所属地', max: 24,},
			{ id: 'orgName', desc: '组织名称', max: 24,},
		];
        this.initPage(this.props.specDefStaff);
	},
	//传递父极的参数
    initPage:function(specDefStaff){
        this.setState({specDefStaff:specDefStaff});
    },
	clear : function(filter){
		// FIXME 输入参数，对象初始化
		this.state.hints = {};
		this.state.specDef.uuid='';
		this.state.specDef.filter = filter;
		this.state.specDef.staffCode='';
		this.state.specDef.perName='';
		this.state.specDef.baseCity='';
		this.state.specDef.orgName='';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.specDef)){
			this.setState({loading: true});
            if(!this.state.specDefStaff.role){
               this.state.specDefStaff.role=[]; 
            }
            this.state.specDefStaff.role.push(this.state.specDef);
			SpecDefActions.updateSpecFlowDef2( this.state.specDefStaff );
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
        var member = this.state.specDef;
        member.corpUuid = window.loginData.compUser.corpUuid;
		member.staffCode = data.staffCode;
		member.perName = data.perName;
		member.email= data.email;
		member.baseCity = data.baseCity;
        member.phone = data.phoneno;
        member.orgName= data.deptName;
        this.setState({loading:false});
     },    
     onSelectProj: function (data) {
        var member = this.state.specDef;
		member.userId = data.userId;
		member.staffCode = data.staffCode;
		member.perName = data.perName;
		member.email= data.email;
		member.baseCity = data.baseCity;
        member.phone = data.phoneno;
        if(data.deptName){
            member.orgName= data.deptName;
        }else{
            member.orgName= data.corpName;
        }
        
        this.setState({loading:false});
    }, 

	  render : function(){
    	var corpUuid = window.loginData.compUser.corpUuid;
        var savedisable = this.state.specDef.staffCode? false : true ;
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        var flowLevel=this.state.specDefStaff.flowLevel
        var tab=''
         if(flowLevel=='资源池'||flowLevel=='资源池小组'){
              tab="增加资源池人员"
         }else{
              tab="增加员工"
         }
    
        const formItemLayout2 = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints=this.state.hints;
        if(this.state.specDefStaff) {

        }

        var form = <Form layout={layout} style={{width:'600px'}}>
        <Row type="flex"> 
            <Col span="10">
                <FormItem {...formItemLayout} className={layoutItem} label='员工编号' colon={true} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                    <Input type='text' name='staffCode' id='staffCode' value={this.state.specDef.staffCode} onChange={this.handleOnChange} disabled={true} />
                </FormItem>
            </Col>
            <Col span="10">   
                <FormItem {...formItemLayout} className={layoutItem} label='员工姓名' colon={true} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                    <Input type='text' name='perName' id='perName' value={this.state.specDef.perName} onChange={this.handleOnChange} disabled={true} />
                </FormItem>
            </Col>
         </Row>
        <Row type="flex">
            <Col span="10">
                 <FormItem {...formItemLayout} className={layoutItem} label='电话' colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                    <Input type='text' name='phone' id='phone' value={this.state.specDef.phone} onChange={this.handleOnChange} disabled={true} />
                </FormItem>
            </Col>
            <Col span="10">
                <FormItem {...formItemLayout} className={layoutItem} label='邮件' colon={true} help={hints.emailHint} validateStatus={hints.emailStatus}>
                        <Input type='text' name='email' id='email' value={this.state.specDef.email} onChange={this.handleOnChange} disabled={true} />
                </FormItem>
            </Col>
        </Row>
        <Row type="flex">
            <Col span="10">
                <FormItem {...formItemLayout} className={layoutItem} label='组织名称' colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}>
                        <Input type='text' name='orgName' id='orgName' value={this.state.specDef.orgName} onChange={this.handleOnChange} disabled={true} />
                </FormItem>
            </Col>
            <Col span="10">
                <FormItem {...formItemLayout} className={layoutItem} label='属地' colon={true} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                        <Input type='text' name='baseCity' id='baseCity' value={this.state.specDef.baseCity} onChange={this.handleOnChange} disabled={true}/>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <FormItem style={{textAlign:'right',margin:'4px 0'}} className={layoutItem}>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} disabled={savedisable} loading={this.state.loading}>保存</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
            </FormItem>
        </Row>
        </Form>
		var formPage=null;	     
        if(this.state.specDefStaff.flowLevel=='事业群'||this.state.specDefStaff.flowLevel=='总公司'||this.state.specDefStaff.flowLevel=='子公司' ){
           formPage =  <SearchEmployee style={{ padding: '10px 0 16px 32px', width: '600px' }} corpUuid={corpUuid} showError={this.showError} onSelectEmpLoyee={this.onSelectEmpLoyee} />
        }
        else{
            formPage =  <SearchResMember style={{ padding: '10px 0 16px 32px', width: '600px' }} corpUuid={corpUuid} showError={this.showError} onSelectMember={this.onSelectProj} />    
        }

        return ( 
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab={tab} key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['flow_role/create']}/>
                            {formPage}
                                    {
                                        this.state.loading ? <Spin>{form}</Spin> : form
                                    }
                            
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});


export default CreateSpecDefStaffPage;