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
var StorLocStore = require('../data/StorLocStore');
var StorLocActions = require('../action/StorLocActions');
import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';

var UpdateStorLocPage = React.createClass({
	getInitialState : function() {
		return {
			storLocSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			storLoc: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(StorLocStore, "onServiceComplete"), ModalForm('storLoc')],
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
				 storLocSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'locName', desc:'地址', required: true, max: '128'},
			{id: 'storCity', desc:'存放城市', required: true, max: '24'},
			{id: 'storName', desc:'库管员', required: true, max: '24'},
			{id: 'memo2', desc:'说明', required: false, max: '32'},		
		];

		this.initPage( this.props.storLoc );
	},
	
	initPage: function(storLoc)
	{
		Utils.copyValue(storLoc, this.state.storLoc);
		this.setState( {loading: false, hints: {}} );
		if (this.refs.empSearchBox !== undefined) {
            this.refs.empSearchBox.setValue(storLoc.storName);
        }

		this.state.storLocSet.operation='';
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.storLoc)){
			this.state.storLocSet.operation = '';
			this.setState({loading: true});
			StorLocActions.updateStorLoc( this.state.storLoc );
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
		var corpUuid = window.loginData.compUser.corpUuid;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改库管地" key="2" style={{width: '100%', height: '100%',overflowY:'auto'}}>
						<div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
							<ServiceMsg ref='mxgBox' svcList={['stor-keeper/update']}/>
							<Form layout={layout} style={{width:'600px'}}>
								<FormItem {...formItemLayout} label="城市" required={true} colon={true} className={layoutItem} help={hints.storCityHint} validateStatus={hints.storCityStatus}>
									<Input type="text" name="storCity" id="storCity" value={this.state.storLoc.storCity } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="地址" required={true} colon={true} className={layoutItem} help={hints.locNameHint} validateStatus={hints.locNameStatus}>
									<Input type="text" name="locName" id="locName" value={this.state.storLoc.locName } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="库管员" required={true} colon={true} className={layoutItem} help={hints.storNameHint} validateStatus={hints.storNameStatus}>
									<SearchEmployee corpUuid={corpUuid} showError={this.showError} ref='empSearchBox' type="text"  name="storName" id="storName" value={this.state.storLoc.storName} onSelectEmpLoyee={this.onSelectEmpLoyee}/>
								</FormItem>
								<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
									<Input type="textarea" name="memo2" id="memo2" value={this.state.storLoc.memo2 } onChange={this.handleOnChange} />
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

export default UpdateStorLocPage;

