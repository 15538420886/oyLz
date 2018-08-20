import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import DictSelect from '../../../lib/Components/DictSelect';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var TmBugStore = require('../data/TmBugStore.js');
var TmBugActions = require('../action/TmBugActions');

var UpdateTmBugPage = React.createClass({
    getInitialState : function() {
        return {
            tmBugSet: {},
            loading: false,
            tmBug: {},
            hints: {},
            validRules: []
        }
    },
 
    mixins: [Reflux.listenTo(TmBugStore, "onServiceComplete"), ModalForm('tmBug')],
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
                    tmBugSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
    	this.state.validRules = [
			{id: 'bugName', desc:'名称', required: true, max: '255'},
			{id: 'sysId', desc:'所属系统', required: false, max: '255'},
			{id: 'bugType', desc:'缺陷类型', required: false, max: '255'},
			{id: 'bugSeverity', desc:'严重程度', required: false, max: '255'},
			{id: 'bugPriorty', desc:'优先级', required: false, max: '255'},
			{id: 'bugResponsible', desc:'处理人', required: false, max: '255'},
			{id: 'bugCode', desc:'缺陷编码', required: true, max: '255'},
		];
       
        // FIXME 输入参数
        this.init(this.props.recruit)
    },
    
    
    init:function(recruit){
    	this.state.hints = {};
		Utils.copyValue(recruit, this.state.tmBug);

		this.setState({
			loading : false
		});
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
    },

    onClickSave : function(){
        if(Common.formValidator(this, this.state.tmBug)){
            this.setState({loading: true});
            TmBugActions.updateTmBug( this.state.tmBug );
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

    render : function(){
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
                    <TabPane tab="增加缺陷管理信息" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['tm-bug/create']}/>
                            <Form layout={layout} style={{width:'600px'}}>
                                 <FormItem {...formItemLayout} label="缺陷名称" required={true} colon={true} className={layoutItem} help={hints.bugNameHint} validateStatus={hints.bugNameStatus}>
									<Input type="text" name="bugName" id="bugName" value={this.state.tmBug.bugName } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="所属系统" required={true} colon={true} className={layoutItem} help={hints.sysIdHint} validateStatus={hints.sysIdStatus}>
									 <DictSelect name="sysId" id="sysId" value={this.state.tmBug.sysId} appName='缺陷管理' optName='所属系统' onSelect={this.handleOnSelected.bind(this, "sysId")}/>
								</FormItem>
								<FormItem {...formItemLayout} label="所属模块" required={false} colon={true} className={layoutItem} help={hints.mdlIdHint} validateStatus={hints.mdlIdStatus}>
									 <DictSelect name="mdlId" id="mdlId" value={this.state.tmBug.mdlId} appName='缺陷管理' optName='所属模块' onSelect={this.handleOnSelected.bind(this, "mdlId")}/>
								</FormItem>
								<FormItem {...formItemLayout} label="缺陷类型" required={true} colon={true} className={layoutItem} help={hints.bugTypeHint} validateStatus={hints.bugTypeStatus}>
									 <DictSelect name="bugType" id="bugType" value={this.state.tmBug.bugType} appName='缺陷管理' optName='缺陷类型' onSelect={this.handleOnSelected.bind(this, "bugType")}/>
								</FormItem>
								<FormItem {...formItemLayout} label="严重程度" required={true} colon={true} className={layoutItem} help={hints.bugSeverityHint} validateStatus={hints.bugSeverityStatus}>
									 <DictSelect name="bugSeverity" id="bugSeverity" value={this.state.tmBug.bugSeverity} appName='缺陷管理' optName='严重程度' onSelect={this.handleOnSelected.bind(this, "bugSeverity")}/>
								</FormItem>
								<FormItem {...formItemLayout} label="重现概率" required={false} colon={true} className={layoutItem} help={hints.bugChanceHint} validateStatus={hints.bugChanceStatus}>
									<DictSelect name="bugChance" id="bugChance" value={this.state.tmBug.bugChance} appName='缺陷管理' optName='重现概率' onSelect={this.handleOnSelected.bind(this, "bugChance")}/>
								</FormItem>
								<FormItem {...formItemLayout} label="处理人" required={true} colon={true} className={layoutItem} help={hints.bugResponsibleHint} validateStatus={hints.bugResponsibleStatus}>
									<Input type="text" name="bugResponsible" id="bugResponsible" value={this.state.tmBug.bugResponsible } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="测试阶段" required={false} colon={true} className={layoutItem} help={hints.bugStageHint} validateStatus={hints.bugStageStatus}>
									<DictSelect name="bugStage" id="idType" value={this.state.tmBug.bugStage} appName='缺陷管理' optName='测试阶段' onSelect={this.handleOnSelected.bind(this, "bugStage")}/>
								</FormItem>
								<FormItem {...formItemLayout} label="描述" required={false} colon={true} className={layoutItem} help={hints.bugDespHint} validateStatus={hints.bugDespStatus}>
									<Input type="text" name="bugDesp" id="bugDesp" value={this.state.tmBug.bugDesp } onChange={this.handleOnChange} />
								</FormItem>
								<FormItem {...formItemLayout} label="缺陷编码" required={true} colon={true} className={layoutItem} help={hints.bugDespHint} validateStatus={hints.bugDespStatus}>
									<Input type="text" name="bugCode" id="bugCode" value={this.state.tmBug.bugCode } onChange={this.handleOnChange} />
								</FormItem>
							
							</Form>
                                <FormItem style={{textAlign:'right',margin:'4px 0'}} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                           
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default UpdateTmBugPage;