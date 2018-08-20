import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
import CodeMap from '../../../../hr/lib/CodeMap';
var Common = require('../../../../public/script/common');


import { Form, Button, Input, Select, Tabs, Row, Col, Spin, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import BatchCreateOutStaffPage from './BatchCreateOutStaffPage';
import SearchOutStaff from '../../../lib/Components/SearchOutStaff';
var ResMemberStore = require('../data/ResMemberStore.js');
var ResMemberActions = require('../action/ResMemberActions');
var ProjContext = require('../../../ProjContext');

var CreateOutStaffPage = React.createClass({
	getInitialState : function() {
		return {
			outStaffSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			outStaff: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), ModalForm('outStaff'),CodeMap()],
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
	              outStaffSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'userCost', desc:'核算成本', required: false, max: '32'},
			{id: 'beginDate', desc:'入池日期', required: true, max:'24'},
            {id: 'beginHour', desc: '时间', required: true, max: '24', pattern: /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/, patternPrompt: '时间格式错误' },
		];
	},
	
	clear : function(){
		this.state.hints = {};
		this.state.outStaff = {};

		this.state.loading = false;
	    this.state.outStaffSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

    onSelectStaff: function (data) {
        var outStaff = this.state.outStaff;
        outStaff.poolUuid = ProjContext.selectedPool.uuid;
		outStaff.teamUuid = this.props.team.uuid;		
        outStaff.corpUuid = window.loginData.compUser.corpUuid;
        outStaff.userUuid = data.uuid;
		outStaff.userId = data.userId;
		outStaff.staffCode = data.staffCode;
		outStaff.perName = data.perName;
		outStaff.baseCity = data.baseCity;
		outStaff.phoneno = data.phoneno;
        outStaff.email = data.email;
		outStaff.eduDegree = data.eduDegree;
		outStaff.eduCollege = data.eduCollege;
		outStaff.workYears = data.workYears;
        outStaff.workBegin = ProjContext.calcBeginMonth(data.entryDate, data.workYears);
		outStaff.induYears = data.induYears;
        outStaff.induBegin = ProjContext.calcBeginMonth(data.entryDate, data.induYears);
		outStaff.empLevel = data.empLevel;
		outStaff.techLevel = data.techLevel;
		outStaff.manLevel = data.manLevel;
		outStaff.techUuid = data.techUuid;
		outStaff.techName = data.techName;
		outStaff.manUuid = data.manUuid;
		outStaff.manName = data.manName;
		outStaff.manType = '外协';
        outStaff.resStatus = '资源池';
		outStaff.corpName = data.corpName;

		outStaff.poolCode = ProjContext.selectedPool.poolCode;
		outStaff.poolName = ProjContext.selectedPool.poolName;
        outStaff.poolLoc = '';
        outStaff.status = '在岗';
        outStaff.resLoc = data.baseCity;

		outStaff.beginDate = Common.getToday()+'';
        outStaff.beginHour = '09:00';

        this.setState({ outStaff: outStaff});
    },
	showError : function(data){
        console.log(data)
    },
    
    onClickSave: function () {
        var outStaff = this.state.outStaff;
        outStaff.resUuid = outStaff.poolUuid;
        outStaff.resName = outStaff.poolName;
        outStaff.resDate = outStaff.beginDate;
        outStaff.resHour = outStaff.beginHour;

		this.setState({ loading: true });
		ResMemberActions.createResMember( outStaff );
	},

	goBack:function(){
        this.props.onBack();
    },
    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
        var boo = this.state.outStaff.userUuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;

        var obj = this.state.outStaff;
        var workYears = ProjContext.getDisplayWorkYears(obj.workBegin);
        var induYears = ProjContext.getDisplayWorkYears(obj.induBegin);
		var form = 
			<Form layout={layout} style={{width:'600px'}}>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工编号" className={layoutItem}>
							<Input type="text" name="staffCode" id="staffCode" value={this.state.outStaff.staffCode } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="姓名" className={layoutItem}>
							<Input type="text" name="perName" id="perName" value={this.state.outStaff.perName } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="公司名称" className={layoutItem}>
							<Input type="text" name="corpName" id="corpName" value={this.state.outStaff.corpName } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="归属地" className={layoutItem}>
							<Input type="text" name="baseCity" id="baseCity" value={this.state.outStaff.baseCity } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="人员类型" className={layoutItem}>
							<Input type="text" name="manType" id="manType" value={this.state.outStaff.manType } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="电话" className={layoutItem}>
							<Input type="text" name="phoneno" id="phoneno" value={this.state.outStaff.phoneno } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="最高学历" className={layoutItem}>
							<Input type="text" name="eduDegree" id="eduDegree" value={this.state.outStaff.eduDegree } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="毕业院校" className={layoutItem}>
							<Input type="text" name="eduCollege" id="eduCollege" value={this.state.outStaff.eduCollege } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="工龄" className={layoutItem}>
							<Col span='10'>
								<Input type="text" name="workYears_1" id="workYears_1" value={workYears.y} addonAfter ="年" onChange={this.handleOnChange2} disabled={true} />
							</Col>
							<Col span='2'>
							</Col>
							<Col span='10'>
								<Input type="text" name="workYears_2" id="workYears_2" value={workYears.m} addonAfter ="月" onChange={this.handleOnChange2} disabled={true} />
							</Col>
							
						</FormItem>
					</Col>
					<Col span="12">
                        <FormItem {...formItemLayout2} label="行业经验" className={layoutItem}>
							<Col span='11'>
								<Input type="text" name="induYears_1" id="induYears_1" value={induYears.y} addonAfter ="年" onChange={this.handleOnChange2} disabled={true} />
							</Col>
							<Col span='2'>
							</Col>
							<Col span='11'>
								<Input type="text" name="induYears_2" id="induYears_2" value={induYears.m} addonAfter ="月" onChange={this.handleOnChange2} disabled={true} />
							</Col>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="员工级别" className={layoutItem}>
							<Input type="text" name="empLevel" id="empLevel" value={this.getLevelName(corpUuid, this.state.outStaff.empLevel) } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="技术级别" className={layoutItem}>
							<Input type="text" name="techLevel" id="techLevel" value={this.state.outStaff.techLevel } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="管理级别" className={layoutItem}>
							<Input type="text" name="manLevel" id="manLevel" value={this.state.outStaff.manLevel } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="技术岗位" className={layoutItem}>
							<Input type="text" name="techUuid" id="techUuid" value={this.state.outStaff.techName } disabled={true}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="管理岗位" className={layoutItem}>
							<Input type="text" name="manUuid" id="manUuid" value={this.state.outStaff.manName } disabled={true}/>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem {...formItemLayout2} label="入池日期" required={true} colon={true} className={layoutItem} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
							<DatePicker style={{width:'100%'}} name="beginDate" id="beginDate"  format={Common.dateFormat} value={this.formatDate(this.state.outStaff.beginDate, Common.dateFormat)} onChange={this.handleOnSelDate.bind(this,"beginDate", Common.dateFormat)}/>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem {...formItemLayout2} label="时间" required={true} colon={true} className={layoutItem} help={hints.beginHourHint} validateStatus={hints.beginHourStatus}>
							<Input type="text" name="beginHour" id="beginHour" value={this.state.outStaff.beginHour} onChange={this.handleOnChange}/>
						</FormItem>
					</Col>
				</Row>
				<FormItem {...formItemLayout} label="核算成本" required={false} colon={true} className={layoutItem} help={hints.userCost} validateStatus={hints.userCost} >
					<Input type="text" name="userCost" id="userCost" value={this.state.outStaff.userCost} onChange={this.handleOnChange}/>
				</FormItem>
				<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
					<Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
					<Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
				</FormItem>
			</Form>;

	    return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="增加外协成员" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['res-member/create']}/>
                            <SearchOutStaff style={{padding:'10px 0 16px 32px', width:'600px'}} showError={this.showError} onSelectStaff={this.onSelectStaff}/>
							{
								this.state.loading ? <Spin>{form}</Spin> : form
							}
                        </div>
                    </TabPane>
                    <TabPane tab="批量增加成员" key="3" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <BatchCreateOutStaffPage team={this.props.team}/>
                    </TabPane>
                </Tabs>
	        </div>
	    );
    }
});

export default CreateOutStaffPage;
