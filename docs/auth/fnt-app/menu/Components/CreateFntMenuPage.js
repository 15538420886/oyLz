import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import FntRoleSelect from './FntRoleSelect';
var Context = require('../../../AuthContext');
var Validator = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select ,Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var FntMenuStore = require('../data/FntMenuStore');
var FntMenuActions = require('../action/FntMenuActions');

var CreateMenuPage = React.createClass({
	getInitialState : function() {
		return {
			menuSet: {
				errMsg : ''
			},
			loading: false,
			modal: false,
			menu: {},
			hints: {},
			validRules: [],
		}
	},

	mixins: [Reflux.listenTo(FntMenuStore, "onServiceComplete"), ModalForm('menu')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
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
			{id: 'menuPath', desc:'菜单路径', required: true, max: '32'},
			{id: 'menuTitle', desc:'菜单标题', required: true, max: '128'},
			{id: 'txnCodes', desc:'功能代码', required: false, max: '512'},
			{id: 'appRoles', desc:'可用角色', required: false, max: '512'},
		];
	},

	clear : function(appUuid, modUuid, puuid){
		this.state.hints = {};
		this.state.menu.uuid='';
		this.state.menu.appUuid = appUuid;
		this.state.menu.modUuid = modUuid;
		this.state.menu.puuid = puuid;
		
		this.state.menu.menuPath='';
		this.state.menu.menuTitle='';
		this.state.menu.txnCodes='';
		this.state.menu.leafNode='0';
		this.state.menu.menuDesc='';
		this.state.menu.appRoles='';

		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	selectRole : function(value) {
        var menu = this.state.menu;
        var arr = menu.appRoles? menu.appRoles.split(','):[];
        arr.push(value);
        menu.appRoles = arr.join(',');
        this.setState({
            loading: this.state.loading,
        });
    },

    deSelectRole: function(value){
        var menu = this.state.menu;
        var arr = menu.appRoles.split(',');
        for(var i=0; i<arr.length; i++){
            if(arr[i] === value){
                arr.splice(i,1);
                break;
            }
        }
        menu.appRoles = arr.join(',');
        this.setState({
            loading: this.state.loading
        });
    },

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.menu)){
			this.setState({loading: true});
			FntMenuActions.createFntAppMenu( this.state.menu );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

        var visible = (this.state.menu.leafNode === '1') ? '' : 'none';
		var hints=this.state.hints;
		var appUuid = Context.fntApp.uuid;
        var roleArr = this.state.menu.appRoles ? this.state.menu.appRoles.split(','):[];

		return (
			<Modal visible={this.state.modal} width='540px' title="增加菜单" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['fnt-app-menu/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} label="菜单路径" required={true} colon={true} className={layoutItem} help={hints.menuPathHint} validateStatus={hints.menuPathStatus}>
	                    <Input type="text" name="menuPath" id="menuPath" value={this.state.menu.menuPath} onChange={this.handleOnChange}/>
	                </FormItem>
	                <FormItem {...formItemLayout} label="菜单标题" required={true} colon={true} className={layoutItem} help={hints.menuTitleHint} validateStatus={hints.menuTitleStatus}>
	                    <Input type="text" name="menuTitle" id="menuTitle" value={this.state.menu.menuTitle} onChange={this.handleOnChange}/>
	                </FormItem>
	                <FormItem {...formItemLayout} label="叶子节点" colon={true} className={layoutItem} help={hints.leafNodeHint} validateStatus={hints.leafNodeStatus}>
						<RadioGroup name="leafNode" id="leafNode" onChange={this.onRadioChange} value={this.state.menu.leafNode}>
			              <Radio id="leafNode" value='1'>是</Radio>
			              <Radio id="leafNode" value='0'>否</Radio>
			            </RadioGroup>
                    </FormItem>
	                <FormItem {...formItemLayout} label="可用角色" colon={true} className={layoutItem} help={hints.appRolesHint} validateStatus={hints.appRolesStatus}>
                        <FntRoleSelect appUuid={appUuid}  name="appRoles" id="appRoles" value={roleArr} onSelect={this.selectRole} onDeselect={this.deSelectRole}/>
	                </FormItem>
                    <FormItem {...formItemLayout} label="功能代码" colon={true} className={layoutItem} help={hints.txnCodesHint} validateStatus={hints.txnCodesStatus} style={{display: visible }}>
	                    <Input type="text" name="txnCodes" id="txnCodes" value={this.state.menu.txnCodes} onChange={this.handleOnChange}/>
	                </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateMenuPage;
