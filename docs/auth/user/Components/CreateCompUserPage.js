import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

import { Modal, Button, Steps } from 'antd';
const Step = Steps.Step;

var CompUserStore = require('../data/CompUserStore.js');
var CompUserActions = require('../action/CompUserActions');
var AuthUserStore = require('../data/AuthUserStore.js');
var AuthUserActions = require('../action/AuthUserActions');
import FindUserPage from './FindUserPage';
import CompUserPage from './CompUserPage';

const steps = [{
  title: '建立基本信息',
  content: '建立用户基本信息',
},
{
  title: '创建用户',
  content: '创建公司内部的用户',
}];

var CreateCompUserPage = React.createClass({
	getInitialState : function() {
		return {
			compUserSet: {
				errMsg : ''
			},
			authUserSet: {
				errMsg : ''
			},

            loading: false,
			current: 0,
			modal: false,
            userExist: false,
			compUser: {},
			authUser: {},
		}
	},

    mixins: [Reflux.listenTo(CompUserStore, "onCompUserComplete"),
        Reflux.listenTo(AuthUserStore, "onAuthUserComplete")],

    onAuthUserComplete: function(data) {
        if(!this.state.modal || this.state.current!==0){
            return;
        }

        if(data.operation === 'create'){
            if( data.errMsg === ''){
                // 成功
                this.state.compUser.userName = this.state.authUser.userName;
                this.state.compUser.perName = this.state.authUser.perName;

                this.setState({
                    current: 1,
                    loading: false,
                    authUserSet: data
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    authUserSet: data
                });
            }
        }
        else if(data.operation === 'find'){
            this.refs.mxgBox.clear();
            this.setState({userExist: false});
        }
    },
    onCompUserComplete: function(data) {
        if(!this.state.modal){
            return;
        }

        if(this.state.current===1 && data.operation === 'create'){
            if( data.errMsg === ''){
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    compUserSet: data
                });
            }
        }
        else if(this.state.current===0 && data.operation === 'find'){
            var flag = (data.errMsg === '用户已经存在');
            this.setState({userExist: flag});
        }
    },

	// 第一次加载
	componentDidMount : function(){
	},
	clear : function(corpUuid, deptUuid){
		this.state.current = 0;
        this.state.userExist = false;
		this.state.compUserSet.errMsg = '';
		this.state.authUserSet.errMsg = '';

		var compUser=this.state.compUser;
		compUser.userName='';
		compUser.perName='';
		compUser.userCode='';
		compUser.userTitle='';
		compUser.userType='';
		compUser.userGroup='';
		compUser.corpUuid = corpUuid;
		compUser.deptUuid = deptUuid;

		var authUser=this.state.authUser;
		authUser.idType='';
		authUser.idCode='';
		authUser.userName='';
		authUser.perName='';
		authUser.phoneno='';
		authUser.email='';
		authUser.passwd='';
		authUser.userStatus='1';
		authUser.regType='1';

	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
        }

        if (this.refs.firstStepPage) {
            this.refs.firstStepPage.clear();
        }
	},

	onClickSave : function(){
		if(this.state.current === 0){
            var flag = this.refs.firstStepPage.onClickSave();
			if( flag == 1 ){
                this.state.compUser.userName = this.state.authUser.userName;
                this.state.compUser.perName = this.state.authUser.perName;

				this.setState({
					current: 1
				});
			}
            else if( flag == 2 ){
                // 等待创建用户
                this.setState({loading: true});
            }
		}
		else{
			var flag = this.refs.compUserPage.onClickSave();
            if( flag ){
                // 等待创建用户
                this.setState({loading: true});
            }
		}
	},

	toggle : function(){
		this.setState({
			modal: !this.state.modal
		});
	},

	render : function(){
		const {current} = this.state;
		var btnSave = (current===0) ? '下一步' : '保存';

		return (
			<Modal visible={this.state.modal} width='540px' title="增加用户" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-user/create', 'auth-user/find', 'comp-user/create', 'comp-user/find']}/>
			   		<Button key="btnOK" type="primary" size="large" disabled={this.state.userExist} onClick={this.onClickSave} loading={this.state.loading}>{btnSave}</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		        <Steps current={current}>
		          {steps.map(item => <Step key={item.title} title={item.title} />)}
		        </Steps>

		        <div style={{paddingTop: '20px'}}>
		        {
			        (current === 0)?
						<FindUserPage ref='firstStepPage' authUser={this.state.authUser} corpUuid={this.state.compUser.corpUuid}/> :
						<CompUserPage ref='compUserPage' compUser={this.state.compUser} corpUuid={this.state.compUser.corpUuid}/>
				}
				</div>
			</Modal>
		);
	}
});

export default CreateCompUserPage;
