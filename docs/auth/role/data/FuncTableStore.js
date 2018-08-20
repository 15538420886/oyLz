'use strict';

var Reflux = require('reflux');
var FuncTableActions = require('../action/FuncTableActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var FuncTableStore = Reflux.createStore({
	listenables: [FuncTableActions],

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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-role-func', operation, errMsg);
	},

	onRetrieveFuncTableInfo: function(roleUuid) {
		var self = this;
		var filter = {};

		filter.roleUuid = roleUuid;

		var url=this.getServiceUrl('auth-role-func/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.roleUuid = roleUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	onInitFuncTableInfo: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveFuncTableInfo(appUuid);
	},

	onCreateFuncTableInfo: function(role) {
		var url = this.getServiceUrl('auth-role-func/batch-create');
		Utils.recordCreate(this, role, url);
	},

	onUpdateFuncTableInfo: function(role) {
		var url = this.getServiceUrl('auth-role-func/update');
		Utils.recordUpdate(this, role, url);
	},

	onDeleteFuncTableInfo: function(uuid) {
		var url = this.getServiceUrl('auth-role-func/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = FuncTableStore;
