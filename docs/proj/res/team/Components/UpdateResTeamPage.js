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

import SearchResMember from '../../../lib/Components/SearchResMember';
var ResTeamStore = require('../data/ResTeamStore.js');
var ResTeamActions = require('../action/ResTeamActions');
var ProjContext = require('../../../ProjContext');

var UpdateResTeamPage = React.createClass({
	getInitialState : function() {
		return {
			resTeamSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			resTeam: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ResTeamStore, "onServiceComplete"), ModalForm('resTeam')],
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
				  resTeamSet: data
			  });
		  }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'teamCode', desc:'小组编号', required: false, max: '64'},
			{id: 'teamName', desc:'小组名称', required: true, max: '128'},
			{id: 'tmName', desc:'组长姓名', required: false, max: '32'},
			{id: 'teamDesc', desc:'小组说明', required: false, max: '3600'},
		];
		this.initPage( this.props.resTeam );
	},

	initPage: function(resTeam)
	{
		Utils.copyValue(resTeam, this.state.resTeam);

		if (this.refs.empSearchBox !== undefined) {
            this.refs.empSearchBox.setValue(resTeam.tmName);
        }
		
		this.setState({ loading: false, hints: {} });
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	},

	onSelectResTeam:function(data){
        this.state.resTeam.tmUuid = data.uuid;
		this.state.resTeam.tmCode = data.staffCode;
		this.state.resTeam.tmName = data.perName;
		this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.resTeam)){
			this.state.resTeamSet.operation = '';
			this.setState({loading: true});
			ResTeamActions.updateResTeam( this.state.resTeam );
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

		var hints=this.state.hints;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="修改小组" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"20px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['res-team/update']}/>
			            	
                           <Form layout={layout} style={{width:'600px'}}>
                                <FormItem {...formItemLayout} label="小组编号" required={false} colon={true} className={layoutItem} help={hints.teamCodeHint} validateStatus={hints.teamCodeStatus}>
									<Input style={{zIndex:'2'}} type="text" name="teamCode" id="teamCode" value={this.state.resTeam.teamCode } onChange={this.handleOnChange}/>
								</FormItem>
                                <FormItem {...formItemLayout} label="小组名称" required={true} colon={true} className={layoutItem} help={hints.teamNameHint} validateStatus={hints.teamNameStatus}>
									<Input style={{zIndex:'2'}} type="text" name="teamName" id="teamName" value={this.state.resTeam.teamName } onChange={this.handleOnChange}/>
                                </FormItem>
                                <FormItem {...formItemLayout} label="组长" required={true} colon={true} className={layoutItem} help={hints.tmNameHint} validateStatus={hints.tmNameStatus}>
                                    <SearchResMember showError={this.showError} ref='empSearchBox' type="text" name="tmName" id="tmName" value={this.state.resTeam.tmName} onSelectMember={this.onSelectResTeam} />
                                </FormItem>
								<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.teamDescHint} validateStatus={hints.teamDescStatus} >
									<Input type="textarea" name="teamDesc" id="teamDesc" value={this.state.resTeam.teamDesc} onChange={this.handleOnChange} style={{height: '100px'}}/>
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

export default UpdateResTeamPage;

