﻿var Reflux = require('reflux');
var Context = require('../../ParamContext');
var ParamEnvActions = require('../action/ParamEnvActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ParamEnvStore = Reflux.createStore({
	listenables: [ParamEnvActions],

	appUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
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

		MsgActions.showError('env_info', operation, errMsg);
	},

	onRetrieveParamEnv: function() {
		var self = this;
		var filter = {};
		if(Context.paramApp){
			filter.appUuid = Context.paramApp.uuid
		}

		var url = this.getServiceUrl('env_info/get-by-appUuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.appUuid = filter.appUuid;
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveParamEnvPage: function(startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveParamEnv();
	},

	onInitParamEnv: function() {
		if( this.recordSet.length > 0 ){
			var appUuid = Context.paramApp ? Context.paramApp.uuid : '';
			if( appUuid === this.appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveParamEnv();
	},

	onCreateParamEnv: function(paramEnv) {
		var url = this.getServiceUrl('env_info/insert');
		Utils.recordCreate(this, paramEnv, url);
	},

	onUpdateParamEnv: function(paramEnv) {
		var url = this.getServiceUrl('env_info/update');
		Utils.recordUpdate(this, paramEnv, url);
	},

	onDeleteParamEnv: function(uuid) {
		var url = this.getServiceUrl('env_info/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ParamEnvStore;
