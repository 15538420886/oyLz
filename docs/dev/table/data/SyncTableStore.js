var Reflux = require('reflux');
var SyncTableActions = require('../action/SyncTableActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SyncTableStore = Reflux.createStore({
	listenables: [SyncTableActions],
    result: {},

	init: function() {
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			operation: operation,
			errMsg: errMsg,
            result: self.result
		});

		MsgActions.showError('sync-table', operation, errMsg);
	},

	//ajax调用后台接口，返回json
	onDownTable: function(app) {
		var self = this;
		Utils.doCreateService(app.downUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.result = result.object;
				self.fireEvent('down-table', '', self);
			}
			else{
				self.fireEvent('down-table', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('down-table', "调用服务错误", self);
		});
	},

	onCompareTable: function(app) {
		var self = this;
		Utils.doCreateService(app.compareUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.result = result.object;
				self.fireEvent('compare-table', '', self);
			}
			else{
				self.fireEvent('compare-table', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('compare-table', "调用服务错误", self);
		});
	},

	onSyncTable: function(app) {
		var self = this;
		Utils.doCreateService(app.syncUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.result = result.object;
				self.fireEvent('sync-table', '', self);
			}
			else{
				self.fireEvent('sync-table', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('sync-table', "调用服务错误", self);
		});
	},
});

module.exports = SyncTableStore;
