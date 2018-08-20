'use strict';

import React from 'react';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Form, Input, Button, Table, Icon, Modal } from 'antd';
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');

var Context = require('../../../AuthContext');
var FntMenuStore = require('../data/FntMenuStore');
var FntMenuActions = require('../action/FntMenuActions');
import MenuTree from './MenuTree';
import CreateFntMenuPage from './CreateFntMenuPage';
import MenuInfoPage from './MenuInfoPage';
import LeafNodePage from './LeafNodePage';
import ChildMenuPage from './ChildMenuPage';

var FntMenuTablePage = React.createClass({
    getInitialState : function() {
        return {
            menuSet: {
                recordSet: [],
                errMsg : '',
            },
            loading : false,
            selectedNode: null,
			fntMod: null,
        }
    },

    mixins: [Reflux.listenTo(FntMenuStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.errMsg === '' && data.operation === 'remove' && this.state.selectedNode !== null){
        	// 判断节点是否被删除
        	var isDeleted = true;
        	var menuUuid = this.state.selectedNode.uuid;
			for(var x=data.recordSet.length-1; x>=0; x--){
				console.log('x', x, data.recordSet[x].uuid, menuUuid);
				if(data.recordSet[x].uuid === menuUuid){
            		isDeleted = false;
					break;
				}
			}
			
			if(isDeleted){
            	this.state.selectedNode = null;
			}
        }

        this.setState({
            loading: false,
            menuSet: data
        });
    },
	initAppMenu: function(fntMod){
		Context.fntMod = fntMod;
		this.setState({fntMod: fntMod});
		
		if(this.refs.menuTree !== undefined){
			this.refs.menuTree.initTree(fntMod);
		}
	},

    onSelectMenu: function(selNode, leafSet){
        this.setState({selectedNode: selNode});
    },
    haveChild: function(menuNode){
        var len=this.state.menuSet.recordSet.length;
        for(var i=0; i<len; i++){
            var node=this.state.menuSet.recordSet[i];
            if(node.puuid === menuNode.uuid){
                return true;
            }
        }
        return false;
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear(Context.fntApp.uuid, Context.fntMod.uuid, '');
        this.refs.createWindow.toggle();
    },
    onClickDelete : function(event){
        var menuNode = this.state.selectedNode;
        if(menuNode === null || this.haveChild(menuNode)){
            return;
        }

        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的菜单 【'+menuNode.menuTitle+'】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.onClickDelete2.bind( this, menuNode )
        });

        event.stopPropagation();
    },
    onClickDelete2 : function(menu){
        this.setState({loading: true});
        FntMenuActions.deleteFntAppMenu( menu.uuid );
    },

    render : function() {
        var page = null;
        var disabled = true;
        var menuNode = this.state.selectedNode;
        if (menuNode !== null) {
            disabled = this.haveChild(menuNode);
            if (menuNode.leafNode === '1') {
                // 功能节点
                page = <div style={{ overflow: 'auto', height: '100%', width: '100%' }}>
                    <LeafNodePage ref="leafNode" menuNode={menuNode} />
                    <div style={{ paddingTop: '4px', paddingBottom: '16px' }}>
                        <ChildMenuPage ref="childMenu" menuNode={menuNode} />
                    </div>
                </div>
            }
            else {
                page = <div style={{ overflow: 'auto', height: '100%', width: '100%' }}>
                    <MenuInfoPage ref="menuInfo" menuNode={menuNode} />
                    <div style={{ paddingTop: '4px', paddingBottom: '16px' }}>
                        <ChildMenuPage ref="childMenu" menuNode={menuNode} />
                    </div>
                </div>
            }
        }

        return (
            <div className='grid-page'>
                <div style={{overflow:'hidden', height:'100%'}}>
                    <div style={{borderRight: '1px solid #e2e2e2', width:'220px', height:'100%', float:'left', overflowY:'auto', overflowX:'hidden'}}>
                        <div className='grid-page' style={{padding: '44px 0 0 0'}}>
                            <div style={{margin: '-44px 0 0 0'}}>
                                <div style={{padding: '16px 0 0 8px'}}>
                                    <Button icon={Common.iconAdd} type="primary" title="增加一级菜单" onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}/>
                                    <Button icon={Common.iconRemove} title="删除叶子节点" disabled={disabled} onClick={this.onClickDelete} style={{marginLeft: '4px'}}/>
                                </div>
			                </div>
			                <div style={{height:'100%', overflow:'auto'}}>
                                <MenuTree ref='menuTree' onSelect={this.onSelectMenu}/>
			                </div>
                            <CreateFntMenuPage ref="createWindow"/>
                        </div>
                    </div>
	                <div style={{height:'100%', overflow:'hidden'}}>
		                <div className='grid-page'>
                            {page}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = FntMenuTablePage;
