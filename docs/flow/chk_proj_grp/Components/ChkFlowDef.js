'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Checkbox, Spin, Button } from 'antd';
const CheckboxGroup = Checkbox.Group;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ChkFlowDefStore = require('../data/ChkFlowDefStore');
var ChkFlowDefActions = require('../action/ChkFlowDefActions');

var ChkProjGrpStore = require('../data/ChkProjGrpStore');
var ChkProjGrpActions = require('../action/ChkProjGrpActions');

var FlowDefPage = React.createClass({
    getInitialState : function() {
        return {
            flowDefSet: {
                recordSet: [],
                errMsg : ''
            },
            flowLoading: false,
            saveLoading: false,
            oldflowList:null,
            newflowList:{},
            disabled: true,
            selected:false,
        }
    },

    mixins: [Reflux.listenTo(ChkFlowDefStore, "onServiceComplete"),
        Reflux.listenTo(ChkProjGrpStore, "onServiceComplete2")
    ],
    onServiceComplete: function(data) {
        this.setState({
            flowLoading: false,
            flowDefSet: data
        });
    },

    onServiceComplete2: function(data) {
        this.setState({
            ProjGrpSet:data,
        });
        if(data.operation == 'find'){ 
            this.state.oldflowList = data.object;
            if (data.object) {
                 Utils.copyValue(data.object, this.state.newflowList);
                 this.setState({ flowLoading: false , selected: true, disabled: false });
             } else {
                 this.state.newflowList = {};
                 this.setState({ flowLoading: false , selected: true, disabled: true });
             }
        };
        if(data.operation == 'create'|| data.operation == 'update'){
            this.state.oldflowList = data.object;
            if (data.object) {
                 Utils.copyValue(data.object, this.state.newflowList);
                 this.setState({ flowLoading: false , saveLoading:false, selected: true, disabled: false });
             } else {
                 this.state.newflowList = {};
                 this.setState({ flowLoading: false , saveLoading:false, selected: true, disabled: true });
             }
        }
    },
    
    // 刷新
    handleQueryClick : function() {
     
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({flowLoading: true});
        var corpUuid = window.loginData.compUser.corpUuid;
        ChkFlowDefActions.retrieveFlowDef(corpUuid);
    },

    onChange: function(checkedValues) {
         this.state.newflowList.flowList = checkedValues.toString();
         this.setState({
             flowLoading: this.state.flowLoading,
             disabled: false
        });
    },
    
    getByUuid:function(uuid){
        this.setState({
           flowLoading: true,
         });
         ChkProjGrpActions.getProjByUuid(uuid);
    },

	 onClickSave: function(){
       this.setState({
           flowLoading: true,
           saveLoading:true,
         });
       var filter = this.state.ProjGrpSet.object;
        if(filter !== null && filter !== undefined && filter !== ''){
            filter.flowList = this.state.newflowList.flowList;
        }else{
            filter = {};
            filter.corpUuid = window.loginData.compUser.corpUuid;
            filter.grpUuid = this.state.ProjGrpSet.uuid;
            filter.uuid = this.state.ProjGrpSet.uuid;
            filter.flowList = this.state.newflowList.flowList;
        }
    
        //原来存在
        if(this.state.oldflowList){
            ChkProjGrpActions.updateChkProjGrp(filter);
        }else{
            ChkProjGrpActions.createChkProjGrp(filter);
        }
    },


    render : function() {
       const options = this.state.flowDefSet.recordSet;
       var flowList = [];
        if(this.state.newflowList.flowList){
            if(this.state.newflowList.flowList.match(/,/g)){
                flowList = this.state.newflowList.flowList.split(',');
            }else{
                flowList.push(this.state.newflowList.flowList);
            } 
        };

       var loading = this.state.flowLoading;
       const checkBox = options.map( (obj, i) =>{
			return <div><Checkbox style={{marginLeft:'10px',lineHeight:'30px'}} value={obj.uuid} disabled={!this.state.selected}>{obj.flowName}</Checkbox></div>
        });
       
        const obj = 
            <div>
                <div style={{border:'1px solid #e2e2e2',minHeight:'300px'}}>
                    <CheckboxGroup onChange={this.onChange} value={flowList}>
                        {checkBox}
                    </CheckboxGroup>
                </div>
            </div>;
        return (
            <div>
                可审批流程：
                 {loading ? <Spin>{obj}</Spin> : obj }	 
                <div style={{display:'block', textAlign:'right', margin:'14px 0 0 0'}}>
                     <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.saveLoading} disabled={this.state.disabled}>保存</Button>
                </div>
          </div>);
      }
});

module.exports = FlowDefPage;