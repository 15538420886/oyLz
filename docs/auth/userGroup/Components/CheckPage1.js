'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Checkbox, Spin, Button } from 'antd';
const CheckboxGroup = Checkbox.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FntRoleStore = require('../../fnt-app/role/data/FntRoleStore');
var FntRoleActions = require('../../fnt-app/role/action/FntRoleActions');

var UserGroupStore = require('../data/UserGroupStore.js');
var UserGroupActions = require('../action/UserGroupActions');

var AppAuthActions = require('../action/AppAuthActions');
var AppAuthStore = require('../data/AppAuthStore')


var CheckPage1 = React.createClass({
    getInitialState : function() {
        return {
            roleSet : {
				recordSet: [],
				errMsg:'',
			},
            userGroupUuid: '',
            oldAuth: null,
            newAuth: {},
            roleLoading:false,
            authLoading: false,
            disabled: true,
            selected:false,
        }
    },

    mixins: [Reflux.listenTo(FntRoleStore, "onServiceComplete"), Reflux.listenTo(AppAuthStore, "onServiceComplete2")],
    onServiceComplete: function(data) {
        if(data.operation === 'retrieve'){
            this.state.roleSet = data;
            this.setState({roleLoading: false});
        }
    },

    onServiceComplete2: function (data) {
            this.state.oldAuth = data.object;
            if (data.object) {
                Utils.copyValue(data.object, this.state.newAuth);
                this.setState({ authLoading: false, selected: true, disabled: false });
            } else {
                this.setState({ authLoading: false, selected: true, disabled: true });
            }   
    },

    // 第一次加载
    componentDidMount : function(){
        
    },

    loadData: function (userGroup, appUuid) {
        if (appUuid) {
            this.setState({ roleLoading: true });
            FntRoleActions.initFntAppRole(appUuid);
        }

        //生成用户权限
        var oldAuth = null;
        if (appUuid && userGroup && userGroup.appAuthList) {
            var len = userGroup.appAuthList.length;
            for (var x = 0; x < len; x++) {
                //暂时处理
                if  (userGroup.appAuthList[x] &&userGroup.appAuthList[x].appUuid === appUuid) {
                    oldAuth = userGroup.appAuthList[x];
                    break;
                }
            }
        }

        var newAuth = {};
        if (oldAuth === null) {
            newAuth = { appUuid: appUuid, roleList: ''};
        }
        else {
            Utils.copyValue(oldAuth, newAuth);
        }
        var selected = (userGroup !== null && appUuid !== null);
        this.setState({  oldAuth: oldAuth, newAuth: newAuth, userGroupUuid:userGroup.uuid,selected: selected, disabled: (oldAuth === null)});
    },

    onAllow: function(){
        if(!this.state.disabled)this.state.newAuth.roleList='';
        this.setState({disabled: !this.state.disabled});
    },

    onChange: function(checkedValues) {
        this.state.newAuth.roleList = checkedValues.join(',');
        this.setState({authLoading: this.state.authLoading});
    },

    onClickSave: function(){
        this.setState({authLoading: true});
        var filter = {
            filter:this.state.userGroupUuid,
            object:{}
        }
    
        Utils.copyValue(this.state.newAuth, filter.object);

        if(!this.state.oldAuth){
            if(this.state.disabled){
                this.setState({authLoading: false});
            }else{
                //create
                AppAuthActions.createAppAuth(filter);
            }
        }else{
            if(this.state.disabled){
                //delete
                filter.object = this.state.oldAuth.appUuid;

                filter.appUuid = this.state.oldAuth.appUuid;
                AppAuthActions.deleteAppAuth(filter);
            }else{
                //update
                AppAuthActions.updateAppAuth(filter);
            }
        }
    },

    render: function () {
        const options = this.state.roleSet.recordSet;
        var roleList = this.state.newAuth.roleList ? this.state.newAuth.roleList.split(',') : [];
  
        const checkBox = options.map( (obj, i) =>{
            return <div><Checkbox style={{marginLeft:'10px',lineHeight:'30px'}} value={obj.roleName} disabled={this.state.disabled || !this.state.selected}>{obj.roleName+'(' + obj.roleDesc + ')'}</Checkbox></div>
        });
        var loading = this.state.roleLoading || this.state.authLoading;
        const obj = 
            <div>
                <Checkbox style={{marginLeft:'10px',lineHeight:'30px'}} disabled={!this.state.selected} onChange={this.onAllow} checked={!this.state.disabled}>允许使用</Checkbox>
                <div style={{border:'1px solid #e2e2e2',minHeight:'300px'}}>
                    <CheckboxGroup onChange={this.onChange} value={roleList}>
                        {checkBox}
                    </CheckboxGroup>
                </div>
            </div>;
    	return (
            <div style={{height: '100%',padding: '2px 0 0 8px',borderLeft:' 1px solid #e2e2e2', padding:'10px'}}>
                {loading ? <Spin>{obj}</Spin> : obj }
                <div style={{display:'block', textAlign:'right', margin:'14px 0 0 0'}}>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.authLoading} disabled={!this.state.selected}>保存</Button>
				</div>
            </div>
            );
        }
});

module.exports = CheckPage1;
