'use strict';

var Reflux = require('reflux');
var ResActions = require('../action/ResActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ResStore = Reflux.createStore({
	listenables: [ResActions],

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

		MsgActions.showError('auth_app_res', operation, errMsg);
	},

	onRetrieveResInfo: function(appUuid, modUuid) {
		var self = this;

		var filter = {};
		filter.appUuid = appUuid;
		filter.modUuid = modUuid;
		var url=this.getServiceUrl('auth_app_res/retrieve');
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

	onInitResInfo: function(appUuid, modUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveResInfo(appUuid, modUuid);
	},

	onCreateResInfo: function(res) {
		var url = this.getServiceUrl('auth_app_res/create');
		Utils.recordCreate(this, res, url);
	},

	onUpdateResInfo: function(res) {
		var url = this.getServiceUrl('auth_app_res/update');
		Utils.recordUpdate(this, res, url);
	},

	onDeleteResInfo: function(uuid) {
		var url = this.getServiceUrl('auth_app_res/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ResStore;
