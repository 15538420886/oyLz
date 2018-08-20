var Reflux = require('reflux');
var ScanActions = require('../action/ScanActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ScanStore = Reflux.createStore({
	listenables: [ScanActions],
	resuleBody: '',
	
	init: function() {
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			operation: operation,
			errMsg: errMsg,
			resuleBody: resuleBody
		});

		MsgActions.showError('scan', operation, errMsg);
	},

	//ajax调用后台接口，返回json
	onScanApi: function(app) {
		var self = this;
		this.resuleBody = '';
		Utils.doCreateService(app.apiUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.fireEvent('scan-api', '', self);
			}
			else{
				self.fireEvent('scan-api', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('scan-api', "调用服务错误", self);
		});
	},
	
	onScanAuth: function(app) {
		var self = this;
		this.resuleBody = '';
		Utils.doCreateService(app.authUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.fireEvent('scan-auth', '', self);
			}
			else{
				self.fireEvent('scan-auth', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('scan-auth', "调用服务错误", self);
		});
	},
	
	onCompareTable: function(app) {
		var self = this;
		this.resuleBody = '';
		Utils.doCreateService(app.compTableUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.fireEvent('table-comp', '', self);
			}
			else{
				self.fireEvent('table-comp', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('table-comp', "调用服务错误", self);
		});
	},
	
	onSyncTable: function(app) {
		var self = this;
		this.resuleBody = '';
		Utils.doCreateService(app.syncTableUrl, app.param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.fireEvent('table-sync', '', self);
			}
			else{
				self.fireEvent('table-sync', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('table-sync', "调用服务错误", self);
		});
	},
});

module.exports = ScanStore;

