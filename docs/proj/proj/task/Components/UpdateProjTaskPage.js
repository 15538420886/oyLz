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

var ProjTaskStore = require('../data/ProjTaskStore.js');
var ProjTaskActions = require('../action/ProjTaskActions');

var UpdateProjTaskPage = React.createClass({
	getInitialState : function() {
		return {
			projTaskSet: {},
			loading: false,
			projTask: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProjTaskStore, "onServiceComplete"), ModalForm('projTask')],
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
				  projTaskSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{ id: 'ordCode', desc: '订单编号',},
			{ id: 'ordName', desc: '订单名称',},
			{ id: 'itemCode', desc: '任务编号',},
			{ id: 'itemName', desc: '任务名称',},
			{ id: 'beginDate', desc: '开始日期',},
			{ id: 'endDate', desc: '结束日期',},
            { id: 'tastStatus', desc: '状态', required: true, },
		];
		this.initPage( this.props.projTask );
	},

	initPage: function(projTask)
	{
		Utils.copyValue(projTask, this.state.projTask);
        this.setState( {loading: false, hints: {}} );
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projTask)){
			this.setState({loading: true});
			ProjTaskActions.updateProjTask( this.state.projTask );
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
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};
		
		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改任务" key="2" style={{width: '100%', height: '100%'}}>
						<div style={{padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
							<ServiceMsg ref='mxgBox' svcList={['proj_task/update']}/>
							<Form layout={layout} style={{width:'600px'}}>
                                <Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='订单编号' colon={true} help={hints.ordCodeHint} validateStatus={hints.ordCodeStatus}>
                                		    <Input type='text' name='ordCode' id='ordCode' value={this.state.projTask.ordCode} onChange={this.handleOnChange} disabled={true}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='订单名称' colon={true} help={hints.ordNameHint} validateStatus={hints.ordNameStatus}>
                                		    <Input type='text' name='ordName' id='ordName' value={this.state.projTask.ordName} onChange={this.handleOnChange} disabled={true}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='任务编号' colon={true} help={hints.itemCodeHint} validateStatus={hints.itemCodeStatus}>
                                		    <Input type='text' name='itemCode' id='itemCode' value={this.state.projTask.itemCode} onChange={this.handleOnChange} disabled={true}/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='任务名称' colon={true} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                		    <Input type='text' name='itemName' id='itemName' value={this.state.projTask.itemName} onChange={this.handleOnChange} disabled={true}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='状态' required={true} colon={true} help={hints.tastStatusHint} validateStatus={hints.tastStatusStatus}>
                                		    <DictSelect name='tastStatus' id='tastStatus' appName='项目管理' optName='项目任务状态' value={this.state.projTask.tastStatus} onSelect={this.handleOnSelected.bind(this, 'tastStatus')} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
									<Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='开始日期' colon={true} help={hints.beginDateHint} validateStatus={hints.beginDateStatus}>
                                		    <DatePicker name='beginDate' id='beginDate' style={{width:'100%'}} value={this.formatDate(this.state.projTask.beginDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'beginDate', Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='结束日期' colon={true} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                		    <DatePicker name='endDate' id='endDate' style={{width:'100%'}} value={this.formatDate(this.state.projTask.endDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,'endDate', Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                </Row>
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

export default UpdateProjTaskPage;