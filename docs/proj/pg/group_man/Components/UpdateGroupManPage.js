import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col , DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import DictSelect from '../../../../lib/Components/DictSelect';

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var GroupManStore = require('../data/GroupManStore.js');
var GroupManActions = require('../action/GroupManActions');
import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';

var UpdateGroupManPage = React.createClass({
	getInitialState : function() {
		return {
			groupManSet: {},
			loading: false,
			groupMan: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(GroupManStore, "onServiceComplete"), ModalForm('groupMan')],
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
				  groupManSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'roleName', desc: '角色', required: true, max: 64,},
			{ id: 'perName', desc: '姓名', required: true, max: 32,},
			{ id: 'beginDate', desc: '开始日期', max: 24,},
			{ id: 'endDate', desc: '离组日期', max: 24,},
		];
		this.initPage( this.props.groupMan );
	},

	initPage: function(groupMan)
	{
		Utils.copyValue(groupMan, this.state.groupMan);

		if (this.refs.empSearchBox !== undefined) {
            this.refs.empSearchBox.setValue(groupMan.perName);
        }

		this.setState( {loading: false, hints: {}} );
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}

	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.groupMan)){
			this.setState({loading: true});
			GroupManActions.updateGroupMan( this.state.groupMan );
		}
	},

	onSelectEmpLoyee : function(data){
        this.state.groupMan.userUuid = data.uuid;
        this.state.groupMan.staffCode = data.staffCode;
		this.state.groupMan.perName = data.perName;
        this.refs.empSearchBox.setValue(data.perName);
        this.setState({
            user:data,
        })
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
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};
		
		var hints=this.state.hints;
		var corpUuid = window.loginData.compUser.corpUuid;
		
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改项目群管理员信息" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{ padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
							<ServiceMsg ref='mxgBox' svcList={['group-man/update']}/>
							<Form layout={layout} style={{width:'600px'}}>
								<FormItem {...formItemLayout} className={layoutItem} label='角色' required={true} colon={true} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
										<DictSelect name='roleName' id='roleName' appName='项目管理' optName='项目群角色' value={this.state.groupMan.roleName} onSelect={this.handleOnSelected.bind(this, 'roleName')} />
								</FormItem>
								<FormItem {...formItemLayout} className={layoutItem} label='姓名' required={true} colon={true} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                        				<SearchEmployee corpUuid={corpUuid} showError={this.showError} ref='empSearchBox' type="text"  name="perName" id="perName" value={this.state.groupMan.perName} onSelectEmpLoyee={this.onSelectEmpLoyee}/>
								</FormItem>
								<FormItem {...formItemLayout} className={layoutItem} label='开始日期' colon={true} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
										<DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.groupMan.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
								</FormItem>
								<FormItem {...formItemLayout} className={layoutItem} label='离组日期' colon={true} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
										<DatePicker name='endDate' id='endDate' style={{width:'100%'}} value={this.formatDate(this.state.groupMan.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'endDate', Common.dateFormat)} />
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

export default UpdateGroupManPage;