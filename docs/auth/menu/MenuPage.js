'use strict';

import React from 'react';

import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import MenuTree from './Components/MenuTree';
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Form, Input, Button, Table, Icon, Modal } from 'antd';
const FormItem = Form.Item;
var Common = require('../../public/script/common');

var Context = require('../AuthContext');
var MenuStore = require('./data/MenuStore');
var MenuActions = require('./action/MenuActions');
import CreateMenuPage from './Components/CreateMenuPage';
import MenuInfoPage from './Components/MenuInfoPage';
import LeafNodePage from './Components/LeafNodePage';
import ChildMenuPage from './Components/ChildMenuPage';

var MenuPage = React.createClass({
    getInitialState : function() {
        return {
            menuSet: {
                recordSet: [],
                operation : '',
                errMsg : '',
            },
            loading : false,
            selectedNode: null,
        }
    },

    mixins: [Reflux.listenTo(MenuStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.errMsg === '' && data.operation === 'remove'){
            this.state.selectedNode = null;
        }

        this.setState({
            loading: false,
            menuSet: data
        });
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
        this.refs.createWindow.clear(Context.authApp.uuid, null);
        this.refs.createWindow.toggle();
    },
    onClickDelete : function(menu, event){
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
        MenuActions.deleteAuthAppMenu( menu.uuid );
    },

    render : function() {
        var page = null;
        var disabled = true;
        var menuNode = this.state.selectedNode;
        if(menuNode !== null){
            disabled = this.haveChild(menuNode);
            if(menuNode.leafNode === '1'){
                // 功能节点
                page = <div className='grid-body'>
                        <LeafNodePage ref="leafNode" menuNode={menuNode}/>
                    </div>
            }
            else{
                page = <div className='grid-body'>
                        <MenuInfoPage ref="menuInfo" menuNode={menuNode}/>
                        <div style={{paddingTop:'4px', paddingBottom:'16px'}}>
                            <ChildMenuPage ref="childMenu" menuNode={menuNode}/>
                        </div>
                    </div>
            }
        }

        var cs = Common.getGridMargin(this, 0);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-app-menu/retrieve', 'auth-app-menu/remove', 'auth-app-menu/update']}/>
				</div>
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
                                <MenuTree onSelect={this.onSelectMenu}/>
			                </div>
                            <CreateMenuPage ref="createWindow"/>
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

module.exports = MenuPage;
