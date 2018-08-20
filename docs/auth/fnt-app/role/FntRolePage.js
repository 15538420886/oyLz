'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal} from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FntRoleStore = require('./data/FntRoleStore');
var FntRoleActions = require('./action/FntRoleActions');
var RoleStore = require('../../role/data/RoleStore');
var RoleActions = require('../../role/action/RoleActions');

var Context = require('../../AuthContext');
import RoleListPage from './Components/RoleListPage'
import SelectRolePage from './Components/SelectRolePage';


var FntRolePage = React.createClass({
    getInitialState : function() {
        return {
            roleSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            roleMap: {},
            loading: false,
            selectedRoles: null,
            roleList: [],
        }
    },

    mixins: [Reflux.listenTo(FntRoleStore, "onServiceComplete"), Reflux.listenTo(RoleStore, "onRoleComplete")],
    onServiceComplete: function(data) {
        if(data.operation === 'update' && data.errMsg === ''){
            var roleList=this.getSelectedRoles(this.state.selectedRoles);
            this.setState({
                loading: false,
                roleList: roleList
            });
        }
        else{
            this.setState({
                loading: false,
            });
        }
    },
    onRoleComplete: function(data) {
        var roleMap = {};
        data.recordSet.map((item, i) => {
            roleMap[item.uuid] = item;
        })

        this.setState({
            loading: false,
            roleSet: data,
            roleMap: roleMap,
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        RoleActions.initFntAppRoleInfo(Context.fntApp.uuid);
    },
    getSelectedRoles: function(roles){
        var roleList=[];
        if( roles !== null && roles.roleList !== null && roles.roleList !== '' ){
            var selList = roles.roleList.split(',');
            selList.map((id, i) => {
                var role = this.state.roleMap[id];
                if(role !== null && typeof(role) !== 'undefined'){
                    roleList.push(role);
                }
            })
        }

        return roleList;
    },
    onSelectRoles:function(roles){
        var roleList=this.getSelectedRoles(roles);
        this.setState({selectedRoles: roles, roleList: roleList});
    },

    handleSelectClick : function(event) {
        if(this.state.selectedRoles !== null){
            this.refs.createWindow.clear(this.state.selectedRoles, this.state.roleList, this.state.roleSet.recordSet);
            this.refs.createWindow.toggle();
        }
    },
    onClickDelete : function(roles, event)
    {
        if(this.state.selectedRoles === null){
            return;
        }

        var uuidList = [];
        this.state.roleList.map((item, i) => {
            if(roles.uuid !== item.uuid){
                uuidList.push( item.uuid );
            }
        })

        var selKeys = uuidList.join(',');

        var rGroup = {};
        Utils.copyValue(this.state.selectedRoles, rGroup);
        rGroup.roleList = selKeys;

        this.setState({loading: true});
        FntRoleActions.updateFntAppRole( rGroup );
    },

    render : function() {
        var recordSet = this.state.roleList;

        const columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 140,
        },
        {
            title: '角色说明',
            dataIndex: 'roleDesc',
            key: 'roleDesc',
            width: 140,
        },
        {
            title: '服务编号',
            dataIndex: 'appCode',
            key: 'appCode',
            width: 140,
        },
        {
            title: '',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={this.onClickDelete.bind(this, record)}>移除</a>
                </span>
            ),
        }
        ];

		var isSelected = (this.state.selectedRoles !== null);
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['fnt_app_role/retrieve', 'fnt_app_role/remove', 'fnt_app_role/update', 'auth-app-role/fntRoles']}/>

                <RoleListPage ref='modList' width='220px' onSelectRoles={this.onSelectRoles}>
                    <div className='toolbar-table'>
                        <Button icon={Common.iconAdd} type="primary" disabled={!isSelected} title="选择角色" onClick={this.handleSelectClick}/>
                    </div>
                    <div style={{margin: '0 16px 0 16px'}}>
                        <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                    </div>
                </RoleListPage>

                <SelectRolePage ref="createWindow"/>
            </div>
        );
    }
});

module.exports = FntRolePage;
