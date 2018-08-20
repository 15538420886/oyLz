'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import {Form, Input,Button, Table, Icon, Modal} from 'antd';
const FormItem = Form.Item;

var Context = require('../../../AuthContext');
var FntMenuStore = require('../data/FntMenuStore');
var FntMenuActions = require('../action/FntMenuActions');
import CreateFntMenuPage from './CreateFntMenuPage';
import UpdateFntMenuPage from './UpdateFntMenuPage';

var ChildMenuPage = React.createClass({
    getInitialState : function() {
        return {
            menuSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },

            loading: false,
            menu: {},
            menuList: [],
        }
    },
    mixins: [Reflux.listenTo(FntMenuStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var menuList=[];
        var menuUuid = this.state.menu.uuid;
        var count=data.recordSet.length;
        for(var i=0; i<count; i++){
            var menu=data.recordSet[i];
            if(menu.puuid === menuUuid){
                menuList.push( menu );
            }
        }

        this.setState({
            loading: false,
            menuSet: data,
            menuList: menuList,
        });
    },

      // 第一次加载
      componentDidMount : function(){
          this.state.menu = {};
          var menuNode = this.props.menuNode;
          if(menuNode !== null){
              this.state.menu = menuNode;
          }

          FntMenuActions.initFntAppMenu( Context.fntMod.uuid );
      },
      componentWillReceiveProps:function(nextProps){
          var menuNode = nextProps.menuNode;
          if(menuNode !== null && menuNode.uuid === this.state.menu.uuid){
          	return;
          }
          
          this.state.menu = {};
          if(menuNode !== null){
              this.state.menu = menuNode;
          }

          if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
              this.refs.mxgBox.clear();
          }

          FntMenuActions.initFntAppMenu( Context.fntMod.uuid );
      },

    handleOpenCreateWindow : function(event) {
        if(typeof(this.state.menu.uuid) !== 'undefined'){
            this.refs.createWindow.clear(Context.fntApp.uuid, Context.fntMod.uuid, this.state.menu.uuid);
            this.refs.createWindow.toggle();
        }
    },

    onClickUpdate : function(menu, event){
        if(menu != null){
            this.refs.updateWindow.initPage(menu);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(menu, event){
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的菜单配置 【'+menu.menuPath+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, menu)
        });
    },

    onClickDelete2 : function(menu)
    {
        this.setState({loading: true});
        FntMenuActions.deleteFntAppMenu( menu.uuid );
    },

    render : function() {
        var recordSet = this.state.menuList;

        const columns = [
        {
            title: '菜单路径',
            dataIndex: 'menuPath',
            key: 'menuPath',
            width: 160,
        },
        {
            title: '菜单标题',
            dataIndex: 'menuTitle',
            key: 'menuTitle',
            width: 140,
        },
        {
            title: '可用角色',
            dataIndex: 'appRoles',
            key: 'appRoles',
            width: 170,
        },
        {
            title: '',
            key: 'action',
            width: 70,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
                    <span className="ant-divider" />
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
                </span>
            ),
        }
        ];

        return (
            <div className='grid-page'>
                <div className='toolbar-table'>
                    <Button icon={Common.iconAdd} type="primary" title="增加子节点" onClick={this.handleOpenCreateWindow}/>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateFntMenuPage ref="createWindow"/>
                <UpdateFntMenuPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = ChildMenuPage;
