'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import {Form, Input,Button, Table, Icon, Modal} from 'antd';
const FormItem = Form.Item;

var Context = require('../../AuthContext');
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var MenuStore = require('../data/MenuStore.js');
var MenuActions = require('../action/MenuActions');
import CreateMenuPage from './CreateMenuPage';
import UpdateMenuPage from './UpdateMenuPage';

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
    mixins: [Reflux.listenTo(MenuStore, "onServiceComplete")],
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

          MenuActions.initAuthAppMenu(Context.authApp.uuid);
      },
      componentWillReceiveProps:function(nextProps){
          this.state.menu = {};
          var menuNode = nextProps.menuNode;
          if(menuNode !== null){
              this.state.menu = menuNode;
          }

          if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
              this.refs.mxgBox.clear();
          }

          MenuActions.initAuthAppMenu(Context.authApp.uuid);
      },

    handleOpenCreateWindow : function(event) {
        if(typeof(this.state.menu.uuid) !== 'undefined'){
            this.refs.createWindow.clear(Context.authApp.uuid, this.state.menu.uuid);
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
            content: '是否删除选中的菜单配置 【'+menu.menuCode+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, menu)
        });
    },

    onClickDelete2 : function(menu)
    {
        this.setState({loading: true});
        this.state.menuSet.operation = '';
        MenuActions.deleteAuthAppMenu( menu.uuid );
    },

    render : function() {
        var recordSet = this.state.menuList;

        const columns = [
        {
            title: '菜单名称',
            dataIndex: 'menuCode',
            key: 'menuCode',
            width: 160,
        },
        {
            title: '菜单说明',
            dataIndex: 'menuTitle',
            key: 'menuTitle',
            width: 160,
        },
        {
            title: '',
            key: 'action',
            width: 80,
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
                <ServiceMsg ref='mxgBox' svcList={['auth-app-menu/retrieve', 'auth-app-menu/remove']}/>

                <div className='toolbar-table'>
                    <Button icon={Common.iconAdd} type="primary" title="增加子节点" onClick={this.handleOpenCreateWindow}/>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>

                <CreateMenuPage ref="createWindow"/>
                <UpdateMenuPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = ChildMenuPage;
