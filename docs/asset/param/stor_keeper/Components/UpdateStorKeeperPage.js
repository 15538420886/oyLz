import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Row, Col, Modal, Button, Input, Select, Tabs} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var StorKeeperStore = require('../data/StorKeeperStore');
var StorKeeperActions = require('../action/StorKeeperActions');

var UpdateStorKeeperPage = React.createClass({
	getInitialState : function() {
		return {
			storKeeperSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			storKeeper: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(StorKeeperStore, "onServiceComplete"), ModalForm('storKeeper')],
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
				 storKeeperSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'storName', desc:'库管员姓名', required: false, max: '24'},
			{id: 'storCode', desc:'库管员工号', required: false, max: '24'},
			{id: 'workCity', desc:'工作城市', required: false, max: '36'},
			{id: 'deptName', desc:'部门名称', required: false, max: '64'},
			{id: 'workLoc', desc:'工作地点', required: false, max: '32'},
			{id: 'storPhone', desc:'电话', required: false, max: '24', dataType: 'mobile'},
			{id: 'storEmail', desc:'邮箱', required: false, max: '32', dataType: 'email'},
		];

		this.initPage( this.props.storKeeper );
	},
	
	initPage: function(storKeeper)
	{
		Utils.copyValue(storKeeper, this.state.storKeeper);
		this.setState( {loading: false, hints: {}} );

		this.state.storKeeperSet.operation='';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.storKeeper)){
			this.state.storKeeperSet.operation = '';
			this.setState({loading: true});
			StorKeeperActions.updateStorKeeper( this.state.storKeeper );
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

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改库管员" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
						<div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
							<ServiceMsg ref='mxgBox' svcList={['stor-keeper/update']}/>
							<Form layout={layout} style={{width:'600px'}}>
								<FormItem {...formItemLayout} label="员工编号" required={true} colon={true} className={layoutItem} help={hints.storCodeHint} validateStatus={hints.storCodeStatus}>
									<Input type="text" name="storCode" id="storCode" disabled={true} value={this.state.storKeeper.storCode } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.storNameHint} validateStatus={hints.storNameStatus}>
									<Input type="text" name="storName" id="storName" disabled={true} value={this.state.storKeeper.storName } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="城市" required={false} colon={true} className={layoutItem} help={hints.workCityHint} validateStatus={hints.workCityStatus}>
									<Input type="text" name="workCity" id="workCity" disabled={true} value={this.state.storKeeper.workCity } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
									<Input type="text" name="deptName" id="deptName" disabled={true} value={this.state.storKeeper.deptName } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="工作地点" required={false} colon={true} className={layoutItem} help={hints.workLocHint} validateStatus={hints.workLocStatus}>
									<Input type="text" name="workLoc" id="workLoc" value={this.state.storKeeper.workLoc } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="电话" required={false} colon={true} className={layoutItem} help={hints.storPhoneHint} validateStatus={hints.storPhoneStatus}>
									<Input type="text" name="storPhone" id="storPhone" value={this.state.storKeeper.storPhone } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="邮箱" required={false} colon={true} className={layoutItem} help={hints.storEmailHint} validateStatus={hints.storEmailStatus}>
									<Input type="text" name="storEmail" id="storEmail" value={this.state.storKeeper.storEmail } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
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

export default UpdateStorKeeperPage;

