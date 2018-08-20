'use strict';

var Reflux = require('reflux');
var RoleActions = require('../action/RoleActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var RoleStore = Reflux.createStore({
	listenables: [RoleActions],

	appUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

    // 角色组
	groupUuid: '',
	groupRecordSet: [],

    // 前端APP
    fntAppUuid: '',
    fntAppRecordSet: [],

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			appUuid: self.appUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-app-role', operation, errMsg);
	},

	fireEvent2: function(operation, errMsg, self)
	{
		self.trigger({
			groupUuid: self.groupUuid,
			recordSet: self.groupRecordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-app-role', operation, errMsg);
	},

    fireEvent3: function (operation, errMsg, self) {
        self.trigger({
            fntAppUuid: self.fntAppUuid,
            recordSet: self.fntAppRecordSet,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('auth-app-role', operation, errMsg);
    },

	onRetrieveRoleInfo: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url=this.getServiceUrl('auth-app-role/get-by-app-uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.appUuid = appUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitRoleInfo: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveRoleInfo(appUuid);
	},

	onCreateRoleInfo: function(role) {
		var url = this.getServiceUrl('auth-app-role/create');
		Utils.recordCreate(this, role, url);
	},

	onUpdateRoleInfo: function(role) {
		var url = this.getServiceUrl('auth-app-role/update');
		Utils.recordUpdate(this, role, url);
	},

	onDeleteRoleInfo: function(uuid) {
		var url = this.getServiceUrl('auth-app-role/delete');
		Utils.recordDelete(this, uuid, url);
	},
	
	// 应用组的所有角色
	onRetrieveGroupRoleInfo: function(groupUuid) {
		var self = this;
		var filter = {};
		filter.groupUuid = groupUuid;
		var url=this.getServiceUrl('auth-app-role/get-by-group-uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.groupRecordSet = result.object.list;
				self.groupUuid = groupUuid;

				self.fireEvent2('groupRoles', '', self);
			}
			else{
				self.fireEvent2('groupRoles', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent2('groupRoles', "调用服务错误", self);
		});
	},

	onInitGroupRoleInfo: function(groupUuid) {
		if( this.groupRecordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent2('groupRoles', '', this);
				return;
			}
		}
		this.onRetrieveGroupRoleInfo(groupUuid);
	},

    // 前端APP的所有角色
    onRetrieveFntAppRoleInfo: function (fntAppUuid) {
        var self = this;
        var filter = {};
        filter.appUuid = fntAppUuid;
        var url = this.getServiceUrl('auth-app-role/selectByFntAppUuid');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.fntAppRecordSet = result.object.list;
                self.fntAppUuid = fntAppUuid;

                self.fireEvent3('fntRoles', '', self);
            }
            else {
                self.fireEvent3('fntRoles', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent3('fntRoles', "调用服务错误", self);
        });
    },

    onInitFntAppRoleInfo: function (fntAppUuid) {
        if (this.fntAppRecordSet.length > 0) {
            if (this.fntAppUuid === fntAppUuid) {
                this.fireEvent3('fntRoles', '', this);
                return;
            }
        }
        this.onRetrieveFntAppRoleInfo(fntAppUuid);
    },

});

module.exports = RoleStore;

