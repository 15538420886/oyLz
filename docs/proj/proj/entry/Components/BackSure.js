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
import ProjCodeMap from '../../../lib/ProjCodeMap';

import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var BackTableStore = require('../data/BackTableStore');
var BackTableActions = require('../action/BackTableActions');

var BackSure = React.createClass({
	getInitialState : function() {
		return {
            backSet: {
				errMsg : ''
			},
			loading: false,
			back: {},
			hints: {},
			validRules: []
		}
	},

    mixins: [Reflux.listenTo(BackTableStore, "onServiceComplete"), ModalForm('back'), ProjCodeMap()],
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
				  backSet: data
			  });
		  }
	  }
      else if( data.operation === 'retrieveMember'){
          if( data.errMsg === ''){
                // 成功，渲染数据
                if(data.member){
                    this.state.back.deptName = data.member.deptName;
                    this.state.back.baseCity = data.member.baseCity;
                    this.state.back.manType = data.member.manType;
                    this.state.back.phoneno = data.member.phoneno;
                    this.state.back.eduDegree = data.member.eduDegree;
                    this.state.back.eduCollege = data.member.eduCollege;
                    this.state.back.workBegin = data.member.workBegin;
                    this.state.back.induBegin = data.member.induBegin;
                    this.state.back.techUuid = data.member.techUuid;
                    this.state.back.techName = data.member.techName;
                    this.state.back.manUuid = data.member.manUuid;
                    this.state.back.manName = data.member.manName;
                }
                
                this.setState({
                    loading: false,
                    backSet: data
                });
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  backSet: data
			  });
		  }
      }
	},
    
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'beginDate', desc:'入组日期', required: true, max:'24'},
            {id: 'beginTime', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];
		this.initPage( this.props.back );
	},

	initPage: function(back)
	{
		Utils.copyValue(back, this.state.back);
        this.state.back.beginDate = Common.getToday()+'';
        this.state.back.beginTime = '09:00';

		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
        }

        this.setState({ loading: true, hints: {}});
        BackTableActions.getMember(back.staffCode);
	},
    //小组名称
    getLevelName: function(teamUuid){
        var value = this._getNullValue(uuid, 'hr_level')
        if(value === null){
            LevelActions.getLevelName( corpUuid, uuid );	// 下载数据
            value = this._getResultValue(uuid, 'hr_level');
        }

        return value;
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.back)){
            this.setState({ loading: true });
            this.state.back.projUuid = ProjContext.selectedProj.uuid;
            this.state.back.projName = ProjContext.selectedProj.projName;
            this.state.back.grpUuid = ProjContext.selectedProj.parentUuid;
			BackTableActions.backSure( this.state.back );
		}
	},

    onTabChange:function(activeKey){
        if (activeKey === '2'){
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
        const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
        var projUuid = ProjContext.selectedProj.uuid;
        var teamName = this.getTeamName(projUuid, this.state.back.teamUuid);
		var dispType = this.state.back.dispType === undefined ? '1' : this.state.back.dispType;
        var form = 
            <Form layout={layout} style={{width:'600px'}}>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工编号" className={layoutItem}>
                            <Input type="text" name="staffCode" id="staffCode" value={this.state.back.staffCode } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="员工姓名" className={layoutItem}>
                            <Input type="text" name="perName" id="perName" value={this.state.back.perName } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="人员类型" className={layoutItem}>
                            <Input type="text" name="manType" id="manType" value={this.state.back.manType } disabled={true}/>
                        </FormItem>
                        
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="归属地" className={layoutItem}>
                            <Input type="text" name="baseCity" id="baseCity" value={this.state.back.baseCity } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem {...formItemLayout2} label="公司" className={layoutItem}>
                            <Input type="text" name="corpName" id="corpName" value={this.state.back.corpName } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem {...formItemLayout2} label="部门" className={layoutItem}>
                            <Input type="text" name="deptName" id="deptName" value={this.state.back.deptName } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="小组名称" className={layoutItem}>
                            <Input type="text" name="teamUuid" id="teamUuid" value={teamName} disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="客户级别" className={layoutItem}>
                            <Input type="text" name="projLevel" id="projLevel" value={this.state.back.projLevel } disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="结算单价" className={layoutItem}>
                            <Input type="text" name="userPrice" id="userPrice" value={this.state.back.userPrice } disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="离组日期" className={layoutItem}>
                            <Input type="text" name="endDate" id="endDate" value={Common.formatDate(this.state.back.endDate, Common.dateFormat)} disabled={true}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="离组时间" className={layoutItem}>
                            <Input type="text" name="endTime" id="endTime" value={this.state.back.endTime} disabled={true}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="回组日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                            <DatePicker style={{width:'100%'}} name="beginDate" id="beginDate" format={Common.dateFormat} value={this.formatDate(this.state.back.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem {...formItemLayout} label="回组时间" required={true} colon={true} className={layoutItem} help={hints.beginTimeHint} validateStatus={hints.beginTimeStatus}>
                            <Input type="text" name="beginTime" id="beginTime" value={this.state.back.beginTime} onChange={this.handleOnChange}/>
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
                <TabPane tab="调度指令" key="1" disabled='true' style={{width: '100%', height: '100%'}}>
                </TabPane>
                <TabPane tab="人员回组" key="2" style={{width: '100%', height: '100%'}}>
                </TabPane>
                <TabPane tab="人员回组确认" key="3" style={{ width: '100%', height: '100%'}}>
                    <div style={{padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                        <ServiceMsg ref='mxgBox' svcList={['proj-member/create', 'proj-member/retrieveMember']}/>
                        {this.state.loading? <Spin>{form}</Spin> : form}
                    </div>
                </TabPane>
            </Tabs> 
		);
	}
});

module.exports = BackSure;