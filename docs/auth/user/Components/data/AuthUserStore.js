var Reflux = require('reflux');
var AuthUserActions = require('../action/AuthUserActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var AuthUserStore = Reflux.createStore({
	listenables: [AuthUserActions],

	authUser: {},

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			authUser: self.authUser,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-user', operation, errMsg);
	},

	onGetAuthUser: function(idType, idCode) {
		var self = this;
		var filter = {};
		filter.idType = idType;
		filter.idCode = idCode;
		var url = this.getServiceUrl('auth-user/get-by-idCode');
		Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.authUser = result.object;
				self.fireEvent('find', '', self);
			}
			else{
				self.fireEvent('find', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('find', "调用服务错误", self);
		});
	},

	onCreateAuthUser: function(authUser) {
		var self = this;
		var url = this.getServiceUrl('auth-user/create');
		Utils.doCreateService(url, authUser).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.authUser = result.object;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},

	onUpdateAuthUser: function(authUser) {
		var self = this;
		var url = this.getServiceUrl('auth-user/update');
		Utils.doUpdateService(url, authUser).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.authUser = result.object;
				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update', "调用服务错误", self);
		});
	}
});

module.exports = AuthUserStore;
