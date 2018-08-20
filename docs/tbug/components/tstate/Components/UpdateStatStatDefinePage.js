import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var StatStatDefineStore = require('../data/StatStatDefineStore.js');
var StatStatDefineActions = require('../action/StatStatDefineActions.js');

var UpdateStatStatDefinePage = React.createClass({
	getInitialState : function() {
		return {
			statStatDefineSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			statStatDefine: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(StatStatDefineStore, "onServiceComplete"), ModalForm('statStatDefine')],
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
				  statStatDefineSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'sttCode', desc:'状态编码', required: true, max: '255'},
			{id: 'sttName', desc:'状态名称', required: true, max: '255'},
			{id: 'isBegin', desc:'初始', required: false, max: '255'},
			{id: 'isFinal', desc:'结束', required: false, max: '255'},
			{id: 'disUse', desc:'是否禁用', required: false, max: '255'},
		];
	},
	
	initPage: function(statStatDefine)
	{
		this.state.hints = {};
		Utils.copyValue(statStatDefine, this.state.statStatDefine);
		
		this.state.loading = false;
		this.state.statStatDefineSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.statStatDefine)){
			this.state.statStatDefineSet.operation = '';
			this.setState({loading: true});
			StatStatDefineActions.updateStatStatDefine( this.state.statStatDefine );
		}
	},

	render : function() {
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
		
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="修改状态机状态管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['stat-stat-define/update']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="状态编码" required={true} colon={true} className={layoutItem} help={hints.sttCodeHint} validateStatus={hints.sttCodeStatus}>
								<Input type="text" name="sttCode" id="sttCode" value={this.state.statStatDefine.sttCode } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="状态名称" required={true} colon={true} className={layoutItem} help={hints.sttNameHint} validateStatus={hints.sttNameStatus}>
								<Input type="text" name="sttName" id="sttName" value={this.state.statStatDefine.sttName } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="初始" required={true} colon={true} className={layoutItem} help={hints.isBeginHint} validateStatus={hints.isBeginStatus}>
								<Input type="text" name="isBegin" id="isBegin" value={this.state.statStatDefine.isBegin } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="结束" required={true} colon={true} className={layoutItem} help={hints.isFinalHint} validateStatus={hints.isFinalStatus}>
								<Input type="text" name="isFinal" id="isFinal" value={this.state.statStatDefine.isFinal } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="是否禁用" required={true} colon={true} className={layoutItem} help={hints.disUseHint} validateStatus={hints.disUseStatus}>
								<DictSelect name="disUse" id="disUse" value={this.state.statStatDefine.disUse} appName='缺陷管理' optName='阿斯顿' onSelect={this.handleOnSelected.bind(this, "disUse")}/>
							</FormItem>
                        </Col>
                        <Col span="13">
                        </Col>
                    </Row>
				</Form>
			</Modal>
		);
	}
});

export default UpdateStatStatDefinePage;

