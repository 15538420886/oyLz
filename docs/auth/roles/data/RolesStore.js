'use strict';

var Reflux = require('reflux');
var RolesActions = require('../action/RolesActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var RolesStore = Reflux.createStore({
	listenables: [RolesActions],

	appUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

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

		MsgActions.showError('auth-app-role-group', operation, errMsg);
	},

	onRetrieveAuthAppRoleGroup: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url=this.getServiceUrl('auth-app-role-group/get-by-app-uuid');
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

	onInitAuthAppRoleGroup: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveAuthAppRoleGroup(appUuid);
	},

	onCreateAuthAppRoleGroup: function(roles) {
		var url = this.getServiceUrl('auth-app-role-group/create');
		Utils.recordCreate(this, roles, url);
	},

	onUpdateAuthAppRoleGroup: function(roles) {
		var url = this.getServiceUrl('auth-app-role-group/update');
		Utils.recordUpdate(this, roles, url);
	},

	onDeleteAuthAppRoleGroup: function(uuid) {
		var url = this.getServiceUrl('auth-app-role-group/delete');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = RolesStore;
