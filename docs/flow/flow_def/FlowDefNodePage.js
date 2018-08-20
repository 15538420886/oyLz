'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal,Spin,Input,Row,Col} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');



var FlowDefStore = require('./data/FlowDefStore.js');
var FlowDefActions = require('./action/FlowDefActions');

import CreateFlowDefNodePage from './Components/CreateFlowDefNodePage';
import UpdateFlowDefNodePage from './Components/UpdateFlowDefNodePage';
import ServiceMsg from '../../lib/Components/ServiceMsg';

var filterValue = '';
var FlowDefNodePage = React.createClass({
    getInitialState : function() {
        return {
            flowDefSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            recordSetCopy:{},
            flowDefNodeSet:{},
        }
    },

    mixins: [Reflux.listenTo(FlowDefStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            flowDefSet: data
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        FlowDefActions.updateFlowDef(this.state.flowDefNodeSet);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});

        //FlowDefNodeActions.initFlowDefNode();
    },
    onInitFlowDef:function(record){
        this.setState({flowDefNodeSet:record});
    },
    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear(this.state.flowDefNodeSet);
        this.refs.createWindow.toggle();
    },

    handleFlowDefClick: function(flowDef, e)
    {
        if(flowDef != null){
            // FIXME: 点击Card的查找
        }

        e.stopPropagation();
    },

    onClickUpdate : function(flowDef, event)
    {
        if(flowDef != null){
            this.refs.updateWindow.initPage(flowDef,this.state.flowDefNodeSet);
            this.refs.updateWindow.toggle();
        }

        event.stopPropagation();
    },

    onClickDelete : function(flowDef, event){

        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的审批流程 【'+flowDef.nodeName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, flowDef)
        });

        event.stopPropagation();
    },
    onClickDelete2 : function(flowDef){
        this.setState({loading: true});
        var recordSetCopy=Utils.deepCopyValue(this.state.flowDefNodeSet);
        for(var i=0;i<recordSetCopy.node.length;i++){
            if(recordSetCopy.node[i].uuid==flowDef.uuid){
                recordSetCopy.node.splice(i,1);
            }
        }
        FlowDefActions.updateFlowDef(recordSetCopy);
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    //对Node节点排序
   nodeDown:function(i){
       var recordSetCopy=Utils.deepCopyValue(this.state.flowDefNodeSet);
       var recordSet=recordSetCopy.node;
       var originNumber=recordSet[i];
       if(i<recordSet.length-1){
           recordSet[i]=recordSet[i+1];
           recordSet[i+1]=originNumber;
           FlowDefActions.updateFlowDef(recordSetCopy);
       }
    },
    nodeUp:function(i){
        var recordSetCopy=Utils.deepCopyValue(this.state.flowDefNodeSet);
        var recordSet=recordSetCopy.node;
        var originNumber=recordSet[i];
        if(i>0){
            recordSet[i]=recordSet[i-1];
            recordSet[i-1]=originNumber;
            FlowDefActions.updateFlowDef(recordSetCopy);
        }
    },
    render : function() {

        if(this.state.flowDefNodeSet.node) {
            var recordSet=this.state.flowDefNodeSet.node;
        } else {
            recordSet = [];
        }

        var cardList =
            recordSet.map((flowDef, i) => {
                return  <div key={flowDef.uuid} className='card-div' style={{width: 260}}>
                    <div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleFlowDefClick.bind(this, flowDef)}>
                        <div className="ant-card-head"><h3 className="ant-card-head-title">{flowDef.nodeName}</h3></div>
                        <div className="ant-card-extra">
                            <Icon type="arrow-up" style={{marginRight:'10px',cursor:'pointer'}} onClick={this.nodeUp.bind(this, i)} />
                            <Icon type="arrow-down" style={{marginRight:'10px',cursor:'pointer'}}  onClick={this.nodeDown.bind(this, i)} />
                            <a href="#" onClick={this.onClickDelete.bind(this, flowDef)}  title='删除节点'><Icon type={Common.iconRemove}/></a>
                        </div>
                        <a href="#" onClick={this.onClickUpdate.bind(this, flowDef)} title='修改节点'>
                            <div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{flowDef.roleName+'(催办='+flowDef.remindDay+'天)'}</div>
                        </a>
                    </div>
                </div>
            });

        var cs = Common.getCardMargin(this);
        return (
            <div className='card-page' style={{padding: cs.padding, height:'auto'}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['flow-def/retrieve', 'flow-def/remove']}/>

                    <div className='toolbar-card'>
                        <div style={{float:'left'}}>
                            <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>共{recordSet.length}个节点</div>
                            <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加节点' className='toolbar-icon' style={{color: '#108ee9'}}/>
                        </div>

                    </div>
                </div>

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                           :
                        <Row type="flex"> <div className='card-body'>{cardList}</div></Row>
                }

                <CreateFlowDefNodePage  ref="createWindow" />
                <UpdateFlowDefNodePage ref="updateWindow" defData={this.state.flowDefNodeSet}/>
            </div>);
    }
});

module.exports = FlowDefNodePage;