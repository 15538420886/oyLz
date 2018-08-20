import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var StatFromToStore = require('../data/StatFromToStore.js');
var StatFromToActions = require('../action/StatFromToActions');

var CreateStatFromToPage = React.createClass({
	getInitialState : function() {
		return {
			statFromToSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			statFromTo: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(StatFromToStore, "onServiceComplete"), ModalForm('statFromTo')],
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
	              statFromToSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
		];
	},
	
	clear : function(InStatFromTo){
		this.state.hints = {};
		this.state.statFromTo.sttFrom='';
		this.state.statFromTo.sttCond='';
		this.state.statFromTo.sttAction='';
		this.state.statFromTo.sttTo='';
		this.state.statFromTo.disUse='';
		this.state.statFromTo.InStatFromTo = InStatFromTo;
		
		this.state.loading = false;
	    this.state.statFromToSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.statFromTo)){
			this.state.statFromToSet.operation = '';
			this.setState({loading: true});
			StatFromToActions.createStatFromTo( this.state.statFromTo );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加状态转换管理" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['stat-from-to/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="现态" required={true} colon={true} className={layoutItem} help={hints.sttFromHint} validateStatus={hints.sttFromStatus}>
								<Input type="text" name="sttFrom" id="sttFrom" value={this.state.statFromTo.sttFrom } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="条件" required={true} colon={true} className={layoutItem} help={hints.sttCondHint} validateStatus={hints.sttCondStatus}>
								<Input type="text" name="sttCond" id="sttCond" value={this.state.statFromTo.sttCond } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="动作" required={true} colon={true} className={layoutItem} help={hints.sttActionHint} validateStatus={hints.sttActionStatus}>
								<Input type="text" name="sttAction" id="sttAction" value={this.state.statFromTo.sttAction } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                        <Col span="13">
							<FormItem {...formItemLayout} label="次态" required={true} colon={true} className={layoutItem} help={hints.sttToHint} validateStatus={hints.sttToStatus}>
								<Input type="text" name="sttTo" id="sttTo" value={this.state.statFromTo.sttTo } onChange={this.handleOnChange} />
							</FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
							<FormItem {...formItemLayout} label="是否禁用" required={true} colon={true} className={layoutItem} help={hints.disUseHint} validateStatus={hints.disUseStatus}>
								<DictSelect name="disUse" id="disUse" value={this.state.statFromTo.disUse} appName='缺陷管理' optName='阿斯顿' onSelect={this.handleOnSelected.bind(this, "disUse")}/>
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

export default CreateStatFromToPage;

