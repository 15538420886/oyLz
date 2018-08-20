import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var TempCheckStore = require('../data/TempCheckStore');
var TempCheckActions = require('../action/TempCheckActions');
var CheckInfoActions = require('../../../lib/action/CheckInfoActions');
var CheckInfoStore = require('../../../lib/data/CheckInfoStore');
import CodeMap from '../../../../hr/lib/CodeMap';
import ProjContext from '../../../ProjContext';

var CreateTempCheckPage = React.createClass({
	getInitialState : function() {
		return {
			tempCheckSet: {
				errMsg : ''
			},
			loading: false,
			modal: false,	
            tempCheck:{},	
            hints: {},
            validRules: [],
            isCreate: false,
		}
	},

    mixins: [Reflux.listenTo(TempCheckStore, "onServiceComplete"), ModalForm('tempCheck'),
        Reflux.listenTo(CheckInfoStore, "onCheckInfoComplete"), CodeMap()],
   
	onServiceComplete: function(data) {
	  if(this.state.modal){
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
	              tempCheckSet: data
	          });
	      }
	  }
	},

    onCheckInfoComplete: function(data) {
        ProjContext.calcCheckDate(this.state.tempCheck, data.posSet, data.leaveSet, this.state.isCreate);
        
        this.setState({
            loading: false,
            leaveSet: data.leaveSet,
            posSet: data.posSet,
        });
    },
    
	// 第一次加载
	componentDidMount : function(){
        this.state.validRules = [
            {id: 'staffCode', desc:'工号', required: false, max: '0'},
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            { id: 'fromHour', desc:'开始时间', required: false, max: '0'},
            { id: 'toHour', desc:'结束时间', required: false, max: '0'},
            {id: 'dateType', desc:'日期类型', required: false, max: '0'},
            {id: 'leaveType', desc:'休假类型', required: false, max: '0'},
            {id: 'leaveHour', desc:'休假时间', required: false, max: '0'},
            {id: 'workHour', desc:'工时', required: false, max: '0'},
            {id: 'overHour', desc:'加班', required: false, max: '0'},
            { id: 'chkDesc', desc:'备注', required: false, max: '512'},
        ];
	},
	
	clear : function(tempCheck,chkDate){
        this.state.hints = {};
        Utils.copyValue(tempCheck, this.state.tempCheck);

        var corpUuid = window.loginData.compUser.corpUuid;
        this.state.tempCheck.corpUuid = corpUuid;
        this.state.tempCheck.chkDate = chkDate;
        this.state.tempCheck.chkProj = ProjContext.selectedProj.uuid;
        this.state.tempCheck.chkTeam = '';

        this.state.tempCheck.projUuid = tempCheck.resUuid;
        this.state.tempCheck.teamUuid = tempCheck.teamUuid;
        this.state.tempCheck.projType = tempCheck.resStatus;
        this.state.tempCheck.projName = tempCheck.resName;
        this.state.tempCheck.projLoc = tempCheck.resLoc;

        this.state.tempCheck.pmUuid = '';
        this.state.tempCheck.pmCode = window.loginData.compUser.userCode;
        this.state.tempCheck.pmName = window.loginData.authUser.perName;
        this.state.tempCheck.fromHour = tempCheck.fromTime;
        this.state.tempCheck.toHour = tempCheck.endTime;

        this.state.tempCheck.dateType = this.getDateType(chkDate);
        this.state.tempCheck.leaveType='';
        this.state.tempCheck.leaveHour='0';
        this.state.tempCheck.chkType = '';

        var checkUuid = tempCheck.checkUuid;
        if (checkUuid === undefined || checkUuid === null || checkUuid === '') {
            this.state.tempCheck.workHour = '0';
            this.state.tempCheck.overHour = '0';
            this.state.tempCheck.chkDesc = '';
            this.state.isCreate = true;
        }
        else {
            this.state.tempCheck.uuid = checkUuid;
            this.state.isCreate = false;
        }

        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }

        this.state.loading = true;
        CheckInfoActions.getCheckInfo(corpUuid,tempCheck.staffCode,tempCheck.userId,chkDate);
	},

	onClickSave : function(){
        this.setState({ loading: true });
        if (this.state.isCreate) {
            TempCheckActions.createUserChkBook(this.state.tempCheck);
        }
        else {
            TempCheckActions.updateUserChkBook(this.state.tempCheck);
        }
	},
	
	render : function(){
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
        var hints=this.state.hints;

        var title = this.state.isCreate ? "生成考勤" : "修改考勤数据";
        return (
                <Modal visible={this.state.modal} width='540px' title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                 footer={[
                    <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                        <ServiceMsg ref='mxgBox' svcList={['user-chk-book/retrieve','user-chk-book/update']}/>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                </div>
                ]}
            >
		
                <Form layout={layout}>
                     <Row>
                         <Col span="12">
                            <FormItem {...formItemLayout} label="工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                <Input type="text" name="staffCode" id="staffCode" value={this.state.tempCheck.staffCode } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                <Input type="text" name="perName" id="perName" value={this.state.tempCheck.perName } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                         </Col>   
                      </Row>
                    <Row>
                      <Col span="12">     
                            <FormItem {...formItemLayout} label="开始时间" required={false} colon={true} className={layoutItem} help={hints.fromHourHint} validateStatus={hints.fromHourStatus}>
                                <Input type="text" name="fromHour" id="fromHour" value={this.state.tempCheck.fromHour } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                       </Col>
                       <Col span="12">     
                            <FormItem {...formItemLayout} label="结束时间" required={false} colon={true} className={layoutItem} help={hints.toHourHint} validateStatus={hints.toHourStatus}>
                                <Input type="text" name="toHour" id="toHour" value={this.state.tempCheck.toHour } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                        </Col>   
                    </Row>
                    <FormItem {...formItemLayout2} label="签到记录" required={false} colon={true} className={layoutItem}>
                        <Input type="textarea" name="checkLogger" id="checkLogger" value={this.state.tempCheck.checkLogger} readOnly={true} />
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout} label="签到时长" required={false} colon={true} className={layoutItem}>
                                <Input type="text" name="checkHour" id="checkHour" value={this.state.tempCheck.checkHour} disabled={true} />
                            </FormItem>
                       </Col>   
                      <Col span="12">         
                            <FormItem {...formItemLayout} label="日期类型" required={false} colon={true} className={layoutItem} help={hints.dateTypeHint} validateStatus={hints.dateTypeStatus}>
                                <Input type="text" name="dateType" id="dateType" value={this.state.tempCheck.dateType } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                       </Col>
                    </Row>
                      <Row>  
                       <Col span="12"> 
                            <FormItem {...formItemLayout} label="休假类型" required={false} colon={true} className={layoutItem} help={hints.leaveTypeHint} validateStatus={hints.leaveTypeStatus}>
                                <Input type="text" name="leaveType" id="leaveType" value={this.state.tempCheck.leaveType } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                         </Col>   
                         <Col span="12"> 
                            <FormItem {...formItemLayout} label="休假时间" required={false} colon={true} className={layoutItem} help={hints.leaveHourHint} validateStatus={hints.leaveHourStatus}>
                                <Input type="text" name="leaveHour" id="leaveHour" value={this.state.tempCheck.leaveHour } onChange={this.handleOnChange} disabled={true}/>
                            </FormItem>
                          </Col>    
                        </Row>
                         <Row>
                           <Col span="12">   
                            <FormItem {...formItemLayout} label="工时" required={false} colon={true} className={layoutItem} help={hints.workHourHint} validateStatus={hints.workHourStatus}>
                                <Input type="text" name="workHour" id="workHour" value={this.state.tempCheck.workHour } onChange={this.handleOnChange} />
                            </FormItem>
                          </Col>
                          <Col span="12">  
                            <FormItem {...formItemLayout} label="加班" required={false} colon={true} className={layoutItem} help={hints.overHourHint} validateStatus={hints.overHourStatus}>
                                <Input type="text" name="overHour" id="overHour" value={this.state.tempCheck.overHour } onChange={this.handleOnChange} />
                            </FormItem>
                         </Col>   
                      </Row>
                    <Row>
                        <FormItem {...formItemLayout2} label="备注" required={false} colon={true} className={layoutItem} help={hints.chkDescHint} validateStatus={hints.chkDescStatus}>
                            <Input type="textarea" name="chkDesc" id="chkDesc" value={this.state.tempCheck.chkDesc } onChange={this.handleOnChange} />
                        </FormItem>
                    </Row>
                </Form>


            </Modal>
    	);
	}
});

export default CreateTempCheckPage;

