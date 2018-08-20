import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select ,Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var MenuStore = require('../data/MenuStore.js');
var MenuActions = require('../action/MenuActions');

var UpdateMenuPage = React.createClass({
	getInitialState : function() {
		return {
			menuSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			menu: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(MenuStore, "onServiceComplete"), ModalForm('menu')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'update'){
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
				  menuSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'menuCode', desc:'菜单编号', required: true, max: '32'},
			{id: 'menuTitle', desc:'菜单标题', required: true, max: '128'},
			{id: 'txnCodes', desc:'功能代码', required: true, max: '512'},
		];
	},
	
	initPage: function(menu)
	{
		this.state.hints = {};
		Utils.copyValue(menu, this.state.menu);
		
		this.state.loading = false;
		this.state.menuSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.menu)){
			this.state.menuSet.operation = '';
			this.setState({loading: true});
			MenuActions.updateAuthAppMenu( this.state.menu );
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
			<Modal visible={this.state.modal} width='540px' title="修改菜单配置信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['auth-app-menu/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="菜单编号" colon={true} className={layoutItem} help={hints.menuCodeHint} validateStatus={hints.menuCodeStatus}>
	                    <Input type="text" name="menuCode" id="menuCode" value={this.state.menu.menuCode} onChange={this.handleOnChange}/>
	                </FormItem>
	                <FormItem {...formItemLayout} label="菜单标题" colon={true} className={layoutItem} help={hints.menuTitleHint} validateStatus={hints.menuTitleStatus}>
	                    <Input type="text" name="menuTitle" id="menuTitle" value={this.state.menu.menuTitle} onChange={this.handleOnChange}/>
	                </FormItem>
	                <FormItem {...formItemLayout} label="叶子节点" colon={true} className={layoutItem} help={hints.leafNodeHint} validateStatus={hints.leafNodeStatus}>
						<RadioGroup name="leafNode" id="leafNode" onChange={this.onRadioChange} value={this.state.menu.leafNode}>
			              <Radio id="leafNode" value='1'>是</Radio>
			              <Radio id="leafNode" value='0'>否</Radio>
			            </RadioGroup>
                    </FormItem>
	                <FormItem {...formItemLayout} label="功能代码" colon={true} className={layoutItem} help={hints.txnCodesHint} validateStatus={hints.txnCodesStatus}>
	                    <Input type="text" name="txnCodes" id="txnCodes" value={this.state.menu.txnCodes} onChange={this.handleOnChange}/>
	                </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default UpdateMenuPage;

