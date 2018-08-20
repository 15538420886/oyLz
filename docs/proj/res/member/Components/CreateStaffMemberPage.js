import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Row, Col, Spin, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var ProjContext = require('../../../ProjContext');
import SelectPool from '../../../lib/Components/SelectPool';
import SelectResTeam from '../../../lib/Components/SelectResTeam';
var ResMemberStore = require('../data/ResMemberStore');
var ResMemberActions = require('../action/ResMemberActions');

var CreateStaffMemberPage = React.createClass({
	getInitialState : function() {
		return {
			resMemberSet: {
				empJob : {},
				errMsg : ''
			},
			loading: false,
			resMember: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), ModalForm('resMember')],
	onServiceComplete: function(data) {
	  if(data.operation === 'create'){
	      if( data.errMsg === ''){
              // 成功
              this.setState({
                  loading: false,
              });

              this.props.onSave('member');
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              resMemberSet: data
	          });
	      }
	  }
	},

	// 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'poolUuid', desc: '资源池', required: true, max: '24' },
            { id: 'teamUuid', desc: '小组', required: true, max: '24' },
			{id: 'userCost', desc:'核算成本', required: false, max: '32'},
			{id: 'beginDate', desc:'入池日期', required: true, max:'24'},
            {id: 'beginHour', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
        ];

        var type = this.props.type;
        if (type === 'out') {
            this.initOutStaff(this.props.obj.user, this.props.obj.job);
        }
        else if (type === 'staff') {
            this.initStaff(this.props.obj.user, this.props.obj.job);
        }
	},
	
    initStaff: function (staff, empJob){
		this.state.hints = {};

        var member = {};
        member.corpUuid = staff.corpUuid;
        member.userUuid = staff.uuid;
        member.userId = staff.userId;
        member.staffCode = staff.staffCode;
        member.perName = staff.perName;
        member.deptName = staff.deptName;
        member.baseCity = staff.baseCity;
        member.phoneno = staff.phoneno;
        member.email = staff.email;
        member.eduDegree = staff.eduDegree;
        member.eduCollege = staff.eduCollege;
        member.workYears = staff.workYears;
        member.workBegin = ProjContext.calcBeginMonth(staff.entryDate, staff.workYears);
        member.induYears = staff.induYears;
        member.induBegin = ProjContext.calcBeginMonth(staff.entryDate, staff.induYears);
        member.beginDate = '' + Common.getToday();
        member.resLoc = staff.baseCity;
        member.beginHour = '09:00';
        member.status = '在岗';
        member.poolLoc = '';

        member.empLevel = empJob.empLevel;
        member.techLevel = empJob.techLevel;
        member.manLevel = empJob.manLevel;
        member.techUuid = empJob.techUuid;
        member.techName = empJob.techName;
        member.manUuid = empJob.manUuid;
        member.manName = empJob.manName;
        member.manType = (empJob.empType == '员工') ? '员工' : '实习';
        member.resStatus = '资源池';
        // member.userCost = empJob.userCost;

        this.setState({ resMember: member, loading: false });
	    if( typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

    initOutStaff: function (staff, empJob) {
        this.state.hints = {};

        var member = {};
        member.corpUuid = staff.corpUuid;
        member.userUuid = staff.uuid;
        member.userId = staff.userId;
        member.staffCode = staff.staffCode;
        member.perName = staff.perName;
        member.deptName = '';
        member.baseCity = staff.baseCity;
        member.phoneno = staff.phoneno;
        member.email = staff.email;
        member.eduDegree = staff.eduDegree;
        member.eduCollege = staff.eduCollege;
        member.workYears = staff.workYears;
        member.workBegin = ProjContext.calcBeginMonth(staff.entryDate, staff.workYears);
        member.induYears = staff.induYears;
        member.induBegin = ProjContext.calcBeginMonth(staff.entryDate, staff.induYears);
        member.beginDate = '' + Common.getToday();
        member.resLoc = staff.baseCity;
        member.beginHour = '09:00';
        member.status = '在岗';
        member.poolLoc = '';
        member.corpName = staff.corpName;

        member.empLevel = empJob.empLevel;
        member.techLevel = empJob.techLevel;
        member.manLevel = empJob.manLevel;
        member.techUuid = empJob.techUuid;
        member.techName = empJob.techName;
        member.manUuid = empJob.manUuid;
        member.manName = empJob.manName;
        member.manType = '外协';
        member.resStatus = '资源池';
        member.userCost = empJob.userCost;

        this.setState({ resMember: member, loading: false });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    handleOnSelectedPool: function (value) {
        var member = this.state.resMember;
        if (member.poolUuid !== value) {
            member.teamUuid = "";
            member.poolUuid = value;

            var poolBox = this.refs.poolBox;
            var pool = poolBox.getPoolNode(value);
            member.poolCode = pool.poolCode;
            member.poolName = pool.poolName;

            this.setState({
                resMember: member,
            });
        }
    },
    
	onClickSave : function(){
        var member = this.state.resMember;
        if (Common.formValidator(this, member)) {
            member.resUuid = member.poolUuid;
            member.resName = member.poolName;
            member.resDate = member.beginDate;
            member.resHour = member.beginHour;

            // console.log('member', member)
            this.setState({ loading: true });
            ResMemberActions.createResMember(member);
        }
	},
    
    render: function () {
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
        var obj = this.state.resMember;
        var corpUuid = obj.corpUuid;
        var poolUuid = obj.poolUuid;

	    return (
            <div style={{ padding: "8px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <Form layout={layout} style={{ width: '100%' }}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="员工编号" className={layoutItem}>
                                <Input type="text" name="staffCode" id="staffCode" value={obj.staffCode} disabled={true} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="姓名" className={layoutItem}>
                                <Input type="text" name="perName" id="perName" value={obj.perName} disabled={true} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="资源池" required={true} colon={true} className={layoutItem} help={hints.poolUuidHint} validateStatus={hints.poolUuidStatus}>
                                <SelectPool ref='poolBox' corpUuid={corpUuid} name="poolUuid" id="poolUuid" value={obj.poolUuid} onSelect={this.handleOnSelectedPool} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="小组" required={true} colon={true} className={layoutItem} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
                                <SelectResTeam poolUuid={poolUuid} name="teamUuid" id="teamUuid" value={obj.teamUuid} onSelect={this.handleOnSelected.bind(this, "teamUuid")} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="入池日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                <DatePicker style={{ width: '100%' }} name="beginDate" id="beginDate" format={Common.dateFormat} value={this.formatDate(obj.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this, "beginDate", Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="时间" required={true} colon={true} className={layoutItem} help={hints.beginHourHint} validateStatus={hints.beginHourStatus}>
                                <Input type="text" name="beginHour" id="beginHour" value={obj.beginHour} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="核算成本" required={false} colon={true} className={layoutItem} help={hints.userCost} validateStatus={hints.userCost} >
                        <Input type="text" name="userCost" id="userCost" value={obj.userCost} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>

                <div key="footerDiv" style={{ display: 'block', textAlign: 'right', padding: '8px 0 0 0' }}>
                    <ServiceMsg ref='mxgBox' svcList={['res-member/create']} />
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                </div>
            </div>
	    );
    }
}); 

export default CreateStaffMemberPage;

