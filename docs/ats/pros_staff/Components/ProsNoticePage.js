import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col, DatePicker, AutoComplete,Modal} from 'antd';
const FormItem = Form.Item;
const Option = AutoComplete.Option;
const TabPane = Tabs.TabPane;


import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictRadio from '../../../lib/Components/DictRadio';
import EntryLocSelect from '../../lib/Components/LocNameSelect';
import HrPersonSelect from '../../lib/Components/HrPersonSelect';
var ProsStaffStore = require('../data/ProsStaffStore.js');
var ProsStaffActions = require('../action/ProsStaffActions');

var ProsNoticePage = React.createClass({
    getInitialState : function() {
        return {

            loading: false,
            prosStaff: {
              mailBody: '',
            },
            hints: {},
            validRules: [],
            result:[],
        }
    },

    mixins: [Reflux.listenTo(ProsStaffStore, "onServiceComplete"), ModalForm('prosStaff')],
    onServiceComplete: function(data) {
        if(data.operation === 'create'){
          if(data.errMsg === ''){
            Common.succMsg("邮件发送成功！");
              this.setState({loading:false});
              // 成功，关闭窗口
              this.goBack();
          }else{
              // 失败
              this.setState({
                  loading: false,
              })
            }
        }
        if(data.operation === 'retrieve'){
          if(data.errMsg === ''){
            this.state.prosStaff.mailBody = data.mailBody;
            this.setState({
              loading :false,
            });
          }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
           { id: 'perName', desc: '姓名', required: true, max: 32,},
           { id: 'noticeTime', desc: '已通知时间', required: true, max: 32,},
           { id: 'gender', desc: '性别',required:true, max: 32,},
           { id: 'birthDate', desc: '出生日期', max: 32,},
           { id: 'phone', desc: '电话', dataType:'mobile',max: 32,},
           { id: 'email', desc: '电子邮箱', dataType:'email', max: 64,},
           { id: 'expectDate', desc: '预计入职日期',required: true, max: 32,},
           { id: 'corpLoc', desc: '入职地址',required: true, max: 64,},
           { id: 'hrPerson', desc: '人力专员',required: true, max: 64,},
           { id: 'mailBody', desc: '邮件内容',required:true, max: 500,}

        ];
        // FIXME 输入参数
        this.initPage(this.props.prosStaff);
    },

    initPage: function(prosStaff)
  	{
  		this.state.hints = {};
  		Utils.copyValue(prosStaff, this.state.prosStaff);
  		this.setState({
  			loading:false
  		});
  		if( typeof(this.refs.mxgBox) != 'undefined' ){
  			this.refs.mxgBox.clear();
  		}
  	},
    onGenerateEmailBody : function(){
      var filter = {};
      var prosStaff = this.state.prosStaff;
      var corpData = {};
      var hrData = {};
      var recordSet = this.refs.corpLoc.state.entryLocSet.recordSet;
      this.refs.corpLoc.state.entryLocSet.recordSet.map((data,i)=>{
        if(data.uuid === prosStaff.corpLoc){
          return corpData=data;
        }
      });
      this.refs.hrPerson.state.HrPersonSelect.recordSet.map((data,i)=>{
        if(data.uuid === prosStaff.hrPerson){
          return hrData=data;
        }
      });
      filter.uuid = prosStaff.uuid;
      filter.corpName = corpData.corpName;
      filter.corpPhone = corpData.corpPhone;
      filter.corpLoc = corpData.locName;
      filter.expectDate = prosStaff.expectDate.substr(0,4)+'年'+prosStaff.expectDate.substr(4,2)+'月'+prosStaff.expectDate.substr(6,2)+'日';
      filter.hrName = hrData.hrName;
      this.state.prosStaff.mailBody = "请正确填写必须内容";
      if(Common.formValidator(this, this.state.prosStaff)){
          this.state.prosStaff.mailBody = '';
          this.setState({loading: true});
          ProsStaffActions.generateEmailBody(filter);
      }else{
        this.state.prosStaff.mailBody = '';
      }
    },
    onClickSave1 : function(){
      if(Common.formValidator(this, this.state.prosStaff)){
        Modal.confirm({
            title: '发送确认',
            content: '是否发送【'+this.state.prosStaff.perName+'】的入职通知邮件',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickSave2.bind()
        });
      }
    },
    onClickSave2 : function(){
        var filter =  {};
        this.setState({loading: true});
        ProsStaffActions.sendEmail(filter);
    },

    goBack:function(){
        this.props.onBack();
    },
    handleSearch : function (value) {
  		let result;
  		if (!value || value.indexOf('@') >= 0) {
  		    result = [];
  		} else {
  		    result = Validator.eMailList.map(domain => `${value}@${domain}`);
  		}
  		this.setState({ result });
  	},
    emailOnChange: function(value){
  		var obj = this.state.prosStaff;
  		obj.email = value;
  		Validator.validator(this, obj, 'email');
  		this.setState({
  			loading: this.state.loading
  		});
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
        let result = this.state.result;
    		const children = result.map((email) => {
    			return <Option key={email}>{email}</Option>;
    		});

        var hints=this.state.hints;
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                    <ServiceMsg ref='mxgBox' svcList={['pros-staff/mail-body','pros-staff/send-mail']}/>
                    <Form layout={layout} style={{width:'600px'}}>

                        <Row>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='姓名' required={true} colon={true} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                            		<Input type='text' name='perName' id='perName' value={this.state.prosStaff.perName} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='已通知时间' required={true} colon={true} help={hints.noticeTimeHint} validateStatus={hints.noticeTimeStatus}>
                            		<DatePicker style={{width:'200px'}} type='text' name='noticeTime' id='noticeTime' value={this.formatDate(this.state.prosStaff.noticeTime, Validator.dateFormat)} format={Validator.dateFormat} onChange={this.handleOnChange} disabled={true} />
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='性别' colon={true} help={hints.genderHint} validateStatus={hints.genderStatus}>
                                <DictRadio name="gender" id="gender" value={this.state.prosStaff.gender} appName='简历系统' optName='性别' onChange={this.onRadioChange} disabled={true}/>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='出生日期' colon={true} help={hints.birthDateHint} validateStatus={hints.birthDateStatus}>
                            		<DatePicker style={{width:'200px'}} name="birthDate" id="birthDate"  value={this.formatDate(this.state.prosStaff.birthDate, Validator.dateFormat)}  format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this,"birthDate", Validator.dateFormat)} />
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='电话' colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                            		<Input type='text' name='phone' id='phone' value={this.state.prosStaff.phone} onChange={this.handleOnChange} />
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='电子邮箱' colon={true} help={hints.emailHint} validateStatus={hints.emailStatus}>
                              <AutoComplete name="email" id="email" value={this.state.prosStaff.email } onSearch={this.handleSearch} placeholder="请输入电子邮箱" onChange={this.emailOnChange} >
                                {children}
                              </AutoComplete>
                            </FormItem>
                          </Col>
                        </Row>

                        <Row>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='预计入职日期' required={true} colon={true} help={hints.expectDateHint} validateStatus={hints.expectDateStatus}>
                                <DatePicker style={{width:'200px'}} name="expectDate" id="expectDate"  value={this.formatDate(this.state.prosStaff.expectDate, Validator.dateFormat)}  format={Validator.dateFormat} onChange={this.handleOnSelDate.bind(this,"expectDate", Validator.dateFormat)} />
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='人力专员' colon={true} required={true} help={hints.hrPersonHint} validateStatus={hints.hrPersonStatus}>
            										<HrPersonSelect ref="hrPerson" name="hrPerson" id="hrPerson" value={this.state.prosStaff.hrPerson} onSelect={this.handleOnSelected.bind(this, "hrPerson")} />
            								</FormItem>
                          </Col>
                        </Row>
                        <FormItem {...formItemLayout} className={layoutItem} label='入职地址' required={true} colon={true} help={hints.corpLocHint} validateStatus={hints.corpLocStatus}>
                            <EntryLocSelect ref="corpLoc" name='corpLoc' id='corpLoc' value={this.state.prosStaff.corpLoc} onSelect={this.handleOnSelected.bind(this, "corpLoc")}/>
                        </FormItem>
                        <FormItem {...formItemLayout} className={layoutItem} label='邮件内容' required={true} colon={true} help={hints.mailBodyHint} validateStatus={hints.mailBodyStatus}>
                            <Input style={{height:'180px'}} type='textarea' name='mailBody' id='mailBody' value={this.state.prosStaff.mailBody}  onChange={this.handleOnChange} />
                        </FormItem>
                        <FormItem style={{textAlign:'right',margin:'4px 0'}} className={layoutItem}>
                            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave1} loading={this.state.loading}>发送</Button>{' '}
                            <Button key="btnGet" size="large" onClick={this.onGenerateEmailBody} loading={this.state.loading}>生成邮件内容</Button>{' '}
                            <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
});

export default ProsNoticePage;
