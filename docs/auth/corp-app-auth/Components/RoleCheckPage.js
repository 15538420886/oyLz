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

var CorpAppAuthStore = require('../data/CorpAppAuthStore');
var CorpAppAuthActions = require('../action/CorpAppAuthActions');

var RoleCheckPage = React.createClass({
    getInitialState : function() {
        return {
            authSet:{
                object:null,
                errMsg:'',
				operation:''
            },
            roleSet : {
				recordSet: [],
				errMsg:'',
				operation:''
			},
            auth:{
                appUuid: '',
                roleList:''
            },
            roleLoading:false,
            authLoading: false,
            disabled: true,
            selected:false,
            userUuid:''
        }
    },

    mixins: [Reflux.listenTo(FntRoleStore, "onServiceComplete"), Reflux.listenTo(CorpAppAuthStore, "onServiceComplete2")],
    onServiceComplete: function(data) {
        if(data.operation === 'retrieve'){
            this.state.roleSet = data;
            this.setState({roleLoading: false});
        }
    },

    onServiceComplete2: function(data){
        this.state.authSet = data;
        if(data.object){
            Utils.copyValue(data.object, this.state.auth);
            this.setState({authLoading: false, selected:true, disabled: false});
        }else{
            this.setState({authLoading: false, selected:true, disabled: true});
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },

    componentWillReceiveProps: function (newProps) {
        if (newProps.appUuid !== this.state.auth.appUuid) {
            this.state.auth = {
                appUuid: '',
                roleList: ''
            };

            var appUuid = newProps.appUuid;
            if (appUuid) {
                this.state.auth.appUuid = appUuid;
                this.setState({ roleLoading: true });
                FntRoleActions.initFntAppRole(appUuid);
            }
        }
    },

    //获取权限信息
    loadData:function(user){
        this.state.auth.roleList='';
        this.setState({authLoading: true, userUuid : user.uuid});
        var filter = {
            appUuid: this.props.appUuid,
            uuid: user.uuid
        }

        CorpAppAuthActions.initAppAuth(filter);
    },

    onAllow: function(){
        if(!this.state.disabled)this.state.auth.roleList='';
        this.setState({disabled: !this.state.disabled});
    },

    onChange: function(checkedValues) {
        this.state.auth.roleList = checkedValues.join(',');
        this.setState({authLoading: this.state.authLoading});
    },

    onClickSave: function(){
        this.setState({authLoading: true});
        var filter = {
            filter:this.state.userUuid,
            object:{}
        }
        Utils.copyValue(this.state.auth, filter.object);
        if(!this.state.authSet.object){
            if(this.state.disabled){
                this.setState({authLoading: false});
            }else{
                //create
                CorpAppAuthActions.createAppAuth(filter);
            }
        }else{
            if(this.state.disabled){
                //delete
                filter.object = this.state.authSet.object.uuid;
                CorpAppAuthActions.deleteAppAuth(filter);

            }else{
                //update
                CorpAppAuthActions.updateAppAuth(filter);
            }
        }

    },

    render : function() {
        
        const options = this.state.roleSet.recordSet;
        var roleList = this.state.auth.roleList ? this.state.auth.roleList.split(',') : [];

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

module.exports = RoleCheckPage;