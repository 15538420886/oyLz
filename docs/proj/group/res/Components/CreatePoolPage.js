import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Tabs, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import SearchEmployee from '../../../../hr/lib/Components/SearchEmployee';
var PoolStore = require('../data/PoolStore.js');
var PoolActions = require('../action/PoolActions');

var CreatePoolPage = React.createClass({
	getInitialState : function() {
		return {
			poolSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			pool: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(PoolStore, "onServiceComplete"), ModalForm('pool')],
	onServiceComplete: function(data) {
	  if( data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.goBack();
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              poolSet: data
	          });
	          console.log(data)
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'pmName', desc:'负责人姓名', required: false, max: '32'},
			{id: 'poolName', desc:'资源池名称', required: true, max: '64'},
			{id: 'poolCode', desc:'资源池编号', required: false, max: '64'},
			{id: 'poolDesc', desc:'资源池说明', required: false, max: '256'},
		];
		this.clear();
	},

	clear : function(corpUuid){
		this.state.hints = {};
		this.state.pool.uuid='';
		this.state.pool.corpUuid = window.loginData.compUser.corpUuid;
		this.state.pool.deptUuid=''
		this.state.pool.pmName='';
		this.state.pool.poolName='';
		this.state.pool.poolCode='';
		this.state.pool.poolDesc='';
		
		this.state.loading = false;
	    this.state.poolSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	onSelectPool:function(data){
        this.state.pool.pmUuid = data.uuid;
		this.state.pool.pmCode = data.staffCode;
        this.state.pool.pmName = data.perName;
        this.refs.empSearchBox.setValue(data.perName);

        this.setState({
           user:data,
        })
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.pool)){
			this.state.poolSet.operation = '';
			this.setState({loading: true});
			PoolActions.createResPool( this.state.pool );
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
        var boo = this.state.pool.pmName? false : true ;
        var corpUuid = window.loginData.compUser.corpUuid;
		return (
			<div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="增加资源池" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"20px 0 16px 0px", height: '100%',overflowY: 'auto'}}>
			            	<ServiceMsg ref='mxgBox' svcList={['res-pool/create']}/>
			            	
                           <Form layout={layout} style={{width:'450px'}}>
                           		<Row>
                           			<Col span="24">
                           				<FormItem {...formItemLayout} label="编号" required={false} colon={true} className={layoutItem} help={hints.poolCodeHint} validateStatus={hints.poolCodeStatus}>
											<Input type="text" name="poolCode" id="poolCode" value={this.state.pool.poolCode} onChange={this.handleOnChange}/>
										</FormItem>
                           			</Col>
                           		</Row>								
								<Row>
									<Col span="24">
										<FormItem {...formItemLayout} label="负责人" required={false} colon={true} className={layoutItem} help={hints.pmNameHint} validateStatus={hints.pmNameStatus}>
											<SearchEmployee corpUuid={corpUuid} showError={this.showError} ref='empSearchBox' type="text"  name="pmName" id="pmName" value={this.state.pool.pmName} onSelectEmpLoyee={this.onSelectPool}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...formItemLayout} label="名称" required={true} colon={true} className={layoutItem} help={hints.poolNameHint} validateStatus={hints.poolNameStatus}>
									<Input style={{zIndex:'2'}} type="text" name="poolName" id="poolName" value={this.state.pool.poolName } onChange={this.handleOnChange}/>
								</FormItem>
								<FormItem {...formItemLayout} label="说明" required={false} colon={true} className={layoutItem} help={hints.poolDescHint} validateStatus={hints.poolDescStatus} >
									<Input type="textarea" name="poolDesc" id="poolDesc" value={this.state.pool.poolDesc} onChange={this.handleOnChange} style={{height: '100px'}}/>
								</FormItem>
								<FormItem style={{textAlign:'right',margin:'4px 0'}} required={false} colon={true} className={layoutItem}>
									<Button key="btnOK" type="primary" size="large" disabled={boo} onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
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

module.exports = CreatePoolPage;
