import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Tabs, Col, Row } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchProjMember from '../../../lib/Components/SearchProjMember';
var ProjTeamStore = require('../data/ProjTeamStore.js');
var ProjTeamActions = require('../action/ProjTeamActions');
var ProjContext = require('../../../ProjContext');

var UpdateProjTeamPage = React.createClass({
	getInitialState : function() {
		return {
			projTeamSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			projTeam: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ProjTeamStore, "onServiceComplete"), ModalForm('projTeam')],
	onServiceComplete: function(data) {
	  if( data.operation === 'update'){
		  if( data.errMsg === ''){
			  // 成功，关闭窗口
			  this.goBack();
		  }
		  else{
			  // 失败
			  this.setState({
				  loading: false,
				  projTeamSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'teamCode', desc:'小组编号', required: true, max: '64'},
			{id: 'tmName', desc:'组长姓名', required: true, max: '32'},
			{id: 'teamDesc', desc:'小组说明', required: false, max: '3600'},
			{id: 'projScope', desc:'项目范围', required: false, max: '3600'},
			{id: 'techDesc', desc:'开发语言', required: false, max: '256'},
			{id: 'teamName', desc:'小组名称', required: true, max: '128'},
		];
		this.initPage( this.props.projTeam );
	},

	componentWillReceiveProps: function (newProps) {
		this.initPage( newProps.projTeam );
	},
	
	initPage: function(projTeam)
	{
		Utils.copyValue(projTeam, this.state.projTeam);

		if (this.refs.empSearchBox !== undefined) {
            this.refs.empSearchBox.setValue(projTeam.tmName);
        }
		
		this.setState({ loading: false, hints: {} });
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onSelectProjTeam:function(data){
        this.state.projTeam.tmUuid = data.uuid;
		this.state.projTeam.tmCode = data.staffCode;
        this.state.projTeam.tmName = data.perName;
        this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.projTeam)){
			this.state.projTeamSet.operation = '';
			this.setState({loading: true});
			ProjTeamActions.updateProjTeam( this.state.projTeam );
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
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};

		var hints=this.state.hints;
        var projUuid = ProjContext.selectedProj.uuid;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改小组" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['proj_team/update']}/>
			            	
                           <Form layout={layout} style={{width:'600px'}}>
								<Row>
									<Col span="12">
										<FormItem {...formItemLayout2} label="小组编号" required={true} colon={true} className={layoutItem} help={hints.teamCodeHint} validateStatus={hints.teamCodeStatus}>
											<Input style={{zIndex:'2'}} type="text" name="teamCode" id="teamCode" value={this.state.projTeam.teamCode } onChange={this.handleOnChange}/>
										</FormItem>
									</Col>
									<Col span="12">
										<FormItem {...formItemLayout} label="组长" required={true} colon={true} className={layoutItem} help={hints.tmNameHint} validateStatus={hints.tmNameStatus}>
											<SearchProjMember projUuid={projUuid} showError={this.showError} ref='empSearchBox' type="text"  name="tmName" id="tmName" value={this.state.projTeam.tmName} onSelectMember={this.onSelectProjTeam}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="小组名称" required={true} colon={true} className={layoutItem} help={hints.teamNameHint} validateStatus={hints.teamNameStatus}>
										<Input style={{zIndex:'2'}} type="text" name="teamName" id="teamName" value={this.state.projTeam.teamName } onChange={this.handleOnChange}/>
								</FormItem>									
								<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.teamDescHint} validateStatus={hints.teamDescStatus} >
									<Input type="textarea" name="teamDesc" id="teamDesc" value={this.state.projTeam.teamDesc} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								<FormItem {...formItemLayout} label="实施范围" required={false} colon={true} className={layoutItem} help={hints.projScopeHint} validateStatus={hints.projScopeStatus} >
									<Input type="textarea" name="projScope" id="projScope" value={this.state.projTeam.projScope} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								<FormItem {...formItemLayout} label="技术要求" required={false} colon={true} className={layoutItem} help={hints.techDescHint} validateStatus={hints.techDescStatus} >
									<Input type="textarea" name="techDesc" id="techDesc" value={this.state.projTeam.techDesc} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								 <FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

export default UpdateProjTeamPage;

