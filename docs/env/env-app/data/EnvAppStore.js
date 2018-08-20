﻿var Reflux = require('reflux');
var EnvAppActions = require('../action/EnvAppActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var EnvAppStore = Reflux.createStore({
	listenables: [EnvAppActions],
	
	recordSet: [],
	lastHostUuid:'',
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

		MsgActions.showError('env-app-info', operation, errMsg);
	},
	
	onRetrieveEnvAppInfo: function(hostUuid) {
		var self = this;
		var filter = {};
		filter.hostUuid = hostUuid;
		var url = this.getServiceUrl('env-app-deploy/get-by-hostUuidUnion');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.lastHostUuid = hostUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveEnvAppInfoPage: function(hostUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveEnvAppInfo( hostUuid );
	},
	
	onInitEnvAppInfo: function(hostUuid) {
		if( this.recordSet.length > 0 && hostUuid === this.lastHostUuid){
				this.fireEvent('retrieve', '', this);
				return;
		}
		
		this.onRetrieveEnvAppInfo(hostUuid);
	},
	
	onCreateEnvAppInfo: function(envApp) {
		var self = this;
		var url = this.getServiceUrl('env-app-deploy/batch-create');
		Utils.doGetRecordService(url, envApp).then(function(result) {
		 	if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
		 		
				self.recordSet = self.recordSet.concat( result.object.list );

		 		self.fireEvent('create', '', self);
			}
			else{

				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
		 	}
		 }, function(value){

			self.fireEvent('create', "调用服务错误", self);
		 });
		
	},
	
	onUpdateEnvAppInfo: function(envApp) {
		var url = this.getServiceUrl('env-app-deploy/update');
		Utils.recordUpdate(this, envApp, url);
	},
	
	onDeleteEnvAppInfo: function(uuid) {
		var url = this.getServiceUrl('env-app-deploy/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = EnvAppStore;