import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
import SelectProjTeam from '../../../lib/Components/SelectProjTeam';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ProjContext from '../../../ProjContext';

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var DispatTableStore = require('../data/DispatTableStore');
var DispatTableActions = require('../action/DispatTableActions');

var DispatSure = React.createClass({
	getInitialState : function() {
		return {
            dispatSet: {
				errMsg : ''
			},
			loading: false,
			dispat: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(DispatTableStore, "onServiceComplete"), ModalForm('dispat')],
	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.props.onBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  dispatSet: data
			  });
		  }
	  }
      else if( data.operation === 'retrieveMember'){
          if( data.errMsg === ''){
			  // 成功，渲染数据
                if(data.member){
                    this.state.dispat.deptName = data.member.deptName;
                    this.state.dispat.baseCity = data.member.baseCity;
                    this.state.dispat.phoneno = data.member.phoneno;
                    this.state.dispat.eduDegree = data.member.eduDegree;
                    this.state.dispat.eduCollege = data.member.eduCollege;
                    this.state.dispat.workBegin = data.member.workBegin;
                    this.state.dispat.induBegin = data.member.induBegin;
                    this.state.dispat.techUuid = data.member.techUuid;
                    this.state.dispat.techName = data.member.techName;
                    this.state.dispat.manUuid = data.member.manUuid;
                    this.state.dispat.manName = data.member.manName;
                }

                this.setState({
                    loading: false,
                    dispatSet: data
                });
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  dispatSet: data
			  });
		  }
      }
	},
    
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'teamUuid', desc:'项目小组', required: false, max: '24'},
            {id: 'roleName', desc:'承担角色', required: false, max: '24'},
            {id: 'projLevel', desc:'客户定级', required: true, max: '64'},
            {id: 'userPrice', desc:'结算单价', required: true, max: '16'},
            {id: 'beginDate', desc:'入组日期', required: true, max:'24'},
            {id: 'beginTime', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];
		this.initPage( this.props.dispat );
	},

	initPage: function(dispat)
	{
		Utils.copyValue(dispat, this.state.dispat);
        this.state.dispat.beginDate = Common.getToday()+'';
        this.state.dispat.beginTime = '09:00';

		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
        }

        this.setState({ loading: true, hints: {}});
        DispatTableActions.getMember(dispat.staffCode);
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.dispat)){
            this.setState({ loading: true });
            this.state.dispat.projUuid = ProjContext.selectedProj.uuid;
            this.state.dispat.projName = ProjContext.selectedProj.projName;
            this.state.dispat.grpUuid = ProjContext.selectedProj.parentUuid;
			DispatTableActions.dispatSure( this.state.dispat );
		}
	},

    onTabChange:function(activeKey){
        if (activeKey === '1'){
            this.props.onBack();
        }
    },

	render : function() {
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
		var projUuid = ProjContext.selectedProj.uuid;
		var dispType = this.state.dispat.dispType === undefined ? '1' : this.state.dispat.dispType;
        var obj = this.state.dispat;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
        var form = 
            <Form layout={layout} style={{width:'600px'}}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工编号" className={layoutItem}>
                            <Input type="text" name="staffCode" id="staffCode" value={this.state.dispat.staffCode } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工姓名" className={layoutItem}>
                            <Input type="text" name="perName" id="perName" value={this.state.dispat.perName } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="任职部门" className={layoutItem}>
                            <Input type="text" name="deptName" id="deptName" value={this.state.dispat.deptName } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="归属地" className={layoutItem}>
                            <Input type="text" name="baseCity" id="baseCity" value={this.state.dispat.baseCity } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="人员类型" className={layoutItem}>
                            <Input type="text" name="manType" id="manType" value={this.state.dispat.manType } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="电话" className={layoutItem}>
                            <Input type="text" name="phoneno" id="phoneno" value={this.state.dispat.phoneno } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="最高学历" className={layoutItem}>
                            <Input type="text" name="eduDegree" id="eduDegree" value={this.state.dispat.eduDegree } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="毕业院校" className={layoutItem}>
                            <Input type="text" name="eduCollege" id="eduCollege" value={this.state.dispat.eduCollege } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="工龄" className={layoutItem}>
                            <Col span='11'>
                                <Input type="text" name="workYears_1" id="workYears_1" value={workYears.y} addonAfter="年" onChange={this.handleOnChange2} disabled={true} />
                            </Col>
                            <Col span='2'>
                            </Col>
                            <Col span='11'>
                                <Input type="text" name="workYears_2" id="workYears_2" value={workYears.m} addonAfter="月" onChange={this.handleOnChange2} disabled={true} />
                            </Col>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="行业经验" className={layoutItem}>
                            <Col span='11'>
                                <Input type="text" name="induYears_1" id="induYears_1" value={induYears.y} addonAfter="年" onChange={this.handleOnChange2} disabled={true} />
                            </Col>
                            <Col span='2'>
                            </Col>
                            <Col span='11'>
                                <Input type="text" name="induYears_2" id="induYears_2" value={induYears.m} addonAfter="月" onChange={this.handleOnChange2} disabled={true} />
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工级别" className={layoutItem}>
                            <Input type="text" name="userLevel" id="userLevel" value={this.state.dispat.userLevel } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="成本" className={layoutItem}>
                            <Input type="text" name="userCost" id="userCost" value={this.state.dispat.userCost } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="技术级别" className={layoutItem}>
                            <Input type="text" name="techLevel" id="techLevel" value={this.state.dispat.techLevel } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理级别" className={layoutItem}>
                            <Input type="text" name="manLevel" id="manLevel" value={this.state.dispat.manLevel } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="技术岗位" className={layoutItem}>
                            <Input type="text" name="techUuid" id="techUuid" value={this.state.dispat.techName } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="管理岗位" className={layoutItem}>
                            <Input type="text" name="manUuid" id="manUuid" value={this.state.dispat.manName } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="出发地" className={layoutItem}>
                            <Input type="text" name="dispLoc" id="dispLoc" value={this.state.dispat.dispLoc} disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="派遣类型" className={layoutItem}>
                            <DictRadio name="dispType" id="dispType" value={dispType} appName='项目管理' optName='派遣类型' disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="项目小组" required={false} colon={true} className={layoutItem}>
                            <SelectProjTeam projUuid={projUuid} name="teamUuid" id="teamUuid" value={this.state.dispat.teamUuid} onSelect={this.handleOnSelected.bind(this, "teamUuid")}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="承担角色" required={false} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                            <Input type="text" name="roleName" id="roleName" value={this.state.dispat.roleName} onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="客户定级" required={true} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
                            <Input type="text" name="projLevel" id="projLevel" value={this.state.dispat.projLevel} onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="结算单价" required={true} colon={true} className={layoutItem} help={hints.userPriceHint} validateStatus={hints.userPriceStatus}>
                            <Input type="text" name="userPrice" id="userPrice" value={this.state.dispat.userPrice} onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="入组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                            <DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.dispat.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="时间" required={true} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                            <Input type="text" name="beginTime" id="beginTime" value={this.state.dispat.beginTime} onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.props.onBack}>取消</Button>
                </FormItem>
            </Form>;
		return (
            <Tabs defaultActiveKey="3" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                <TabPane tab="调度指令" key="1" style={{width: '100%', height: '100%'}}>
                </TabPane>
                <TabPane tab="人员回组" key="2" disabled='true' style={{width: '100%', height: '100%'}}>
                </TabPane>
                <TabPane tab="人员入组确认" key="3" style={{ width: '100%', height: '100%'}}>
                    <div style={{padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                        <ServiceMsg ref='mxgBox' svcList={['proj-disp/create', 'proj-disp/retrieveMember']}/>
                        {this.state.loading? <Spin>{form}</Spin> : form}
                    </div>
                </TabPane>
            </Tabs> 
		);
	}
});

module.exports = DispatSure;