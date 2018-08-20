'use strict';

var Reflux = require('reflux');
var ModuleActions = require('../action/ModuleActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ModuleStore = Reflux.createStore({
	listenables: [ModuleActions],

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
		MsgActions.showError('auth-app-module', operation, errMsg);
	},

	onRetrieveModuleInfo: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url=this.getServiceUrl('auth-app-module/get-by-appUuid');
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

	onInitModuleInfo: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveModuleInfo(appUuid);
	},

	onCreateModuleInfo: function(module) {
		var url = this.getServiceUrl('auth-app-module/create');
		Utils.recordCreate(this, module, url);
	},

	onUpdateModuleInfo: function(module) {
		var url = this.getServiceUrl('auth-app-module/update');
		Utils.recordUpdate(this, module, url);
	},

	onDeleteModuleInfo: function(uuid) {
		var url = this.getServiceUrl('auth-app-module/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ModuleStore;
