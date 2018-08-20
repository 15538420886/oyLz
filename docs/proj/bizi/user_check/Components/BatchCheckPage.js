import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import {  Modal, Button, Progress } from 'antd';

var UserCheckStore = require('../../../proj/user_check/data/UserCheckStore');
var UserCheckActions = require('../../../proj/user_check/action/UserCheckActions');
var CheckInfoActions = require('../../../lib/action/CheckInfoActions');
var CheckInfoStore = require('../../../lib/data/CheckInfoStore');
import CodeMap from '../../../../hr/lib/CodeMap';
import ProjContext from '../../../ProjContext';

var BatchCheckPage = React.createClass({
	getInitialState : function() {
		return {
            userCheckSet: {
				operation : '',
				errMsg : ''
			},
			checkList: [],
			len: 0,
			index: 0,
			chkDate: '',
			modal: false,
            isCreate: false,
			stop: false,
		}
	},

    mixins: [Reflux.listenTo(UserCheckStore, "onServiceComplete"), ModalForm('userCheck'),
        Reflux.listenTo(CheckInfoStore, "onCheckInfoComplete"), CodeMap()],
   
	onServiceComplete: function(data) {
		
		if(this.state.modal){
			if( data.errMsg === ''){
				// 成功
				var len = this.state.len;
				var index = this.state.index;
				var stop = this.state.stop;
				if(stop){
					return;
				}
				if(index+1 === len){
					//结束
					this.setState({
						index: index+1,
					});
				}else{
					//继续回调
					this.setState({
						index: index+1,
					});
					this.doBatchCheck(this.state.checkList);
				}
			}
			else{
			// 失败
				this.setState({
					loading: false,
					stop: true,
					userCheckSet: data
				});
			}
		}
	},

    onCheckInfoComplete: function(data) {
		var len = this.state.len;
        var index = this.state.index;
		ProjContext.calcCheckDate(this.state.checkList[index], data.posSet, data.leaveSet, this.state.isCreate);
		//发送保存请求
        this.state.userCheckSet.operation = '';
        if (this.state.isCreate) {
            UserCheckActions.createUserChkBook(this.state.checkList[index]);
        }
        else {
            UserCheckActions.updateUserChkBook(this.state.checkList[index]);
        }
    },
    
	// 第一次加载
	componentDidMount : function(){
	},
	
	clear : function(checkList, chkDate){
		//深拷贝checkList
		var checkList2 = [];
		var len = checkList.length;
		checkList.map((data, i) => {
			checkList2[i] = {};
			Utils.copyValue(data, checkList2[i]);
		})
		this.state.checkList = checkList2;
		this.state.chkDate = chkDate;
		this.state.index = 0;
		this.state.len = len;
		this.state.stop = false;
		this.doBatchCheck(checkList2);

	},

	doBatchCheck: function(checkList){
		var chkDate = this.state.chkDate;
		var len = this.state.len;
		var i = this.state.index;
		var data = {};
		Utils.copyValue(checkList[i], data);
		var corpUuid = window.loginData.compUser.corpUuid;
		checkList[i].corpUuid = corpUuid;
		checkList[i].chkDate = chkDate;

		checkList[i].projUuid = data.resUuid;
		checkList[i].teamUuid = data.teamUuid;
		checkList[i].projType = data.resStatus;
		checkList[i].projName = data.resName;
		checkList[i].projLoc = data.resLoc;

		checkList[i].pmUuid = '';
		checkList[i].pmCode = window.loginData.compUser.userCode;
		checkList[i].pmName = window.loginData.authUser.perName;
		checkList[i].fromHour = data.fromTime;
		checkList[i].toHour = data.endTime;

		checkList[i].dateType = this.getDateType(chkDate);
		checkList[i].leaveType='';
		checkList[i].leaveHour='0';
		checkList[i].chkType = '';

		var checkUuid = data.checkUuid;
		if (checkUuid === undefined || checkUuid === null || checkUuid === '') {
			checkList[i].workHour = '0';
			checkList[i].overHour = '0';
			checkList[i].chkDesc = '';
			this.state.isCreate = true;
		}
		else {
			checkList[i].uuid = checkUuid;
			this.state.isCreate = false;
		}

		if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
			this.refs.mxgBox.clear();
		}
		CheckInfoActions.getCheckInfo(corpUuid,data.staffCode,data.userId,chkDate);


	},

	onStop: function(){
		this.state.stop = true ;
	},
	
	render : function(){
		var index = this.state.index;
		var perName = this.state.checkList[index] ? this.state.checkList[index].perName : '';
		var perc = Math.floor(index / this.state.len * 100);

		var button = null;
		var text = null;
		if(this.state.stop){
			button = <Button key="btnClose" type="primary" size="large" onClick={this.toggle}>完成</Button>;
			text = <span>已终止！</span>
		}
		else{
			button = perName ? 
			<Button key="btnClose" type="primary" size="large" onClick={this.onStop}>终止</Button>:
			<Button key="btnClose" type="primary" size="large" onClick={this.toggle}>完成</Button>;

			text = perName ? <span>正在生成{perName}的考勤 ……</span> : <span>已完成！</span>;
		}
        return (
                <Modal visible={this.state.modal} width='540px' closable={false} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                 footer={[
                    <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                        <ServiceMsg ref='mxgBox' svcList={['user-chk-book/retrieve','user-chk-book/update']}/>
						{button}
                    </div>
                ]}
            >
                <div style={{padding:'24px 0px'}}>
                    <Progress percent={perc} status="active" />
					<p style={{padding:'12px 0 0 0'}}>{text}</p>
                </div>
            </Modal>
    	);
	}
});

export default BatchCheckPage;

